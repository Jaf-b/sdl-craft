import {Liveblocks} from "@liveblocks/node";

export const liveblocks = new Liveblocks({
    secret: process.env.NEXT_LIVEBLOCKS_SECRET_API_KEY as string,
});