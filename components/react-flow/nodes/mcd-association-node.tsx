import { NodeProps, Handle, Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { McdAssociationNode } from "../types";
import { NodeCommentBadge } from "../node-comment-badge";

export function McdAssociationNodeComponent({ id, data }: NodeProps<McdAssociationNode>) {
    const { label, attributes, commentCount, unresolvedCommentCount, onOpenComments } = data;

    return (
        <div className="relative group">
            {/* Handles de connexion (Left, Right, Top, Bottom) */}
            <Handle type="target" position={Position.Left} id="left" className="!bg-emerald-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Left} id="left-src" className="!bg-emerald-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Right} id="right" className="!bg-emerald-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Right} id="right-src" className="!bg-emerald-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Top} id="top" className="!bg-emerald-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Top} id="top-src" className="!bg-emerald-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Bottom} id="bottom" className="!bg-emerald-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Bottom} id="bottom-src" className="!bg-emerald-500 !w-3 !h-3 hover:!scale-125 transition-transform" />

            {/* Shape Ovale/Losange Merise */}
            <div className="w-[180px] min-h-[90px] bg-gradient-to-br from-emerald-500/10 via-card to-emerald-500/5 border-2 border-emerald-500/60 rounded-[45px] shadow-lg flex flex-col items-center justify-center p-3 text-center transition-all hover:border-emerald-500 hover:shadow-emerald-500/20">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono px-2 truncate w-full">
                    {label}
                </div>

                {attributes && attributes.length > 0 && (
                    <div className="mt-1 border-t border-emerald-500/20 pt-1 w-full space-y-0.5 font-mono text-[10px]">
                        {attributes.map((attr) => (
                            <div key={attr.id} className="text-muted-foreground truncate">
                                {attr.name}
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions au survol ou constantes */}
                <div className="absolute -top-3 right-2 bg-card border border-border rounded-md shadow flex items-center gap-0.5 p-0.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <NodeCommentBadge
                        nodeId={id}
                        nodeLabel={label}
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
                        title="Modifier l'association"
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
                        title="Supprimer l'association"
                    >
                        <Trash2 className="h-2.5 w-2.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
