import { NodeProps, Handle, Position } from "@xyflow/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Box, Cpu, FileCode2, ListFilter } from "lucide-react";
import { UmlClassNode } from "../types";

export function UmlClassNodeComponent({ id, data }: NodeProps<UmlClassNode>) {
    const { label, classType, attributes, methods } = data;

    const classTypeColor: Record<string, string> = {
        class: "border-indigo-500/40 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
        interface: "border-purple-500/40 text-purple-600 dark:text-purple-400 bg-purple-500/10",
        abstract: "border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
        enum: "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10",
    };

    return (
        <Card className={`w-[290px] bg-card border-2 text-card-foreground shadow-2xl overflow-hidden py-0 transition-all ${classTypeColor[classType] || "border-border"}`}>
            {/* Handles de connexion (Left, Right, Top, Bottom) */}
            <Handle type="target" position={Position.Left} id="left" className="!bg-indigo-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Left} id="left-src" className="!bg-indigo-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Right} id="right" className="!bg-indigo-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Right} id="right-src" className="!bg-indigo-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Top} id="top" className="!bg-indigo-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Top} id="top-src" className="!bg-indigo-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Bottom} id="bottom" className="!bg-indigo-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Bottom} id="bottom-src" className="!bg-indigo-500 !w-3 !h-3 hover:!scale-125 transition-transform" />

            {/* En-tête Classe UML */}
            <CardHeader className="bg-muted/40 px-3 py-2 border-b border-border text-center space-y-0.5 relative">
                {classType !== "class" && (
                    <div className="text-[9px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                        «{classType}»
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <CardTitle className={`text-xs font-bold font-mono tracking-wide ${classType === "abstract" ? "italic" : ""}`}>
                        {label}
                    </CardTitle>

                    <div className="flex items-center gap-0.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                                e.stopPropagation();
                                data.onEdit?.(id);
                            }}
                            title="Modifier la classe UML"
                        >
                            <Pencil className="h-2.5 w-2.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                data.onDelete?.(id);
                            }}
                            title="Supprimer la classe UML"
                        >
                            <Trash2 className="h-2.5 w-2.5" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {/* Compartiment 1 : Attributs UML */}
            <CardContent className="p-2 space-y-1 font-mono text-xs border-b border-border bg-background/50">
                {attributes && attributes.length > 0 ? (
                    attributes.map((attr) => (
                        <div key={attr.id} className="flex items-center justify-between text-[11px] truncate">
                            <div className="flex items-center gap-1 overflow-hidden">
                                <span className={`font-bold ${attr.visibility === "+" ? "text-green-500" : attr.visibility === "-" ? "text-red-500" : attr.visibility === "#" ? "text-amber-500" : "text-blue-500"}`}>
                                    {attr.visibility}
                                </span>
                                <span className={`${attr.isStatic ? "underline font-semibold" : "text-foreground"} truncate`}>
                                    {attr.name}
                                </span>
                            </div>
                            <span className="text-muted-foreground text-[10px] ml-2 shrink-0">: {attr.type}</span>
                        </div>
                    ))
                ) : (
                    <div className="text-[10px] text-muted-foreground italic px-1">Aucun attribut</div>
                )}
            </CardContent>

            {/* Compartiment 2 : Méthodes UML */}
            <CardContent className="p-2 space-y-1 font-mono text-xs bg-card">
                {methods && methods.length > 0 ? (
                    methods.map((meth) => (
                        <div key={meth.id} className="flex items-center justify-between text-[11px] truncate">
                            <div className="flex items-center gap-1 overflow-hidden">
                                <span className={`font-bold ${meth.visibility === "+" ? "text-green-500" : meth.visibility === "-" ? "text-red-500" : meth.visibility === "#" ? "text-amber-500" : "text-blue-500"}`}>
                                    {meth.visibility}
                                </span>
                                <span className={`${meth.isAbstract ? "italic" : meth.isStatic ? "underline" : ""} text-foreground truncate`}>
                                    {meth.name}({meth.parameters || ""})
                                </span>
                            </div>
                            <span className="text-muted-foreground text-[10px] ml-2 shrink-0">: {meth.returnType}</span>
                        </div>
                    ))
                ) : (
                    <div className="text-[10px] text-muted-foreground italic px-1">Aucune méthode</div>
                )}
            </CardContent>
        </Card>
    );
}
