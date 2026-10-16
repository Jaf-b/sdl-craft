import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Key, Trash2 } from "lucide-react";
import { ModelingMode, McdCardinality, MldCardinality, MldColumn, MldTableData, FlowCustomNode } from "../types";

type EdgeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    mode: ModelingMode;
    editingEdgeId: string | null;
    nodes: FlowCustomNode[];
    sourceNodeId: string;
    targetNodeId: string;
    sourceFieldId?: string;
    targetFieldId?: string;
    initialCardinality?: string;
    onSave: (sourceFieldId: string, targetFieldId: string, cardinality: string) => void;
    onDeleteEdge: (edgeId: string) => void;
};

export function EdgeModal({
    isOpen,
    onClose,
    mode,
    editingEdgeId,
    nodes,
    sourceNodeId,
    targetNodeId,
    sourceFieldId: initialSourceFieldId = "",
    targetFieldId: initialTargetFieldId = "",
    initialCardinality,
    onSave,
    onDeleteEdge,
}: EdgeModalProps) {
    const defaultCardinality = mode === "MCD" ? "1,N" : "1:N";
    const [cardinality, setCardinality] = useState<string>(initialCardinality || defaultCardinality);
    const [targetFieldId, setTargetFieldId] = useState<string>(initialTargetFieldId);

    const sourceNode = nodes.find((n) => n.id === sourceNodeId);
    const targetNode = nodes.find((n) => n.id === targetNodeId);

    useEffect(() => {
        if (isOpen) {
            setCardinality(initialCardinality || defaultCardinality);
            setTargetFieldId(initialTargetFieldId);
        }
    }, [isOpen, initialCardinality, initialTargetFieldId, defaultCardinality]);

    const targetColumns: MldColumn[] = (targetNode?.data as MldTableData)?.columns || [];

    const handleSave = () => {
        onSave(initialSourceFieldId, targetFieldId, cardinality);
        onClose();
    };

    const handleDelete = () => {
        if (editingEdgeId) {
            onDeleteEdge(editingEdgeId);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-card border-border text-card-foreground max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-sm font-bold">
                        {editingEdgeId ? "Modifier la Liaison" : "Configurer la Liaison"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Informations Nœud Source / Cible */}
                    <div className="bg-muted/50 p-3 rounded-lg border border-border space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Source ({mode === "MCD" ? "Nœud" : "Clé Primaire"}) :</span>
                            {mode === "MLD" && (
                                <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30 text-[9px] px-1 py-0">
                                    <Key className="h-2.5 w-2.5 mr-0.5" /> PK
                                </Badge>
                            )}
                        </div>
                        <div className="text-sm font-semibold text-primary">
                            {sourceNode?.data?.label || sourceNodeId}
                        </div>
                    </div>

                    {/* Sélection du champ cible en MLD */}
                    {mode === "MLD" && targetColumns.length > 0 && (
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">
                                Champ cible dans <span className="text-primary font-semibold">{targetNode?.data?.label || targetNodeId}</span> :
                            </Label>
                            <Select value={targetFieldId} onValueChange={(value) => setTargetFieldId(value || "")}>
                                <SelectTrigger className="bg-background border-input text-xs font-mono">
                                    <SelectValue placeholder="Sélectionner la colonne" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    {targetColumns.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name} {c.isFk ? "(FK)" : ""}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Sélection de la Cardinalité / Relation */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                            Cardinalité / Relation ({mode === "MCD" ? "Merise" : mode === "MLD" ? "Relationnelle" : "UML"})
                        </Label>
                        {mode === "MCD" ? (
                            <Select value={cardinality} onValueChange={(val) => val && setCardinality(val as McdCardinality)}>
                                <SelectTrigger className="bg-background border-input text-xs font-mono">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    <SelectItem value="0,1">0,1 (Au plus un)</SelectItem>
                                    <SelectItem value="1,1">1,1 (Exactement un)</SelectItem>
                                    <SelectItem value="0,N">0,N (Au moins zéro, jusqu'à plusieurs)</SelectItem>
                                    <SelectItem value="1,N">1,N (Au moins un, jusqu'à plusieurs)</SelectItem>
                                    <SelectItem value="N,N">N,N (Au moins un, jusqu'à plusieurs)</SelectItem>
                                    <SelectItem value="N,1">N,1 (Au moins un, jusqu'à plusieurs)</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : mode === "MLD" ? (
                            <Select value={cardinality} onValueChange={(val) => val && setCardinality(val as MldCardinality)}>
                                <SelectTrigger className="bg-background border-input text-xs font-mono">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    <SelectItem value="1:1">1:1 (Un à Un)</SelectItem>
                                    <SelectItem value="1:N">1:N (Un à Plusieurs)</SelectItem>
                                    <SelectItem value="N:N">N:N (Plusieurs à Plusieurs)</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <Select value={cardinality} onValueChange={(val) => val && setCardinality(val)}>
                                <SelectTrigger className="bg-background border-input text-xs font-mono">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    <SelectItem value="1..*">1..* (Au moins un)</SelectItem>
                                    <SelectItem value="0..*">0..* (Zéro ou plusieurs)</SelectItem>
                                    <SelectItem value="0..1">0..1 (Zéro ou un)</SelectItem>
                                    <SelectItem value="1">1 (Exactement un)</SelectItem>
                                    <SelectItem value="inherits">«extends» Héritage</SelectItem>
                                    <SelectItem value="implements">«implements» Implémentation</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex justify-between items-center w-full">
                    {editingEdgeId ? (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                            className="mr-auto text-xs gap-1.5"
                        >
                            <Trash2 className="h-3.5 w-3.5" /> Supprimer la liaison
                        </Button>
                    ) : (
                        <div />
                    )}
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={onClose}>
                            Annuler
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                            Enregistrer
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
