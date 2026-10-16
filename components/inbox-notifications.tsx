"use client";

import {
    useInboxNotifications,
    useUnreadInboxNotificationsCount,
    useMarkAllInboxNotificationsAsRead,
} from "@liveblocks/react/suspense";
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";
import { Bell, CheckCheck, Sparkles, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function InboxNotifications() {
    const { inboxNotifications } = useInboxNotifications();
    const { count } = useUnreadInboxNotificationsCount();
    const markAllAsRead = useMarkAllInboxNotificationsAsRead();

    return (
        <Popover>
            <PopoverTrigger className="relative inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                <Bell className="h-4 w-4" />
                {count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white shadow-md animate-pulse">
                        {count > 9 ? "9+" : count}
                    </span>
                )}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 sm:w-96 p-0 rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl overflow-hidden">
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
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAllAsRead()}
                            className="h-6 px-2 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                        >
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Tout lire
                        </Button>
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
                                />
                            ))}
                        </InboxNotificationList>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default InboxNotifications;
