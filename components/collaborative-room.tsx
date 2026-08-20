"use client"
import {
    RoomProvider,ClientSideSuspense
} from "@liveblocks/react/suspense";
import {FlowDiagram} from "@/components/react-flow";
import ActiveCollaborators from "@/components/active-collaborators";

function CollaborativeRoom({roomId}: {roomId: string}) {
    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<div>Loading…</div>}>
                <ActiveCollaborators/>
                <FlowDiagram />
            </ClientSideSuspense>
        </RoomProvider>
    )
}

export default CollaborativeRoom


