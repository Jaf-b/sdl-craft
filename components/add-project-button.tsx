"use client";

import { AddProjectDialog } from "./add-project-dialog";

type AddProjectProps = {
    userId: string;
    email: string;
    trigger?: React.ReactNode;
};

export function AddProjectButton({ userId, email, trigger }: AddProjectProps) {
    return <AddProjectDialog userId={userId} email={email} trigger={trigger} />;
}

export default AddProjectButton;
