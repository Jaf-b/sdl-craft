"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { UmlStateKind } from "../types";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    editingNodeId: string | null;
    initialLabel?: string;
    initialKind?: UmlStateKind;
    initialEntry?: string;
    initialDo?: string;
    initialExit?: string;
    onSave: (label: string, kind: UmlStateKind, entry: string, doAction: string, exit: string) => void;
};

export function UmlStateModal({ isOpen, onClose, editingNodeId, initialLabel = "", initialKind = "simple",
    initialEntry = "", initialDo = "", initialExit = "", onSave }: Props) {
    const [label, setLabel] = useState(initialLabel);
    const [kind, setKind] = useState<UmlStateKind>(initialKind);
    const [entry, setEntry] = useState(initialEntry);
    const [doAction, setDoAction] = useState(initialDo);
    const [exit, setExit] = useState(initialExit);

    useEffect(() => {
        if (isOpen) {
            setLabel(initialLabel); setKind(initialKind);
            setEntry(initialEntry); setDoAction(initialDo); setExit(initialExit);
        }
    }, [isOpen, initialLabel, initialKind, initialEntry, initialDo, initialExit]);

    const hasActions = kind === "simple" || kind === "composite";

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-card border-border text-card-foreground max-w-md">
                <DialogHeader>
                    <DialogTitle>{editingNodeId ? "Modifier l'état" : "Créer un État"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Nom de l'état</Label>
                            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="EnAttente" className="bg-background text-xs font-mono" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Type</Label>
                            <Select value={kind} onValueChange={(v) => setKind(v as UmlStateKind)}>
                                <SelectTrigger className="bg-background text-xs font-mono h-9"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    <SelectItem value="simple">État Simple</SelectItem>
                                    <SelectItem value="composite">État Composite</SelectItem>
                                    <SelectItem value="initial">Pseudo-état Initial</SelectItem>
                                    <SelectItem value="final">État Final</SelectItem>
                                    <SelectItem value="choice">Pseudo-état Choix</SelectItem>
                                    <SelectItem value="fork">Fork</SelectItem>
                                    <SelectItem value="join">Join</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {hasActions && (
                        <div className="space-y-2">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">entry / action</Label>
                                <Input value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="entry / openConnection()" className="bg-background text-xs font-mono" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">do / action</Label>
                                <Input value={doAction} onChange={(e) => setDoAction(e.target.value)} placeholder="do / processData()" className="bg-background text-xs font-mono" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">exit / action</Label>
                                <Input value={exit} onChange={(e) => setExit(e.target.value)} placeholder="exit / closeConnection()" className="bg-background text-xs font-mono" />
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" size="sm" onClick={onClose}>Annuler</Button>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => { onSave(label, kind, entry, doAction, exit); onClose(); }}>Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
