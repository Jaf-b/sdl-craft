"use client";

import { useState, useMemo } from "react";
import { ProjectCard, ProjectRoom } from "./project-card";
import { AddProjectButton } from "./add-project-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Search, Plus, FolderKanban, Sparkles, Filter } from "lucide-react";

type ProjectListProps = {
    initialProjects: ProjectRoom[];
    userId: string;
    email: string;
};

export function ProjectList({ initialProjects, userId, email }: ProjectListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProjects = useMemo(() => {
        if (!searchQuery.trim()) return initialProjects;
        const q = searchQuery.toLowerCase();
        return initialProjects.filter((p) => {
            const title = p.metadata?.title?.toLowerCase() || "";
            const id = p.id.toLowerCase();
            return title.includes(q) || id.includes(q);
        });
    }, [initialProjects, searchQuery]);

    return (
        <div className="space-y-6">
            {/* Barre de recherche et actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/40 p-4 rounded-xl border border-border/60 backdrop-blur-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher un projet par nom ou ID..."
                        className="pl-9 bg-background/80 text-xs font-mono"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                        >
                            Effacer
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <AddProjectButton userId={userId} email={email} />
                </div>
            </div>

            {/* Liste ou État vide */}
            {initialProjects.length === 0 ? (
                <Empty className="py-20 border border-dashed border-border/80 rounded-2xl bg-card/20">
                    <EmptyHeader>
                        <EmptyMedia variant="icon" className="bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 p-4 rounded-2xl">
                            <FolderKanban className="h-8 w-8" />
                        </EmptyMedia>
                        <EmptyTitle className="text-lg font-bold">Aucun projet pour le moment</EmptyTitle>
                        <EmptyDescription className="text-xs max-w-md text-muted-foreground">
                            Vous n'avez pas encore créé d'espace de modélisation. Démarrez votre premier projet pour concevoir vos MCD, MLD et diagrammes UML.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <AddProjectButton
                            userId={userId}
                            email={email}
                            trigger={
                                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/20">
                                    <Plus className="h-4 w-4" />
                                    Créer mon premier projet
                                </Button>
                            }
                        />
                    </EmptyContent>
                </Empty>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center py-16 bg-card/20 rounded-2xl border border-border/40 space-y-2">
                    <Search className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                    <p className="text-sm font-semibold text-foreground">Aucun résultat trouvé pour "{searchQuery}"</p>
                    <p className="text-xs text-muted-foreground">Essayez avec un autre mot-clé ou réinitialisez la recherche.</p>
                    <Button variant="outline" size="sm" onClick={() => setSearchQuery("")} className="mt-2">
                        Réinitialiser la recherche
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} room={project} currentEmail={email} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProjectList;
