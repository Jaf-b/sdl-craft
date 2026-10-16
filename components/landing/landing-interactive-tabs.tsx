"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Boxes,
    GitBranch,
    Kanban,
    Cpu,
    Key,
    Link as LinkIcon,
    CheckCircle2,
    Terminal,
    Layers,
    Users,
    Container,
} from "lucide-react";

export function LandingInteractiveTabs() {
    const [activeTab, setActiveTab] = useState("architecture");

    return (
        <div className="w-full max-w-5xl mx-auto mt-12 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-xl shadow-2xl overflow-hidden p-2 sm:p-4">
            {/* Header du mockup canvas */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-border/60 bg-muted/40 rounded-xl mb-4">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-muted-foreground ml-2 truncate">
                        sdl-craft / SaaS-SaaSApp-Stack.craft
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Équipe Dev (4 membres en direct)
                    </Badge>
                </div>
            </div>

            {/* Selector tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-center mb-4">
                    <TabsList className="grid grid-cols-2 sm:grid-cols-4 bg-muted/60 h-auto p-1 w-full max-w-3xl">
                        <TabsTrigger value="architecture" className="text-xs font-semibold gap-1.5 py-2">
                            <Boxes className="h-3.5 w-3.5 text-indigo-400" />
                            1. Architecture & MCD
                        </TabsTrigger>
                        <TabsTrigger value="tracking" className="text-xs font-semibold gap-1.5 py-2">
                            <Kanban className="h-3.5 w-3.5 text-amber-400" />
                            2. Suivi de Projet
                        </TabsTrigger>
                        <TabsTrigger value="gitdocker" className="text-xs font-semibold gap-1.5 py-2">
                            <Container className="h-3.5 w-3.5 text-cyan-400" />
                            3. Git & Docker
                        </TabsTrigger>
                        <TabsTrigger value="deployment" className="text-xs font-semibold gap-1.5 py-2">
                            <Cpu className="h-3.5 w-3.5 text-purple-400" />
                            4. Déploiement Équipe
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Tab 1: Architecture & MCD */}
                <TabsContent value="architecture" className="mt-0">
                    <div className="relative min-h-[300px] sm:min-h-[360px] bg-slate-950/90 rounded-xl border border-slate-800/80 p-6 flex flex-col md:flex-row items-center justify-around gap-6 overflow-hidden">
                        <div className="w-56 rounded-xl border-2 border-indigo-500/60 bg-indigo-950/40 p-4 shadow-lg backdrop-blur-md">
                            <div className="flex items-center justify-between pb-2 border-b border-indigo-500/30 mb-2">
                                <span className="font-mono font-bold text-sm text-indigo-300">USER_ACCOUNT</span>
                                <Badge className="text-[9px] bg-indigo-500/20 text-indigo-300 border-none">MCD / MLD</Badge>
                            </div>
                            <div className="space-y-1 font-mono text-xs text-slate-300">
                                <div className="flex items-center gap-1.5 text-amber-400">
                                    <Key className="h-3 w-3 shrink-0" />
                                    <span className="underline decoration-amber-400">user_id : UUID</span>
                                </div>
                                <div className="pl-4 text-slate-400">email : String</div>
                                <div className="pl-4 text-slate-400">role : Enum</div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <div className="px-4 py-2 rounded-full border-2 border-purple-500/60 bg-purple-950/40 text-purple-300 font-mono text-xs font-bold shadow-md">
                                1,N — [ POSSÈDE ] — 1,1
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono mt-1">Relation Relationnelle</span>
                        </div>

                        <div className="w-56 rounded-xl border-2 border-indigo-500/60 bg-indigo-950/40 p-4 shadow-lg backdrop-blur-md">
                            <div className="flex items-center justify-between pb-2 border-b border-indigo-500/30 mb-2">
                                <span className="font-mono font-bold text-sm text-indigo-300">WORKSPACE</span>
                                <Badge className="text-[9px] bg-indigo-500/20 text-indigo-300 border-none">MCD / MLD</Badge>
                            </div>
                            <div className="space-y-1 font-mono text-xs text-slate-300">
                                <div className="flex items-center gap-1.5 text-amber-400">
                                    <Key className="h-3 w-3 shrink-0" />
                                    <span className="underline decoration-amber-400">workspace_id</span>
                                </div>
                                <div className="pl-4 text-slate-400">name : String</div>
                                <div className="pl-4 text-slate-400">plan : String</div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Tab 2: Suivi de Projet & Sprints */}
                <TabsContent value="tracking" className="mt-0">
                    <div className="relative min-h-[300px] sm:min-h-[360px] bg-slate-950/90 rounded-xl border border-slate-800/80 p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-2">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                <span className="text-xs font-bold text-slate-300 font-mono">À FAIRE (3)</span>
                                <Badge variant="outline" className="text-[9px] border-slate-700 text-slate-400">Sprint 12</Badge>
                            </div>
                            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                                <span className="font-semibold text-slate-200 block">Modéliser schéma Auth</span>
                                <span className="text-[10px] text-amber-400 font-mono">Assigné: @alex</span>
                            </div>
                        </div>

                        <div className="rounded-xl border border-indigo-500/40 bg-indigo-950/30 p-3 space-y-2">
                            <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2">
                                <span className="text-xs font-bold text-indigo-300 font-mono">EN COURS (2)</span>
                                <Badge className="bg-indigo-500/20 text-indigo-300 border-none text-[9px]">En Direct</Badge>
                            </div>
                            <div className="p-2.5 rounded-lg bg-slate-950 border border-indigo-500/40 text-xs space-y-1">
                                <span className="font-semibold text-indigo-200 block">Générer Docker Compose</span>
                                <span className="text-[10px] text-emerald-400 font-mono">Revue par: @team</span>
                            </div>
                        </div>

                        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 space-y-2">
                            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                                <span className="text-xs font-bold text-emerald-300 font-mono">TERMINÉ (8)</span>
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            </div>
                            <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-500/30 text-xs space-y-1">
                                <span className="font-semibold text-slate-300 block">Création Repo GitHub</span>
                                <span className="text-[10px] text-slate-400 font-mono">Merger master</span>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Tab 3: Git & Docker */}
                <TabsContent value="gitdocker" className="mt-0">
                    <div className="relative min-h-[300px] sm:min-h-[360px] bg-slate-950/90 rounded-xl border border-slate-800/80 p-6 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                        <div className="rounded-xl border border-cyan-500/40 bg-cyan-950/30 p-4 space-y-2">
                            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                                    <Container className="h-4 w-4" /> Dockerfile &amp; Compose
                                </span>
                                <Badge variant="outline" className="text-[9px] border-cyan-500/40 text-cyan-300">Autogénéré</Badge>
                            </div>
                            <pre className="text-slate-300 leading-relaxed text-[11px]">
{`FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]`}
                            </pre>
                        </div>

                        <div className="rounded-xl border border-purple-500/40 bg-purple-950/30 p-4 space-y-2">
                            <div className="flex items-center justify-between border-b border-purple-500/30 pb-2">
                                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                                    <GitBranch className="h-4 w-4" /> Sync GitHub Repo
                                </span>
                                <Badge variant="outline" className="text-[9px] border-purple-500/40 text-purple-300">Branch main</Badge>
                            </div>
                            <pre className="text-purple-200 leading-relaxed text-[11px]">
{`$ git remote add origin github.com/team/saas.git
$ git push -u origin main
[OK] Repository synchronisé
[OK] Pipeline CI/CD déclenché`}
                            </pre>
                        </div>
                    </div>
                </TabsContent>

                {/* Tab 4: Déploiement Équipe */}
                <TabsContent value="deployment" className="mt-0">
                    <div className="relative min-h-[300px] sm:min-h-[360px] bg-slate-950/90 rounded-xl border border-slate-800/80 p-6 flex flex-col justify-center items-center text-center space-y-4">
                        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                            <Cpu className="h-8 w-8" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-100 font-mono">
                            Déploiement Continu Multi-Environnement
                        </h4>
                        <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                            De la modélisation à la mise en production sur votre infrastructure (AWS, Vercel, Docker Hub, Kubernetes).
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 pt-2">
                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">Prod : Deployed (v2.5.0)</Badge>
                            <Badge className="bg-sky-500/20 text-sky-300 border-sky-500/30 text-xs">Staging : Active</Badge>
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">Équipe : 5 Développeurs</Badge>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default LandingInteractiveTabs;
