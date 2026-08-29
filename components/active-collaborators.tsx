"use client";

import React from "react";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

export function ActiveCollaborators() {
    const others = useOthers();
    const self = useSelf();

    const collaborators = others.map((other) => other.info).filter(Boolean);

    return (
        <div className="flex items-center gap-2">
            {/* Compteur et icône */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md border border-border/50">
                <Users className="h-3.5 w-3.5 text-indigo-400" />
                <span className="font-semibold text-foreground">{collaborators.length + 1}</span>
                <span className="hidden md:inline text-[10px]">en ligne</span>
            </div>

            {/* Pile d'avatars */}
            <div className="flex items-center -space-x-2 overflow-hidden py-0.5">
                {/* Utilisateur courant (Self) */}
                {self?.info && (
                    <div
                        className="relative group"
                        title={`${self.info.name || "Vous"} (Vous)`}
                    >
                        <Avatar
                            size="sm"
                            className="ring-2 ring-background ring-offset-1 transition-transform group-hover:scale-110 group-hover:z-10"
                            style={{ borderColor: self.info.color || "#6366f1" }}
                        >
                            <AvatarImage src={self.info.avatar} alt={self.info.name} />
                            <AvatarFallback className="text-[10px] font-bold bg-indigo-600 text-white">
                                {self.info.name?.slice(0, 2).toUpperCase() || "MO"}
                            </AvatarFallback>
                            <AvatarBadge className="bg-emerald-500 ring-1 ring-background" />
                        </Avatar>
                    </div>
                )}

                {/* Autres collaborateurs */}
                {collaborators.map((collaborator, index) => {
                    const initials = collaborator.name
                        ? collaborator.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()
                        : "??";

                    return (
                        <div
                            key={collaborator.id || index}
                            className="relative group"
                            title={`${collaborator.name} (${collaborator.email || "Collaborateur"})`}
                        >
                            <Avatar
                                size="sm"
                                className="ring-2 ring-background ring-offset-1 transition-transform group-hover:scale-110 group-hover:z-10"
                                style={{ borderColor: collaborator.color || "#10b981" }}
                            >
                                <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                                <AvatarFallback
                                    className="text-[10px] font-bold text-white"
                                    style={{ backgroundColor: collaborator.color || "#4f46e5" }}
                                >
                                    {initials}
                                </AvatarFallback>
                                <AvatarBadge className="bg-emerald-500 ring-1 ring-background" />
                            </Avatar>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ActiveCollaborators;
