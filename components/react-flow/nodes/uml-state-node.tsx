import { NodeProps, Handle, Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { UmlStateNode } from "../types";

export function UmlStateNodeComponent({ id, data, selected }: NodeProps<UmlStateNode>) {
    const { label, kind, entryAction, doAction, exitAction } = data;

    const handles = (
        <>
            <Handle type="target" position={Position.Top}    id="top"        className="!bg-teal-400 !w-2.5 !h-2.5" />
            <Handle type="source" position={Position.Top}    id="top-src"    className="!bg-teal-400 !w-2.5 !h-2.5" />
            <Handle type="target" position={Position.Bottom} id="bottom"     className="!bg-teal-400 !w-2.5 !h-2.5" />
            <Handle type="source" position={Position.Bottom} id="bottom-src" className="!bg-teal-400 !w-2.5 !h-2.5" />
            <Handle type="target" position={Position.Left}   id="left"       className="!bg-teal-400 !w-2.5 !h-2.5" />
            <Handle type="source" position={Position.Left}   id="left-src"   className="!bg-teal-400 !w-2.5 !h-2.5" />
            <Handle type="target" position={Position.Right}  id="right"      className="!bg-teal-400 !w-2.5 !h-2.5" />
            <Handle type="source" position={Position.Right}  id="right-src"  className="!bg-teal-400 !w-2.5 !h-2.5" />
        </>
    );

    // 1. Initial : cercle rempli vert foncé
    if (kind === "initial") {
        return (
            <div className="relative group">
                {handles}
                <div className="w-5 h-5 rounded-full bg-green-900 shadow-md" />
            </div>
        );
    }

    // 2. Final : double cercle noir
    if (kind === "final") {
        return (
            <div className="relative group">
                {handles}
                <div className="w-7 h-7 rounded-full border-2 border-gray-900 bg-white flex items-center justify-center shadow-md">
                    <div className="w-3.5 h-3.5 rounded-full bg-gray-900" />
                </div>
            </div>
        );
    }

    // 3. Choice : losange orange
    if (kind === "choice") {
        return (
            <div className="relative group flex items-center justify-center w-16 h-16">
                {handles}
                <div className="absolute w-11 h-11 bg-orange-400 border-2 border-orange-600 shadow-md" style={{ transform: "rotate(45deg)" }} />
                {label && (
                    <span className="relative z-10 text-[10px] font-semibold text-white text-center leading-tight px-1">
                        {label}
                    </span>
                )}
                <div className="absolute -top-3 right-0 bg-card border border-border rounded-md shadow flex items-center gap-0.5 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-muted-foreground hover:text-foreground"
                        onClick={(e) => { e.stopPropagation(); data.onEdit?.(id); }}>
                        <Pencil className="h-2.5 w-2.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-destructive hover:bg-destructive/10"
                        onClick={(e) => { e.stopPropagation(); data.onDelete?.(id); }}>
                        <Trash2 className="h-2.5 w-2.5" />
                    </Button>
                </div>
            </div>
        );
    }

    // 4. Fork / Join : barre horizontale noire épaisse
    if (kind === "fork" || kind === "join") {
        return (
            <div className="relative group flex items-center justify-center">
                {handles}
                <div className="w-32 h-2 bg-gray-900 rounded-sm shadow-md" />
                <div className="absolute -top-4 right-0 bg-card border border-border rounded-md shadow flex items-center gap-0.5 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-muted-foreground hover:text-foreground"
                        onClick={(e) => { e.stopPropagation(); data.onEdit?.(id); }}>
                        <Pencil className="h-2.5 w-2.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-destructive hover:bg-destructive/10"
                        onClick={(e) => { e.stopPropagation(); data.onDelete?.(id); }}>
                        <Trash2 className="h-2.5 w-2.5" />
                    </Button>
                </div>
            </div>
        );
    }

    // 5. Simple / Composite : rectangle arrondi bleu-vert
    const hasInternals = entryAction || doAction || exitAction;
    const isComposite  = kind === "composite";

    return (
        <div className="relative group">
            {handles}
            <div className={`min-w-[160px] rounded-xl border-2 bg-teal-50 shadow-md transition-all ${selected ? "border-teal-500 ring-2 ring-teal-300" : "border-teal-400"} ${isComposite ? "border-dashed" : ""}`}>
                {/* En-tête */}
                <div className="bg-teal-500 text-white text-sm font-bold text-center px-4 py-1.5 rounded-t-[10px]">
                    {label || "État"}
                </div>

                {/* Actions internes */}
                {hasInternals && (
                    <div className="text-xs font-mono text-gray-700 divide-y divide-teal-200 border-t border-teal-300">
                        {entryAction && (
                            <div className="px-3 py-1">
                                <span className="font-semibold text-teal-700">entry</span>{" / "}{entryAction}
                            </div>
                        )}
                        {doAction && (
                            <div className="px-3 py-1">
                                <span className="font-semibold text-teal-700">do</span>{" / "}{doAction}
                            </div>
                        )}
                        {exitAction && (
                            <div className="px-3 py-1">
                                <span className="font-semibold text-teal-700">exit</span>{" / "}{exitAction}
                            </div>
                        )}
                    </div>
                )}

                {/* Zone composite */}
                {isComposite && (
                    <div className="mx-2 mb-2 mt-1 h-8 rounded border border-dashed border-teal-300 flex items-center justify-center">
                        <span className="text-[10px] text-teal-400 italic">sous-états</span>
                    </div>
                )}

                {/* Boutons */}
                <div className="absolute -top-3 right-2 bg-card border border-border rounded-md shadow flex items-center gap-0.5 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground"
                        onClick={(e) => { e.stopPropagation(); data.onEdit?.(id); }}>
                        <Pencil className="h-2.5 w-2.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive hover:bg-destructive/10"
                        onClick={(e) => { e.stopPropagation(); data.onDelete?.(id); }}>
                        <Trash2 className="h-2.5 w-2.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
