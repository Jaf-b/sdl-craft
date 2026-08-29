import { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { PendingDeletion } from "../types";

type DeleteConfirmModalProps = {
    pendingDeletion: PendingDeletion | null;
    onConfirm: () => void;
    onCancel: () => void;
};

export function DeleteConfirmModal({
    pendingDeletion,
    onConfirm,
    onCancel,
}: DeleteConfirmModalProps) {
    const description = useMemo(() => {
        if (!pendingDeletion) return "";
        if (pendingDeletion.kind === "node") {
            const edgeCount = pendingDeletion.connectedEdgeIds.length;
            const nodeTypeName =
                pendingDeletion.nodeType === "mcdEntity"
                    ? "l'entité"
                    : pendingDeletion.nodeType === "mcdAssociation"
                    ? "l'association"
                    : pendingDeletion.nodeType === "databaseTable"
                    ? "la table"
                    : "l'élément";

            return edgeCount === 0
                ? `Voulez-vous vraiment supprimer ${nodeTypeName} « ${pendingDeletion.name} » ?`
                : `Voulez-vous vraiment supprimer ${nodeTypeName} « ${pendingDeletion.name} » ainsi que ses ${edgeCount} liaison${edgeCount > 1 ? "s" : ""} associée${edgeCount > 1 ? "s" : ""} ?`;
        }
        if (pendingDeletion.kind === "edge") {
            return "Voulez-vous vraiment supprimer cette liaison ?";
        }
        if (pendingDeletion.kind === "flow") {
            const nodeCount = pendingDeletion.nodes.length;
            const edgeCount = pendingDeletion.edges.length;
            return `Voulez-vous vraiment supprimer ${nodeCount > 0 ? `${nodeCount} élément${nodeCount > 1 ? "s" : ""}` : ""}${nodeCount > 0 && edgeCount > 0 ? " et " : ""}${edgeCount > 0 ? `${edgeCount} liaison${edgeCount > 1 ? "s" : ""}` : ""} ?`;
        }
        return "";
    }, [pendingDeletion]);

    return (
        <Dialog open={pendingDeletion !== null} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="bg-card border-border text-card-foreground max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" /> Confirmer la suppression
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-xs pt-1">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" size="sm" onClick={onCancel}>
                        Annuler
                    </Button>
                    <Button variant="destructive" size="sm" onClick={onConfirm}>
                        Supprimer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
