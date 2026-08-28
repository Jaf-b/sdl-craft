"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Box } from "lucide-react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    editingNodeId: string | null;
    initialLabel?: string;
    initialInstanceName?: string;
    initialClassName?: string;
    initialIsActor?: boolean;
    onSave: (label: string, instanceName: string, className: string, isActor: boolean) => void;
};

export function UmlLifelineModal({
    isOpen,
    onClose,
    editingNodeId,
    initialLabel = "",
    initialInstanceName = "",
    initialClassName = "",
    initialIsActor = false,
    onSave,
}: Props) {
    const [label, setLabel] = useState(initialLabel);
    const [instanceName, setInstanceName] = useState(initialInstanceName);
    const [className, setClassName] = useState(initialClassName);
    const [isActor, setIsActor] = useState(initialIsActor);

    useEffect(() => {
        if (isOpen) {
            setLabel(initialLabel);
            setInstanceName(initialInstanceName);
            setClassName(initialClassName);
            setIsActor(initialIsActor);
        }
    }, [isOpen, initialLabel, initialInstanceName, initialClassName, initialIsActor]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-card border-border text-card-foreground max-w-md">
                <DialogHeader>
                    <DialogTitle>{editingNodeId ? "Modifier la ligne de vie" : "Créer une Ligne de Vie (Séquence)"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    {/* Choix Acteur vs Objet */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Type de Ligne de Vie</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                type="button"
                                variant={!isActor ? "default" : "outline"}
                                className={`h-9 text-xs gap-1.5 ${!isActor ? "bg-teal-600 hover:bg-teal-700 text-white" : ""}`}
                                onClick={() => setIsActor(false)}
                            >
                                <Box className="h-3.5 w-3.5" /> Objet / Système
                            </Button>
                            <Button
                                type="button"
                                variant={isActor ? "default" : "outline"}
                                className={`h-9 text-xs gap-1.5 ${isActor ? "bg-teal-600 hover:bg-teal-700 text-white" : ""}`}
                                onClick={() => setIsActor(true)}
                            >
                                <User className="h-3.5 w-3.5" /> Acteur (User)
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Nom d'instance</Label>
                            <Input
                                value={instanceName}
                                onChange={(e) => setInstanceName(e.target.value)}
                                placeholder="client"
                                className="bg-background text-xs font-mono underline"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Nom de la Classe / Système</Label>
                            <Input
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                                placeholder="Client"
                                className="bg-background text-xs font-mono"
                            />
                        </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground font-mono bg-muted/30 p-2 rounded">
                        Aperçu : <span className="underline">{instanceName || "instance"} : {className || "Classe"}</span>
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                        onClick={() => {
                            onSave(label || `${instanceName}:${className}`, instanceName, className, isActor);
                            onClose();
                        }}
                    >
                        Enregistrer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
