"use server";

import { clerkClient } from "@clerk/nextjs/server";
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
        const client = await clerkClient();
        const { data: users } = await client.users.getUserList({
            emailAddress: userIds,
            limit: 50,
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

        // Pour les emails qui n'ont pas encore de compte Clerk, renvoyer un fallback
        return userIds.map((userId) => {
            const found = formattedUsers.find((u) => u.id === userId || u.email === userId);
            if (found) return found;

            return {
                id: userId,
                name: userId.split("@")[0] || userId,
                email: userId,
                avatar: "",
                color: getUserColor(userId),
            };
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        return userIds.map((userId) => ({
            id: userId,
            name: userId.split("@")[0] || userId,
            email: userId,
            avatar: "",
            color: getUserColor(userId),
        }));
    }
}

/**
 * Recherche des utilisateurs pour l'autocomplétion des mentions (@user)
 */
export async function searchMentionUsers({ text, roomId }: { text?: string; roomId?: string }): Promise<string[]> {
    try {
        const client = await clerkClient();
        const { data: users } = await client.users.getUserList({
            query: text || "",
            limit: 10,
        });

        return users
            .map((user) => user.emailAddresses[0]?.emailAddress)
            .filter((email): email is string => Boolean(email));
    } catch (error) {
        console.error("Erreur recherche mentions :", error);
        return [];
    }
}
