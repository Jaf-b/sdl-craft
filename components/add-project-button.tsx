"use client"
import {Button} from "@/components/ui/button";
import {createProject} from "@/lib/actions/room.actions";
import {useRouter} from "next/navigation";

type AddProjectProps = {
    userId:string
    email:string
}

function AddProjectButton({userId,email}: AddProjectProps) {

    const router = useRouter();
    const AddProjectHandler = async ()=> {
        try {
            const room = await createProject({userId, email})
            if(room) router.push(`/project/${room.id}`)
        }catch (e) {
         console.error(e);
        }
    }

    return (
        <Button onClick={AddProjectHandler}>Créer un Projet</Button>
    )
}

export default AddProjectButton
