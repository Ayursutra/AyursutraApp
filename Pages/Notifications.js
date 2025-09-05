import React, { useState, useEffect, useCallback } from "react";
import { Notification, User } from "@/entities/all";
import { SendEmail } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Plus, Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import NotificationList from "../components/notifications/NotificationList";
import NotificationForm from "../components/notifications/NotificationForm";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedNotifications = await Notification.list('-created_date');
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast({
        variant: "destructive",
        title: "Failed to load notifications",
        description: "There was a problem fetching the notification history.",
      });
    }
    setIsLoading(false);
  }, [toast]); // Added toast as a dependency

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]); // Added loadNotifications as a dependency

  const handleSendNotification = async (formData) => {
    setIsLoading(true);
    let sentCount = 0;
    
    try {
      const users = await User.list();
      sentCount = users.length;

      if (formData.channels.includes('Email')) {
        // This is a simplified bulk email sending. For large lists, a backend job is better.
        const emailPromises = users
          .filter(user => user.email)
          .map(user => 
            SendEmail({
              to: user.email,
              subject: formData.title,
              body: formData.message,
            })
          );
        await Promise.all(emailPromises);
        toast({
          title: "Emails Sent",
          description: `Successfully queued emails for ${emailPromises.length} users.`,
        });
      }

      if (formData.channels.includes('SMS') || formData.channels.includes('WhatsApp')) {
        toast({
          variant: "default",
          title: "SMS/WhatsApp Mock Send",
          description: "This is a demo. In a real app, this would trigger SMS/WhatsApp APIs.",
        });
      }

      await Notification.create({
        ...formData,
        status: 'Sent',
        sent_to_count: sentCount,
        sent_date: new Date().toISOString()
      });

      loadNotifications();
      setShowForm(false);
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        variant: "destructive",
        title: "Notification Failed",
        description: "There was an error sending the notification.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-900 mb-2 flex items-center gap-3">
              <Bell className="w-8 h-8"/>
              Notifications
            </h1>
            <p className="text-amber-700">Send communications to all users</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg"
            disabled={isLoading}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Notification
          </Button>
        </div>

        {showForm ? (
          <NotificationForm
            onSubmit={handleSendNotification}
            onCancel={() => setShowForm(false)}
            isLoading={isLoading}
          />
        ) : (
          <NotificationList
            notifications={notifications}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
