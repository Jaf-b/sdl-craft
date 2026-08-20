import { Liveblocks } from "@liveblocks/node";
import {liveblocks} from "@/lib/liveblocks";
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {getUserColor} from "@/lib/utils";



export async function POST(request: Request) {

    const ClerkUser = await currentUser()

    if(!ClerkUser) redirect("/sign-in")
    // Get the current user from your database

    const {id,emailAddresses,imageUrl,firstName,lastName} = ClerkUser
    const user = {
        id,
        info:{
            id,
            name: `${firstName} ${lastName}`,
            email: emailAddresses[0].emailAddress,
            avatar: imageUrl,
            color:getUserColor(id)
        }
    }

    // Identify the user and return the result
    const { status, body } = await liveblocks.identifyUser(
        {
            userId: user.info.email,
            groupIds:[]
        },
        { userInfo: user.info },
    );

    return new Response(body, { status });
}