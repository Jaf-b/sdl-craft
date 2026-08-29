import { Node, Edge } from "@xyflow/react";

export type ModelingMode = "MCD" | "MLD" | "UML";

// Les 6 Diagrammes UML Essentiels
export type UmlDiagramType =
    | "usecase"     // 1. Diagramme des cas d'utilisation (Acteurs, Cas d'usage)
    | "class"       // 2. Diagramme de classes (Classes, Interfaces, Méthodes)
    | "sequence"    // 3. Diagramme de séquence (Lignes de vie, Messages API)
    | "activity"    // 4. Diagramme d'activités (Workflows, Décisions, Fork/Join)
    | "deployment"  // 5. Diagramme de déploiement (DevOps, Cloud, Serveurs, BDD)
    | "state";      // 6. Diagramme d'états-transitions (Cycles de vie d'entités)

// Propriétés collaboratives partagées par tous les nœuds
export type BaseNodeCollaborativeData = {
    commentCount?: number;
    unresolvedCommentCount?: number;
    onOpenComments?: (nodeId: string, nodeLabel: string) => void;
};

// --- Types MCD (MERISE) ---
export type McdAttribute = {
    id: string;
    name: string;
    isIdentifier?: boolean;
    nullable?: boolean;
};
export type McdEntityData = BaseNodeCollaborativeData & {
    label: string;
    attributes: McdAttribute[];
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
};
export type McdAssociationData = BaseNodeCollaborativeData & {
    label: string;
    attributes?: McdAttribute[];
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
};
export type McdCardinality = "0,1" | "1,1" | "0,N" | "1,N";
export type McdEdgeData = Record<string, unknown> & {
    cardinality: McdCardinality;
    roleName?: string;
    onDeleteEdge?: (id: string) => void;
};
export type McdEntityNode = Node<McdEntityData, "mcdEntity">;
export type McdAssociationNode = Node<McdAssociationData, "mcdAssociation">;
export type McdEdge = Edge<McdEdgeData>;

// --- Types MLD (Modèle Logique / Relationnel) ---
export type DataType = "UUID" | "VARCHAR(255)" | "INTEGER" | "TIMESTAMP" | "BOOLEAN" | "TEXT";
export type MldCardinality = "1:1" | "1:N" | "N:N";
export type MldColumn = {
    id: string;
    name: string;
    type: DataType;
    isPk?: boolean;
    isFk?: boolean;
    nullable?: boolean;
};
export type MldTableData = BaseNodeCollaborativeData & {
    label: string;
    columns: MldColumn[];
    linkedColumnIds?: Set<string>;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
};
export type MldEdgeData = Record<string, unknown> & {
    sourceField?: string;
    targetField?: string;
    cardinality: MldCardinality;
    onDeleteEdge?: (id: string) => void;
};
export type MldTableNode = Node<MldTableData, "databaseTable">;
export type MldEdge = Edge<MldEdgeData>;

// --- Types UML Communs ---
export type UmlVisibility = "+" | "-" | "#" | "~";
export type UmlClassType = "class" | "interface" | "abstract" | "enum";

export type UmlAttribute = {
    id: string;
    name: string;
    type: string;
    visibility: UmlVisibility;
    isStatic?: boolean;
};

export type UmlMethod = {
    id: string;
    name: string;
    returnType: string;
    visibility: UmlVisibility;
    parameters?: string;
    isStatic?: boolean;
    isAbstract?: boolean;
};

// 1. Diagramme de Cas d'Utilisation
export type UmlActorData = BaseNodeCollaborativeData & {
    label: string;
    roleDescription?: string;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
};
export type UmlUseCaseData = BaseNodeCollaborativeData & {
    label: string;
    description?: string;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
};
export type UmlActorNode = Node<UmlActorData, "umlActor">;
export type UmlUseCaseNode = Node<UmlUseCaseData, "umlUseCase">;

// 2. Diagramme de Classes
export type UmlClassData = BaseNodeCollaborativeData & {
    label: string;
    classType: UmlClassType;
    attributes: UmlAttribute[];
    methods: UmlMethod[];
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
};
export type UmlClassNode = Node<UmlClassData, "umlClass">;

// 3. Diagramme de Séquence
export type UmlLifelineData = BaseNodeCollaborativeData & {
    label: string;
    instanceName?: string;
    className?: string;
    isActor?: boolean;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
};
export type UmlLifelineNode = Node<UmlLifelineData, "umlLifeline">;

// 4. Diagramme d'Activités
export type UmlActivityKind = "initial" | "final" | "action" | "decision" | "fork" | "join";
export type UmlActivityData = BaseNodeCollaborativeData & {
    label: string;
    nodeKind: UmlActivityKind;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
};
export type UmlActivityNode = Node<UmlActivityData, "umlActivity">;

// 5. Diagramme de Déploiement
export type UmlDeploymentKind = "node" | "device" | "artifact" | "executionEnvironment";
export type UmlDeploymentData = BaseNodeCollaborativeData & {
    label: string;
    kind: UmlDeploymentKind;
    stereotype?: string;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
};
export type UmlDeploymentNode = Node<UmlDeploymentData, "umlDeployment">;

// 6. Diagramme d'États-Transitions
export type UmlStateKind = "initial" | "final" | "simple" | "composite" | "choice";
export type UmlStateData = BaseNodeCollaborativeData & {
    label: string;
    kind: UmlStateKind;
    entryAction?: string;
    doAction?: string;
    exitAction?: string;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
};
export type UmlStateNode = Node<UmlStateData, "umlState">;

// --- Types Globaux Union ---
export type FlowCustomNode =
    | McdEntityNode
    | McdAssociationNode
    | MldTableNode
    | UmlActorNode
    | UmlUseCaseNode
    | UmlClassNode
    | UmlLifelineNode
    | UmlActivityNode
    | UmlDeploymentNode
    | UmlStateNode;

export type FlowCustomEdge = McdEdge | MldEdge;

export type PendingDeletion =
    | { kind: "node"; id: string; name: string; nodeType: string; connectedEdgeIds: string[] }
    | { kind: "edge"; id: string }
    | { kind: "flow"; nodes: FlowCustomNode[]; edges: FlowCustomEdge[]; resolve: (value: boolean) => void }
    | null;
