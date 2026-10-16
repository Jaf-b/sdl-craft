import { SignUp } from "@clerk/nextjs";
import { AnimatedBackground } from "@/components/landing/animated-background";
import { Layers, Boxes, Container, Kanban, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function SignUpPage() {
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
            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-3 py-1 text-xs">
              Rejoignez des milliers de développeurs
            </Badge>
            <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
              Créez votre espace<br />
              <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                de travail en équipe
              </span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Invitez vos collaborateurs, définissez des rôles, et travaillez ensemble sur l'architecture de vos projets en temps réel.
            </p>
          </div>

          {/* Feature steps */}
          <div className="space-y-4">
            {[
              { step: "01", label: "Concevez votre architecture", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
              { step: "02", label: "Invitez votre équipe & collaborez", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
              { step: "03", label: "Générez le code & déployez", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
            ].map(({ step, label, color }) => (
              <div key={step} className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold font-mono shrink-0 ${color}`}>
                  {step}
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
            <SignUp fallbackRedirectUrl="/project" forceRedirectUrl="/project" />
          </div>

          <p className="text-center text-xs text-slate-500">
            Déjà un compte ?{" "}
            <Link href="/sign-in" className="text-primary hover:underline font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
