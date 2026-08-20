"use client"
import React from 'react'
import {Button} from "@/components/ui/button";

type HeaderProps = {
    title: string
    description: string
    buttonTitle: string
}

function Headers({title, description,buttonTitle}: HeaderProps) {

    return (
        <div className="flex items-center justify-between p-6 max-w-6xl m-auto">
            <div className="flex flex-col">
                <h1 className="text-xl font-semibold">{title}</h1>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <Button >{buttonTitle}</Button>
        </div>
    )
}

export default Headers
