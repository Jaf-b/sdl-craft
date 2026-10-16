"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Layers, Sparkles, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InboxNotifications } from "./inbox-notifications";

export function Navbar() {
    const { user } = useUser();

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
                {/* Logo & Marque */}
                <div className="flex items-center gap-6">
                    <Link href="/project" className="flex items-center gap-2.5 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-md group-hover:scale-105 transition-transform">
                            <Layers className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-base tracking-tight font-mono text-foreground flex items-center gap-1.5">
                                SDL Craft
                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                                    v2.5
                                </span>
                            </span>
                            <span className="text-[10px] text-muted-foreground hidden sm:inline">
                                Modélisation MCD · MLD · UML
                            </span>
                        </div>
                    </Link>

                    {/* Navigation links */}
                    <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
                        <Link href="/project">
                            <Button variant="ghost" size="sm" className="gap-2 text-foreground font-semibold">
                                <FolderGit2 className="h-4 w-4 text-primary" />
                                Mes Projets
                            </Button>
                        </Link>
                    </nav>
                </div>

                {/* Profil & Actions utilisateur */}
                <div className="flex items-center gap-3">
                    {/* Cloche de notifications Liveblocks */}
                    <InboxNotifications />

                    {user && (
                        <div className="hidden sm:flex flex-col items-end text-right">
                            <span className="text-xs font-semibold text-foreground leading-none">
                                {user.fullName || user.username || "Utilisateur"}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono leading-tight">
                                {user.primaryEmailAddress?.emailAddress}
                            </span>
                        </div>
                    )}
                    <div className="p-0.5 rounded-full ring-2 ring-border hover:ring-primary transition-all">
                        <UserButton />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
