import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ProjectList } from "@/components/project-list";
import { getProjects } from "@/lib/actions/room.actions";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Layers, Database, Box } from "lucide-react";
import AnimatedBackground from "@/components/landing/animated-background";

export const dynamic = "force-dynamic";

async function ProjectPage() {
    const clerkUser = await currentUser();

    if (!clerkUser) {
        redirect("/sign-in");
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const roomsResponse = await getProjects(email);
    const projects = roomsResponse?.data || [];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AnimatedBackground />
            {/* Barre de navigation */}
            <Navbar />

            {/* Contenu principal */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
                {/* En-tête de section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/40 pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">
                                Projets de Modélisation
                            </h1>
                            <Badge variant="outline" className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/30">
                                {projects.length} projet{projects.length > 1 ? "s" : ""}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground max-w-2xl">
                            Concevez vos modèles conceptuels (MCD), schémas relationnels (MLD) et diagrammes UML 2.5 en temps réel avec vos collaborateurs.
                        </p>
                    </div>

                    {/* Raccourcis de badges */}
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-card/60 border border-border/50 p-1.5 rounded-lg">
                        <span className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 font-semibold">
                            <Layers className="h-3 w-3" /> MCD
                        </span>
                        <span className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-blue-500/10 text-blue-400 font-semibold">
                            <Database className="h-3 w-3" /> MLD
                        </span>
                        <span className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-purple-500/10 text-purple-400 font-semibold">
                            <Box className="h-3 w-3" /> UML (6)
                        </span>
                    </div>
                </div>

                {/* Liste des projets avec recherche et cartes */}
                <ProjectList
                    initialProjects={projects}
                    userId={clerkUser.id}
                    email={email}
                />
            </main>
        </div>
    );
}

export default ProjectPage;
