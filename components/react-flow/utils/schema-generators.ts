import { MldTableNode, MldEdge } from "../types";

function capitalize(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function camelCase(str: string): string {
    if (!str) return "";
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

// 1. Générateur DDL SQL (PostgreSQL)
export function generateSqlSchema(nodes: MldTableNode[], edges: MldEdge[]): string {
    if (!nodes || nodes.length === 0) return "-- Aucun nœud MLD à exporter\n";

    let script = "-- Script DDL SQL (PostgreSQL / Relational)\n\n";

    nodes.forEach((node) => {
        if (!node.data?.columns) return;
        const tableName = node.data.label.toLowerCase().replace(/\s+/g, "_");
        script += `CREATE TABLE ${tableName} (\n`;

        const columnLines = node.data.columns.map((col) => {
            let line = `  ${col.name} ${col.type}`;
            if (!col.nullable) line += " NOT NULL";
            if (col.isPk) line += " PRIMARY KEY";
            return line;
        });

        script += columnLines.join(",\n");
        script += "\n);\n\n";
    });

    edges.forEach((edge) => {
        const srcNode = nodes.find((n) => n.id === edge.source);
        const tgtNode = nodes.find((n) => n.id === edge.target);
        const srcCol = srcNode?.data?.columns?.find((c) => c.id === edge.data?.sourceField);
        const tgtCol = tgtNode?.data?.columns?.find((c) => c.id === edge.data?.targetField);

        if (srcNode && tgtNode && srcCol && tgtCol) {
            const srcTableName = srcNode.data.label.toLowerCase().replace(/\s+/g, "_");
            const tgtTableName = tgtNode.data.label.toLowerCase().replace(/\s+/g, "_");

            script += `ALTER TABLE ${tgtTableName}\n`;
            script += `  ADD CONSTRAINT fk_${tgtTableName}_${tgtCol.name}\n`;
            script += `  FOREIGN KEY (${tgtCol.name})\n`;
            script += `  REFERENCES ${srcTableName}(${srcCol.name});\n\n`;
        }
    });

    return script;
}

// 2. Générateur Schema Prisma ORM
export function generatePrismaSchema(nodes: MldTableNode[], edges: MldEdge[]): string {
    if (!nodes || nodes.length === 0) return "// Aucun nœud MLD à exporter\n";

    let script = `// Prisma Schema File\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\ngenerator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n`;

    nodes.forEach((node) => {
        if (!node.data?.columns) return;
        const modelName = capitalize(node.data.label);
        script += `model ${modelName} {\n`;

        node.data.columns.forEach((col) => {
            let prismaType = "String";
            if (col.type === "INTEGER") prismaType = "Int";
            if (col.type === "TIMESTAMP") prismaType = "DateTime";
            if (col.type === "BOOLEAN") prismaType = "Boolean";
            if (col.type === "TEXT") prismaType = "String";

            let line = `  ${col.name} ${prismaType}${col.nullable ? "?" : ""}`;
            if (col.isPk) {
                line += col.type === "UUID" ? " @id @default(uuid())" : " @id @default(autoincrement())";
            }
            script += line + "\n";
        });

        // Relations entrantes (Foreign Keys)
        const incomingEdges = edges.filter((e) => e.target === node.id);
        incomingEdges.forEach((edge) => {
            const srcNode = nodes.find((n) => n.id === edge.source);
            const tgtCol = node.data.columns.find((c) => c.id === edge.data?.targetField);
            const srcCol = srcNode?.data?.columns.find((c) => c.id === edge.data?.sourceField);
            if (srcNode && tgtCol && srcCol) {
                const sourceModel = capitalize(srcNode.data.label);
                const relFieldName = srcNode.data.label.toLowerCase();
                script += `  ${relFieldName} ${sourceModel} @relation(fields: [${tgtCol.name}], references: [${srcCol.name}])\n`;
            }
        });

        // Relations sortantes (1:N)
        const outgoingEdges = edges.filter((e) => e.source === node.id);
        outgoingEdges.forEach((edge) => {
            const tgtNode = nodes.find((n) => n.id === edge.target);
            if (tgtNode) {
                const targetModel = capitalize(tgtNode.data.label);
                const listName = `${tgtNode.data.label.toLowerCase()}List`;
                script += `  ${listName} ${targetModel}[]\n`;
            }
        });

        script += `}\n\n`;
    });

    return script;
}

// 3. Générateur Schema Drizzle ORM
export function generateDrizzleSchema(nodes: MldTableNode[], edges: MldEdge[]): string {
    if (!nodes || nodes.length === 0) return "// Aucun nœud MLD à exporter\n";

    let script = `import { pgTable, uuid, varchar, integer, timestamp, boolean, text } from "drizzle-orm/pg-core";\n\n`;

    nodes.forEach((node) => {
        if (!node.data?.columns) return;
        const tableName = node.data.label.toLowerCase().replace(/\s+/g, "_");
        const varName = camelCase(node.data.label) || "table";
        script += `export const ${varName} = pgTable("${tableName}", {\n`;

        node.data.columns.forEach((col) => {
            let colDef = "";
            if (col.type === "UUID") colDef = `uuid("${col.name}")`;
            else if (col.type === "VARCHAR(255)") colDef = `varchar("${col.name}", { length: 255 })`;
            else if (col.type === "INTEGER") colDef = `integer("${col.name}")`;
            else if (col.type === "TIMESTAMP") colDef = `timestamp("${col.name}")`;
            else if (col.type === "BOOLEAN") colDef = `boolean("${col.name}")`;
            else colDef = `text("${col.name}")`;

            if (col.isPk) colDef += `.primaryKey()`;
            if (!col.nullable) colDef += `.notNull()`;

            script += `  ${col.name}: ${colDef},\n`;
        });

        script += `});\n\n`;
    });

    return script;
}
