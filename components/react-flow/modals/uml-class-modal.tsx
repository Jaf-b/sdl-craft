import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { UmlAttribute, UmlMethod, UmlVisibility, UmlClassType } from "../types";

type UmlClassModalProps = {
    isOpen: boolean;
    onClose: () => void;
    editingNodeId: string | null;
    initialClassName?: string;
    initialClassType?: UmlClassType;
    initialAttributes?: UmlAttribute[];
    initialMethods?: UmlMethod[];
    onSave: (name: string, classType: UmlClassType, attributes: UmlAttribute[], methods: UmlMethod[]) => void;
};

export function UmlClassModal({
    isOpen,
    onClose,
    editingNodeId,
    initialClassName = "",
    initialClassType = "class",
    initialAttributes = [],
    initialMethods = [],
    onSave,
}: UmlClassModalProps) {
    const [name, setName] = useState(initialClassName);
    const [classType, setClassType] = useState<UmlClassType>(initialClassType);
    const [attributes, setAttributes] = useState<UmlAttribute[]>(initialAttributes);
    const [methods, setMethods] = useState<UmlMethod[]>(initialMethods);

    useEffect(() => {
        if (isOpen) {
            setName(initialClassName);
            setClassType(initialClassType);
            setAttributes(
                initialAttributes.length > 0
                    ? initialAttributes
                    : [{ id: `attr-${Date.now()}`, name: "id", type: "string", visibility: "+" }]
            );
            setMethods(
                initialMethods.length > 0
                    ? initialMethods
                    : [{ id: `meth-${Date.now()}`, name: "getId", returnType: "string", visibility: "+", parameters: "" }]
            );
        }
    }, [isOpen, initialClassName, initialClassType, initialAttributes, initialMethods]);

    const handleAddAttribute = () => {
        setAttributes([
            ...attributes,
            { id: `attr-${Date.now()}`, name: `attribute${attributes.length + 1}`, type: "string", visibility: "+" },
        ]);
    };

    const handleAddMethod = () => {
        setMethods([
            ...methods,
            { id: `meth-${Date.now()}`, name: `method${methods.length + 1}`, returnType: "void", visibility: "+", parameters: "" },
        ]);
    };

    const handleSave = () => {
        if (!name.trim()) return;
        onSave(name.trim(), classType, attributes, methods);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-card border-border text-card-foreground max-w-xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingNodeId ? "Modifier la Classe UML" : "Créer une Classe UML"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Nom et Type de Classe */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 space-y-1.5">
                            <Label htmlFor="className" className="text-xs text-muted-foreground">Nom de la classe</Label>
                            <Input
                                id="className"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="User, Order, Payment"
                                className="bg-background border-input font-mono"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Type UML</Label>
                            <Select value={classType} onValueChange={(val) => setClassType(val as UmlClassType)}>
                                <SelectTrigger className="bg-background border-input text-xs font-mono">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    <SelectItem value="class">Classe</SelectItem>
                                    <SelectItem value="interface">Interface</SelectItem>
                                    <SelectItem value="abstract">Classe Abstraite</SelectItem>
                                    <SelectItem value="enum">Enumération</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Section Attributs */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs text-muted-foreground">Attributs (+ Visibilité, Nom, Type)</Label>
                            <Button variant="ghost" size="sm" onClick={handleAddAttribute} className="text-xs text-indigo-500 h-7 px-2">
                                <Plus className="h-3.5 w-3.5 mr-1" /> Attribut
                            </Button>
                        </div>

                        <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                            {attributes.map((attr) => (
                                <div key={attr.id} className="flex items-center gap-2 bg-muted/40 p-2 rounded-md border border-border">
                                    <Select
                                        value={attr.visibility}
                                        onValueChange={(val) => setAttributes(attributes.map((a) => (a.id === attr.id ? { ...a, visibility: val as UmlVisibility } : a)))}
                                    >
                                        <SelectTrigger className="w-[65px] h-8 bg-background text-xs font-bold font-mono">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            <SelectItem value="+">+ (Public)</SelectItem>
                                            <SelectItem value="-">- (Private)</SelectItem>
                                            <SelectItem value="#"># (Protected)</SelectItem>
                                            <SelectItem value="~">~ (Package)</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        value={attr.name}
                                        onChange={(e) => setAttributes(attributes.map((a) => (a.id === attr.id ? { ...a, name: e.target.value } : a)))}
                                        placeholder="nom"
                                        className="h-8 bg-background text-xs font-mono"
                                    />

                                    <Input
                                        value={attr.type}
                                        onChange={(e) => setAttributes(attributes.map((a) => (a.id === attr.id ? { ...a, type: e.target.value } : a)))}
                                        placeholder="string"
                                        className="h-8 bg-background text-xs font-mono w-[110px]"
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

                    {/* Section Méthodes */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs text-muted-foreground">Méthodes (+ Visibilité, Nom, Paramètres, Type Retour)</Label>
                            <Button variant="ghost" size="sm" onClick={handleAddMethod} className="text-xs text-purple-500 h-7 px-2">
                                <Plus className="h-3.5 w-3.5 mr-1" /> Méthode
                            </Button>
                        </div>

                        <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                            {methods.map((meth) => (
                                <div key={meth.id} className="flex items-center gap-2 bg-muted/40 p-2 rounded-md border border-border">
                                    <Select
                                        value={meth.visibility}
                                        onValueChange={(val) => setMethods(methods.map((m) => (m.id === meth.id ? { ...m, visibility: val as UmlVisibility } : m)))}
                                    >
                                        <SelectTrigger className="w-[65px] h-8 bg-background text-xs font-bold font-mono">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            <SelectItem value="+">+ (Public)</SelectItem>
                                            <SelectItem value="-">- (Private)</SelectItem>
                                            <SelectItem value="#"># (Protected)</SelectItem>
                                            <SelectItem value="~">~ (Package)</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        value={meth.name}
                                        onChange={(e) => setMethods(methods.map((m) => (m.id === meth.id ? { ...m, name: e.target.value } : m)))}
                                        placeholder="nomMethode"
                                        className="h-8 bg-background text-xs font-mono"
                                    />

                                    <Input
                                        value={meth.parameters || ""}
                                        onChange={(e) => setMethods(methods.map((m) => (m.id === meth.id ? { ...m, parameters: e.target.value } : m)))}
                                        placeholder="param1: type"
                                        className="h-8 bg-background text-xs font-mono w-[100px]"
                                    />

                                    <Input
                                        value={meth.returnType}
                                        onChange={(e) => setMethods(methods.map((m) => (m.id === meth.id ? { ...m, returnType: e.target.value } : m)))}
                                        placeholder="void"
                                        className="h-8 bg-background text-xs font-mono w-[90px]"
                                    />

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                                        onClick={() => setMethods(methods.filter((m) => m.id !== meth.id))}
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
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSave}>
                        Enregistrer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
