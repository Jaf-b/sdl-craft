import React from 'react'
import Headers from "@/components/headers";
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import {ArrowUpRightIcon} from "lucide-react";
import {ProjectCard} from "@/components/project-card";
import AddProjectButton from "@/components/add-project-button";
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

async function Project () {

    const clerkUser = await currentUser()

    if(!clerkUser) redirect("/sign-in")

    const project=[]
    return (
        <div>
            <div className="flex items-center justify-between p-6 max-w-6xl m-auto">
                <div className="flex flex-col">
                    <h1 className="text-xl font-semibold">Liste de Projet</h1>
                    <p className="text-sm text-gray-500">Faites la conception de votre workflow pour un dévélopment rapide</p>
                </div>
                <AddProjectButton
                    userId={clerkUser.id}
                    email={clerkUser.emailAddresses[0].emailAddress}
                />
            </div>
            {project.length === 0 ? (
                <Empty className="mt-[20vh]">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <ArrowUpRightIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Projects Yet</EmptyTitle>
                        <EmptyDescription>
                            You haven&apos;t created any projects yet. Get started by creating
                            your first project.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <AddProjectButton
                            userId={clerkUser.id}
                            email={clerkUser.emailAddresses[0].emailAddress}
                        />
                    </EmptyContent>
                </Empty>
            ): (
                <div>
                    <ProjectCard/>
                </div>
            )}

        </div>
    )
}

export default Project
