import { NodeProps, Handle, Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { User, Pencil, Trash2 } from "lucide-react";
import { UmlLifelineNode } from "../types";

export function UmlLifelineNodeComponent({ id, data, selected }: NodeProps<UmlLifelineNode>) {
    const { label, instanceName, className, isActor } = data;
    const headerTitle = instanceName && className ? `${instanceName} : ${className}` : (label || "Objet");

    return (
        <div className="relative flex flex-col items-center select-none">
            {/* Handle pour le point de contact supérieur */}
            <Handle type="target" position={Position.Top} id="top" className="!bg-teal-500 !w-2.5 !h-2.5" />
            <Handle type="source" position={Position.Top} id="top-src" className="!bg-teal-500 !w-2.5 !h-2.5" />

            {/* En-tête : Acteur ou Rectangle objet */}
            {isActor ? (
                <div className={`flex flex-col items-center justify-center p-2 rounded-lg bg-teal-500/10 border-2 ${selected ? "border-teal-500 ring-2 ring-teal-300" : "border-teal-500/60"} shadow-md min-w-[100px]`}>
                    <User className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                    <span className="text-xs font-bold font-mono text-center text-foreground mt-1 underline">
                        {headerTitle}
                    </span>
                </div>
            ) : (
                <div className={`w-[120px] py-2 px-1 text-center rounded-md bg-card border-2 ${selected ? "border-teal-500 ring-2 ring-teal-300" : "border-teal-500/60"} shadow-md`}>
                    <div className="text-xs font-bold font-mono text-foreground truncate underline">
                        {headerTitle}
                    </div>
                </div>
            )}

            {/* Boutons d'action */}
            <div className="absolute -top-3 right-0 bg-card border border-border rounded-md shadow flex items-center gap-0.5 p-0.5 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity z-20">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 text-muted-foreground hover:text-foreground"
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
                    className="h-4 w-4 text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                        e.stopPropagation();
                        data.onDelete?.(id);
                    }}
                >
                    <Trash2 className="h-2.5 w-2.5" />
                </Button>
            </div>

            {/* Ligne de vie pointillée vers le bas */}
            <div className="relative w-[2px] h-[220px] border-l-2 border-dashed border-teal-500/60 flex flex-col items-center">
                {/* Barre d'activation centrale */}
                <div className="absolute top-10 w-3 h-24 bg-teal-500/20 border border-teal-500/80 rounded-sm shadow-inner" />

                {/* Handles sur la ligne de vie pour les messages de séquence */}
                <Handle type="target" position={Position.Left} id="left" className="!bg-teal-500 !w-2.5 !h-2.5 !top-16" />
                <Handle type="source" position={Position.Left} id="left-src" className="!bg-teal-500 !w-2.5 !h-2.5 !top-16" />
                <Handle type="target" position={Position.Right} id="right" className="!bg-teal-500 !w-2.5 !h-2.5 !top-28" />
                <Handle type="source" position={Position.Right} id="right-src" className="!bg-teal-500 !w-2.5 !h-2.5 !top-28" />

                <Handle type="target" position={Position.Left} id="left-mid" className="!bg-teal-500 !w-2.5 !h-2.5 !top-40" />
                <Handle type="source" position={Position.Left} id="left-mid-src" className="!bg-teal-500 !w-2.5 !h-2.5 !top-40" />
                <Handle type="target" position={Position.Right} id="right-mid" className="!bg-teal-500 !w-2.5 !h-2.5 !top-48" />
                <Handle type="source" position={Position.Right} id="right-mid-src" className="!bg-teal-500 !w-2.5 !h-2.5 !top-48" />

                <Handle type="target" position={Position.Bottom} id="bottom" className="!bg-teal-500 !w-2.5 !h-2.5" />
                <Handle type="source" position={Position.Bottom} id="bottom-src" className="!bg-teal-500 !w-2.5 !h-2.5" />
            </div>
        </div>
    );
}
