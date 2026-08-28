"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Boxes,
    Calendar,
    ExternalLink,
    MoreVertical,
    Pencil,
    Trash2,
    Loader2,
} from "lucide-react";
import { deleteProject, updateProjectTitle } from "@/lib/actions/room.actions";

export type ProjectRoom = {
    id: string;
    createdAt: string;
    metadata?: {
        title?: string;
        email?: string;
        creatorId?: string;
        createdAt?: string;
    };
    usersAccesses?: Record<string, string[]>;
};

type ProjectCardProps = {
    room: ProjectRoom;
    currentEmail?: string;
};

export function ProjectCard({ room, currentEmail }: ProjectCardProps) {
    const router = useRouter();
    const title = room.metadata?.title || "Projet sans titre";
    const dateStr = room.metadata?.createdAt || room.createdAt;
    const formattedDate = dateStr
        ? new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
        : "Récemment";

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [isRenaming, setIsRenaming] = useState(false);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fermer le menu si on clique en dehors
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    const handleRename = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        setIsRenaming(true);
        try {
            await updateProjectTitle(room.id, newTitle.trim());
            setIsRenameOpen(false);
            router.refresh();
        } catch (err) {
            console.error(err);
        } finally {
            setIsRenaming(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteProject(room.id);
            setIsDeleteOpen(false);
            router.refresh();
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Card className="group relative flex flex-col justify-between overflow-hidden border border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:bg-card hover:shadow-xl hover:shadow-indigo-500/5">
                {/* Accent supérieur coloré */}
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60 group-hover:opacity-100 transition-opacity" />

                <div>
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 shrink-0 group-hover:scale-105 transition-transform">
                                    <Boxes className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex flex-col">
                                    <CardTitle className="text-sm font-bold font-mono truncate text-foreground group-hover:text-indigo-400 transition-colors">
                                        {title}
                                    </CardTitle>
                                    <span className="text-[10px] text-muted-foreground font-mono truncate">
                                        ID : {room.id}
                                    </span>
                                </div>
                            </div>

                            {/* Menu contextuel (custom, sans Radix) */}
                            <div ref={menuRef} className="relative shrink-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                    onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>

                                {menuOpen && (
                                    <div className="absolute right-0 top-8 z-50 w-40 rounded-lg border border-border bg-popover py-1 shadow-xl text-xs">
                                        <button
                                            className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-accent transition-colors"
                                            onClick={() => { setMenuOpen(false); setNewTitle(title); setIsRenameOpen(true); }}
                                        >
                                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                            Renommer
                                        </button>
                                        <div className="my-1 h-px bg-border" />
                                        <button
                                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-destructive hover:bg-destructive/10 transition-colors"
                                            onClick={() => { setMenuOpen(false); setIsDeleteOpen(true); }}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Supprimer
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="px-5 py-2 space-y-3">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            Espace de travail collaboratif pour modélisation de diagrammes MCD, MLD et UML.
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            <Badge variant="secondary" className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-normal">
                                MCD &amp; MLD
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 font-normal">
                                UML 2.5
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-normal gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Liveblocks
                            </Badge>
                        </div>
                    </CardContent>
                </div>

                <CardFooter className="p-5 pt-3 border-t border-border/40 flex items-center justify-between bg-muted/20">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                        <Calendar className="h-3 w-3" />
                        <span>{formattedDate}</span>
                    </div>
                    <Link href={`/project/${room.id}`}>
                        <Button size="sm" className="h-8 text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                            Ouvrir
                            <ExternalLink className="h-3 w-3" />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>

            {/* Modal renommage */}
            <Dialog open={isRenameOpen} onOpenChange={(open) => setIsRenameOpen(open)}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleRename}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Pencil className="h-4 w-4 text-indigo-500" />
                                Renommer le projet
                            </DialogTitle>
                            <DialogDescription>
                                Modifiez le titre affiché pour ce projet.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="font-mono"
                                autoFocus
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsRenameOpen(false)} disabled={isRenaming}>
                                Annuler
                            </Button>
                            <Button type="submit" size="sm" disabled={isRenaming || !newTitle.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                {isRenaming && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
                                Enregistrer
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal suppression */}
            <Dialog open={isDeleteOpen} onOpenChange={(open) => setIsDeleteOpen(open)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <Trash2 className="h-4 w-4" />
                            Supprimer le projet ?
                        </DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer définitivement{" "}
                            <strong className="text-foreground font-mono">"{title}"</strong> ? Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>
                            Annuler
                        </Button>
                        <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting} className="gap-1.5">
                            {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            Confirmer la suppression
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ProjectCard;
