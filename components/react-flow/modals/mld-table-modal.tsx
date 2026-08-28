import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { MldColumn, DataType } from "../types";

type MldTableModalProps = {
    isOpen: boolean;
    onClose: () => void;
    editingNodeId: string | null;
    initialTableName?: string;
    initialColumns?: MldColumn[];
    onSave: (tableName: string, columns: MldColumn[]) => void;
};

export function MldTableModal({
    isOpen,
    onClose,
    editingNodeId,
    initialTableName = "",
    initialColumns = [],
    onSave,
}: MldTableModalProps) {
    const [tableName, setTableName] = useState(initialTableName);
    const [columns, setColumns] = useState<MldColumn[]>(initialColumns);

    useEffect(() => {
        if (isOpen) {
            setTableName(initialTableName);
            setColumns(
                initialColumns.length > 0
                    ? initialColumns
                    : [{ id: `col-${Date.now()}`, name: "id", type: "UUID", isPk: true, nullable: false }]
            );
        }
    }, [isOpen, initialTableName, initialColumns]);

    const handleAddColumn = () => {
        setColumns([
            ...columns,
            { id: `col-${Date.now()}`, name: "nouvelle_colonne", type: "VARCHAR(255)", nullable: true },
        ]);
    };

    const handleSave = () => {
        if (!tableName.trim()) return;
        onSave(tableName.trim(), columns);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-card border-border text-card-foreground max-w-lg">
                <DialogHeader>
                    <DialogTitle>{editingNodeId ? "Modifier la Table MLD" : "Créer une Table MLD"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="tableName" className="text-xs text-muted-foreground">Nom de la table</Label>
                        <Input
                            id="tableName"
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            placeholder="utilisateurs"
                            className="bg-background border-input font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs text-muted-foreground">Colonnes & Types de données</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleAddColumn}
                                className="text-xs text-primary hover:text-primary/80 h-7 px-2"
                            >
                                <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter Colonne
                            </Button>
                        </div>

                        <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                            {columns.map((col) => (
                                <div key={col.id} className="flex items-center gap-2 bg-muted/40 p-2 rounded-md border border-border">
                                    <Input
                                        value={col.name}
                                        onChange={(e) => setColumns(columns.map((c) => (c.id === col.id ? { ...c, name: e.target.value } : c)))}
                                        className="h-8 bg-background border-input text-xs font-mono"
                                    />
                                    <Select
                                        value={col.type}
                                        onValueChange={(val) => {
                                            if (val) {
                                                setColumns(columns.map((c) => (c.id === col.id ? { ...c, type: val as DataType } : c)));
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="w-[130px] h-8 bg-background border-input text-xs font-mono">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            <SelectItem value="UUID">UUID</SelectItem>
                                            <SelectItem value="VARCHAR(255)">VARCHAR(255)</SelectItem>
                                            <SelectItem value="INTEGER">INTEGER</SelectItem>
                                            <SelectItem value="TIMESTAMP">TIMESTAMP</SelectItem>
                                            <SelectItem value="BOOLEAN">BOOLEAN</SelectItem>
                                            <SelectItem value="TEXT">TEXT</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <div className="flex items-center gap-1 px-1">
                                        <Checkbox
                                            id={`pk-${col.id}`}
                                            checked={!!col.isPk}
                                            onCheckedChange={(checked) =>
                                                setColumns(columns.map((c) => (c.id === col.id ? { ...c, isPk: Boolean(checked) } : c)))
                                            }
                                            className="border-amber-500 data-[state=checked]:bg-amber-500"
                                        />
                                        <Label htmlFor={`pk-${col.id}`} className="text-[11px] text-amber-600 dark:text-amber-400 font-bold cursor-pointer">
                                            PK
                                        </Label>
                                    </div>

                                    <div className="flex items-center gap-1 px-1">
                                        <Checkbox
                                            id={`fk-${col.id}`}
                                            checked={!!col.isFk}
                                            onCheckedChange={(checked) =>
                                                setColumns(columns.map((c) => (c.id === col.id ? { ...c, isFk: Boolean(checked) } : c)))
                                            }
                                            className="border-sky-500 data-[state=checked]:bg-sky-500"
                                        />
                                        <Label htmlFor={`fk-${col.id}`} className="text-[11px] text-sky-600 dark:text-sky-400 font-bold cursor-pointer">
                                            FK
                                        </Label>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                                        onClick={() => setColumns(columns.filter((c) => c.id !== col.id))}
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
