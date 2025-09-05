import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function StatsGrid({ title, value, icon: Icon, gradient, description }) {
  return (
    <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 opacity-5">
        <Icon className="w-full h-full" />
      </div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} bg-opacity-10`}>
            <Icon className={`w-6 h-6 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`} />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-amber-700">{title}</p>
          <p className="text-3xl font-bold text-amber-900">{value}</p>
          {description && (
            <div className="flex items-center text-sm text-amber-600">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span>{description}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}