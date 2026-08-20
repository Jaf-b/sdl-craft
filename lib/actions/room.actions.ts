"use server"

import {liveblocks} from "@/lib/liveblocks";
import {nanoid} from "nanoid";
import {RoomAccesses} from "@liveblocks/node";
import {revalidatePath} from "next/cache";
import {parseStringify} from "@/lib/utils";

type CreateProjectParams = {
    userId: string;
    email: string;
}

export const createProject  = async ({userId,email}:CreateProjectParams) => {
    const roomId = nanoid()

    try{
        const metadata = {
            creatorId: userId,
            email,
            title:"Untitled",
        }
        const usersAccesses:RoomAccesses ={
            [email]:['room:write']
        }
        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses:['room:write']
        });
        revalidatePath("/project")
        return parseStringify(room);
    }catch(err){
        console.log(err)
    }
}