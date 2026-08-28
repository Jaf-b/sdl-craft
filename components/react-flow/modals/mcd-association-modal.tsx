import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { McdAttribute } from "../types";

type McdAssociationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    editingNodeId: string | null;
    initialName?: string;
    initialAttributes?: McdAttribute[];
    onSave: (name: string, attributes: McdAttribute[]) => void;
};

export function McdAssociationModal({
    isOpen,
    onClose,
    editingNodeId,
    initialName = "",
    initialAttributes = [],
    onSave,
}: McdAssociationModalProps) {
    const [name, setName] = useState(initialName);
    const [attributes, setAttributes] = useState<McdAttribute[]>(initialAttributes);

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setAttributes(initialAttributes);
        }
    }, [isOpen, initialName, initialAttributes]);

    const handleAddAttribute = () => {
        setAttributes([
            ...attributes,
            { id: `attr-${Date.now()}`, name: `date_association`, nullable: true },
        ]);
    };

    const handleSave = () => {
        if (!name.trim()) return;
        onSave(name.trim(), attributes);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-card border-border text-card-foreground max-w-lg">
                <DialogHeader>
                    <DialogTitle>{editingNodeId ? "Modifier l'Association MCD" : "Créer une Association MCD"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="assocName" className="text-xs text-muted-foreground">Nom de l'association / verbe (ex: PASSER, CONTENIR, APPARTENIR)</Label>
                        <Input
                            id="assocName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="APPARTENIR"
                            className="bg-background border-input uppercase font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs text-muted-foreground">Attributs de l'association (optionnels)</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleAddAttribute}
                                className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 h-7 px-2"
                            >
                                <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter Attribut
                            </Button>
                        </div>

                        <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                            {attributes.map((attr) => (
                                <div key={attr.id} className="flex items-center gap-2 bg-muted/40 p-2 rounded-md border border-border">
                                    <Input
                                        value={attr.name}
                                        onChange={(e) => setAttributes(attributes.map((a) => (a.id === attr.id ? { ...a, name: e.target.value } : a)))}
                                        className="h-8 bg-background border-input text-xs"
                                        placeholder="Nom de l'attribut (ex: date_commande, quantite)"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                                        onClick={() => setAttributes(attributes.filter((a) => a.id !== attr.id))}
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSave}>
                        Enregistrer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
