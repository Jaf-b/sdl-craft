import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import {
    Code,
    Copy,
    Check,
    Download,
    Database,
    FileCode,
    Layers,
} from "lucide-react";
import { MldTableNode, MldEdge } from "./types";
import { generateSqlSchema, generatePrismaSchema, generateDrizzleSchema } from "./utils/schema-generators";

type ExportSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    nodes: MldTableNode[];
    edges: MldEdge[];
};

export type ExportFormat = "sql" | "prisma" | "drizzle";

export function ExportSidebar({
    isOpen,
    onClose,
    nodes,
    edges,
}: ExportSidebarProps) {
    const [format, setFormat] = useState<ExportFormat>("sql");
    const [copied, setCopied] = useState(false);

    // Calcul du code selon le format sélectionné
    const generatedCode = useMemo(() => {
        if (format === "sql") {
            return generateSqlSchema(nodes, edges);
        } else if (format === "prisma") {
            return generatePrismaSchema(nodes, edges);
        } else {
            return generateDrizzleSchema(nodes, edges);
        }
    }, [format, nodes, edges]);

    // Statistiques du diagramme
    const stats = useMemo(() => {
        let totalColumns = 0;
        let totalPk = 0;
        let totalFk = 0;

        nodes.forEach((n) => {
            if (n.data?.columns) {
                totalColumns += n.data.columns.length;
                n.data.columns.forEach((col) => {
                    if (col.isPk) totalPk++;
                    if (col.isFk) totalFk++;
                });
            }
        });

        return {
            tablesCount: nodes.length,
            columnsCount: totalColumns,
            pkCount: totalPk,
            fkCount: totalFk,
            relationsCount: edges.length,
        };
    }, [nodes, edges]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const fileExtensions: Record<ExportFormat, { name: string; ext: string }> = {
            sql: { name: "schema.sql", ext: "text/sql" },
            prisma: { name: "schema.prisma", ext: "text/plain" },
            drizzle: { name: "schema.ts", ext: "text/typescript" },
        };

        const target = fileExtensions[format];
        const blob = new Blob([generatedCode], { type: target.ext });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = target.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="w-[440px] sm:max-w-[480px] p-0 flex flex-col bg-card border-l border-border shadow-2xl">
                {/* Header Sidebar */}
                <SheetHeader className="px-4 py-3 border-b border-border bg-muted/30 shrink-0">
                    <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-primary" />
                        <SheetTitle className="font-bold text-sm">Exportation du Schéma</SheetTitle>
                    </div>
                    <SheetDescription className="text-xs text-muted-foreground">
                        Générez le code source prêt à l'emploi (SQL, Prisma, Drizzle).
                    </SheetDescription>
                </SheetHeader>

                {/* Statistiques rapides */}
                <div className="p-3 bg-muted/20 border-b border-border grid grid-cols-4 gap-2 text-center text-xs font-mono shrink-0">
                    <div className="bg-card p-1.5 rounded-md border border-border">
                        <div className="text-muted-foreground text-[10px]">Tables</div>
                        <div className="font-bold text-primary text-sm">{stats.tablesCount}</div>
                    </div>
                    <div className="bg-card p-1.5 rounded-md border border-border">
                        <div className="text-muted-foreground text-[10px]">Colonnes</div>
                        <div className="font-bold text-foreground text-sm">{stats.columnsCount}</div>
                    </div>
                    <div className="bg-card p-1.5 rounded-md border border-border">
                        <div className="text-muted-foreground text-[10px]">PK</div>
                        <div className="font-bold text-amber-500 text-sm">{stats.pkCount}</div>
                    </div>
                    <div className="bg-card p-1.5 rounded-md border border-border">
                        <div className="text-muted-foreground text-[10px]">Relations</div>
                        <div className="font-bold text-sky-500 text-sm">{stats.relationsCount}</div>
                    </div>
                </div>

                {/* Sélection du Format d'export */}
                <div className="p-3 space-y-2 border-b border-border shrink-0">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                        Format d'exportation
                    </label>
                    <Tabs value={format} onValueChange={(val) => setFormat(val as ExportFormat)} className="w-full">
                        <TabsList className="grid grid-cols-3 bg-muted/60 h-9 p-1">
                            <TabsTrigger value="sql" className="text-xs font-mono gap-1">
                                <Code className="h-3 w-3" /> SQL
                            </TabsTrigger>
                            <TabsTrigger value="prisma" className="text-xs font-mono gap-1">
                                <Layers className="h-3 w-3" /> Prisma
                            </TabsTrigger>
                            <TabsTrigger value="drizzle" className="text-xs font-mono gap-1">
                                <FileCode className="h-3 w-3" /> Drizzle
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Code Output Viewer */}
                <div className="flex-1 p-3 overflow-hidden flex flex-col relative bg-muted/10">
                    <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-[10px] font-mono uppercase bg-background border-border">
                            {format === "sql" ? "schema.sql" : format === "prisma" ? "schema.prisma" : "schema.ts"}
                        </Badge>

                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={handleCopy}>
                                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                                <span>{copied ? "Copié" : "Copier"}</span>
                            </Button>
                            <Button variant="default" size="sm" className="h-7 text-xs gap-1" onClick={handleDownload}>
                                <Download className="h-3.5 w-3.5" />
                                <span>Télécharger</span>
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto bg-slate-950 text-slate-100 p-3 rounded-lg font-mono text-xs border border-slate-800 shadow-inner">
                        <pre className="whitespace-pre">{generatedCode}</pre>
                    </div>
                </div>

                {/* Footer info */}
                <div className="p-3 border-t border-border bg-muted/20 text-[11px] text-muted-foreground flex items-center justify-between shrink-0">
                    <span>Modèle MLD actif</span>
                    <span className="font-mono">{format.toUpperCase()} Ready</span>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default ExportSidebar;
