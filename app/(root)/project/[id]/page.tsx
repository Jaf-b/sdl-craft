import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import CollaborativeRoom from "@/components/collaborative-room";
import { getProjectAccess } from "@/lib/actions/room.actions";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

type PageProps = {
    params: Promise<{ id: string }>;
};

async function ProjectCanvasPage({ params }: PageProps) {
    const clerkUser = await currentUser();

    if (!clerkUser) {
        redirect("/sign-in");
    }

    const { id: roomId } = await params;
    const email = clerkUser.emailAddresses[0]?.emailAddress || "";

    // Vérification des droits d'accès au projet côté serveur
    const { role, room } = await getProjectAccess({
        roomId,
        email,
        userId: clerkUser.id,
    });

    // Si l'utilisateur n'a aucun accès (room privée et utilisateur non invité)
    if (role === "none" || !room) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md w-full p-8 rounded-2xl bg-card border border-border shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-inner">
                        <Lock className="h-8 w-8" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-xl font-bold text-foreground font-mono flex items-center justify-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-destructive" />
                            Accès Refusé
                        </h1>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Vous n'avez pas les autorisations nécessaires pour accéder à cet espace de modélisation. Demandez au propriétaire du projet de vous inviter par email.
                        </p>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] font-mono text-muted-foreground">
                        ID de la salle : <span className="text-foreground">{roomId}</span>
                    </div>

                    <div className="pt-2">
                        <Link href="/project">
                            <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                                <ArrowLeft className="h-4 w-4" />
                                Retour à mes projets
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const projectTitle = room.metadata?.title || "Projet sans titre";
    const creatorEmail = room.metadata?.email;
    const usersAccesses = room.usersAccesses || {};

    return (
        <CollaborativeRoom
            roomId={roomId}
            projectTitle={projectTitle}
            currentUserRole={role}
            creatorEmail={creatorEmail}
            usersAccesses={usersAccesses}
        />
    );
}

export default ProjectCanvasPage;
