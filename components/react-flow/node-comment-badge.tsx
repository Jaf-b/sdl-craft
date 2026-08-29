"use client";

import { MessageSquare } from "lucide-react";

type NodeCommentBadgeProps = {
    nodeId: string;
    nodeLabel: string;
    commentCount?: number;
    unresolvedCount?: number;
    onOpenComments?: (nodeId: string, nodeLabel: string) => void;
};

export function NodeCommentBadge({
    nodeId,
    nodeLabel,
    commentCount = 0,
    unresolvedCount = 0,
    onOpenComments,
}: NodeCommentBadgeProps) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onOpenComments?.(nodeId, nodeLabel);
            }}
            className={`relative flex items-center justify-center rounded-md transition-all ${
                commentCount > 0
                    ? "h-6 px-1.5 gap-1 bg-indigo-600/25 text-indigo-300 border border-indigo-500/50 hover:bg-indigo-600/40 shadow-xs"
                    : "h-6 w-6 text-muted-foreground/60 hover:text-indigo-400 hover:bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
            }`}
            title={
                commentCount > 0
                    ? `${commentCount} discussion(s) attachée(s) à "${nodeLabel}"`
                    : `Ajouter un commentaire sur "${nodeLabel}"`
            }
        >
            <MessageSquare className="h-3 w-3" />
            {commentCount > 0 && (
                <span className="text-[10px] font-bold font-mono">
                    {commentCount}
                </span>
            )}
            {unresolvedCount > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-indigo-500 ring-1 ring-background animate-pulse" />
            )}
        </button>
    );
}

export default NodeCommentBadge;
