import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Phone, BellOff, Users } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const channelIcons = {
  Email: Mail,
  SMS: MessageSquare,
  WhatsApp: Phone,
};

export default function NotificationList({ notifications, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="mt-4 flex justify-between items-end">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-1/4" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 rounded-xl shadow-lg">
        <BellOff className="mx-auto h-16 w-16 text-amber-500" />
        <h3 className="mt-4 text-xl font-semibold text-amber-900">No Notifications Yet</h3>
        <p className="mt-2 text-sm text-amber-700">Your sent notifications will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-amber-900">{notification.title}</CardTitle>
              <Badge variant={notification.status === 'Sent' ? 'default' : 'secondary'} className={notification.status === 'Sent' ? 'bg-green-100 text-green-800' : ''}>
                {notification.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 text-sm mb-4 line-clamp-2">
              {notification.message}
            </p>
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                {notification.channels?.map(channel => {
                  const Icon = channelIcons[channel];
                  return (
                    <Badge key={channel} variant="outline" className="flex items-center gap-1 border-amber-200 text-amber-700">
                      {Icon && <Icon className="w-3 h-3" />}
                      {channel}
                    </Badge>
                  );
                })}
              </div>
              <div className="text-right text-xs text-amber-600">
                <p className="flex items-center gap-1 justify-end">
                  <Users className="w-3 h-3"/> Sent to {notification.sent_to_count} users
                </p>
                <p>
                  {format(new Date(notification.sent_date), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}