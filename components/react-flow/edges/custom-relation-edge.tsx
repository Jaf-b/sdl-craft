import {
    BaseEdge,
    EdgeLabelRenderer,
    getSmoothStepPath,
    EdgeProps,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FlowCustomEdgeData } from "../types";

export function CustomRelationEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    label,
    data,
}: EdgeProps) {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 8,
    });

    const edgeData = data as FlowCustomEdgeData | undefined;

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (edgeData?.onDeleteEdge) {
            edgeData.onDeleteEdge(id);
        }
    };

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: "all",
                    }}
                    className="nodrag nopan flex items-center gap-0.5 bg-background/95 backdrop-blur-md border border-primary/40 rounded-full px-1.5 py-0.5 shadow-sm hover:border-primary transition-all group scale-90 hover:scale-100"
                >
                    {/* Badge Cardinalité */}
                    <span className="text-[9px] font-mono font-bold text-primary px-0.5 leading-none">
                        {typeof label === "string" ? label : edgeData?.cardinality ? String(edgeData.cardinality) : "1:N"}
                    </span>

                    {/* Bouton X de suppression rapide de la liaison */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-3.5 w-3.5 rounded-full p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/20 transition-colors shrink-0"
                        onClick={handleDelete}
                        title="Supprimer la liaison"
                    >
                        <X className="h-2 w-2" />
                    </Button>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
