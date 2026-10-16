"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { createProject } from "@/lib/actions/room.actions";

type AddProjectDialogProps = {
    userId: string;
    email: string;
    trigger?: React.ReactNode;
};

export function AddProjectDialog({ userId, email, trigger }: AddProjectDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const projectTitle = title.trim() || "Nouveau Projet";
            const room = await createProject({ userId, email, title: projectTitle });
            if (room) {
                setIsOpen(false);
                setTitle("");
                router.push(`/project/${room.id}`);
            }
        } catch (error) {
            console.error("Erreur création projet :", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Bouton déclencheur */}
            <span onClick={() => setIsOpen(true)} className="contents">
                {trigger || (
                    <Button className="gap-2 font-semibold">
                        <Plus className="h-4 w-4" />
                        Nouveau Projet
                    </Button>
                )}
            </span>

            {/* Modale */}
            <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-indigo-500" />
                                Créer un nouveau projet
                            </DialogTitle>
                            <DialogDescription>
                                Donnez un nom à votre projet de modélisation (MCD, MLD, UML). Vous pourrez inviter des collaborateurs en temps réel.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-3 py-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="project-title">Nom du projet</Label>
                                <Input
                                    id="project-title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="ex: Plateforme E-Commerce, API Banque..."
                                    className="font-mono"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                                disabled={isLoading}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isLoading}
                                className="gap-2 font-semibold"
                            >
                                {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                {isLoading ? "Création..." : "Créer le projet"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AddProjectDialog;
