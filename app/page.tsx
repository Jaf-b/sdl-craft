import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LandingInteractiveTabs } from "@/components/landing/landing-interactive-tabs";
import { AnimatedBackground } from "@/components/landing/animated-background";
import {
    Layers,
    Sparkles,
    Boxes,
    Database,
    Box,
    Users,
    MessageSquare,
    Code,
    Share2,
    ShieldCheck,
    Zap,
    ArrowRight,
    CheckCircle2,
    Lock,
    Globe,
    Cpu,
    GitBranch,
    FileCode,
    Container,
    Kanban,
    Rocket,
    Check,
} from "lucide-react";

export default async function Home() {
    const { userId } = await auth();

    if (userId) {
        redirect("/project");
    }

    return (
        <div className="min-h-screen flex flex-col text-foreground selection:bg-indigo-500/20 selection:text-indigo-400">
            {/* Header Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6 sm:px-10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                            <Layers className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-lg tracking-tight font-mono flex items-center gap-2">
                            SDL Craft
                            <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-1.5 py-0 font-mono">
                                Platform v2.5
                            </Badge>
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <a href="#pipeline" className="hover:text-foreground transition-colors">
                            Processus
                        </a>
                        <a href="#features" className="hover:text-foreground transition-colors">
                            Fonctionnalités
                        </a>
                        <a href="#devops" className="hover:text-foreground transition-colors">
                            Git &amp; Docker
                        </a>
                        <a href="#teams" className="hover:text-foreground transition-colors">
                            Équipes &amp; Tarifs
                        </a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <SignInButton forceRedirectUrl="/project">
                            <Button variant="ghost" size="sm" className="text-xs font-semibold">
                                Se connecter
                            </Button>
                        </SignInButton>
                        <SignUpButton forceRedirectUrl="/project">
                            <Button size="sm" className="text-xs font-semibold gap-1">
                                <span>Lancer l'application</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                        </SignUpButton>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-20 pb-16 px-6 sm:px-10 max-w-7xl mx-auto text-center flex flex-col items-center overflow-hidden">
                {/* Glow background effect */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

                <Badge variant="outline" className="mb-6 px-3 py-1 bg-indigo-500/10 text-indigo-400 border-indigo-500/30 rounded-full text-xs font-semibold flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Plateforme Globale de Création Logicielle pour Développeurs &amp; Équipes</span>
                </Badge>

                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.15]">
                    Transformez vos idées en{" "}
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        logiciels déployés
                    </span>
                </h1>

                <p className="mt-6 text-base sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
                    De l'architecture initiale (MCD, MLD, UML) au suivi du projet, jusqu'à la synchronisation Git et aux conteneurs Docker : la plateforme idéale pour créer et déployer vos logiciels en équipe.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                    <SignUpButton forceRedirectUrl="/project">
                        <Button size="lg" className="h-12 px-8 text-sm font-bold rounded-xl shadow-xl gap-2 cursor-pointer">
                            <span>Commencer gratuitement en équipe</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </SignUpButton>
                    <a href="#pipeline">
                        <Button variant="outline" size="lg" className="h-12 px-6 text-sm font-semibold rounded-xl border-border/80">
                            Découvrir le workflow
                        </Button>
                    </a>
                </div>

                {/* Démo interactive en 4 étapes */}
                <LandingInteractiveTabs />
            </section>

            {/* Pipeline du processus de création logicielle (4 piliers) */}
            <section id="pipeline" className="py-20 border-y border-border/50 bg-muted/20">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-12">
                    <div className="text-center space-y-3 max-w-2xl mx-auto">
                        <Badge variant="outline" className="text-xs uppercase font-mono tracking-wider bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1">
                            Workflow de A à Z
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight">Le processus complet de création logicielle</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-bold text-indigo-400">ÉTAPE 1</span>
                                <Boxes className="h-5 w-5 text-indigo-400" />
                            </div>
                            <h3 className="font-bold text-base">Architecture &amp; Modélisation</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Modélisez le MCD, le MLD relationnel et les 6 diagrammes UML (Classes, Séquence, Déploiement...).
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-bold text-amber-400">ÉTAPE 2</span>
                                <Kanban className="h-5 w-5 text-amber-400" />
                            </div>
                            <h3 className="font-bold text-base">Suivi de Projet &amp; Sprints</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Organisez le backlog, suivez l'avancement des tâches et échangez avec vos collaborateurs via les mentions `@user`.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-bold text-cyan-400">ÉTAPE 3</span>
                                <Container className="h-5 w-5 text-cyan-400" />
                            </div>
                            <h3 className="font-bold text-base">Git &amp; Docker Config</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Générez le code ORM (SQL, Prisma, Drizzle), synchronisez avec GitHub/GitLab et produisez les fichiers `Dockerfile`.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-card border border-border/60 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-bold text-emerald-400">ÉTAPE 4</span>
                                <Rocket className="h-5 w-5 text-emerald-400" />
                            </div>
                            <h3 className="font-bold text-base">Déploiement &amp; Équipe</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Déployez votre application sur le Cloud avec gestion fine des accès (Créateur, Éditeur, Lecteur).
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid Section */}
            <section id="features" className="py-24 px-6 sm:px-10 max-w-7xl mx-auto space-y-16">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <Badge variant="outline" className="text-xs uppercase font-mono tracking-wider bg-purple-500/10 text-purple-400 border-purple-500/20 px-3 py-1">
                        Fonctionnalités Clés
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                        Tout ce dont votre équipe a besoin pour réussir
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-card/60 border-border/60 backdrop-blur-md p-6 hover:border-indigo-500/40 transition-all duration-200 hover:shadow-xl">
                        <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
                            <Boxes className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg font-bold">Modélisation BD &amp; UML</CardTitle>
                        <CardDescription className="mt-2 text-xs leading-relaxed text-muted-foreground">
                            Entités MCD, tables MLD et diagrammes UML complets pour concevoir des architectures robustes et évolutives.
                        </CardDescription>
                    </Card>

                    <Card className="bg-card/60 border-border/60 backdrop-blur-md p-6 hover:border-purple-500/40 transition-all duration-200 hover:shadow-xl">
                        <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
                            <Users className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg font-bold">Espaces Équipes Temps Réel</CardTitle>
                        <CardDescription className="mt-2 text-xs leading-relaxed text-muted-foreground">
                            Multi-curseurs en direct, présence des collaborateurs et synchronisation instantanée via Liveblocks.
                        </CardDescription>
                    </Card>

                    <Card className="bg-card/60 border-border/60 backdrop-blur-md p-6 hover:border-teal-500/40 transition-all duration-200 hover:shadow-xl">
                        <div className="p-3 w-fit rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-4">
                            <Kanban className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg font-bold">Suivi de Projet &amp; Discussions</CardTitle>
                        <CardDescription className="mt-2 text-xs leading-relaxed text-muted-foreground">
                            Commentaires interactifs sur les éléments, notifications en direct et autocomplétion des mentions `@user`.
                        </CardDescription>
                    </Card>

                    <Card className="bg-card/60 border-border/60 backdrop-blur-md p-6 hover:border-cyan-500/40 transition-all duration-200 hover:shadow-xl">
                        <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
                            <Container className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg font-bold">Docker &amp; Repos Git</CardTitle>
                        <CardDescription className="mt-2 text-xs leading-relaxed text-muted-foreground">
                            Génération automatique de `Dockerfile`, `docker-compose.yml` et intégration avec vos dépôts GitHub/GitLab.
                        </CardDescription>
                    </Card>

                    <Card className="bg-card/60 border-border/60 backdrop-blur-md p-6 hover:border-amber-500/40 transition-all duration-200 hover:shadow-xl">
                        <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
                            <Code className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg font-bold">Génération ORM Instantanée</CardTitle>
                        <CardDescription className="mt-2 text-xs leading-relaxed text-muted-foreground">
                            Exportation en un clic vers SQL, schémas Prisma ORM et définitions TypeScript Drizzle ORM.
                        </CardDescription>
                    </Card>

                    <Card className="bg-card/60 border-border/60 backdrop-blur-md p-6 hover:border-pink-500/40 transition-all duration-200 hover:shadow-xl">
                        <div className="p-3 w-fit rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-4">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg font-bold">Gestion des Rôles &amp; Droits</CardTitle>
                        <CardDescription className="mt-2 text-xs leading-relaxed text-muted-foreground">
                            Gestion fine des autorisations (Créateur, Éditeur, Lecteur) et partage d'accès sécurisé par email.
                        </CardDescription>
                    </Card>
                </div>
            </section>

            {/* Section DevOps / Docker / Git */}
            <section id="devops" className="py-20 px-6 sm:px-10 border-t border-border/50 bg-muted/10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <Badge variant="outline" className="text-xs uppercase font-mono tracking-wider bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-3 py-1">
                            DevOps &amp; Infrastructure Ready
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            Générez vos conteneurs Docker et synchronisez avec vos Repos Git
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                            Passez directement du schéma d'architecture au déploiement des conteneurs sans configuration fastidieuse.
                        </p>
                        <div className="space-y-3 font-medium text-xs sm:text-sm">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                <span>Génération automatisée de `Dockerfile` et `docker-compose.yml`</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                <span>Synchronisation directe avec vos repos GitHub et GitLab</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                <span>Prêt pour les pipelines de déploiement continu (CI/CD)</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl font-mono text-xs text-slate-200 overflow-x-auto space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-slate-400">
                            <span className="text-[11px] font-bold uppercase text-cyan-400">docker-compose.yml</span>
                            <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">Généré par SDL Craft</Badge>
                        </div>
                        <pre className="text-cyan-300">
{`version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/app
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app
    ports:
      - "5432:5432"`}
                        </pre>
                    </div>
                </div>
            </section>

            {/* Section Offres & Tarifs Équipes */}
            <section id="teams" className="py-24 px-6 sm:px-10 max-w-7xl mx-auto space-y-16">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <Badge variant="outline" className="text-xs uppercase font-mono tracking-wider bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">
                        Formules &amp; Équipes
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                        Des options adaptées aux développeurs solos et aux équipes
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Choisissez l'offre qui convient à la taille de vos projets.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Offre Solo */}
                    <Card className="bg-card border-border/60 p-6 flex flex-col justify-between">
                        <div className="space-y-4">
                            <Badge variant="outline" className="w-fit">Développeur Solo</Badge>
                            <h3 className="text-2xl font-bold">Gratuit</h3>
                            <p className="text-xs text-muted-foreground">Idéal pour les projets personnels et la découverte de l'outil.</p>
                            <ul className="space-y-2.5 text-xs pt-4 border-t border-border">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-400" />
                                    <span>Modélisation MCD, MLD &amp; UML illimitée</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-400" />
                                    <span>Exportation des schémas SQL</span>
                                </li>
                                <li className="flex items-center gap-2 text-muted-foreground">
                                    <Check className="h-4 w-4 opacity-40" />
                                    <span>1 utilisateur par projet</span>
                                </li>
                            </ul>
                        </div>
                        <div className="pt-6">
                            <SignUpButton forceRedirectUrl="/project">
                                <Button variant="outline" className="w-full">Commencer Solo</Button>
                            </SignUpButton>
                        </div>
                    </Card>

                    {/* Offre Équipe (Populaire) */}
                    <Card className="bg-card border-2 border-indigo-500 p-6 flex flex-col justify-between relative shadow-2xl scale-[1.03]">
                        <div className="absolute -top-3 right-6">
                            <Badge className="bg-indigo-600 text-white font-bold text-[10px]">Populaire</Badge>
                        </div>
                        <div className="space-y-4">
                            <Badge variant="outline" className="w-fit border-indigo-500/40 text-indigo-400">Équipe &amp; Startups</Badge>
                            <h3 className="text-2xl font-bold">Collaboratif</h3>
                            <p className="text-xs text-muted-foreground">Pour concevoir, suivre et déployer vos logiciels en équipe.</p>
                            <ul className="space-y-2.5 text-xs pt-4 border-t border-border">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-indigo-400" />
                                    <span>Toutes les fonctionnalités Solo</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-indigo-400" />
                                    <span>Collaboration temps réel multi-curseurs</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-indigo-400" />
                                    <span>Mentions `@team` &amp; Notifications directes</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-indigo-400" />
                                    <span>Exports Prisma, Drizzle &amp; Config Docker</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-indigo-400" />
                                    <span>Gestion fine des rôles (Créateur, Éditeur, Lecteur)</span>
                                </li>
                            </ul>
                        </div>
                        <div className="pt-6">
                            <SignUpButton forceRedirectUrl="/project">
                                <Button className="w-full">Créer un espace Équipe</Button>
                            </SignUpButton>
                        </div>
                    </Card>

                    {/* Offre Entreprise */}
                    <Card className="bg-card border-border/60 p-6 flex flex-col justify-between">
                        <div className="space-y-4">
                            <Badge variant="outline" className="w-fit">Entreprise</Badge>
                            <h3 className="text-2xl font-bold">Sur Mesure</h3>
                            <p className="text-xs text-muted-foreground">Pour les organisations exigeant un hébergement sur mesure et une sécurité avancée.</p>
                            <ul className="space-y-2.5 text-xs pt-4 border-t border-border">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-400" />
                                    <span>Toutes les fonctionnalités Équipe</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-400" />
                                    <span>Sync Repos Git privés d'entreprise</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-400" />
                                    <span>Support dédié &amp; SLA 99.9%</span>
                                </li>
                            </ul>
                        </div>
                        <div className="pt-6">
                            <SignUpButton forceRedirectUrl="/project">
                                <Button variant="outline" className="w-full">Contact Entreprise</Button>
                            </SignUpButton>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 px-6 sm:px-10 max-w-5xl mx-auto text-center space-y-8 my-12 relative">
                <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/60 to-slate-950/60 border border-indigo-500/30 backdrop-blur-xl shadow-2xl space-y-6">
                    <Badge variant="outline" className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border-indigo-500/30 rounded-full text-xs font-semibold">
                        Transformez vos idées en logiciels
                    </Badge>
                    <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Lancez votre projet en équipe avec SDL Craft
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
                        Rejoignez les développeurs et équipes qui modélisent, gèrent et déploient leurs applications en temps réel.
                    </p>
                    <div className="pt-4 flex justify-center">
                        <SignUpButton forceRedirectUrl="/project">
                            <Button size="lg" className="h-12 px-8 text-sm font-bold rounded-xl shadow-xl gap-2 cursor-pointer">
                                <span>Démarrer maintenant</span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </SignUpButton>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/50 py-8 bg-muted/20 text-xs text-muted-foreground">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 font-mono font-bold text-foreground">
                        <Layers className="h-4 w-4 text-indigo-500" />
                        <span>SDL Craft Platform © 2026</span>
                    </div>
                    <div>
                        Architecture, Modélisation, Suivi de Projet, Repos Git, Docker &amp; Collaboration d'Équipe.
                    </div>
                </div>
            </footer>
        </div>
    );
}
