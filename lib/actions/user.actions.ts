"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { liveblocks } from "@/lib/liveblocks";
import { getUserColor, parseStringify } from "@/lib/utils";

export type LiveblocksUser = {
    id: string;
    name: string;
    email: string;
    avatar: string;
    color: string;
};

/**
 * Récupère les informations des utilisateurs à partir de leurs adresses email ou IDs
 */
export async function getLiveblocksUsers({ userIds }: { userIds: string[] }): Promise<LiveblocksUser[]> {
    try {
        if (!userIds || userIds.length === 0) return [];

        const client = await clerkClient();
        const { data: users } = await client.users.getUserList({
            limit: 100,
        });

        const formattedUsers: LiveblocksUser[] = users.map((user) => {
            const email = user.emailAddresses[0]?.emailAddress || user.id;
            const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || email;
            return {
                id: email,
                name,
                email,
                avatar: user.imageUrl || "",
                color: getUserColor(user.id),
            };
        });

        // Pour chaque userId demandé, renvoyer l'utilisateur correspondant ou un fallback
        return userIds.map((userId) => {
            const found = formattedUsers.find(
                (u) => u.id.toLowerCase() === userId.toLowerCase() || u.email.toLowerCase() === userId.toLowerCase()
            );
            if (found) return found;

            const name = userId.includes("@") ? userId.split("@")[0] : userId;
            return {
                id: userId,
                name,
                email: userId,
                avatar: "",
                color: getUserColor(userId),
            };
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        return userIds.map((userId) => ({
            id: userId,
            name: userId.includes("@") ? userId.split("@")[0] : userId,
            email: userId,
            avatar: "",
            color: getUserColor(userId),
        }));
    }
}

/**
 * Recherche des utilisateurs pour l'autocomplétion des mentions (@user)
 * Renvoie une liste complète des utilisateurs du projet + tous les membres du site
 */
export async function searchMentionUsers({ text, roomId }: { text?: string; roomId?: string }): Promise<string[]> {
    try {
        const client = await clerkClient();

        // 1. Récupérer la liste globale des utilisateurs sur Clerk
        const { data: clerkUsers } = await client.users.getUserList({ limit: 100 });
        const allClerkEmails = clerkUsers
            .map((u) => u.emailAddresses[0]?.emailAddress)
            .filter((email): email is string => Boolean(email));

        let projectUserEmails: string[] = [];

        // 2. Si roomId est transmise, récupérer en priorité les membres affectés au projet
        if (roomId) {
            try {
                const room = await liveblocks.getRoom(roomId);
                if (room) {
                    const emailsSet = new Set<string>();

                    if (room.metadata?.email) {
                        emailsSet.add(room.metadata.email as string);
                    }

                    if (room.usersAccesses) {
                        Object.keys(room.usersAccesses).forEach((email) => {
                            if (email) emailsSet.add(email);
                        });
                    }

                    projectUserEmails = Array.from(emailsSet);
                }
            } catch (err) {
                console.error("Erreur lors de la récupération des accès de la room pour les mentions :", err);
            }
        }

        // Combiner : Membres du projet en premier, puis les autres membres
        const orderedEmails = Array.from(new Set([...projectUserEmails, ...allClerkEmails]));

        // 3. Filtrer selon la saisie utilisateur (query)
        const query = (text || "").trim().toLowerCase();
        if (!query) {
            return orderedEmails;
        }

        return orderedEmails.filter((email) => email.toLowerCase().includes(query));
    } catch (error) {
        console.error("Erreur recherche mentions :", error);
        return [];
    }
}
