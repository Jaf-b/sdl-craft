import { SignIn } from "@clerk/nextjs";
import { AnimatedBackground } from "@/components/landing/animated-background";
import { Layers, Boxes, Container, Kanban, Rocket, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex bg-[oklch(0.10_0.006_228.8)] text-foreground">
      <AnimatedBackground />

      {/* Panneau gauche — Branding (caché sur mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative z-10">
        <Link href="/" className="flex items-center gap-3 group w-fit">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md group-hover:scale-105 transition-transform">
            <Layers className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight font-mono text-white">
            SDL Craft
          </span>
        </Link>

        <div className="space-y-10">
          <div className="space-y-4">
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1 text-xs">
              Plateforme Créative pour Développeurs
            </Badge>
            <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
              De l'idée au<br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                logiciel déployé
              </span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Modélisez, collaborez, générez du code et déployez vos applications avec vos équipes en temps réel.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              { icon: Boxes, label: "Architecture MCD, MLD & UML", color: "text-indigo-400" },
              { icon: Kanban, label: "Suivi de projet collaboratif", color: "text-amber-400" },
              { icon: Container, label: "Génération Docker & Sync Git", color: "text-cyan-400" },
              { icon: Rocket, label: "Déploiement multi-environnements", color: "text-emerald-400" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm text-slate-300 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-600 font-mono">
          SDL Craft Platform © 2026 — Architecture, Git, Docker, Équipe.
        </p>
      </div>

      {/* Panneau droit — Formulaire Clerk */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Logo sur mobile */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Layers className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight font-mono text-white">SDL Craft</span>
          </div>

          {/* Glassmorphism card wrapping the Clerk component */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6">
            <SignIn fallbackRedirectUrl="/project" forceRedirectUrl="/project" />
          </div>

          <p className="text-center text-xs text-slate-500">
            Pas encore de compte ?{" "}
            <Link href="/sign-up" className="text-primary hover:underline font-semibold">
              Créer un compte gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
