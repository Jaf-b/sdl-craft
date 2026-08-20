"use client"
import React from 'react'
import CollaborativeRoom from "@/components/collaborative-room";
import {SearchParams} from "next/dist/server/request/search-params";
import {useParams} from "next/navigation";
import ActiveCollaborators from "@/components/active-collaborators";

function Page() {
    const params = useParams();
    return (
        <div>
            <CollaborativeRoom roomId={params.id as string}/>
        </div>
    )
}

export default Page
