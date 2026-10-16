"use client";

import { useState, useMemo, useCallback } from "react";
import {
    ReactFlow,
    Controls,
    Background,
    Connection,
    NodeTypes,
    EdgeTypes,
} from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import { useThreads } from "@liveblocks/react/suspense";
import { NodeCommentsModal } from "@/components/comments/node-comments-modal";
import "@xyflow/react/dist/style.css";

// Icons & UI
import { AlertCircle, X, MessageSquare, Eye, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Types
import {
    ModelingMode,
    UmlDiagramType,
    McdAttribute,
    MldColumn,
    UmlAttribute,
    UmlMethod,
    UmlClassType,
    UmlStateKind,
    UmlDeploymentKind,
    UmlActivityKind,
    McdEntityData,
    McdEntityNode,
    McdAssociationNode,
    MldTableNode,
    MldTableData,
    MldEdge,
    MldEdgeData,
    UmlClassNode,
    UmlActorNode,
    UmlUseCaseNode,
    UmlActivityNode,
    UmlDeploymentNode,
    UmlStateNode,
    UmlLifelineNode,
    FlowCustomNode,
    FlowCustomEdge,
    PendingDeletion,
} from "./types";

// Node & Edge Components
import { McdEntityNodeComponent } from "./nodes/mcd-entity-node";
import { McdAssociationNodeComponent } from "./nodes/mcd-association-node";
import { MldTableNodeComponent } from "./nodes/mld-table-node";
import { UmlActorNodeComponent } from "./nodes/uml-actor-node";
import { UmlUseCaseNodeComponent } from "./nodes/uml-usecase-node";
import { UmlClassNodeComponent } from "./nodes/uml-class-node";
import { UmlLifelineNodeComponent } from "./nodes/uml-lifeline-node";
import { UmlActivityNodeComponent } from "./nodes/uml-activity-node";
import { UmlDeploymentNodeComponent } from "./nodes/uml-deployment-node";
import { UmlStateNodeComponent } from "./nodes/uml-state-node";
import { CustomRelationEdge } from "./edges/custom-relation-edge";

import { FlowToolbar } from "./flow-toolbar";
import { McdEntityModal } from "./modals/mcd-entity-modal";
import { McdAssociationModal } from "./modals/mcd-association-modal";
import { MldTableModal } from "./modals/mld-table-modal";
import { UmlClassModal } from "./modals/uml-class-modal";
import { UmlStateModal } from "./modals/uml-state-modal";
import { UmlLifelineModal } from "./modals/uml-lifeline-modal";
import { UmlDiagramSelectorModal } from "./modals/uml-diagram-selector-modal";
import { EdgeModal } from "./modals/edge-modal";
import { DeleteConfirmModal } from "./modals/delete-confirm-modal";
import { SqlExportModal } from "./modals/sql-export-modal";
import { ExportSidebar } from "./export-sidebar";

// Initial Canvas Data
const INITIAL_NODES: FlowCustomNode[] = [
    // --- Nœuds MCD ---
    {
        id: "mcd_client",
        type: "mcdEntity",
        data: {
            label: "CLIENT",
            attributes: [
                { id: "ca-1", name: "id_client", isIdentifier: true },
                { id: "ca-2", name: "nom" },
                { id: "ca-3", name: "email" },
            ],
        },
        position: { x: 50, y: 120 },
    },
    {
        id: "mcd_passer",
        type: "mcdAssociation",
        data: {
            label: "PASSER",
            attributes: [{ id: "pa-1", name: "date_commande" }],
        },
        position: { x: 340, y: 140 },
    },
    {
        id: "mcd_commande",
        type: "mcdEntity",
        data: {
            label: "COMMANDE",
            attributes: [
                { id: "cma-1", name: "num_commande", isIdentifier: true },
                { id: "cma-2", name: "montant_total" },
            ],
        },
        position: { x: 590, y: 120 },
    },

    // --- Nœuds MLD ---
    {
        id: "mld_users",
        type: "databaseTable",
        data: {
            label: "users",
            columns: [
                { id: "u-1", name: "id", type: "UUID", isPk: true, nullable: false },
                { id: "u-2", name: "email", type: "VARCHAR(255)", nullable: false },
                { id: "u-3", name: "full_name", type: "VARCHAR(255)", nullable: true },
            ],
        },
        position: { x: 50, y: 100 },
    },
    // --- Nœuds UML ---
    {
        id: "uml_user",
        type: "umlClass",
        data: {
            label: "User",
            classType: "class",
            attributes: [
                { id: "ua-1", name: "id", type: "string", visibility: "-" },
                { id: "ua-2", name: "email", type: "string", visibility: "+" },
            ],
            methods: [
                { id: "um-1", name: "login", returnType: "boolean", visibility: "+", parameters: "email: string" },
            ],
        },
        position: { x: 50, y: 120 },
    },
    // --- Nœuds UML (Cas d'Utilisation) ---
    {
        id: "uml_actor_client",
        type: "umlActor",
        data: { label: "Client", roleDescription: "Utilisateur final" },
        position: { x: 50, y: 120 },
    },
    {
        id: "uml_uc_commande",
        type: "umlUseCase",
        data: { label: "Passer une commande", description: "Inclus le paiement" },
        position: { x: 300, y: 120 },
    },

    // --- Nœuds UML (Activités) ---
    {
        id: "uml_act_start",
        type: "umlActivity",
        data: { label: "Début", nodeKind: "initial" },
        position: { x: 50, y: 120 },
    },
    {
        id: "uml_act_login",
        type: "umlActivity",
        data: { label: "Authentifier l'utilisateur", nodeKind: "action" },
        position: { x: 180, y: 110 },
    },

    // --- Nœuds UML (Séquence) ---
    {
        id: "uml_seq_user",
        type: "umlLifeline",
        data: { label: "Client", instanceName: "c", className: "Client", isActor: true },
        position: { x: 80, y: 80 },
    },
    {
        id: "uml_seq_api",
        type: "umlLifeline",
        data: { label: "API Gateway", instanceName: "gateway", className: "APIGateway", isActor: false },
        position: { x: 300, y: 80 },
    },

    // --- Nœuds UML (Déploiement) ---
    {
        id: "uml_dep_server",
        type: "umlDeployment",
        data: { label: "Serveur Cloud AWS", kind: "node", stereotype: "«cloud»" },
        position: { x: 80, y: 100 },
    },
    {
        id: "uml_dep_app",
        type: "umlDeployment",
        data: { label: "api-backend.jar", kind: "artifact", stereotype: "«artifact»" },
        position: { x: 340, y: 100 },
    },

    // --- Nœuds UML (États-transitions) ---
    {
        id: "uml_st_pending",
        type: "umlState",
        data: {
            label: "EnAttente",
            kind: "simple",
            entryAction: "entry / notifyUser()",
            doAction: "do / checkPayment()",
            exitAction: "exit / logStatus()",
        },
        position: { x: 100, y: 100 },
    },
    {
        id: "uml_st_paid",
        type: "umlState",
        data: {
            label: "Payée",
            kind: "simple",
            entryAction: "entry / generateInvoice()",
        },
        position: { x: 350, y: 100 },
    },
];

const INITIAL_EDGES: FlowCustomEdge[] = [
    // --- Liaisons MCD ---
    {
        id: "edge-mcd-1",
        type: "customRelation",
        source: "mcd_client",
        target: "mcd_passer",
        sourceHandle: "right-src",
        targetHandle: "left",
        label: "0,N",
        data: { cardinality: "0,N" },
    },
    {
        id: "edge-mcd-2",
        type: "customRelation",
        source: "mcd_commande",
        target: "mcd_passer",
        sourceHandle: "left-src",
        targetHandle: "right",
        label: "1,1",
        data: { cardinality: "1,1" },
    },

    // --- Liaisons MLD ---
    {
        id: "edge-mld-1",
        type: "customRelation",
        source: "mld_users",
        target: "mld_orders",
        sourceHandle: "source-u-1",
        targetHandle: "target-o-2",
        label: "1:N",
        data: { sourceField: "u-1", targetField: "o-2", cardinality: "1:N" },
        animated: true,
    },

    // --- Liaisons UML ---
    {
        id: "edge-uml-1",
        type: "customRelation",
        source: "uml_user",
        target: "uml_order",
        sourceHandle: "right-src",
        targetHandle: "left",
        label: "1..*",
        data: { cardinality: "1..*" },
    },
];

export type FlowDiagramProps = {
    isReadOnly?: boolean;
    onOpenCommentsSidebar?: () => void;
};

export function FlowDiagram({ isReadOnly = false, onOpenCommentsSidebar }: FlowDiagramProps) {
    // Mode de modélisation actif : MCD ou MLD
    const [mode, setMode] = useState<ModelingMode>("MCD");

    // Enregistrement des composants Nœuds et Arêtes React Flow
    const nodeTypes: NodeTypes = useMemo(
        () => ({
            mcdEntity: McdEntityNodeComponent,
            mcdAssociation: McdAssociationNodeComponent,
            databaseTable: MldTableNodeComponent,
            // 6 Diagrammes UML Essentiels
            umlActor: UmlActorNodeComponent,
            umlUseCase: UmlUseCaseNodeComponent,
            umlClass: UmlClassNodeComponent,
            umlLifeline: UmlLifelineNodeComponent,
            umlActivity: UmlActivityNodeComponent,
            umlDeployment: UmlDeploymentNodeComponent,
            umlState: UmlStateNodeComponent,
        }),
        []
    );

    const edgeTypes: EdgeTypes = useMemo(
        () => ({
            customRelation: CustomRelationEdge,
        }),
        []
    );

    // Liveblocks Flow State (Collaboratif en temps réel)
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onDelete,
    } = useLiveblocksFlow<FlowCustomNode, FlowCustomEdge>({
        suspense: true,
        nodes: { initial: INITIAL_NODES },
        edges: { initial: INITIAL_EDGES },
    });

    // Liveblocks Threads & Commentaires attachés aux nœuds
    const { threads } = useThreads();
    const [selectedNodeForComments, setSelectedNodeForComments] = useState<{ id: string; name: string } | null>(null);

    // Statistiques des commentaires par nœud (total et non résolus)
    const nodeCommentsStats = useMemo(() => {
        const stats: Record<string, { total: number; unresolved: number }> = {};
        threads.forEach((thread) => {
            const nodeId = thread.metadata?.nodeId as string | undefined;
            if (nodeId) {
                if (!stats[nodeId]) stats[nodeId] = { total: 0, unresolved: 0 };
                stats[nodeId].total += 1;
                if (!thread.resolved) {
                    stats[nodeId].unresolved += 1;
                }
            }
        });
        return stats;
    }, [threads]);

    // Modales & Notifications
    const [isMcdEntityModalOpen, setIsMcdEntityModalOpen] = useState(false);
    const [isMcdAssociationModalOpen, setIsMcdAssociationModalOpen] = useState(false);
    const [isMldTableModalOpen, setIsMldTableModalOpen] = useState(false);
    const [isUmlClassModalOpen, setIsUmlClassModalOpen] = useState(false);
    const [isUmlStateModalOpen, setIsUmlStateModalOpen] = useState(false);
    const [isUmlLifelineModalOpen, setIsUmlLifelineModalOpen] = useState(false);
    const [umlDiagramType, setUmlDiagramType] = useState<UmlDiagramType>("usecase");
    const [isUmlDiagramSelectorOpen, setIsUmlDiagramSelectorOpen] = useState(false);
    const [isEdgeModalOpen, setIsEdgeModalOpen] = useState(false);
    const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
    const [isExportSidebarOpen, setIsExportSidebarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pendingDeletion, setPendingDeletion] = useState<PendingDeletion | null>(null);

    // Formulaires de modification
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [activeNodeName, setActiveNodeName] = useState<string>("");
    const [activeMcdAttributes, setActiveMcdAttributes] = useState<McdAttribute[]>([]);
    const [activeMldColumns, setActiveMldColumns] = useState<MldColumn[]>([]);
    const [activeUmlClassType, setActiveUmlClassType] = useState<UmlClassType>("class");
    const [activeUmlAttributes, setActiveUmlAttributes] = useState<UmlAttribute[]>([]);
    const [activeUmlMethods, setActiveUmlMethods] = useState<UmlMethod[]>([]);
    // États pour modification États et Lifelines
    const [activeInstanceName, setActiveInstanceName] = useState<string>("");
    const [activeClassName, setActiveClassName] = useState<string>("");
    const [activeStateKind, setActiveStateKind] = useState<UmlStateKind>("simple");
    const [activeStateEntry, setActiveStateEntry] = useState<string>("");
    const [activeStateDo, setActiveStateDo] = useState<string>("");
    const [activeStateExit, setActiveStateExit] = useState<string>("");
    const [activeIsActor, setActiveIsActor] = useState<boolean>(false);

    // Formulaire de liaison
    const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
    const [edgeSourceNodeId, setEdgeSourceNodeId] = useState<string>("");
    const [edgeTargetNodeId, setEdgeTargetNodeId] = useState<string>("");
    const [edgeSourceFieldId, setEdgeSourceFieldId] = useState<string>("");
    const [edgeTargetFieldId, setEdgeTargetFieldId] = useState<string>("");
    const [edgeSourceHandle, setEdgeSourceHandle] = useState<string | undefined>(undefined);
    const [edgeTargetHandle, setEdgeTargetHandle] = useState<string | undefined>(undefined);
    const [edgeCardinality, setEdgeCardinality] = useState<string>("1,N");

    // Menu contextuel clic-droit sur les nœuds
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        nodeId: string;
        nodeName: string;
    } | null>(null);

    const handleNodeContextMenu = useCallback(
        (event: React.MouseEvent, node: FlowCustomNode) => {
            event.preventDefault();
            const nodeName = (node.data as { label?: string }).label || node.id;
            setContextMenu({
                x: event.clientX,
                y: event.clientY,
                nodeId: node.id,
                nodeName,
            });
        },
        []
    );

    const closeContextMenu = useCallback(() => setContextMenu(null), []);

    // Calcul des colonnes reliées en MLD
    const linkedColumnIds = useMemo<Set<string>>(() => {
        const set = new Set<string>();
        edges.forEach((edge) => {
            const data = edge.data as MldEdgeData | undefined;
            if (data?.sourceField) set.add(data.sourceField);
            if (data?.targetField) set.add(data.targetField);
        });
        return set;
    }, [edges]);

    // Changement de mode avec ouverture automatique du sélecteur UML
    const handleModeChange = (newMode: ModelingMode) => {
        setMode(newMode);
        if (newMode === "UML") {
            setIsUmlDiagramSelectorOpen(true);
        }
    };

    // Filtrage des nœuds & arêtes selon le mode et les 6 diagrammes UML essentiels
    const filteredNodes = useMemo(() => {
        return nodes.filter((node) => {
            if (mode === "MCD") {
                return node.type === "mcdEntity" || node.type === "mcdAssociation";
            }
            if (mode === "MLD") {
                return node.type === "databaseTable";
            }
            // Mode UML — 6 diagrammes
            switch (umlDiagramType) {
                case "usecase":
                    return node.type === "umlActor" || node.type === "umlUseCase";
                case "class":
                    return node.type === "umlClass";
                case "sequence":
                    return node.type === "umlLifeline";
                case "activity":
                    return node.type === "umlActivity";
                case "deployment":
                    return node.type === "umlDeployment";
                case "state":
                    return node.type === "umlState";
                default:
                    return node.type === "umlUseCase";
            }
        });
    }, [nodes, mode, umlDiagramType]);

    const activeNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

    const filteredEdges = useMemo(() => {
        return edges.filter(
            (edge) => activeNodeIds.has(edge.source) && activeNodeIds.has(edge.target)
        );
    }, [edges, activeNodeIds]);

    // Handlers d'ouverture des Modales de création
    const handleOpenCreateEntity = () => {
        setEditingNodeId(null);
        setActiveNodeName("");
        setActiveMcdAttributes([
            { id: `attr-${Date.now()}`, name: "id", isIdentifier: true, nullable: false },
        ]);
        setIsMcdEntityModalOpen(true);
    };

    const handleOpenCreateAssociation = () => {
        setEditingNodeId(null);
        setActiveNodeName("");
        setActiveMcdAttributes([]);
        setIsMcdAssociationModalOpen(true);
    };

    const handleOpenCreateTable = () => {
        setEditingNodeId(null);
        setActiveNodeName("");
        setActiveMldColumns([
            { id: `col-${Date.now()}`, name: "id", type: "UUID", isPk: true, nullable: false },
        ]);
        setIsMldTableModalOpen(true);
    };

    const handleOpenCreateUmlClass = () => {
        setEditingNodeId(null);
        setActiveNodeName("");
        setActiveUmlClassType("class");
        setActiveUmlAttributes([
            { id: `attr-${Date.now()}`, name: "id", type: "string", visibility: "-" },
        ]);
        setActiveUmlMethods([
            { id: `meth-${Date.now()}`, name: "getId", returnType: "string", visibility: "+", parameters: "" },
        ]);
        setIsUmlClassModalOpen(true);
    };

    const handleOpenCreateUmlActor = () => {
        const newId = `uml_act_${Date.now()}`;
        const newNode: UmlActorNode = {
            id: newId,
            type: "umlActor",
            position: { x: 100 + Math.random() * 150, y: 100 + Math.random() * 150 },
            data: { label: "Nouvel Acteur", roleDescription: "Utilisateur" },
        };
        onNodesChange([{ type: "add", item: newNode }]);
    };

    const handleOpenCreateUmlUseCase = () => {
        const newId = `uml_uc_${Date.now()}`;
        const newNode: UmlUseCaseNode = {
            id: newId,
            type: "umlUseCase",
            position: { x: 250 + Math.random() * 150, y: 100 + Math.random() * 150 },
            data: { label: "Nouveau cas d'utilisation", description: "" },
        };
        onNodesChange([{ type: "add", item: newNode }]);
    };

    const handleOpenCreateUmlActivity = (kind: UmlActivityKind) => {
        const newId = `uml_actv_${Date.now()}`;
        const labelMap: Record<string, string> = {
            initial: "Début",
            final: "Fin",
            action: "Nouvelle Action",
            decision: "Est-ce valide ?",
            fork: "Fork",
            join: "Join",
        };
        const newNode: UmlActivityNode = {
            id: newId,
            type: "umlActivity",
            position: { x: 150 + Math.random() * 150, y: 100 + Math.random() * 150 },
            data: { label: labelMap[kind] || "Action", nodeKind: kind },
        };
        onNodesChange([{ type: "add", item: newNode }]);
    };

    const handleOpenCreateUmlDeployment = (kind: UmlDeploymentKind) => {
        const newId = `uml_dep_${Date.now()}`;
        const labelMap: Record<UmlDeploymentKind, string> = {
            node: "Serveur d'Applications",
            device: "Passerelle IoT",
            artifact: "app.war",
            executionEnvironment: "Node.js v20",
        };
        const newNode: UmlDeploymentNode = {
            id: newId,
            type: "umlDeployment",
            position: { x: 100 + Math.random() * 150, y: 100 + Math.random() * 150 },
            data: { label: labelMap[kind] || "Nœud", kind },
        };
        onNodesChange([{ type: "add", item: newNode }]);
    };

    const handleOpenCreateUmlState = (kind: UmlStateKind) => {
        setEditingNodeId(null);
        setActiveNodeName("EnTraitement");
        setActiveStateKind(kind);
        setActiveStateEntry("entry / init()");
        setActiveStateDo("do / execute()");
        setActiveStateExit("exit / cleanup()");
        setIsUmlStateModalOpen(true);
    };

    const handleSaveUmlState = (label: string, kind: UmlStateKind, entryAction: string, doAction: string, exitAction: string) => {
        if (editingNodeId) {
            const targetNode = nodes.find((n) => n.id === editingNodeId);
            if (targetNode) {
                onNodesChange([
                    {
                        type: "replace",
                        id: editingNodeId,
                        item: { ...targetNode, data: { ...targetNode.data, label, kind, entryAction, doAction, exitAction } } as FlowCustomNode,
                    },
                ]);
            }
        } else {
            const newId = `uml_st_${Date.now()}`;
            const newNode: UmlStateNode = {
                id: newId,
                type: "umlState",
                position: { x: 120 + Math.random() * 150, y: 100 + Math.random() * 150 },
                data: { label, kind, entryAction, doAction, exitAction },
            };
            onNodesChange([{ type: "add", item: newNode }]);
        }
    };

    const handleOpenCreateUmlLifeline = () => {
        setEditingNodeId(null);
        setActiveNodeName("Client");
        setActiveInstanceName("client");
        setActiveClassName("Client");
        setActiveIsActor(false);
        setIsUmlLifelineModalOpen(true);
    };

    const handleSaveUmlLifeline = (label: string, instanceName: string, className: string, isActor: boolean) => {
        if (editingNodeId) {
            const targetNode = nodes.find((n) => n.id === editingNodeId);
            if (targetNode) {
                onNodesChange([
                    {
                        type: "replace",
                        id: editingNodeId,
                        item: { ...targetNode, data: { ...targetNode.data, label, instanceName, className, isActor } } as FlowCustomNode,
                    },
                ]);
            }
        } else {
            const newId = `uml_life_${Date.now()}`;
            const newNode: UmlLifelineNode = {
                id: newId,
                type: "umlLifeline",
                position: { x: 100 + Math.random() * 150, y: 100 + Math.random() * 150 },
                data: { label, instanceName, className, isActor },
            };
            onNodesChange([{ type: "add", item: newNode }]);
        }
    };

    // Handlers d'édition de Nœud
    const handleEditNode = useCallback((id: string) => {
        const node = nodes.find((n) => n.id === id);
        if (!node) return;

        setEditingNodeId(id);
        setActiveNodeName(node.data.label || "");

        if (node.type === "mcdEntity") {
            setActiveMcdAttributes(node.data.attributes || []);
            setIsMcdEntityModalOpen(true);
        } else if (node.type === "mcdAssociation") {
            setActiveMcdAttributes(node.data.attributes || []);
            setIsMcdAssociationModalOpen(true);
        } else if (node.type === "databaseTable") {
            setActiveMldColumns(node.data.columns || []);
            setIsMldTableModalOpen(true);
        } else if (node.type === "umlClass") {
            setActiveUmlClassType(node.data.classType || "class");
            setActiveUmlAttributes(node.data.attributes || []);
            setActiveUmlMethods(node.data.methods || []);
            setIsUmlClassModalOpen(true);
        } else if (node.type === "umlState") {
            setActiveStateKind(node.data.kind || "simple");
            setActiveStateEntry(node.data.entryAction || "");
            setActiveStateDo(node.data.doAction || "");
            setActiveStateExit(node.data.exitAction || "");
            setIsUmlStateModalOpen(true);
        } else if (node.type === "umlLifeline") {
            setActiveInstanceName(node.data.instanceName || "");
            setActiveClassName(node.data.className || "");
            setActiveIsActor(!!node.data.isActor);
            setIsUmlLifelineModalOpen(true);
        }
    }, [nodes]);

    // Handlers de suppression de Nœud et d'Arête
    const handleDeleteNode = useCallback((id: string) => {
        const node = nodes.find((n) => n.id === id);
        if (!node) return;

        const connectedEdges = edges.filter((e) => e.source === id || e.target === id);

        setPendingDeletion({
            kind: "node",
            id,
            name: node.data.label,
            nodeType: node.type as "mcdEntity" | "mcdAssociation" | "databaseTable" | "umlClass",
            connectedEdgeIds: connectedEdges.map((e) => e.id),
        });
    }, [nodes, edges]);

    const handleDeleteEdge = useCallback((edgeId: string) => {
        setPendingDeletion({
            kind: "edge",
            id: edgeId,
        });
    }, []);

    // Validation des connexions (onConnect)
    const handleConnect = useCallback((connection: Connection) => {
        if (!connection.source || !connection.target) return;

        const srcNode = nodes.find((n) => n.id === connection.source);
        const tgtNode = nodes.find((n) => n.id === connection.target);

        if (!srcNode || !tgtNode) return;

        if (mode === "MLD") {
            const srcFieldId = connection.sourceHandle?.replace("source-", "").replace("target-", "") || "";
            const srcColumns = (srcNode.data as MldTableData).columns || [];
            const srcColumn = srcColumns.find((c: MldColumn) => c.id === srcFieldId);

            if (!srcColumn?.isPk) {
                setErrorMessage(`Liaison MLD impossible : "${srcColumn?.name || srcFieldId}" dans "${srcNode.data.label}" n'est pas une clé primaire (PK).`);
                setTimeout(() => setErrorMessage(null), 4000);
                return;
            }

            const tgtFieldId = connection.targetHandle?.replace("source-", "").replace("target-", "") || "";
            const tgtColumns = (tgtNode.data as MldTableData).columns || [];

            setEditingEdgeId(null);
            setEdgeSourceNodeId(connection.source);
            setEdgeTargetNodeId(connection.target);
            setEdgeSourceFieldId(srcFieldId);
            setEdgeTargetFieldId(tgtFieldId || tgtColumns[0]?.id || "");
            setEdgeSourceHandle(connection.sourceHandle || undefined);
            setEdgeTargetHandle(connection.targetHandle || undefined);
            setEdgeCardinality("1:N");
            setIsEdgeModalOpen(true);
        } else if (mode === "MCD") {
            // MCD : Liaison Entité <-> Association
            setEditingEdgeId(null);
            setEdgeSourceNodeId(connection.source);
            setEdgeTargetNodeId(connection.target);
            setEdgeSourceFieldId("");
            setEdgeTargetFieldId("");
            setEdgeSourceHandle(connection.sourceHandle || undefined);
            setEdgeTargetHandle(connection.targetHandle || undefined);
            setEdgeCardinality("1,N");
            setIsEdgeModalOpen(true);
        } else {
            // UML Mode : Liaison entre Classes UML
            setEditingEdgeId(null);
            setEdgeSourceNodeId(connection.source);
            setEdgeTargetNodeId(connection.target);
            setEdgeSourceFieldId("");
            setEdgeTargetFieldId("");
            setEdgeSourceHandle(connection.sourceHandle || undefined);
            setEdgeTargetHandle(connection.targetHandle || undefined);
            setEdgeCardinality("1..*");
            setIsEdgeModalOpen(true);
        }
    }, [nodes, mode]);

    // Sauvegarde Nœud MCD Entité
    const handleSaveMcdEntity = (name: string, attributes: McdAttribute[]) => {
        if (editingNodeId) {
            const node = nodes.find((n) => n.id === editingNodeId);
            if (node) {
                onNodesChange([
                    {
                        type: "replace",
                        id: editingNodeId,
                        item: { ...node, data: { ...node.data, label: name, attributes } } as FlowCustomNode,
                    },
                ]);
            }
        } else {
            const newId = `mcd_ent_${Date.now()}`;
            const newNode: McdEntityNode = {
                id: newId,
                type: "mcdEntity",
                position: { x: 100 + Math.random() * 150, y: 100 + Math.random() * 150 },
                data: { label: name, attributes },
            };
            onNodesChange([{ type: "add", item: newNode }]);
        }
    };

    // Sauvegarde Nœud MCD Association
    const handleSaveMcdAssociation = (name: string, attributes: McdAttribute[]) => {
        if (editingNodeId) {
            const node = nodes.find((n) => n.id === editingNodeId);
            if (node) {
                onNodesChange([
                    {
                        type: "replace",
                        id: editingNodeId,
                        item: { ...node, data: { ...node.data, label: name, attributes } } as FlowCustomNode,
                    },
                ]);
            }
        } else {
            const newId = `mcd_assoc_${Date.now()}`;
            const newNode: McdAssociationNode = {
                id: newId,
                type: "mcdAssociation",
                position: { x: 250 + Math.random() * 150, y: 150 + Math.random() * 150 },
                data: { label: name, attributes },
            };
            onNodesChange([{ type: "add", item: newNode }]);
        }
    };

    // Sauvegarde Nœud MLD Table
    const handleSaveMldTable = (tableName: string, columns: MldColumn[]) => {
        if (editingNodeId) {
            const targetNode = nodes.find((n) => n.id === editingNodeId);
            if (targetNode) {
                onNodesChange([
                    {
                        type: "replace",
                        id: editingNodeId,
                        item: { ...targetNode, data: { ...targetNode.data, label: tableName, columns } } as FlowCustomNode,
                    },
                ]);
            }
        } else {
            const newId = `mld_tbl_${Date.now()}`;
            const newNode: MldTableNode = {
                id: newId,
                type: "databaseTable",
                position: { x: 100 + Math.random() * 150, y: 100 + Math.random() * 150 },
                data: { label: tableName, columns },
            };
            onNodesChange([{ type: "add", item: newNode }]);
        }
    };

    // Sauvegarde Nœud UML Classe
    const handleSaveUmlClass = (name: string, classType: UmlClassType, attributes: UmlAttribute[], methods: UmlMethod[]) => {
        if (editingNodeId) {
            const targetNode = nodes.find((n) => n.id === editingNodeId);
            if (targetNode) {
                onNodesChange([
                    {
                        type: "replace",
                        id: editingNodeId,
                        item: { ...targetNode, data: { ...targetNode.data, label: name, classType, attributes, methods } } as FlowCustomNode,
                    },
                ]);
            }
        } else {
            const newId = `uml_cls_${Date.now()}`;
            const newNode: UmlClassNode = {
                id: newId,
                type: "umlClass",
                position: { x: 100 + Math.random() * 150, y: 100 + Math.random() * 150 },
                data: { label: name, classType, attributes, methods },
            };
            onNodesChange([{ type: "add", item: newNode }]);
        }
    };

    // Sauvegarde / Édition d'Arête (Liaison)
    const handleSaveEdge = (sourceFieldId: string, targetFieldId: string, cardinality: string) => {
        if (!edgeSourceNodeId || !edgeTargetNodeId) return;

        const resolvedSourceHandle = mode === "MLD" && sourceFieldId ? `source-${sourceFieldId}` : edgeSourceHandle;
        const resolvedTargetHandle = mode === "MLD" && targetFieldId ? `target-${targetFieldId}` : edgeTargetHandle;

        const newEdge: FlowCustomEdge = {
            id: editingEdgeId || `rel-${edgeSourceNodeId}-${edgeTargetNodeId}-${Date.now()}`,
            type: "customRelation",
            source: edgeSourceNodeId,
            target: edgeTargetNodeId,
            sourceHandle: resolvedSourceHandle,
            targetHandle: resolvedTargetHandle,
            label: cardinality,
            animated: mode === "MLD",
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
    };

    // Confirmation de suppression
    const handleConfirmDeletion = () => {
        if (!pendingDeletion) return;

        if (pendingDeletion.kind === "node") {
            const nodeToDelete = nodes.find((n) => n.id === pendingDeletion.id);
            const connectedEdges = edges.filter((e) => e.source === pendingDeletion.id || e.target === pendingDeletion.id);

            if (onDelete) {
                onDelete({
                    nodes: nodeToDelete ? [nodeToDelete] : [],
                    edges: connectedEdges,
                });
            }

            onNodesChange([{ type: "remove", id: pendingDeletion.id }]);
            if (pendingDeletion.connectedEdgeIds.length > 0) {
                onEdgesChange(pendingDeletion.connectedEdgeIds.map((id) => ({ type: "remove", id })));
            }
        } else if (pendingDeletion.kind === "edge") {
            const edgeToDelete = edges.find((e) => e.id === pendingDeletion.id);

            if (onDelete) {
                onDelete({
                    nodes: [],
                    edges: edgeToDelete ? [edgeToDelete] : [],
                });
            }

            onEdgesChange([{ type: "remove", id: pendingDeletion.id }]);
        } else {
            pendingDeletion.resolve(true);
        }

        setPendingDeletion(null);
    };

    const handleCancelDeletion = () => {
        if (pendingDeletion?.kind === "flow") {
            pendingDeletion.resolve(false);
        }
        setPendingDeletion(null);
    };

    // Interception des suppressions via clavier ou API (onBeforeDelete)
    const handleBeforeDelete = useCallback(({ nodes: nodesToDelete, edges: edgesToDelete }: { nodes: FlowCustomNode[]; edges: FlowCustomEdge[] }) => {
        return new Promise<boolean>((resolve) => {
            setPendingDeletion({
                kind: "flow",
                nodes: nodesToDelete,
                edges: edgesToDelete,
                resolve,
            });
        });
    }, []);

    // Conversion automatique MCD -> MLD (Générer MLD depuis MCD)
    const handleGenerateMldFromMcd = useCallback(() => {
        const mcdEntities = nodes.filter((n) => n.type === "mcdEntity");
        const mcdAssociations = nodes.filter((n) => n.type === "mcdAssociation");

        if (mcdEntities.length === 0) {
            setErrorMessage("Veuillez d'abord créer des entités MCD avant d'exécuter la conversion MLD.");
            setTimeout(() => setErrorMessage(null), 4000);
            return;
        }

        const newMldNodes: MldTableNode[] = [];
        const newMldEdges: MldEdge[] = [];

        // 1. Convertir chaque Entité MCD en Table MLD
        mcdEntities.forEach((ent, index) => {
            const tableName = ent.data.label.toLowerCase();
            const entityData = ent.data as McdEntityData;
            const cols: MldColumn[] = (entityData.attributes || []).map((attr: McdAttribute) => ({
                id: `col-${attr.id}`,
                name: attr.name,
                type: attr.isIdentifier ? "UUID" : "VARCHAR(255)",
                isPk: !!attr.isIdentifier,
                nullable: !attr.isIdentifier,
            }));

            // Si aucun identifiant n'est défini, on ajoute un id par défaut
            if (!cols.some((c) => c.isPk)) {
                cols.unshift({ id: `col-id-${Date.now()}-${index}`, name: "id", type: "UUID", isPk: true, nullable: false });
            }

            newMldNodes.push({
                id: `mld_gen_${ent.id}`,
                type: "databaseTable",
                position: { x: ent.position.x, y: ent.position.y },
                data: {
                    label: tableName,
                    columns: cols,
                },
            });
        });

        // 2. Convertir les Associations MCD
        mcdAssociations.forEach((assoc, index) => {
            // Trouver les entités reliées à cette association
            const assocEdges = edges.filter((e) => e.source === assoc.id || e.target === assoc.id);
            const connectedEntityIds = assocEdges.map((e) => (e.source === assoc.id ? e.target : e.source));

            if (connectedEntityIds.length >= 2) {
                // Table de jonction MLD
                const assocTableName = assoc.data.label.toLowerCase();
                const junctionCols: MldColumn[] = [
                    { id: `jcol-id-${index}`, name: "id", type: "UUID", isPk: true, nullable: false },
                ];

                connectedEntityIds.forEach((entId, idx) => {
                    const srcMldTable = newMldNodes.find((n) => n.id === `mld_gen_${entId}`);
                    const pkCol = srcMldTable?.data.columns.find((c) => c.isPk);
                    const fkName = `${srcMldTable?.data.label}_id`;

                    const fkColId = `jcol-fk-${index}-${idx}`;
                    junctionCols.push({
                        id: fkColId,
                        name: fkName,
                        type: pkCol?.type || "UUID",
                        isFk: true,
                        nullable: false,
                    });

                    if (srcMldTable && pkCol) {
                        newMldEdges.push({
                            id: `rel-gen-${srcMldTable.id}-${fkColId}`,
                            type: "customRelation",
                            source: srcMldTable.id,
                            target: `mld_gen_assoc_${assoc.id}`,
                            sourceHandle: `source-${pkCol.id}`,
                            targetHandle: `target-${fkColId}`,
                            label: "1:N",
                            data: { sourceField: pkCol.id, targetField: fkColId, cardinality: "1:N" },
                            animated: true,
                        });
                    }
                });

                newMldNodes.push({
                    id: `mld_gen_assoc_${assoc.id}`,
                    type: "databaseTable",
                    position: { x: assoc.position.x, y: assoc.position.y },
                    data: {
                        label: assocTableName,
                        columns: junctionCols,
                    },
                });
            }
        });

        // Ajouter les nouveaux nœuds/arêtes au canvas
        onNodesChange(newMldNodes.map((n) => ({ type: "add", item: n })));
        if (newMldEdges.length > 0) {
            onEdgesChange(newMldEdges.map((e) => ({ type: "add", item: e })));
        }

        // Basculer automatiquement sur le mode MLD
        setMode("MLD");
    }, [nodes, edges, onNodesChange, onEdgesChange]);

    // Enrichissement dynamique des nœuds filtrés avec handlers callbacks
    const enrichedNodes = useMemo(() => {
        return filteredNodes.map((node) => {
            const stats = nodeCommentsStats[node.id];
            return {
                ...node,
                data: {
                    ...node.data,
                    linkedColumnIds: node.type === "databaseTable" ? linkedColumnIds : undefined,
                    onEdit: isReadOnly ? undefined : handleEditNode,
                    onDelete: isReadOnly ? undefined : handleDeleteNode,
                    commentCount: stats?.total ?? 0,
                    unresolvedCommentCount: stats?.unresolved ?? 0,
                    onOpenComments: (nodeId: string, nodeName: string) =>
                        setSelectedNodeForComments({ id: nodeId, name: nodeName }),
                },
            };
        }) as FlowCustomNode[];
    }, [filteredNodes, linkedColumnIds, handleEditNode, handleDeleteNode, isReadOnly, nodeCommentsStats]);

    // Enrichissement dynamique des arêtes avec callback de suppression directe
    const enrichedEdges = useMemo(() => {
        return filteredEdges.map((edge) => ({
            ...edge,
            data: {
                ...edge.data,
                onDeleteEdge: isReadOnly ? undefined : handleDeleteEdge,
            },
        })) as FlowCustomEdge[];
    }, [filteredEdges, handleDeleteEdge, isReadOnly]);

    return (
        <div className="w-full h-screen relative bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            {/* Bannière Mode Lecture Seule */}
            {isReadOnly && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-1.5 rounded-full shadow-lg text-xs flex items-center gap-2 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="font-semibold">Mode Lecture Seule</span>
                    <span className="text-amber-200/70 hidden sm:inline">— Vous pouvez visualiser le diagramme et participer aux commentaires</span>
                </div>
            )}

            {/* Barre d'outils MCD / MLD / UML */}
            {!isReadOnly && (
                <FlowToolbar
                    mode={mode}
                    onModeChange={handleModeChange}
                    umlDiagramType={umlDiagramType}
                    onOpenUmlDiagramSelector={() => setIsUmlDiagramSelectorOpen(true)}
                    // MCD
                    onOpenCreateEntity={handleOpenCreateEntity}
                    onOpenCreateAssociation={handleOpenCreateAssociation}
                    onGenerateMldFromMcd={handleGenerateMldFromMcd}
                    // MLD
                    onOpenCreateTable={handleOpenCreateTable}
                    // 1. Cas d'utilisation
                    onOpenCreateUmlActor={handleOpenCreateUmlActor}
                    onOpenCreateUmlUseCase={handleOpenCreateUmlUseCase}
                    // 2. Classes
                    onOpenCreateUmlClass={handleOpenCreateUmlClass}
                    // 3. Séquence
                    onOpenCreateUmlLifeline={handleOpenCreateUmlLifeline}
                    // 4. Activités
                    onOpenCreateUmlActivity={handleOpenCreateUmlActivity}
                    // 5. Déploiement
                    onOpenCreateUmlDeployment={handleOpenCreateUmlDeployment}
                    // 6. États-transitions
                    onOpenCreateUmlState={handleOpenCreateUmlState}
                    // Export
                    onToggleExportSidebar={() => setIsExportSidebarOpen((prev) => !prev)}
                    isSidebarOpen={isExportSidebarOpen}
                />
            )}

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

            {/* Canvas React Flow */}
            <ReactFlow<FlowCustomNode, FlowCustomEdge>
                nodes={enrichedNodes}
                edges={enrichedEdges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={isReadOnly ? undefined : handleConnect}
                onDelete={isReadOnly ? undefined : onDelete}
                onBeforeDelete={isReadOnly ? async () => false : handleBeforeDelete}
                nodesDraggable={!isReadOnly}
                nodesConnectable={!isReadOnly}
                elementsSelectable={true}
                onEdgeClick={isReadOnly ? undefined : (_, edge) => {
                    const edgeData = edge.data as MldEdgeData | undefined;
                    setEditingEdgeId(edge.id);
                    setEdgeSourceNodeId(edge.source);
                    setEdgeTargetNodeId(edge.target);
                    setEdgeSourceFieldId(edgeData?.sourceField || "");
                    setEdgeTargetFieldId(edgeData?.targetField || "");
                    setEdgeSourceHandle(edge.sourceHandle || undefined);
                    setEdgeTargetHandle(edge.targetHandle || undefined);
                    setEdgeCardinality(edgeData?.cardinality || (mode === "MCD" ? "1,N" : "1:N"));
                    setIsEdgeModalOpen(true);
                }}
                onNodeContextMenu={handleNodeContextMenu}
                onPaneClick={closeContextMenu}
                fitView
                fitViewOptions={{ padding: 0.2 }}
            >
                <Background />
                <Controls />
                <Cursors />

            </ReactFlow>

            {/* Bouton flottant Commentaires (sidebar du projet) */}
            {onOpenCommentsSidebar && (
                <div className="absolute bottom-6 right-6 z-30">
                    <Button
                        onClick={onOpenCommentsSidebar}
                        className="h-11 rounded-full shadow-xl gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-4"
                        title="Voir tous les commentaires du projet"
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span className="hidden sm:inline">Commentaires</span>
                    </Button>
                </div>
            )}

            {/* Menu contextuel Clic-droit sur un nœud */}
            {contextMenu && (
                <>
                    {/* Overlay pour fermer en cliquant en dehors */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={closeContextMenu}
                        onContextMenu={(e) => { e.preventDefault(); closeContextMenu(); }}
                    />
                    <div
                        className="fixed z-50 min-w-[200px] rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-2xl p-1.5 text-sm space-y-1"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                    >
                        <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/60 mb-1 truncate max-w-[200px]">
                            {contextMenu.nodeName}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedNodeForComments({ id: contextMenu.nodeId, name: contextMenu.nodeName });
                                closeContextMenu();
                            }}
                            className="w-full justify-start gap-2.5 text-xs font-medium h-8"
                        >
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Voir les commentaires</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedNodeForComments({ id: contextMenu.nodeId, name: contextMenu.nodeName });
                                closeContextMenu();
                            }}
                            className="w-full justify-start gap-2.5 text-xs font-medium h-8 text-indigo-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                        >
                            <MessageSquarePlus className="h-3.5 w-3.5 text-indigo-400" />
                            <span>Ajouter un commentaire</span>
                        </Button>
                    </div>
                </>
            )}

            {/* Modale des commentaires d'un nœud spécifique */}
            <NodeCommentsModal
                selectedNode={selectedNodeForComments}
                onClose={() => setSelectedNodeForComments(null)}
            />

            {/* MODALES */}
            <McdEntityModal
                isOpen={isMcdEntityModalOpen}
                onClose={() => setIsMcdEntityModalOpen(false)}
                editingNodeId={editingNodeId}
                initialName={activeNodeName}
                initialAttributes={activeMcdAttributes}
                onSave={handleSaveMcdEntity}
            />

            <McdAssociationModal
                isOpen={isMcdAssociationModalOpen}
                onClose={() => setIsMcdAssociationModalOpen(false)}
                editingNodeId={editingNodeId}
                initialName={activeNodeName}
                initialAttributes={activeMcdAttributes}
                onSave={handleSaveMcdAssociation}
            />

            <MldTableModal
                isOpen={isMldTableModalOpen}
                onClose={() => setIsMldTableModalOpen(false)}
                editingNodeId={editingNodeId}
                initialTableName={activeNodeName}
                initialColumns={activeMldColumns}
                onSave={handleSaveMldTable}
            />

            <UmlClassModal
                isOpen={isUmlClassModalOpen}
                onClose={() => setIsUmlClassModalOpen(false)}
                editingNodeId={editingNodeId}
                initialClassName={activeNodeName}
                initialClassType={activeUmlClassType}
                initialAttributes={activeUmlAttributes}
                initialMethods={activeUmlMethods}
                onSave={handleSaveUmlClass}
            />



            <UmlStateModal
                isOpen={isUmlStateModalOpen}
                onClose={() => setIsUmlStateModalOpen(false)}
                editingNodeId={editingNodeId}
                initialLabel={activeNodeName}
                initialKind={activeStateKind}
                initialEntry={activeStateEntry}
                initialDo={activeStateDo}
                initialExit={activeStateExit}
                onSave={handleSaveUmlState}
            />

            <UmlLifelineModal
                isOpen={isUmlLifelineModalOpen}
                onClose={() => setIsUmlLifelineModalOpen(false)}
                editingNodeId={editingNodeId}
                initialLabel={activeNodeName}
                initialInstanceName={activeInstanceName}
                initialClassName={activeClassName}
                initialIsActor={activeIsActor}
                onSave={handleSaveUmlLifeline}
            />

            <UmlDiagramSelectorModal
                isOpen={isUmlDiagramSelectorOpen}
                onClose={() => setIsUmlDiagramSelectorOpen(false)}
                currentDiagramType={umlDiagramType}
                onSelectDiagramType={setUmlDiagramType}
            />

            <EdgeModal
                isOpen={isEdgeModalOpen}
                onClose={() => setIsEdgeModalOpen(false)}
                mode={mode}
                editingEdgeId={editingEdgeId}
                nodes={nodes}
                sourceNodeId={edgeSourceNodeId}
                targetNodeId={edgeTargetNodeId}
                sourceFieldId={edgeSourceFieldId}
                targetFieldId={edgeTargetFieldId}
                initialCardinality={edgeCardinality}
                onSave={handleSaveEdge}
                onDeleteEdge={handleDeleteEdge}
            />

            <DeleteConfirmModal
                pendingDeletion={pendingDeletion}
                onConfirm={handleConfirmDeletion}
                onCancel={handleCancelDeletion}
            />

            <SqlExportModal
                isOpen={isSqlModalOpen}
                onClose={() => setIsSqlModalOpen(false)}
                nodes={nodes.filter((n) => n.type === "databaseTable") as MldTableNode[]}
                edges={edges.filter((e) => activeNodeIds.has(e.source) && activeNodeIds.has(e.target)) as MldEdge[]}
            />

            {/* SIDEBAR D'EXPORTATION (SQL, PRISMA, DRIZZLE) */}
            <ExportSidebar
                isOpen={isExportSidebarOpen}
                onClose={() => setIsExportSidebarOpen(false)}
                nodes={nodes.filter((n) => n.type === "databaseTable") as MldTableNode[]}
                edges={edges.filter((e) => activeNodeIds.has(e.source) && activeNodeIds.has(e.target)) as MldEdge[]}
            />
        </div>
    );
}

export default FlowDiagram;
