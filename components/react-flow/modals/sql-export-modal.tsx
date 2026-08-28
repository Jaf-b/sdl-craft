import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Code, Copy, Check } from "lucide-react";
import { MldTableNode, MldEdge } from "../types";

type SqlExportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    nodes: MldTableNode[];
    edges: MldEdge[];
};

export function SqlExportModal({
    isOpen,
    onClose,
    nodes,
    edges,
}: SqlExportModalProps) {
    const [copied, setCopied] = useState(false);

    const sqlScript = useMemo(() => {
        let script = "-- Script SQL DDL Généré (PostgreSQL / Relational)\n\n";

        nodes.forEach((node) => {
            if (!node.data || !node.data.columns) return;
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
    }, [nodes, edges]);

    const handleCopy = () => {
        navigator.clipboard.writeText(sqlScript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-card border-border text-card-foreground max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-primary" /> Export DDL SQL (MLD)
                    </DialogTitle>
                </DialogHeader>

                <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-96 border border-border text-foreground">
                        {sqlScript}
                    </pre>
                    <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-3 right-3 h-8 w-8"
                        onClick={handleCopy}
                        title="Copier le code SQL"
                    >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>

                <DialogFooter>
                    <Button onClick={onClose}>Fermer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
