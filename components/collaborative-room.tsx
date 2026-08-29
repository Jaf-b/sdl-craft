"use client";

import { useState } from "react";
import Link from "next/link";
import { RoomProvider, ClientSideSuspense, useThreads } from "@liveblocks/react/suspense";
import { FlowDiagram } from "@/components/react-flow";
import ActiveCollaborators from "@/components/active-collaborators";
import { ShareProjectDialog } from "@/components/share-project-dialog";
import { CommentsDrawer } from "@/components/comments/comments-drawer";
import { InboxNotifications } from "@/components/inbox-notifications";
import { ArrowLeft, MessageSquare, Shield, Crown, Edit3, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserButton } from "@clerk/nextjs";
import Loader from "@/components/loader";
import { UserRole } from "@/lib/actions/room.actions";

type RoomHeaderProps = {
    roomId: string;
    projectTitle?: string;
    currentUserRole: UserRole;
    creatorEmail?: string;
    usersAccesses?: Record<string, string[]>;
    isCommentsOpen: boolean;
    onToggleComments: () => void;
};

function RoomHeader({
    roomId,
    projectTitle,
    currentUserRole,
    creatorEmail,
    usersAccesses,
    isCommentsOpen,
    onToggleComments,
}: RoomHeaderProps) {
    const { threads } = useThreads();
    const unresolvedThreads = threads.filter((t) => !t.resolved);

    return (
        <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            {/* Côté Gauche : Retour aux projets + Titre du projet + Rôle */}
            <div className="flex items-center gap-2.5 bg-background/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-border shadow-xl pointer-events-auto">
                <Link href="/project">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs font-semibold h-8 -ml-1 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Projets</span>
                    </Button>
                </Link>

                <div className="h-4 w-[1px] bg-border" />

                <div className="flex items-center gap-2 min-w-0 max-w-[200px] sm:max-w-[320px]">
                    <span className="text-xs font-bold font-mono truncate text-foreground">
                        {projectTitle || "Projet"}
                    </span>
                    {currentUserRole === "creator" && (
                        <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/30 gap-1 shrink-0 font-mono">
                            <Crown className="h-3 w-3" />
                            Propriétaire
                        </Badge>
                    )}
                    {currentUserRole === "editor" && (
                        <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/30 gap-1 shrink-0 font-mono">
                            <Edit3 className="h-3 w-3" />
                            Éditeur
                        </Badge>
                    )}
                    {currentUserRole === "viewer" && (
                        <Badge variant="outline" className="text-[10px] bg-sky-500/10 text-sky-400 border-sky-500/30 gap-1 shrink-0 font-mono">
                            <Eye className="h-3 w-3" />
                            Lecteur
                        </Badge>
                    )}
                </div>
            </div>

            {/* Côté Droit : Collaborateurs actifs + Commentaires + Partage + Profil */}
            <div className="flex items-center gap-2 bg-background/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border shadow-xl pointer-events-auto">
                {/* Avatars des personnes connectées */}
                <ActiveCollaborators />

                <div className="h-4 w-[1px] bg-border" />

                {/* Bouton Commentaires avec badge */}
                <Button
                    variant={isCommentsOpen ? "secondary" : "ghost"}
                    size="sm"
                    onClick={onToggleComments}
                    className={`h-8 gap-1.5 text-xs font-semibold relative ${
                        isCommentsOpen ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Commentaires</span>
                    {unresolvedThreads.length > 0 && (
                        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-xs">
                            {unresolvedThreads.length}
                        </span>
                    )}
                </Button>

                {/* Modale de partage (accessible si créateur ou éditeur) */}
                <ShareProjectDialog
                    roomId={roomId}
                    currentUserRole={currentUserRole}
                    creatorEmail={creatorEmail}
                    usersAccesses={usersAccesses}
                />

                {/* Notifications Liveblocks */}
                <InboxNotifications />

                <div className="h-4 w-[1px] bg-border" />

                {/* Avatar Clerk */}
                <div className="p-0.5 rounded-full ring-1 ring-border">
                    <UserButton />
                </div>
            </div>
        </header>
    );
}

function RoomContent({
    roomId,
    projectTitle,
    currentUserRole,
    creatorEmail,
    usersAccesses,
}: {
    roomId: string;
    projectTitle?: string;
    currentUserRole: UserRole;
    creatorEmail?: string;
    usersAccesses?: Record<string, string[]>;
}) {
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <RoomHeader
                roomId={roomId}
                projectTitle={projectTitle}
                currentUserRole={currentUserRole}
                creatorEmail={creatorEmail}
                usersAccesses={usersAccesses}
                isCommentsOpen={isCommentsOpen}
                onToggleComments={() => setIsCommentsOpen((prev) => !prev)}
            />

            {/* Canvas React Flow avec restriction en mode lecture seule si viewer */}
            <FlowDiagram
                isReadOnly={currentUserRole === "viewer"}
                onOpenCommentsSidebar={() => setIsCommentsOpen(true)}
            />

            {/* Volet de commentaires collaboratifs */}
            <CommentsDrawer
                isOpen={isCommentsOpen}
                onClose={() => setIsCommentsOpen(false)}
            />
        </div>
    );
}

type CollaborativeRoomProps = {
    roomId: string;
    projectTitle?: string;
    currentUserRole?: UserRole;
    creatorEmail?: string;
    usersAccesses?: Record<string, string[]>;
};

export function CollaborativeRoom({
    roomId,
    projectTitle = "Projet de Modélisation",
    currentUserRole = "editor",
    creatorEmail,
    usersAccesses = {},
}: CollaborativeRoomProps) {
    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<Loader />}>
                <RoomContent
                    roomId={roomId}
                    projectTitle={projectTitle}
                    currentUserRole={currentUserRole}
                    creatorEmail={creatorEmail}
                    usersAccesses={usersAccesses}
                />
            </ClientSideSuspense>
        </RoomProvider>
    );
}

export default CollaborativeRoom;
