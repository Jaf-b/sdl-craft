import { NodeProps, Handle, Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { UmlUseCaseNode } from "../types";

export function UmlUseCaseNodeComponent({ id, data }: NodeProps<UmlUseCaseNode>) {
    const { label, description } = data;

    return (
        <div className="relative group">
            {/* Handles de connexion (Top, Bottom, Left, Right) */}
            <Handle type="target" position={Position.Top} id="top" className="!bg-purple-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Top} id="top-src" className="!bg-purple-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Bottom} id="bottom" className="!bg-purple-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Bottom} id="bottom-src" className="!bg-purple-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Left} id="left" className="!bg-purple-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Left} id="left-src" className="!bg-purple-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="target" position={Position.Right} id="right" className="!bg-purple-500 !w-3 !h-3 hover:!scale-125 transition-transform" />
            <Handle type="source" position={Position.Right} id="right-src" className="!bg-purple-500 !w-3 !h-3 hover:!scale-125 transition-transform" />

            {/* Shape Ovale Cas d'Utilisation UML */}
            <div className="w-[200px] min-h-[85px] bg-gradient-to-br from-purple-500/10 via-card to-purple-500/5 border-2 border-purple-500/60 rounded-[50px] shadow-lg flex flex-col items-center justify-center p-3 text-center transition-all hover:border-purple-500 hover:shadow-purple-500/20">
                <div className="text-xs font-bold font-mono text-purple-600 dark:text-purple-300 px-2 truncate w-full">
                    {label}
                </div>

                {description && (
                    <div className="text-[10px] font-mono text-muted-foreground mt-0.5 truncate w-full">
                        {description}
                    </div>
                )}

                {/* Actions au survol */}
                <div className="absolute -top-3 right-3 bg-card border border-border rounded-md shadow flex items-center gap-0.5 p-0.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                            e.stopPropagation();
                            data.onEdit?.(id);
                        }}
                        title="Modifier le cas d'utilisation"
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
                        title="Supprimer le cas d'utilisation"
                    >
                        <Trash2 className="h-2.5 w-2.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
