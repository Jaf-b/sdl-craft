import { NodeProps, Handle, Position } from "@xyflow/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { McdEntityNode } from "../types";
import { NodeCommentBadge } from "../node-comment-badge";

export function McdEntityNodeComponent({ id, data }: NodeProps<McdEntityNode>) {
    const { label, attributes, commentCount, unresolvedCommentCount, onOpenComments } = data;

    return (
        <Card className="w-[260px] bg-card border-primary/40 text-card-foreground shadow-xl overflow-hidden py-0 transition-all hover:border-primary group">
            {/* Handles de connexion (Left, Right, Top, Bottom) */}
            <Handle type="target" position={Position.Left} id="left" className="!bg-primary !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Left} id="left-src" className="!bg-primary !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Right} id="right" className="!bg-primary !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Right} id="right-src" className="!bg-primary !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Top} id="top" className="!bg-primary !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Top} id="top-src" className="!bg-primary !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Bottom} id="bottom" className="!bg-primary !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Bottom} id="bottom-src" className="!bg-primary !w-3 !h-3 hover:!scale-125 transition-transform" />

            {/* En-tête Entité MCD */}
            <CardHeader className="bg-primary/10 px-3 py-2 border-b border-primary/20 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary">{label}</CardTitle>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-primary/10 border-primary/30 text-primary font-mono">
                        ENTITÉ
                    </Badge>
                </div>
                <div className="flex items-center gap-1">
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
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                            e.stopPropagation();
                            data.onEdit?.(id);
                        }}
                        title="Modifier l'entité"
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
                        title="Supprimer l'entité"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </CardHeader>

            {/* Liste des attributs Merise */}
            <CardContent className="p-2 space-y-1 font-mono text-xs">
                {attributes && attributes.length > 0 ? (
                    attributes.map((attr) => (
                        <div
                            key={attr.id}
                            className={`flex items-center justify-between py-1 px-2 rounded-md ${
                                attr.isIdentifier
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-300 font-semibold underline decoration-amber-500/60"
                                    : "bg-muted/30 text-foreground"
                            }`}
                        >
                            <span className="truncate">
                                {attr.isIdentifier && <span className="font-bold text-amber-500 mr-1">#</span>}
                                {attr.name}
                            </span>
                            {attr.isIdentifier && (
                                <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30 text-[8px] px-1 py-0 h-3.5">
                                    ID
                                </Badge>
                            )}
                        </div>
                    ))
                ) : (
                    <span className="text-[10px] text-muted-foreground italic px-2">Aucun attribut</span>
                )}
            </CardContent>
        </Card>
    );
}
