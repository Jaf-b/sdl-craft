import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { McdAttribute } from "../types";

type McdEntityModalProps = {
    isOpen: boolean;
    onClose: () => void;
    editingNodeId: string | null;
    initialName?: string;
    initialAttributes?: McdAttribute[];
    onSave: (name: string, attributes: McdAttribute[]) => void;
};

export function McdEntityModal({
    isOpen,
    onClose,
    editingNodeId,
    initialName = "",
    initialAttributes = [],
    onSave,
}: McdEntityModalProps) {
    const [name, setName] = useState(initialName);
    const [attributes, setAttributes] = useState<McdAttribute[]>(initialAttributes);

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setAttributes(
                initialAttributes.length > 0
                    ? initialAttributes
                    : [{ id: `attr-${Date.now()}`, name: "id", isIdentifier: true, nullable: false }]
            );
        }
    }, [isOpen, initialName, initialAttributes]);

    const handleAddAttribute = () => {
        setAttributes([
            ...attributes,
            { id: `attr-${Date.now()}`, name: `attribut_${attributes.length + 1}`, isIdentifier: false, nullable: true },
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
                    <DialogTitle>{editingNodeId ? "Modifier l'Entité MCD" : "Créer une Entité MCD"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="entityName" className="text-xs text-muted-foreground">Nom de l'entité (ex: CLIENT, PRODUIT)</Label>
                        <Input
                            id="entityName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="CLIENT"
                            className="bg-background border-input uppercase"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs text-muted-foreground">Attributs Merise</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleAddAttribute}
                                className="text-xs text-primary hover:text-primary/80 h-7 px-2"
                            >
                                <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter Attribut
                            </Button>
                        </div>

                        <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                            {attributes.map((attr) => (
                                <div key={attr.id} className="flex items-center gap-2 bg-muted/40 p-2 rounded-md border border-border">
                                    <Input
                                        value={attr.name}
                                        onChange={(e) => setAttributes(attributes.map((a) => (a.id === attr.id ? { ...a, name: e.target.value } : a)))}
                                        className="h-8 bg-background border-input text-xs"
                                        placeholder="Nom de l'attribut"
                                    />

                                    <div className="flex items-center gap-1.5 px-2">
                                        <Checkbox
                                            id={`id-${attr.id}`}
                                            checked={!!attr.isIdentifier}
                                            onCheckedChange={(checked) =>
                                                setAttributes(attributes.map((a) => (a.id === attr.id ? { ...a, isIdentifier: Boolean(checked) } : a)))
                                            }
                                            className="border-amber-500 data-[state=checked]:bg-amber-500"
                                        />
                                        <Label htmlFor={`id-${attr.id}`} className="text-[11px] text-amber-600 dark:text-amber-400 font-bold cursor-pointer whitespace-nowrap">
                                            # Identifiant
                                        </Label>
                                    </div>

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
                    <Button size="sm" onClick={handleSave}>
                        Enregistrer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
