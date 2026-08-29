"use client";

import { ReactNode } from "react";
import {
    LiveblocksProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from "@/components/loader";
import { getLiveblocksUsers, searchMentionUsers } from "@/lib/actions/user.actions";

export function Provider({ children }: { children: ReactNode }) {
    return (
        <LiveblocksProvider
            authEndpoint="/api/liveblocks-auth"
            resolveUsers={async ({ userIds }) => {
                const users = await getLiveblocksUsers({ userIds });
                return users;
            }}
            resolveMentionSuggestions={async ({ text, roomId }) => {
                const mentionUsers = await searchMentionUsers({ text, roomId });
                return mentionUsers;
            }}
        >
            <ClientSideSuspense fallback={<Loader />}>
                {children}
            </ClientSideSuspense>
        </LiveblocksProvider>
    );
}