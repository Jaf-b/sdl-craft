"use client";

import { useState } from "react";
import { useThreads, useDeleteThread } from "@liveblocks/react/suspense";
import { Composer, Thread } from "@liveblocks/react-ui";
import {
    MessageSquare,
    X,
    Sparkles,
    MessageCircle,
    Trash2,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CommentsDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function CommentsDrawer({ isOpen, onClose }: CommentsDrawerProps) {
    const { threads } = useThreads();
    const deleteThread = useDeleteThread();
    const [filter, setFilter] = useState<"all" | "unresolved" | "resolved">("unresolved");
    const [deletingThreadId, setDeletingThreadId] = useState<string | null>(null);

    if (!isOpen) return null;

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
        <aside className="fixed top-16 right-4 bottom-4 z-40 w-80 sm:w-[420px] flex flex-col bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden transition-all animate-in fade-in slide-in-from-right-5 duration-200">
            {/* En-tête du volet */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/60 bg-muted/30">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-foreground">Discussions & Notes</span>
                        {unresolvedCount > 0 && (
                            <Badge variant="secondary" className="text-[10px] bg-indigo-500/15 text-indigo-400 border-indigo-500/20 px-1.5 py-0">
                                {unresolvedCount}
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {/* Filtre d'affichage */}
                    <div className="flex items-center bg-background rounded-lg p-0.5 border border-border text-[11px]">
                        <button
                            onClick={() => setFilter("unresolved")}
                            className={`px-2 py-0.5 rounded-md transition-colors ${
                                filter === "unresolved"
                                    ? "bg-indigo-600 text-white font-medium shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Ouverts ({unresolvedCount})
                        </button>
                        <button
                            onClick={() => setFilter("resolved")}
                            className={`px-2 py-0.5 rounded-md transition-colors ${
                                filter === "resolved"
                                    ? "bg-indigo-600 text-white font-medium shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Résolus ({resolvedCount})
                        </button>
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-2 py-0.5 rounded-md transition-colors ${
                                filter === "all"
                                    ? "bg-indigo-600 text-white font-medium shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Tous ({threads.length})
                        </button>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Zone de création de nouveau commentaire avec support des mentions @ */}
            <div className="p-3 border-b border-border/40 bg-secondary/15">
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

            {/* Liste des discussions (Threads) avec voir, répondre et supprimer */}
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
                                : "Créez une nouvelle discussion pour partager vos remarques et mentionner vos collaborateurs."}
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
        </aside>
    );
}

export default CommentsDrawer;
