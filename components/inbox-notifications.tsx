"use client";

import { useState, useRef, useEffect } from "react";
import {
    useInboxNotifications,
    useUnreadInboxNotificationsCount,
    useMarkAllInboxNotificationsAsRead,
} from "@liveblocks/react/suspense";
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";
import { Bell, CheckCheck, Sparkles, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function InboxNotifications() {
    const { inboxNotifications } = useInboxNotifications();
    const { count } = useUnreadInboxNotificationsCount();
    const markAllAsRead = useMarkAllInboxNotificationsAsRead();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fermer le popover si on clique à l'extérieur
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative inline-block">
            {/* Bouton Cloche avec badge */}
            <Button
                variant={isOpen ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`relative h-8 w-8 rounded-lg transition-colors ${
                    isOpen
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
                title="Notifications & Mentions"
            >
                <Bell className="h-4 w-4" />
                {count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white shadow-md animate-pulse">
                        {count > 9 ? "9+" : count}
                    </span>
                )}
            </Button>

            {/* Popover des notifications */}
            {isOpen && (
                <div className="absolute right-0 top-10 z-50 w-80 sm:w-96 rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    {/* En-tête du volet de notification */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/30">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                <Sparkles className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-xs font-bold font-mono text-foreground">
                                Notifications {count > 0 && `(${count} non lues)`}
                            </span>
                        </div>

                        {count > 0 && (
                            <button
                                onClick={() => markAllAsRead()}
                                className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                <CheckCheck className="h-3 w-3" />
                                Tout lire
                            </button>
                        )}
                    </div>

                    {/* Liste des notifications Liveblocks */}
                    <div className="max-h-96 overflow-y-auto divide-y divide-border/30">
                        {inboxNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-2 p-4">
                                <div className="p-3 rounded-full bg-secondary/50 border border-border/60">
                                    <Inbox className="h-6 w-6 text-muted-foreground/50" />
                                </div>
                                <p className="text-xs font-semibold text-foreground">Toutes les notifications sont à jour</p>
                                <p className="text-[11px] max-w-[220px]">
                                    Lorsqu'un collaborateur vous taguera (@votre_email) dans un commentaire, vous recevrez une alerte ici.
                                </p>
                            </div>
                        ) : (
                            <InboxNotificationList className="lb-root">
                                {inboxNotifications.map((inboxNotification) => (
                                    <InboxNotification
                                        key={inboxNotification.id}
                                        inboxNotification={inboxNotification}
                                        href={`/project/${inboxNotification.roomId}`}
                                        onClick={() => setIsOpen(false)}
                                    />
                                ))}
                            </InboxNotificationList>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default InboxNotifications;
