import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Plus, Layers, Database, Box, User, Zap, ArrowLeftRight, Cpu, GitBranch,
    Info, PanelRightOpen, PanelRightClose, ChevronDown, Sparkles
} from "lucide-react";
import { ModelingMode, UmlDiagramType, UmlDeploymentKind, UmlStateKind, UmlActivityKind } from "./types";

type FlowToolbarProps = {
    mode: ModelingMode;
    onModeChange: (mode: ModelingMode) => void;
    umlDiagramType: UmlDiagramType;
    onOpenUmlDiagramSelector: () => void;
    // MCD
    onOpenCreateEntity: () => void;
    onOpenCreateAssociation: () => void;
    onGenerateMldFromMcd: () => void;
    // MLD
    onOpenCreateTable: () => void;
    // UML 1 : Cas d'utilisation
    onOpenCreateUmlActor: () => void;
    onOpenCreateUmlUseCase: () => void;
    // UML 2 : Classes
    onOpenCreateUmlClass: () => void;
    // UML 3 : Séquence
    onOpenCreateUmlLifeline: () => void;
    // UML 4 : Activités
    onOpenCreateUmlActivity: (kind: UmlActivityKind) => void;
    // UML 5 : Déploiement
    onOpenCreateUmlDeployment: (kind: UmlDeploymentKind) => void;
    // UML 6 : États-transitions
    onOpenCreateUmlState: (kind: UmlStateKind) => void;
    // Export
    onToggleExportSidebar: () => void;
    isSidebarOpen: boolean;
};

const UML_DIAGRAM_META: Record<UmlDiagramType, { name: string; icon: typeof Box; color: string }> = {
    usecase: { name: "Cas d'Utilisation", icon: User, color: "text-purple-600 dark:text-purple-400" },
    class: { name: "Classes", icon: Box, color: "text-indigo-600 dark:text-indigo-400" },
    sequence: { name: "Séquence", icon: ArrowLeftRight, color: "text-teal-600 dark:text-teal-400" },
    activity: { name: "Activités", icon: Zap, color: "text-amber-600 dark:text-amber-400" },
    deployment: { name: "Déploiement", icon: Cpu, color: "text-cyan-600 dark:text-cyan-400" },
    state: { name: "États-Transitions", icon: GitBranch, color: "text-orange-600 dark:text-orange-400" },
};

function Separator() {
    return <div className="h-5 w-[1px] bg-border hidden sm:block" />;
}

function ToolBtn({
    onClick,
    variant = "default",
    className = "",
    children,
}: {
    onClick: () => void;
    variant?: "default" | "secondary" | "outline";
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <Button onClick={onClick} size="sm" variant={variant} className={`gap-1.5 shadow-md ${className}`}>
            {children}
        </Button>
    );
}

export function FlowToolbar({
    mode,
    onModeChange,
    umlDiagramType,
    onOpenUmlDiagramSelector,
    onOpenCreateEntity,
    onOpenCreateAssociation,
    onGenerateMldFromMcd,
    onOpenCreateTable,
    onOpenCreateUmlActor,
    onOpenCreateUmlUseCase,
    onOpenCreateUmlClass,
    onOpenCreateUmlLifeline,
    onOpenCreateUmlActivity,
    onOpenCreateUmlDeployment,
    onOpenCreateUmlState,
    onToggleExportSidebar,
    isSidebarOpen,
}: FlowToolbarProps) {
    const meta = UML_DIAGRAM_META[umlDiagramType] || UML_DIAGRAM_META.class;
    const ActiveIcon = meta.icon;

    return (
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-background/85 backdrop-blur-md p-2 rounded-xl border border-border shadow-2xl max-w-[calc(100vw-2rem)]">
            {/* Sélecteur de mode : MCD / MLD / UML */}
            <Tabs value={mode} onValueChange={(val) => onModeChange(val as ModelingMode)}>
                <TabsList className="bg-card border border-border h-9">
                    <TabsTrigger value="MCD" className="gap-1.5 text-xs font-semibold px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Layers className="h-3.5 w-3.5" /> MCD (Conceptuel)
                    </TabsTrigger>
                    <TabsTrigger value="MLD" className="gap-1.5 text-xs font-semibold px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Database className="h-3.5 w-3.5" /> MLD (Logique)
                    </TabsTrigger>
                    <TabsTrigger value="UML" className="gap-1.5 text-xs font-semibold px-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                        <Box className="h-3.5 w-3.5" /> UML (6 Essentiels)
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <Separator />

            {/* Actions MCD */}
            {mode === "MCD" && (
                <>
                    <ToolBtn onClick={onOpenCreateEntity}><Plus className="h-4 w-4" /> Entité</ToolBtn>
                    <ToolBtn onClick={onOpenCreateAssociation} variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        <Plus className="h-4 w-4" /> Association
                    </ToolBtn>
                    <ToolBtn onClick={onGenerateMldFromMcd} variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-300">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Générer MLD
                    </ToolBtn>
                </>
            )}

            {/* Actions MLD */}
            {mode === "MLD" && (
                <ToolBtn onClick={onOpenCreateTable}><Plus className="h-4 w-4" /> Nouvelle Table</ToolBtn>
            )}

            {/* Actions UML dynamiques */}
            {mode === "UML" && (
                <>
                    {/* Bouton sélecteur du diagramme UML */}
                    <Button
                        onClick={onOpenUmlDiagramSelector}
                        size="sm"
                        variant="outline"
                        className={`gap-1.5 shadow-md border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 font-mono text-xs ${meta.color}`}
                    >
                        <ActiveIcon className="h-3.5 w-3.5" />
                        <span className="max-w-[150px] truncate">{meta.name}</span>
                        <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
                    </Button>

                    <Separator />

                    {/* 1. Cas d'utilisation */}
                    {umlDiagramType === "usecase" && (
                        <>
                            <ToolBtn onClick={onOpenCreateUmlActor} className="bg-purple-600 hover:bg-purple-700 text-white">
                                <Plus className="h-4 w-4" /> Acteur
                            </ToolBtn>
                            <ToolBtn onClick={onOpenCreateUmlUseCase} variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                                <Plus className="h-4 w-4" /> Cas d'Utilisation
                            </ToolBtn>
                        </>
                    )}

                    {/* 2. Classes */}
                    {umlDiagramType === "class" && (
                        <ToolBtn onClick={onOpenCreateUmlClass} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Plus className="h-4 w-4" /> Classe / Interface
                        </ToolBtn>
                    )}

                    {/* 3. Séquence */}
                    {umlDiagramType === "sequence" && (
                        <ToolBtn onClick={onOpenCreateUmlLifeline} className="bg-teal-600 hover:bg-teal-700 text-white">
                            <Plus className="h-4 w-4" /> Ligne de vie
                        </ToolBtn>
                    )}

                    {/* 4. Activités */}
                    {umlDiagramType === "activity" && (
                        <>
                            <ToolBtn onClick={() => onOpenCreateUmlActivity("action")} className="bg-amber-600 hover:bg-amber-700 text-white">
                                <Plus className="h-4 w-4" /> Action
                            </ToolBtn>
                            <ToolBtn onClick={() => onOpenCreateUmlActivity("decision")} variant="outline" className="border-amber-500/40 text-amber-600">
                                <Plus className="h-4 w-4" /> Décision
                            </ToolBtn>
                            <ToolBtn onClick={() => onOpenCreateUmlActivity("fork")} variant="outline" className="border-amber-500/40 text-amber-600">
                                <Plus className="h-4 w-4" /> Fork/Join
                            </ToolBtn>
                            <ToolBtn onClick={() => onOpenCreateUmlActivity("initial")} variant="outline">
                                <Plus className="h-4 w-4" /> Début/Fin
                            </ToolBtn>
                        </>
                    )}

                    {/* 5. Déploiement */}
                    {umlDiagramType === "deployment" && (
                        <>
                            <ToolBtn onClick={() => onOpenCreateUmlDeployment("node")} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                                <Plus className="h-4 w-4" /> Serveur / Nœud
                            </ToolBtn>
                            <ToolBtn onClick={() => onOpenCreateUmlDeployment("device")} variant="outline" className="border-cyan-500/40 text-cyan-600">
                                <Plus className="h-4 w-4" /> Périphérique / Cloud
                            </ToolBtn>
                            <ToolBtn onClick={() => onOpenCreateUmlDeployment("artifact")} variant="outline" className="border-emerald-500/40 text-emerald-600">
                                <Plus className="h-4 w-4" /> Artefact
                            </ToolBtn>
                        </>
                    )}

                    {/* 6. États-transitions */}
                    {umlDiagramType === "state" && (
                        <>
                            <ToolBtn onClick={() => onOpenCreateUmlState("simple")} className="bg-orange-600 hover:bg-orange-700 text-white">
                                <Plus className="h-4 w-4" /> État
                            </ToolBtn>
                            <ToolBtn onClick={() => onOpenCreateUmlState("composite")} variant="outline" className="border-orange-500/40 text-orange-600">
                                <Plus className="h-4 w-4" /> État Composite
                            </ToolBtn>
                            <ToolBtn onClick={() => onOpenCreateUmlState("choice")} variant="outline" className="border-orange-500/40 text-orange-600">
                                <Plus className="h-4 w-4" /> Choix
                            </ToolBtn>
                            <ToolBtn onClick={() => onOpenCreateUmlState("initial")} variant="outline">
                                <Plus className="h-4 w-4" /> Initial/Final
                            </ToolBtn>
                        </>
                    )}
                </>
            )}

            <Separator />

            {/* Bouton d'export */}
            <Button
                variant={isSidebarOpen ? "default" : "outline"}
                size="sm"
                onClick={onToggleExportSidebar}
                className="gap-2 shadow-md font-semibold"
            >
                {isSidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4 text-primary" />}
                <span className="hidden md:inline">Exporter</span>
            </Button>

            {/* Astuce */}
            <Badge variant="outline" className="hidden xl:flex items-center gap-1 text-[10px] font-normal py-1 px-2 text-muted-foreground bg-muted/30">
                <Info className="h-3 w-3 text-primary shrink-0" />
                <span>Cliquez sur <strong className="text-destructive font-mono">X</strong> pour supprimer</span>
            </Badge>
        </div>
    );
}
