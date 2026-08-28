import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Box, ArrowLeftRight, Zap, Cpu, GitBranch } from "lucide-react";
import { UmlDiagramType } from "../types";

type DiagramOption = {
    type: UmlDiagramType;
    title: string;
    description: string;
    icon: typeof Box;
    color: string;
    category: "Structure" | "Comportement" | "Architecture";
};

const ESSENTIAL_DIAGRAMS: DiagramOption[] = [
    {
        type: "usecase",
        title: "Cas d'utilisation (Use Case)",
        description: "Définir ce que fait le système et identifier les acteurs/utilisateurs.",
        icon: User,
        color: "border-purple-500/50 hover:border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-500/5",
        category: "Comportement",
    },
    {
        type: "class",
        title: "Diagramme de classes",
        description: "Cœur de la conception OO : structure des données, entités, méthodes et héritage.",
        icon: Box,
        color: "border-indigo-500/50 hover:border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5",
        category: "Structure",
    },
    {
        type: "sequence",
        title: "Diagramme de séquence",
        description: "Logique métier, échanges d'API et flux de messages étape par étape dans le temps.",
        icon: ArrowLeftRight,
        color: "border-teal-500/50 hover:border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-500/5",
        category: "Comportement",
    },
    {
        type: "activity",
        title: "Diagramme d'activités",
        description: "Algorithmes, workflows et processus métiers multi-étapes (actions, décisions, fork/join).",
        icon: Zap,
        color: "border-amber-500/50 hover:border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/5",
        category: "Comportement",
    },
    {
        type: "deployment",
        title: "Diagramme de déploiement",
        description: "DevOps, Cloud et infrastructure : serveurs, conteneurs, bases de données, réseaux.",
        icon: Cpu,
        color: "border-cyan-500/50 hover:border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5",
        category: "Architecture",
    },
    {
        type: "state",
        title: "Diagramme d'états-transitions",
        description: "Logique des entités ayant des cycles de vie stricts (ex: En attente -> Payée -> Livrée).",
        icon: GitBranch,
        color: "border-orange-500/50 hover:border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-500/5",
        category: "Comportement",
    },
];

type Props = {
    isOpen: boolean;
    onClose: () => void;
    currentDiagramType: UmlDiagramType;
    onSelectDiagramType: (type: UmlDiagramType) => void;
};

export function UmlDiagramSelectorModal({ isOpen, onClose, currentDiagramType, onSelectDiagramType }: Props) {
    const handleSelect = (type: UmlDiagramType) => {
        onSelectDiagramType(type);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-card border-border text-card-foreground max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base font-bold">
                        <Box className="h-5 w-5 text-indigo-500" />
                        Choisir le Diagramme UML
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Sélectionnez l'un des 6 diagrammes UML essentiels. La barre d'outils s'adaptera automatiquement.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
                    {ESSENTIAL_DIAGRAMS.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = currentDiagramType === opt.type;

                        return (
                            <Card
                                key={opt.type}
                                className={`cursor-pointer transition-all border-2 p-3 relative group ${opt.color} ${
                                    isSelected
                                        ? "ring-2 ring-primary shadow-lg shadow-primary/10 scale-[1.01]"
                                        : "hover:shadow-md hover:scale-[1.005]"
                                }`}
                                onClick={() => handleSelect(opt.type)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-background/80 border border-border shrink-0 group-hover:scale-110 transition-transform">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                            <CardTitle className="text-xs font-bold font-mono leading-tight">
                                                {opt.title}
                                            </CardTitle>
                                            <Badge variant="outline" className="text-[9px] px-1 py-0 shrink-0 font-normal">
                                                {opt.category}
                                            </Badge>
                                        </div>
                                        <CardDescription className="text-[11px] text-muted-foreground leading-snug">
                                            {opt.description}
                                        </CardDescription>
                                    </div>
                                </div>
                                {isSelected && (
                                    <div className="absolute top-2 right-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
