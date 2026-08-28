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
        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: ["room:write"],
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

export const getProject = async ({ roomId, userId }: { roomId: string; userId: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId);
        return parseStringify(room);
    } catch (err) {
        console.error("Erreur lors de la récupération du projet :", err);
        return null;
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