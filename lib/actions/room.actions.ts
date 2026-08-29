"use server"

import { liveblocks } from "@/lib/liveblocks";
import { nanoid } from "nanoid";
import { RoomAccesses } from "@liveblocks/node";
import { revalidatePath } from "next/cache";
import { parseStringify } from "@/lib/utils";

type CreateProjectParams = {
    userId: string;
    email: string;
    title?: string;
};

export type UserRole = "creator" | "editor" | "viewer" | "none";

export const createProject = async ({ userId, email, title = "Sans titre" }: CreateProjectParams) => {
    const roomId = nanoid();

    try {
        const metadata = {
            creatorId: userId,
            email,
            title: title || "Nouveau Projet",
            createdAt: new Date().toISOString(),
        };
        const usersAccesses: RoomAccesses = {
            [email]: ["room:write"],
        };
        // defaultAccesses: [] verrouille la room aux seuls utilisateurs autorisés
        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: [],
        });
        revalidatePath("/project");
        return parseStringify(room);
    } catch (err) {
        console.error("Erreur lors de la création du projet :", err);
        return null;
    }
};

export const getProjects = async (email: string) => {
    try {
        const rooms = await liveblocks.getRooms({
            userId: email,
        });
        return parseStringify(rooms);
    } catch (err) {
        console.error("Erreur lors de la récupération des projets :", err);
        return { data: [] };
    }
};

export const getProject = async ({ roomId, userId }: { roomId: string; userId?: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId);
        return parseStringify(room);
    } catch (err) {
        console.error("Erreur lors de la récupération du projet :", err);
        return null;
    }
};

/**
 * Détermine le rôle d'un utilisateur pour une room donnée
 */
export const getProjectAccess = async ({ roomId, email, userId }: { roomId: string; email: string; userId?: string }): Promise<{ role: UserRole; room: any }> => {
    try {
        const room = await liveblocks.getRoom(roomId);
        if (!room) {
            return { role: "none", room: null };
        }

        const isCreator = room.metadata?.creatorId === userId || room.metadata?.email === email;
        if (isCreator) {
            return { role: "creator", room: parseStringify(room) };
        }

        const userAccess = room.usersAccesses?.[email];
        if (userAccess?.includes("room:write")) {
            return { role: "editor", room: parseStringify(room) };
        }
        if (userAccess?.includes("room:read")) {
            return { role: "viewer", room: parseStringify(room) };
        }

        // Vérifier les accès par défaut de la room
        if (room.defaultAccesses?.includes("room:write")) {
            return { role: "editor", room: parseStringify(room) };
        }
        if (room.defaultAccesses?.includes("room:read")) {
            return { role: "viewer", room: parseStringify(room) };
        }

        return { role: "none", room: parseStringify(room) };
    } catch (err) {
        console.error("Erreur lors de la vérification des accès :", err);
        return { role: "none", room: null };
    }
};

export const updateProjectTitle = async (roomId: string, title: string) => {
    try {
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title,
            },
        });
        revalidatePath("/project");
        revalidatePath(`/project/${roomId}`);
        return parseStringify(updatedRoom);
    } catch (err) {
        console.error("Erreur lors de la mise à jour du titre :", err);
        return null;
    }
};

/**
 * Met à jour ou ajoute un droit d'accès pour un utilisateur par email
 */
export const updateRoomUserAccess = async ({
    roomId,
    email,
    userType,
    updatedBy,
}: {
    roomId: string;
    email: string;
    userType: "editor" | "viewer";
    updatedBy: string;
}) => {
    try {
        const usersAccesses: RoomAccesses = {
            [email]: userType === "editor" ? ["room:write"] : ["room:read"],
        };

        const room = await liveblocks.updateRoom(roomId, {
            usersAccesses,
        });

        revalidatePath(`/project/${roomId}`);
        revalidatePath("/project");
        return parseStringify(room);
    } catch (err) {
        console.error("Erreur lors de la mise à jour des accès :", err);
        return null;
    }
};

/**
 * Révoque l'accès d'un utilisateur à une room
 */
export const removeRoomUserAccess = async ({
    roomId,
    email,
}: {
    roomId: string;
    email: string;
}) => {
    try {
        const room = await liveblocks.getRoom(roomId);
        if (!room) return null;

        // Si l'utilisateur est le créateur original, on ne supprime pas son accès
        if (room.metadata?.email === email) {
            throw new Error("Impossible de révoquer l'accès du propriétaire du projet.");
        }

        const usersAccesses: RoomAccesses = {
            [email]: null as any,
        };

        const updatedRoom = await liveblocks.updateRoom(roomId, {
            usersAccesses,
        });

        revalidatePath(`/project/${roomId}`);
        revalidatePath("/project");
        return parseStringify(updatedRoom);
    } catch (err) {
        console.error("Erreur lors de la suppression de l'accès :", err);
        return null;
    }
};

export const deleteProject = async (roomId: string) => {
    try {
        await liveblocks.deleteRoom(roomId);
        revalidatePath("/project");
        return { success: true };
    } catch (err) {
        console.error("Erreur lors de la suppression du projet :", err);
        return { success: false };
    }
};