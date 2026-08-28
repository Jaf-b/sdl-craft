"use client";

import Link from "next/link";
import { RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { FlowDiagram } from "@/components/react-flow";
import ActiveCollaborators from "@/components/active-collaborators";
import { ArrowLeft, Layers, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

function RoomHeader({ roomId }: { roomId: string }) {
    return (
        <header className="absolute top-4 right-4 z-20 flex items-center gap-3 bg-background/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border shadow-2xl">
            <Link href="/project">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs font-semibold h-8 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Projets</span>
                </Button>
            </Link>

            <div className="h-4 w-[1px] bg-border" />

            {/* Collaborateurs actifs */}
            <ActiveCollaborators />

            <div className="h-4 w-[1px] bg-border" />

            {/* Avatar Clerk */}
            <div className="p-0.5 rounded-full ring-1 ring-border">
                <UserButton />
            </div>
        </header>
    );
}

function LoadingRoom() {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-background space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20 animate-bounce">
                <Layers className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Connexion à l'espace collaboratif...</span>
            </div>
        </div>
    );
}

export function CollaborativeRoom({ roomId }: { roomId: string }) {
    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<LoadingRoom />}>
                <div className="relative w-full h-screen overflow-hidden">
                    <RoomHeader roomId={roomId} />
                    <FlowDiagram />
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    );
}

export default CollaborativeRoom;
