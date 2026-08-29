import { NodeProps, Handle, Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { User, Pencil, Trash2 } from "lucide-react";
import { UmlActorNode } from "../types";
import { NodeCommentBadge } from "../node-comment-badge";

export function UmlActorNodeComponent({ id, data }: NodeProps<UmlActorNode>) {
    const { label, roleDescription, commentCount, unresolvedCommentCount, onOpenComments } = data;

    return (
        <div className="relative group flex flex-col items-center">
            {/* Handles de connexion (Top, Bottom, Left, Right) */}
            <Handle type="target" position={Position.Top} id="top" className="!bg-purple-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Top} id="top-src" className="!bg-purple-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Bottom} id="bottom" className="!bg-purple-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Bottom} id="bottom-src" className="!bg-purple-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Left} id="left" className="!bg-purple-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Left} id="left-src" className="!bg-purple-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Right} id="right" className="!bg-purple-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Right} id="right-src" className="!bg-purple-500 !w-3 !h-3 hover:!scale-125 transition-transform" />

            {/* Icone Stickman Acteur UML */}
            <div className="w-16 h-20 bg-purple-500/10 border-2 border-purple-500/60 rounded-xl shadow-lg flex flex-col items-center justify-center p-2 text-purple-600 dark:text-purple-400 hover:border-purple-500 transition-all">
                <User className="h-10 w-10 stroke-[1.5]" />
            </div>

            <div className="mt-1.5 text-xs font-bold font-mono text-center text-foreground max-w-[120px] truncate">
                {label}
            </div>

            {roleDescription && (
                <div className="text-[9px] font-mono text-muted-foreground text-center truncate max-w-[120px]">
                    {roleDescription}
                </div>
            )}

            {/* Actions au survol */}
            <div className="absolute -top-3 right-0 bg-card border border-border rounded-md shadow flex items-center gap-0.5 p-0.5 opacity-90 group-hover:opacity-100 transition-opacity">
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
                    title="Modifier l'acteur"
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
                    title="Supprimer l'acteur"
                >
                    <Trash2 className="h-2.5 w-2.5" />
                </Button>
            </div>
        </div>
    );
}
