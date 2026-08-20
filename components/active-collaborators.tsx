import React from 'react'
import {useOthers} from "@liveblocks/react/suspense";
import {Avatar, AvatarBadge, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

function ActiveCollaborators() {

    const others = useOthers();
    const collaborators = others.map((other) => other.info);

    return (
        <div className="flex">
                {collaborators.map((collaborator, index) => (
                 <div  key={index} className="collaborator">
                     <Avatar>
                         <AvatarImage src={collaborator.avatar} alt="@shadcn" />
                         <AvatarFallback>{collaborator.name}</AvatarFallback>
                         <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                     </Avatar>
                 </div>

                ))}
        </div>
    )
}

export default ActiveCollaborators
