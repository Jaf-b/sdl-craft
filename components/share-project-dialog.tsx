"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Share2,
    UserPlus,
    Copy,
    Check,
    Trash2,
    Shield,
    Eye,
    Edit3,
    Crown,
    Loader2,
} from "lucide-react";
import {
    updateRoomUserAccess,
    removeRoomUserAccess,
    UserRole,
} from "@/lib/actions/room.actions";

type ShareProjectDialogProps = {
    roomId: string;
    currentUserRole: UserRole;
    creatorEmail?: string;
    usersAccesses?: Record<string, string[]>;
    trigger?: React.ReactNode;
};

export function ShareProjectDialog({
    roomId,
    currentUserRole,
    creatorEmail,
    usersAccesses = {},
    trigger,
}: ShareProjectDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [userType, setUserType] = useState<"editor" | "viewer">("editor");
    const [isPending, startTransition] = useTransition();
    const [copied, setCopied] = useState(false);
    const [actionLoadingEmail, setActionLoadingEmail] = useState<string | null>(null);
    const router = useRouter();

    const canManageAccess = currentUserRole === "creator" || currentUserRole === "editor";

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        const targetEmail = email.trim().toLowerCase();
        if (!targetEmail) return;

        startTransition(async () => {
            await updateRoomUserAccess({
                roomId,
                email: targetEmail,
                userType,
                updatedBy: creatorEmail || "",
            });
            setEmail("");
            router.refresh();
        });
    };

    const handleRoleChange = async (targetEmail: string, newType: "editor" | "viewer") => {
        setActionLoadingEmail(targetEmail);
        try {
            await updateRoomUserAccess({
                roomId,
                email: targetEmail,
                userType: newType,
                updatedBy: creatorEmail || "",
            });
            router.refresh();
        } finally {
            setActionLoadingEmail(null);
        }
    };

    const handleRemove = async (targetEmail: string) => {
        setActionLoadingEmail(targetEmail);
        try {
            await removeRoomUserAccess({
                roomId,
                email: targetEmail,
            });
            router.refresh();
        } finally {
            setActionLoadingEmail(null);
        }
    };

    const handleCopyLink = () => {
        const url = `${window.location.origin}/project/${roomId}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Obtenir la liste consolidée des collaborateurs
    const collaboratorsList = Object.entries(usersAccesses || {})
        .filter(([userEmail]) => userEmail && userEmail !== creatorEmail)
        .map(([userEmail, accesses]) => ({
            email: userEmail,
            role: accesses.includes("room:write") ? "editor" : "viewer",
        }));

    return (
        <>
            <span onClick={() => setIsOpen(true)} className="contents">
                {trigger || (
                    <Button
                        size="sm"
                        className="h-8 gap-1.5 text-xs font-semibold"
                    >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Partager</span>
                    </Button>
                )}
            </span>

            <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-bold">
                            <Share2 className="h-4 w-4 text-indigo-500" />
                            Partager ce projet
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Invitez des membres de votre équipe et définissez leurs autorisations d'édition ou de lecture.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-3">
                        {/* Formulaire d'invitation */}
                        {canManageAccess ? (
                            <form onSubmit={handleInvite} className="space-y-3 p-3 bg-secondary/30 rounded-xl border border-border/60">
                                <Label className="text-xs font-semibold flex items-center gap-1.5">
                                    <UserPlus className="h-3.5 w-3.5 text-indigo-400" />
                                    Inviter un nouveau collaborateur
                                </Label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Input
                                        type="email"
                                        placeholder="adresse.email@exemple.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-9 text-xs font-mono bg-background flex-1"
                                        required
                                    />
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Select
                                            value={userType}
                                            onValueChange={(val) => setUserType(val as "editor" | "viewer")}
                                        >
                                            <SelectTrigger className="h-9 w-[160px] text-xs font-mono bg-background">
                                                <SelectValue placeholder="Rôle" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="editor">Éditeur (Modifie)</SelectItem>
                                                <SelectItem value="viewer">Lecteur (Vue seule)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={isPending || !email.trim()}
                                            className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shrink-0"
                                        >
                                            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Inviter"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="p-3 bg-muted/40 rounded-xl border border-border text-xs text-muted-foreground">
                                Vous êtes en mode lecture seule. Seuls les éditeurs ou le propriétaire peuvent inviter de nouveaux membres.
                            </div>
                        )}

                        {/* Liste des personnes ayant accès */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Personnes ayant accès
                            </span>

                            <div className="divide-y divide-border/40 rounded-xl border border-border/60 bg-card/40 overflow-hidden max-h-56 overflow-y-auto">
                                {/* Propriétaire du projet */}
                                {creatorEmail && (
                                    <div className="flex items-center justify-between p-3 text-xs">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                                                <Crown className="h-3.5 w-3.5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-mono truncate font-medium text-foreground">{creatorEmail}</p>
                                                <p className="text-[10px] text-muted-foreground">Créateur & Propriétaire</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/20 font-mono">
                                            Propriétaire
                                        </Badge>
                                    </div>
                                )}

                                {/* Autres collaborateurs invités */}
                                {collaboratorsList.map((collab) => {
                                    const isRowLoading = actionLoadingEmail === collab.email;

                                    return (
                                        <div key={collab.email} className="flex items-center justify-between p-3 text-xs hover:bg-muted/30 transition-colors">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                                                    {collab.role === "editor" ? <Edit3 className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-mono truncate font-medium text-foreground">{collab.email}</p>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {collab.role === "editor" ? "Peut modifier et concevoir" : "Peut visualiser et commenter"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                {canManageAccess ? (
                                                    <>
                                                        <Select
                                                            disabled={isRowLoading}
                                                            value={collab.role}
                                                            onValueChange={(val) => handleRoleChange(collab.email, val as "editor" | "viewer")}
                                                        >
                                                            <SelectTrigger className="h-7 w-[100px] text-[11px] font-mono bg-background">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="editor">Éditeur</SelectItem>
                                                                <SelectItem value="viewer">Lecteur</SelectItem>
                                                            </SelectContent>
                                                        </Select>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={isRowLoading}
                                                            onClick={() => handleRemove(collab.email)}
                                                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                            title="Révoquer l'accès"
                                                        >
                                                            {isRowLoading ? (
                                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            )}
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Badge variant="secondary" className="text-[10px] font-mono">
                                                        {collab.role === "editor" ? "Éditeur" : "Lecteur"}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {collaboratorsList.length === 0 && !creatorEmail && (
                                    <div className="p-4 text-center text-xs text-muted-foreground">
                                        Aucun collaborateur invité pour le moment.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Copier le lien du projet */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/50 text-xs">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-indigo-400" />
                                <span className="text-muted-foreground">Lien direct d'accès à la room</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopyLink}
                                className="h-7 text-xs gap-1.5 font-mono"
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-3 w-3 text-emerald-400" />
                                        <span>Copié !</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3 w-3" />
                                        <span>Copier le lien</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ShareProjectDialog;
