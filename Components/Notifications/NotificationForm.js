import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, MessageSquare, Phone, Send, X, Info, Loader2 } from "lucide-react";

const channels = [
  { id: 'Email', label: 'Email', icon: Mail },
  { id: 'SMS', label: 'SMS', icon: MessageSquare },
  { id: 'WhatsApp', label: 'WhatsApp', icon: Phone }
];

export default function NotificationForm({ onSubmit, onCancel, isLoading }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedChannels, setSelectedChannels] = useState(['Email']);

  const handleChannelChange = (channelId) => {
    setSelectedChannels(prev =>
      prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !message || selectedChannels.length === 0) {
      // Basic validation
      return;
    }
    onSubmit({ title, message, channels: selectedChannels });
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-amber-900">Compose New Notification</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-amber-800">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Upcoming Holiday Closure"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-amber-200 focus:border-amber-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-amber-800">Message</Label>
            <Textarea
              id="message"
              placeholder="Compose your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border-amber-200 focus:border-amber-400 min-h-[150px]"
              required
            />
          </div>
          <div className="space-y-3">
            <Label className="text-amber-800">Channels</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {channels.map(({ id, label, icon: Icon }) => (
                <div
                  key={id}
                  onClick={() => handleChannelChange(id)}
                  className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedChannels.includes(id)
                      ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500'
                      : 'border-amber-200 hover:bg-amber-50/50'
                  }`}
                >
                  <Checkbox checked={selectedChannels.includes(id)} id={`channel-${id}`} />
                  <Icon className="w-5 h-5 text-amber-700" />
                  <Label htmlFor={`channel-${id}`} className="font-medium text-amber-900 cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-700" />
            <AlertTitle className="text-blue-800">Service Integration Notice</AlertTitle>
            <AlertDescription className="text-blue-700">
              Email is fully functional. SMS and WhatsApp channels are for demonstration and require custom backend integration to work.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-amber-100 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="border-amber-200 text-amber-700 hover:bg-amber-50">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !title || !message || selectedChannels.length === 0} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
            {isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
            ) : (
              <><Send className="w-4 h-4 mr-2" /> Send Notification</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}