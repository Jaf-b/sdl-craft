import { NodeProps, Handle, Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { UmlActivityNode } from "../types";
import { NodeCommentBadge } from "../node-comment-badge";

export function UmlActivityNodeComponent({ id, data }: NodeProps<UmlActivityNode>) {
    const { label, nodeKind, commentCount, unresolvedCommentCount, onOpenComments } = data;

    // 1. État Initial UML (Cercle rempli)
    if (nodeKind === "initial") {
        return (
            <div className="relative group">
                <Handle type="target" position={Position.Left} id="left" className="!bg-amber-500 !w-2.5 !h-2.5" />
                <Handle type="source" position={Position.Right} id="right" className="!bg-amber-500 !w-2.5 !h-2.5" />
                <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-amber-500 !w-2.5 !h-2.5" />
                <div className="w-8 h-8 rounded-full bg-amber-500 shadow-md flex items-center justify-center border-2 border-amber-600">
                    <span className="sr-only">Début</span>
                </div>
            </div>
        );
    }

    // 2. État Final UML (Double cercle)
    if (nodeKind === "final") {
        return (
            <div className="relative group">
                <Handle type="target" position={Position.Left} id="left" className="!bg-amber-500 !w-2.5 !h-2.5" />
                <Handle type="target" position={Position.Top} id="top" className="!bg-amber-500 !w-2.5 !h-2.5" />
                <div className="w-8 h-8 rounded-full border-2 border-amber-500 bg-background flex items-center justify-center shadow-md">
                    <div className="w-4 h-4 rounded-full bg-amber-500" />
                </div>
            </div>
        );
    }

    // 3. Nœud de Décision UML (Losange)
    if (nodeKind === "decision") {
        return (
            <div className="relative group">
                <Handle type="target" position={Position.Top} id="top" className="!bg-amber-500 !w-2.5 !h-2.5" />
                <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-amber-500 !w-2.5 !h-2.5" />
                <Handle type="source" position={Position.Right} id="right" className="!bg-amber-500 !w-2.5 !h-2.5" />
                <Handle type="target" position={Position.Left} id="left" className="!bg-amber-500 !w-2.5 !h-2.5" />

                <div className="w-16 h-16 rotate-45 bg-amber-500/10 border-2 border-amber-500/80 shadow-md flex items-center justify-center p-1 hover:border-amber-500 transition-all">
                    <span className="-rotate-45 text-[10px] font-bold font-mono text-amber-600 dark:text-amber-300 text-center truncate max-w-[50px]">
                        {label || "?"}
                    </span>
                </div>

                <div className="absolute -top-3 right-0 bg-card border border-border rounded-md shadow flex items-center gap-0.5 p-0.5 opacity-90 group-hover:opacity-100 transition-opacity z-10">
                    <NodeCommentBadge
                        nodeId={id}
                        nodeLabel={label || "Décision"}
                        commentCount={commentCount}
                        unresolvedCount={unresolvedCommentCount}
                        onOpenComments={onOpenComments}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                            e.stopPropagation();
                            data.onDelete?.(id);
                        }}
                    >
                        <Trash2 className="h-2.5 w-2.5" />
                    </Button>
                </div>
            </div>
        );
    }

    // 4. Action / Étape d'activité UML (Rectangle Arrondi)
    return (
        <div className="relative group">
            <Handle type="target" position={Position.Top} id="top" className="!bg-amber-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Top} id="top-src" className="!bg-amber-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Bottom} id="bottom" className="!bg-amber-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Bottom} id="bottom-src" className="!bg-amber-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Left} id="left" className="!bg-amber-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Left} id="left-src" className="!bg-amber-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Right} id="right" className="!bg-amber-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Right} id="right-src" className="!bg-amber-500 !w-3 !h-3 hover:!scale-125 transition-transform" />

            <div className="w-[180px] min-h-[50px] bg-gradient-to-br from-amber-500/10 via-card to-amber-500/5 border-2 border-amber-500/60 rounded-xl shadow-md flex items-center justify-center p-3 text-center transition-all hover:border-amber-500">
                <div className="text-xs font-bold font-mono text-amber-600 dark:text-amber-300 truncate w-full">
                    {label}
                </div>

                <div className="absolute -top-3 right-2 bg-card border border-border rounded-md shadow flex items-center gap-0.5 p-0.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <NodeCommentBadge
                        nodeId={id}
                        nodeLabel={label || "Action"}
                        commentCount={commentCount}
                        unresolvedCount={unresolvedCommentCount}
                        onOpenComments={onOpenComments}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                            e.stopPropagation();
                            data.onEdit?.(id);
                        }}
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
                    >
                        <Trash2 className="h-2.5 w-2.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
