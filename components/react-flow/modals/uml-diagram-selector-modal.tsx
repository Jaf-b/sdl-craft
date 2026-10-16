import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Box, ArrowLeftRight, Zap, Cpu, GitBranch, Check } from "lucide-react";
import { UmlDiagramType } from "../types";

type DiagramOption = {
    type: UmlDiagramType;
    title: string;
    description: string;
    icon: typeof Box;
    color: string;
    badgeColor: string;
    category: "Structure" | "Comportement" | "Architecture";
};

const ESSENTIAL_DIAGRAMS: DiagramOption[] = [
    {
        type: "usecase",
        title: "Cas d'utilisation",
        description: "Définir les fonctionnalités du système et identifier les interactions avec les acteurs.",
        icon: User,
        color: "border-purple-500/30 hover:border-purple-500 bg-purple-500/5 hover:bg-purple-500/10 text-purple-600 dark:text-purple-400",
        badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        category: "Comportement",
    },
    {
        type: "class",
        title: "Diagramme de classes",
        description: "Modéliser les classes, attributs, méthodes, relations et structures de données.",
        icon: Box,
        color: "border-indigo-500/30 hover:border-indigo-500 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        badgeColor: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
        category: "Structure",
    },
    {
        type: "sequence",
        title: "Diagramme de séquence",
        description: "Visualiser les échanges chronologiques et flux de messages entre objets et API.",
        icon: ArrowLeftRight,
        color: "border-teal-500/30 hover:border-teal-500 bg-teal-500/5 hover:bg-teal-500/10 text-teal-600 dark:text-teal-400",
        badgeColor: "bg-teal-500/10 text-teal-500 border-teal-500/20",
        category: "Comportement",
    },
    {
        type: "activity",
        title: "Diagramme d'activités",
        description: "Représenter les workflows, algorithmes et processus décisionnels étape par étape.",
        icon: Zap,
        color: "border-amber-500/30 hover:border-amber-500 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400",
        badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        category: "Comportement",
    },
    {
        type: "deployment",
        title: "Diagramme de déploiement",
        description: "Cartographier l'infrastructure physique et cloud : serveurs, nœuds et conteneurs.",
        icon: Cpu,
        color: "border-cyan-500/30 hover:border-cyan-500 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
        badgeColor: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
        category: "Architecture",
    },
    {
        type: "state",
        title: "États-transitions",
        description: "Spécifier le cycle de vie et les changements d'état d'un objet en réponse aux événements.",
        icon: GitBranch,
        color: "border-orange-500/30 hover:border-orange-500 bg-orange-500/5 hover:bg-orange-500/10 text-orange-600 dark:text-orange-400",
        badgeColor: "bg-orange-500/10 text-orange-500 border-orange-500/20",
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
            <DialogContent className="bg-card border-border text-card-foreground sm:max-w-4xl lg:max-w-5xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
                <DialogHeader className="space-y-1.5 pb-2 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                            <Box className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold tracking-tight">
                                Sélectionner un Diagramme UML
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Choisissez parmi les 6 modèles UML officiels. La barre d'outils s'adaptera automatiquement.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                    {ESSENTIAL_DIAGRAMS.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = currentDiagramType === opt.type;

                        return (
                            <Card
                                key={opt.type}
                                className={`cursor-pointer transition-all duration-200 border-2 p-5 relative group flex flex-col justify-between rounded-xl ${opt.color} ${
                                    isSelected
                                        ? "ring-2 ring-primary border-primary shadow-xl scale-[1.02] bg-primary/5"
                                        : "hover:shadow-lg hover:scale-[1.01]"
                                }`}
                                onClick={() => handleSelect(opt.type)}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 rounded-xl bg-background/90 border border-border shadow-xs group-hover:scale-105 transition-transform">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Badge variant="outline" className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${opt.badgeColor}`}>
                                                {opt.category}
                                            </Badge>
                                            {isSelected && (
                                                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                                                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <CardTitle className="text-base font-bold tracking-tight">
                                            {opt.title}
                                        </CardTitle>
                                        <CardDescription className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                                            {opt.description}
                                        </CardDescription>
                                    </div>
                                </div>

                                <div className="pt-4 mt-2 flex items-center justify-end">
                                    <span className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
                                        isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                    }`}>
                                        {isSelected ? "Diagramme actif" : "Choisir ce modèle →"}
                                    </span>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default UmlDiagramSelectorModal;
