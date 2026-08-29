"use client";

import { useState } from "react";
import { useThreads, useDeleteThread } from "@liveblocks/react/suspense";
import { Composer, Thread } from "@liveblocks/react-ui";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    MessageSquare,
    Sparkles,
    Trash2,
    MessageCircle,
    Layers,
    Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type NodeCommentsModalProps = {
    selectedNode: {
        id: string;
        name: string;
        type?: string;
    } | null;
    onClose: () => void;
};

export function NodeCommentsModal({ selectedNode, onClose }: NodeCommentsModalProps) {
    const { threads } = useThreads();
    const deleteThread = useDeleteThread();
    const [filter, setFilter] = useState<"all" | "unresolved">("unresolved");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    if (!selectedNode) return null;

    // Filtrer les threads attachés à ce nœud spécifique
    const nodeThreads = threads.filter(
        (thread) => thread.metadata?.nodeId === selectedNode.id
    );

    const filteredThreads = nodeThreads.filter((thread) => {
        if (filter === "unresolved") return !thread.resolved;
        return true;
    });

    const unresolvedCount = nodeThreads.filter((t) => !t.resolved).length;

    const handleDeleteThread = (threadId: string) => {
        if (confirm("Supprimer cette discussion ?")) {
            setDeletingId(threadId);
            try {
                deleteThread(threadId);
            } finally {
                setDeletingId(null);
            }
        }
    };

    return (
        <Dialog open={Boolean(selectedNode)} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-card text-card-foreground">
                {/* En-tête de la modale */}
                <DialogHeader className="p-4 pb-3 border-b border-border/60 bg-muted/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                                <MessageSquare className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <DialogTitle className="text-sm font-bold truncate flex items-center gap-2">
                                    <span>Commentaires :</span>
                                    <span className="font-mono text-indigo-400">{selectedNode.name}</span>
                                </DialogTitle>
                                <DialogDescription className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5 mt-0.5">
                                    <Tag className="h-3 w-3" />
                                    ID : {selectedNode.id}
                                </DialogDescription>
                            </div>
                        </div>

                        {/* Onglets de filtrage */}
                        <div className="flex items-center bg-background rounded-lg p-0.5 border border-border text-[11px] shrink-0">
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
                                onClick={() => setFilter("all")}
                                className={`px-2 py-0.5 rounded-md transition-colors ${
                                    filter === "all"
                                        ? "bg-indigo-600 text-white font-medium shadow-xs"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Tous ({nodeThreads.length})
                            </button>
                        </div>
                    </div>
                </DialogHeader>

                {/* Saisie d'un nouveau commentaire attaché à ce nœud */}
                <div className="p-4 border-b border-border/40 bg-secondary/10">
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-indigo-400" />
                                Laisser une note sur cet élément
                            </span>
                            <span className="text-[10px] text-muted-foreground/80 font-mono">
                                Utilisez <strong className="text-indigo-400">@</strong> pour mentionner
                            </span>
                        </div>
                        <div className="lb-root rounded-xl overflow-hidden border border-border/80 bg-background shadow-xs">
                            <Composer
                                metadata={{
                                    nodeId: selectedNode.id,
                                    nodeName: selectedNode.name,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Liste des commentaires attachés à ce nœud */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[45vh]">
                    {filteredThreads.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-2 text-muted-foreground">
                            <div className="p-3 rounded-full bg-secondary/50 border border-border/60">
                                <MessageCircle className="h-5 w-5 text-muted-foreground/60" />
                            </div>
                            <p className="text-xs font-semibold text-foreground">
                                {filter === "unresolved"
                                    ? "Aucune discussion ouverte sur cet élément"
                                    : "Aucun commentaire pour cet élément"}
                            </p>
                            <p className="text-[11px] max-w-[260px]">
                                Écrivez un message ci-dessus pour démarrer une discussion spécifique à <strong className="text-foreground">{selectedNode.name}</strong>.
                            </p>
                        </div>
                    ) : (
                        filteredThreads.map((thread) => (
                            <div
                                key={thread.id}
                                className={`group relative rounded-xl border transition-all shadow-xs ${
                                    thread.resolved
                                        ? "opacity-70 bg-muted/20 border-border/40"
                                        : "bg-background/90 border-border hover:border-indigo-500/40"
                                }`}
                            >
                                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteThread(thread.id)}
                                        disabled={deletingId === thread.id}
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
            </DialogContent>
        </Dialog>
    );
}

export default NodeCommentsModal;
