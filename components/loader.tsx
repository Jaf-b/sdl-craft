import React from 'react'
import {Layers, Loader2} from "lucide-react";

function Loader() {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-background space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-xl shadow-indigo-500/20 animate-bounce">
                <Layers className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Connexion à l'espace collaboratif...</span>
            </div>
        </div>
    );
}

export default Loader
