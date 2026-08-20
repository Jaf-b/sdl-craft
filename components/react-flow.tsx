"use client";

import { useState, useMemo, useCallback } from "react";
import {
    ReactFlow,
    Handle,
    Position,
    Controls,
    Background,
    Node,
    Edge,
    Connection,
    NodeProps,
    NodeTypes,
} from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import "@xyflow/react/dist/style.css";

// Imports Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Lucide Icons
import {
    Pencil,
    Trash2,
    Plus,
    Key,
    Link as LinkIcon,
    AlertCircle,
    X,
    Code,
    Layers,
    Database,
    FileText,
    Copy,
    Check,
} from "lucide-react";

// --- Types Strictement Définis ---
export type ViewMode = "MCD" | "MLD" | "MPD";
export type DataType = "UUID" | "VARCHAR(255)" | "INTEGER" | "TIMESTAMP" | "BOOLEAN" | "TEXT";
export type CardinalityType = "1:1" | "1:N" | "N:N";

export type Column = {
    id: string;
    name: string;
    type: DataType;
    isPk?: boolean;
    isFk?: boolean;
    nullable?: boolean;
};

export type TableNodeData = {
    label: string;
    columns: Column[];
    viewMode: ViewMode;
    linkedColumnIds?: Set<string>;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
};

export type CustomEdgeData = Record<string, unknown> & {
    sourceField: string;
    targetField: string;
    cardinality: CardinalityType;
};

export type TableNode = Node<TableNodeData, "databaseTable">;
export type RelationEdge = Edge<CustomEdgeData>;

// --- Composant Nœud Adaptatif (MCD / MLD / MPD) ---
function DatabaseTableNode({ id, data }: NodeProps<TableNode>) {
    const { viewMode, label, columns, linkedColumnIds } = data;

    return (
        <Card className="w-[280px] bg-card border-border text-card-foreground shadow-xl overflow-hidden py-0 transition-all">
            <CardHeader className="bg-muted/50 px-3 py-2 border-b border-border flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-xs font-bold tracking-wide">{label}</CardTitle>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-background/60 border-border text-muted-foreground font-mono">
                        {viewMode === "MCD" ? "ENTITÉ" : viewMode === "MLD" ? "TABLE" : "MPD"}
                    </Badge>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={() => data.onEdit?.(id)}
                    >
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:bg-destructive/10"
                        onClick={() => data.onDelete?.(id)}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-2 space-y-1.5 font-mono text-xs">
                {columns?.map((col) => {
                    const isLinked = linkedColumnIds?.has(col.id);

                    return (
                        <div
                            key={col.id}
                            className={`relative flex items-center justify-between py-1 px-2 rounded-md transition-colors ${
                                isLinked ? "bg-primary/10 border border-primary/30" : "bg-muted/30 border border-transparent"
                            }`}
                        >
                            {/* Target Handle */}
                            <Handle
                                type="target"
                                position={Position.Left}
                                id={`target-${col.id}`}
                                className="!bg-primary !w-2.5 !h-2.5 !-left-3 hover:!scale-125 transition-transform"
                            />

                            <div className="flex items-center gap-1.5 overflow-hidden">
                                {/* Badges MLD & MPD */}
                                {viewMode !== "MCD" && col.isPk && (
                                    <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30 text-[9px] px-1 py-0 h-4">
                                        <Key className="h-2.5 w-2.5 mr-0.5" /> PK
                                    </Badge>
                                )}
                                {viewMode !== "MCD" && col.isFk && (
                                    <Badge className="bg-sky-500/20 text-sky-600 dark:text-sky-300 border-sky-500/30 text-[9px] px-1 py-0 h-4">
                                        FK
                                    </Badge>
                                )}

                                {/* Nom du champ */}
                                <span className={`truncate ${col.isPk && viewMode !== "MCD" ? "font-semibold text-amber-600 dark:text-amber-200" : "text-foreground"}`}>
                                    {col.name}
                                </span>

                                {isLinked && viewMode !== "MCD" && (
                                    <Badge variant="outline" className="text-[8px] bg-primary/10 text-primary border-primary/20 px-1 py-0 h-3.5">
                                        <LinkIcon className="h-2 w-2 mr-0.5" /> LINK
                                    </Badge>
                                )}
                            </div>

                            {/* Type (Masqué en MCD, basique en MLD, détaillé en MPD) */}
                            {viewMode === "MPD" && (
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-muted-foreground uppercase">{col.type}</span>
                                    {!col.nullable && <span className="text-[8px] text-red-500 font-bold">NN</span>}
                                </div>
                            )}

                            {/* Source Handle (PK uniquement) */}
                            <Handle
                                type="source"
                                position={Position.Right}
                                id={`source-${col.id}`}
                                isConnectable={!!col.isPk}
                                title={col.isPk ? "Glisser pour lier" : "Seule une clé primaire (PK) peut initier une liaison"}
                                className={`!w-2.5 !h-2.5 !-right-3 transition-transform ${
                                    col.isPk ? "!bg-amber-400 hover:!scale-125 cursor-pointer" : "!bg-muted-foreground/30 !cursor-not-allowed"
                                }`}
                            />
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}

// --- Composant Principal ---
export function FlowDiagram() {
    const nodeTypes: NodeTypes = useMemo(() => ({ databaseTable: DatabaseTableNode }), []);

    // Mode de vue actif : MCD, MLD ou MPD
    const [viewMode, setViewMode] = useState<ViewMode>("MPD");

    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onDelete,
    } = useLiveblocksFlow<TableNode, RelationEdge>({
        suspense: true,
        nodes: {
            initial: [
                {
                    id: "users",
                    type: "databaseTable",
                    data: {
                        label: "users",
                        viewMode: "MPD",
                        columns: [
                            { id: "u-1", name: "id", type: "UUID", isPk: true, nullable: false },
                            { id: "u-2", name: "email", type: "VARCHAR(255)", nullable: false },
                        ],
                    },
                    position: { x: 50, y: 100 },
                },
                {
                    id: "courses",
                    type: "databaseTable",
                    data: {
                        label: "courses",
                        viewMode: "MPD",
                        columns: [
                            { id: "c-1", name: "id", type: "UUID", isPk: true, nullable: false },
                            { id: "c-2", name: "title", type: "VARCHAR(255)", nullable: false },
                            { id: "c-3", name: "instructor_id", type: "UUID", isFk: true, nullable: false },
                        ],
                    },
                    position: { x: 450, y: 100 },
                },
            ],
        },
        edges: {
            initial: [
                {
                    id: "rel-users-courses",
                    source: "users",
                    target: "courses",
                    sourceHandle: "source-u-1",
                    targetHandle: "target-c-3",
                    label: "1:N",
                    data: { sourceField: "u-1", targetField: "c-3", cardinality: "1:N" },
                    animated: true,
                },
            ],
        },
    });

    // Modales & Bannières
    const [isTableModalOpen, setIsTableModalOpen] = useState<boolean>(false);
    const [isEdgeModalOpen, setIsEdgeModalOpen] = useState<boolean>(false);
    const [isSqlModalOpen, setIsSqlModalOpen] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Formulaire Table
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [tableName, setTableName] = useState<string>("");
    const [columns, setColumns] = useState<Column[]>([]);

    // Formulaire Relation
    const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
    const [sourceTableId, setSourceTableId] = useState<string>("");
    const [targetTableId, setTargetTableId] = useState<string>("");
    const [sourceFieldId, setSourceFieldId] = useState<string>("");
    const [targetFieldId, setTargetFieldId] = useState<string>("");
    const [cardinality, setCardinality] = useState<CardinalityType>("1:N");

    // Calcul des colonnes reliées
    const linkedColumnIds = useMemo<Set<string>>(() => {
        const set = new Set<string>();
        edges.forEach((edge) => {
            if (edge.data?.sourceField) set.add(edge.data.sourceField);
            if (edge.data?.targetField) set.add(edge.data.targetField);
        });
        return set;
    }, [edges]);

    // Génération du Script SQL DDL (pour le MPD)
    const sqlScript = useMemo(() => {
        let script = "-- Generated DDL Script (PostgreSQL)\n\n";

        nodes.forEach((node) => {
            script += `CREATE TABLE ${node.data.label} (\n`;
            const columnLines = node.data.columns.map((col) => {
                let line = `  ${col.name} ${col.type}`;
                if (!col.nullable) line += " NOT NULL";
                if (col.isPk) line += " PRIMARY KEY";
                return line;
            });

            script += columnLines.join(",\n");
            script += "\n);\n\n";
        });

        edges.forEach((edge) => {
            const srcNode = nodes.find((n) => n.id === edge.source);
            const tgtNode = nodes.find((n) => n.id === edge.target);
            const srcCol = srcNode?.data.columns.find((c) => c.id === edge.data?.sourceField);
            const tgtCol = tgtNode?.data.columns.find((c) => c.id === edge.data?.targetField);

            if (srcNode && tgtNode && srcCol && tgtCol) {
                script += `ALTER TABLE ${tgtNode.data.label}\n`;
                script += `  ADD CONSTRAINT fk_${tgtNode.data.label}_${tgtCol.name}\n`;
                script += `  FOREIGN KEY (${tgtCol.name})\n`;
                script += `  REFERENCES ${srcNode.data.label}(${srcCol.name});\n\n`;
            }
        });

        return script;
    }, [nodes, edges]);

    // Validation Drag & Drop (Connexion)
    const handleCanvasConnect = useCallback((connection: Connection) => {
        if (!connection.source || !connection.target) return;

        const srcNode = nodes.find((n) => n.id === connection.source);
        const srcFieldId = connection.sourceHandle?.replace("source-", "").replace("target-", "") || "";
        const srcColumn = srcNode?.data.columns.find((c) => c.id === srcFieldId);

        if (!srcColumn?.isPk) {
            setErrorMessage(`Liaison impossible : "${srcColumn?.name || srcFieldId}" dans "${srcNode?.data.label}" n'est pas une clé primaire (PK).`);
            setTimeout(() => setErrorMessage(null), 4000);
            return;
        }

        const tgtNode = nodes.find((n) => n.id === connection.target);
        const tgtFieldId = connection.targetHandle?.replace("source-", "").replace("target-", "") || "";
        const tgtColumns = tgtNode?.data.columns || [];

        setEditingEdgeId(null);
        setSourceTableId(connection.source);
        setTargetTableId(connection.target);
        setSourceFieldId(srcFieldId);
        setTargetFieldId(tgtFieldId || tgtColumns[0]?.id || "");
        setCardinality("1:N");

        setIsEdgeModalOpen(true);
    }, [nodes]);

    // Handlers Table
    const handleOpenCreateModal = () => {
        setEditingNodeId(null);
        setTableName("");
        setColumns([{ id: `col-${Date.now()}`, name: "id", type: "UUID", isPk: true, nullable: false }]);
        setIsTableModalOpen(true);
    };

    const handleOpenEditModal = useCallback((id: string) => {
        const node = nodes.find((n) => n.id === id);
        if (!node) return;
        setEditingNodeId(id);
        setTableName(node.data.label);
        setColumns(node.data.columns);
        setIsTableModalOpen(true);
    }, [nodes]);

    const handleDeleteNode = useCallback((id: string) => {
        onNodesChange([{ type: "remove", id }]);
        const edgesToRemove = edges.filter((e) => e.source === id || e.target === id);
        if (edgesToRemove.length > 0) {
            onEdgesChange(edgesToRemove.map((e) => ({ type: "remove", id: e.id })));
        }
    }, [edges, onNodesChange, onEdgesChange]);

    const handleSaveTable = () => {
        if (!tableName.trim()) return;

        if (editingNodeId) {
            const currentColumnIds = new Set(columns.map((c) => c.id));
            const pkColumnIds = new Set(columns.filter((c) => c.isPk).map((c) => c.id));

            const brokenEdges = edges.filter((e) => {
                if (!e.data) return false;
                if (e.source === editingNodeId) {
                    if (!currentColumnIds.has(e.data.sourceField) || !pkColumnIds.has(e.data.sourceField)) return true;
                }
                if (e.target === editingNodeId && !currentColumnIds.has(e.data.targetField)) return true;
                return false;
            });

            if (brokenEdges.length > 0) {
                onEdgesChange(brokenEdges.map((e) => ({ type: "remove", id: e.id })));
            }

            const targetNode = nodes.find((n) => n.id === editingNodeId);
            if (targetNode) {
                onNodesChange([
                    {
                        type: "replace",
                        id: editingNodeId,
                        item: {
                            ...targetNode,
                            data: { ...targetNode.data, label: tableName, columns },
                        },
                    },
                ]);
            }
        } else {
            const newId = tableName.toLowerCase().replace(/\s+/g, "_");
            const newNode: TableNode = {
                id: newId,
                type: "databaseTable",
                position: { x: 100 + Math.random() * 100, y: 100 + Math.random() * 100 },
                data: { label: tableName, columns, viewMode },
            };
            onNodesChange([{ type: "add", item: newNode }]);
        }
        setIsTableModalOpen(false);
    };

    // Handlers Relations
    const handleOpenEditEdgeModal = (edge: RelationEdge) => {
        setEditingEdgeId(edge.id);
        setSourceTableId(edge.source);
        setTargetTableId(edge.target);
        setSourceFieldId(edge.data?.sourceField || "");
        setTargetFieldId(edge.data?.targetField || "");
        setCardinality(edge.data?.cardinality || "1:N");
        setIsEdgeModalOpen(true);
    };

    const handleSaveEdge = () => {
        if (!sourceTableId || !targetTableId || !sourceFieldId || !targetFieldId) return;

        const newEdge: RelationEdge = {
            id: editingEdgeId || `rel-${sourceTableId}-${targetTableId}-${Date.now()}`,
            source: sourceTableId,
            target: targetTableId,
            sourceHandle: `source-${sourceFieldId}`,
            targetHandle: `target-${targetFieldId}`,
            label: cardinality,
            animated: true,
            data: {
                sourceField: sourceFieldId,
                targetField: targetFieldId,
                cardinality,
            },
        };

        if (editingEdgeId) {
            onEdgesChange([
                { type: "remove", id: editingEdgeId },
                { type: "add", item: newEdge },
            ]);
        } else {
            onEdgesChange([{ type: "add", item: newEdge }]);
        }
        setIsEdgeModalOpen(false);
    };

    const handleDeleteEdge = (edgeId: string) => {
        onEdgesChange([{ type: "remove", id: edgeId }]);
        setIsEdgeModalOpen(false);
    };

    const handleCopySql = () => {
        navigator.clipboard.writeText(sqlScript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Injection dynamique du mode de vue actif
    const enrichedNodes = useMemo<TableNode[]>(() => {
        return nodes.map((node) => ({
            ...node,
            data: {
                ...node.data,
                viewMode,
                linkedColumnIds,
                onEdit: handleOpenEditModal,
                onDelete: handleDeleteNode,
            },
        }));
    }, [nodes, viewMode, linkedColumnIds, handleOpenEditModal, handleDeleteNode]);

    // Métadonnées pour les modales
    const sourceTableNode = useMemo(() => nodes.find((n) => n.id === sourceTableId), [nodes, sourceTableId]);
    const sourceColumnName = useMemo(() => {
        return sourceTableNode?.data.columns.find((c) => c.id === sourceFieldId)?.name || sourceFieldId;
    }, [sourceTableNode, sourceFieldId]);

    const targetColumns = useMemo<Column[]>(() => {
        return nodes.find((n) => n.id === targetTableId)?.data.columns || [];
    }, [nodes, targetTableId]);

    return (
        <div className="w-full h-screen relative bg-background text-foreground">
            {/* Toolbar Supérieure */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
                <Button onClick={handleOpenCreateModal} className="gap-2 shadow-lg">
                    <Plus className="h-4 w-4" /> Nouvelle Table
                </Button>

                {/* Sélecteur de vue : MCD / MLD / MPD */}
                <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as ViewMode)} className="shadow-lg">
                    <TabsList className="bg-card border border-border">
                        <TabsTrigger value="MCD" className="gap-1.5 text-xs">
                            <Layers className="h-3.5 w-3.5" /> MCD
                        </TabsTrigger>
                        <TabsTrigger value="MLD" className="gap-1.5 text-xs">
                            <FileText className="h-3.5 w-3.5" /> MLD
                        </TabsTrigger>
                        <TabsTrigger value="MPD" className="gap-1.5 text-xs">
                            <Database className="h-3.5 w-3.5" /> MPD
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Bouton pour exporter le SQL */}
                <Button variant="outline" onClick={() => setIsSqlModalOpen(true)} className="gap-2 shadow-lg bg-card">
                    <Code className="h-4 w-4 text-primary" /> Exporter SQL
                </Button>
            </div>

            {/* Notification d'erreur */}
            {errorMessage && (
                <div className="absolute top-4 right-4 z-50 bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg shadow-2xl text-xs flex items-center gap-3 backdrop-blur-md">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-destructive/20" onClick={() => setErrorMessage(null)}>
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            )}

            {/* Flow Canvas */}
            <ReactFlow<TableNode, RelationEdge>
                nodes={enrichedNodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={handleCanvasConnect}
                onDelete={onDelete}
                onEdgeClick={(_, edge) => handleOpenEditEdgeModal(edge)}
                fitView
                fitViewOptions={{ padding: 0.2 }}
            >
                <Background color="hsl(var(--muted-foreground) / 0.3)" gap={16} />
                <Controls />
                <Cursors />
            </ReactFlow>

            {/* MODALE : Création / Édition Table */}
            <Dialog open={isTableModalOpen} onOpenChange={setIsTableModalOpen}>
                <DialogContent className="bg-card border-border text-card-foreground max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingNodeId ? "Modifier la Table" : "Créer une Table"}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="tableName" className="text-xs text-muted-foreground">Nom de la table</Label>
                            <Input
                                id="tableName"
                                value={tableName}
                                onChange={(e) => setTableName(e.target.value)}
                                className="bg-background border-input"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs text-muted-foreground">Colonnes</Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setColumns([...columns, { id: `col-${Date.now()}`, name: "new_col", type: "VARCHAR(255)", nullable: true }])}
                                    className="text-xs text-primary hover:text-primary/80 h-7 px-2"
                                >
                                    <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter
                                </Button>
                            </div>

                            <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                                {columns.map((col) => (
                                    <div key={col.id} className="flex items-center gap-2 bg-muted/40 p-2 rounded-md border border-border">
                                        <Input
                                            value={col.name}
                                            onChange={(e) => setColumns(columns.map((c) => (c.id === col.id ? { ...c, name: e.target.value } : c)))}
                                            className="h-8 bg-background border-input text-xs"
                                        />
                                        <Select
                                            value={col.type}
                                            onValueChange={(val: DataType) => setColumns(columns.map((c) => (c.id === col.id ? { ...c, type: val } : c)))}
                                        >
                                            <SelectTrigger className="w-[130px] h-8 bg-background border-input text-xs">
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

                                        <div className="flex items-center gap-1.5 px-1">
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

                                        <div className="flex items-center gap-1.5 px-1">
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
                                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
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
                        <Button variant="outline" size="sm" onClick={() => setIsTableModalOpen(false)}>
                            Annuler
                        </Button>
                        <Button size="sm" onClick={handleSaveTable}>
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODALE : Édition Relation */}
            <Dialog open={isEdgeModalOpen} onOpenChange={setIsEdgeModalOpen}>
                <DialogContent className="bg-card border-border text-card-foreground max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingEdgeId ? "Modifier la Liaison" : "Configurer la Liaison"}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="bg-muted/50 p-3 rounded-lg border border-border space-y-1 font-mono text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Source (Clé Primaire) :</span>
                                <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30 text-[9px] px-1 py-0">
                                    <Key className="h-2.5 w-2.5 mr-0.5" /> PK
                                </Badge>
                            </div>
                            <div className="text-sm font-semibold text-primary">
                                {sourceTableNode?.data.label}.<span className="text-amber-600 dark:text-amber-300">{sourceColumnName}</span>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">
                                Champ cible dans <span className="text-primary font-semibold">{targetTableId}</span> :
                            </Label>
                            <Select value={targetFieldId} onValueChange={setTargetFieldId}>
                                <SelectTrigger className="bg-background border-input text-xs">
                                    <SelectValue />
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

                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Cardinalité</Label>
                            <Select value={cardinality} onValueChange={(val: CardinalityType) => setCardinality(val)}>
                                <SelectTrigger className="bg-background border-input text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    <SelectItem value="1:1">1:1 (Un à Un)</SelectItem>
                                    <SelectItem value="1:N">1:N (Un à Plusieurs)</SelectItem>
                                    <SelectItem value="N:N">N:N (Plusieurs à Plusieurs)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="flex justify-between items-center w-full">
                        {editingEdgeId ? (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteEdge(editingEdgeId)}
                                className="mr-auto text-xs"
                            >
                                Supprimer
                            </Button>
                        ) : <div />}
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setIsEdgeModalOpen(false)}>
                                Annuler
                            </Button>
                            <Button size="sm" onClick={handleSaveEdge}>
                                Enregistrer
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODALE : Code SQL Généré (MPD) */}
            <Dialog open={isSqlModalOpen} onOpenChange={setIsSqlModalOpen}>
                <DialogContent className="bg-card border-border text-card-foreground max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5 text-primary" /> Code SQL Généré (DDL)
                        </DialogTitle>
                    </DialogHeader>

                    <div className="relative">
                        <pre className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-96 border border-border text-foreground">
                            {sqlScript}
                        </pre>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute top-3 right-3 h-8 w-8"
                            onClick={handleCopySql}
                        >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setIsSqlModalOpen(false)}>Fermer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}