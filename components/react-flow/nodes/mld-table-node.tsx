import { NodeProps, Handle, Position } from "@xyflow/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Key, Link as LinkIcon } from "lucide-react";
import { MldTableNode } from "../types";

export function MldTableNodeComponent({ id, data }: NodeProps<MldTableNode>) {
    const { label, columns, linkedColumnIds } = data;

    return (
        <Card className="w-[280px] bg-card border-border text-card-foreground shadow-xl overflow-hidden py-0 transition-all hover:border-slate-400 dark:hover:border-slate-600">
            <CardHeader className="bg-muted/50 px-3 py-2 border-b border-border flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-xs font-bold tracking-wide">{label}</CardTitle>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-background/60 border-border text-muted-foreground font-mono">
                        TABLE MLD
                    </Badge>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                            e.stopPropagation();
                            data.onEdit?.(id);
                        }}
                        title="Modifier la table"
                    >
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                            e.stopPropagation();
                            data.onDelete?.(id);
                        }}
                        title="Supprimer la table"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-2 space-y-1.5 font-mono text-xs">
                {columns && columns.length > 0 ? (
                    columns.map((col) => {
                        const isLinked = linkedColumnIds?.has(col.id);

                        return (
                            <div
                                key={col.id}
                                className={`relative flex items-center justify-between py-1 px-2 rounded-md transition-colors ${
                                    isLinked ? "bg-primary/10 border border-primary/30" : "bg-muted/30 border border-transparent"
                                }`}
                            >
                                {/* Target Handle pour recevoir les clés étrangères */}
                                <Handle
                                    type="target"
                                    position={Position.Left}
                                    id={`target-${col.id}`}
                                    className="!bg-primary !w-2.5 !h-2.5 !-left-3 hover:!scale-125 transition-transform"
                                />

                                <div className="flex items-center gap-1.5 overflow-hidden">
                                    {/* Badges MLD (PK / FK) */}
                                    {col.isPk && (
                                        <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30 text-[9px] px-1 py-0 h-4">
                                            <Key className="h-2.5 w-2.5 mr-0.5" /> PK
                                        </Badge>
                                    )}
                                    {col.isFk && (
                                        <Badge className="bg-sky-500/20 text-sky-600 dark:text-sky-300 border-sky-500/30 text-[9px] px-1 py-0 h-4">
                                            FK
                                        </Badge>
                                    )}

                                    {/* Nom du champ */}
                                    <span className={`truncate ${col.isPk ? "font-semibold text-amber-600 dark:text-amber-200" : "text-foreground"}`}>
                                        {col.name}
                                    </span>

                                    {isLinked && (
                                        <Badge variant="outline" className="text-[8px] bg-primary/10 text-primary border-primary/20 px-1 py-0 h-3.5">
                                            <LinkIcon className="h-2 w-2 mr-0.5" /> LINK
                                        </Badge>
                                    )}
                                </div>

                                {/* Type de données SQL */}
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-muted-foreground uppercase">{col.type}</span>
                                    {!col.nullable && <span className="text-[8px] text-red-500 font-bold" title="NOT NULL">NN</span>}
                                </div>

                                {/* Source Handle (Seules les PK peuvent initier la liaison par défaut) */}
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={`source-${col.id}`}
                                    isConnectable={!!col.isPk}
                                    title={col.isPk ? "Glisser pour lier la clé primaire" : "Seule une clé primaire (PK) peut initier une liaison"}
                                    className={`!w-2.5 !h-2.5 !-right-3 transition-transform ${
                                        col.isPk ? "!bg-amber-400 hover:!scale-125 cursor-pointer" : "!bg-muted-foreground/30 !cursor-not-allowed"
                                    }`}
                                />
                            </div>
                        );
                    })
                ) : (
                    <span className="text-[10px] text-muted-foreground italic px-2">Aucune colonne</span>
                )}
            </CardContent>
        </Card>
    );
}
