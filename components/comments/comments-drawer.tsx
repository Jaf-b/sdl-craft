"use client";

import { useState } from "react";
import { useThreads, useDeleteThread } from "@liveblocks/react/suspense";
import { Composer, Thread } from "@liveblocks/react-ui";
import {
    MessageSquare,
    Sparkles,
    MessageCircle,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";

type CommentsDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function CommentsDrawer({ isOpen, onClose }: CommentsDrawerProps) {
    const { threads } = useThreads();
    const deleteThread = useDeleteThread();
    const [filter, setFilter] = useState<"all" | "unresolved" | "resolved">("unresolved");
    const [deletingThreadId, setDeletingThreadId] = useState<string | null>(null);

    const filteredThreads = threads.filter((thread) => {
        if (filter === "unresolved") return !thread.resolved;
        if (filter === "resolved") return thread.resolved;
        return true;
    });

    const unresolvedCount = threads.filter((t) => !t.resolved).length;
    const resolvedCount = threads.filter((t) => t.resolved).length;

    const handleDeleteThread = (threadId: string) => {
        if (confirm("Voulez-vous vraiment supprimer cette discussion et tous ses commentaires ?")) {
            setDeletingThreadId(threadId);
            try {
                deleteThread(threadId);
            } finally {
                setDeletingThreadId(null);
            }
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="w-80 sm:w-[420px] p-0 flex flex-col bg-card/95 backdrop-blur-xl border-l border-border shadow-2xl overflow-hidden">
                {/* En-tête du volet */}
                <SheetHeader className="px-4 py-3 border-b border-border/60 bg-muted/30 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                <MessageSquare className="h-4 w-4" />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <SheetTitle className="text-sm font-bold text-foreground">Discussions & Notes</SheetTitle>
                                {unresolvedCount > 0 && (
                                    <Badge variant="secondary" className="text-[10px] bg-indigo-500/15 text-indigo-400 border-indigo-500/20 px-1.5 py-0">
                                        {unresolvedCount}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Filtre d'affichage (Shadcn UI Buttons) */}
                        <div className="flex items-center bg-background rounded-lg p-0.5 border border-border mr-6">
                            <Button
                                variant={filter === "unresolved" ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setFilter("unresolved")}
                                className={`h-6 px-2 text-[11px] rounded-md ${
                                    filter === "unresolved" ? "bg-indigo-600 text-white font-medium hover:bg-indigo-600" : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Ouverts ({unresolvedCount})
                            </Button>
                            <Button
                                variant={filter === "resolved" ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setFilter("resolved")}
                                className={`h-6 px-2 text-[11px] rounded-md ${
                                    filter === "resolved" ? "bg-indigo-600 text-white font-medium hover:bg-indigo-600" : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Résolus ({resolvedCount})
                            </Button>
                            <Button
                                variant={filter === "all" ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setFilter("all")}
                                className={`h-6 px-2 text-[11px] rounded-md ${
                                    filter === "all" ? "bg-indigo-600 text-white font-medium hover:bg-indigo-600" : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Tous ({threads.length})
                            </Button>
                        </div>
                    </div>
                    <SheetDescription className="sr-only">
                        Discussions collaboratives et commentaires sur le projet.
                    </SheetDescription>
                </SheetHeader>

                {/* Liste des discussions (Threads) en haut */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {filteredThreads.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-2 text-muted-foreground">
                            <div className="p-3 rounded-full bg-secondary/50 border border-border/60">
                                <MessageCircle className="h-6 w-6 text-muted-foreground/60" />
                            </div>
                            <p className="text-xs font-semibold text-foreground">
                                {filter === "unresolved"
                                    ? "Aucune discussion ouverte"
                                    : filter === "resolved"
                                    ? "Aucune discussion résolue"
                                    : "Aucun commentaire pour le moment"}
                            </p>
                            <p className="text-[11px] max-w-[240px]">
                                {filter === "unresolved"
                                    ? "Toutes les discussions sont résolues !"
                                    : "Créez une nouvelle discussion ci-dessous pour partager vos remarques et mentionner vos collaborateurs."}
                            </p>
                        </div>
                    ) : (
                        filteredThreads.map((thread) => (
                            <div
                                key={thread.id}
                                id={`thread-${thread.id}`}
                                className={`group relative rounded-xl border transition-all shadow-xs ${
                                    thread.resolved
                                        ? "opacity-70 bg-muted/20 border-border/40"
                                        : "bg-background/90 border-border hover:border-indigo-500/40"
                                }`}
                            >
                                {/* Bouton de suppression rapide de la discussion entière */}
                                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteThread(thread.id)}
                                        disabled={deletingThreadId === thread.id}
                                        className="h-6 w-6 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        title="Supprimer la discussion"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>

                                <div className="lb-root">
                                    <Thread thread={thread} />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Zone de saisie d'un nouveau commentaire (Composer en bas) */}
                <div className="p-3 border-t border-border/40 bg-secondary/15 shrink-0 mt-auto">
                    <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-indigo-400" />
                                Nouveau sujet
                            </span>
                            <span className="text-[10px] text-muted-foreground/80 font-mono">
                                Tapez <strong className="text-indigo-400">@</strong> pour notifier quelqu'un
                            </span>
                        </span>
                        <div className="lb-root rounded-xl overflow-hidden border border-border/80 bg-background shadow-xs">
                            <Composer />
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default CommentsDrawer;
