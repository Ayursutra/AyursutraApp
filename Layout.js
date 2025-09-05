
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Heart, 
  UserCheck,
  Bell
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Patients",
    url: createPageUrl("Patients"),
    icon: Users,
  },
  {
    title: "Schedule",
    url: createPageUrl("Schedule"),
    icon: Calendar,
  },
  {
    title: "Treatment Plans",
    url: createPageUrl("TreatmentPlans"),
    icon: Heart,
  },
  {
    title: "Practitioners",
    url: createPageUrl("Practitioners"),
    icon: UserCheck,
  },
  {
    title: "Notifications",
    url: createPageUrl("Notifications"),
    icon: Bell,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <style>
          {`
            :root {
              --sidebar-background: 255 248 240;
              --sidebar-foreground: 124 58 37;
              --sidebar-primary: 154 88 48;
              --sidebar-primary-foreground: 255 255 255;
              --sidebar-accent: 251 220 177;
              --sidebar-accent-foreground: 124 58 37;
              --sidebar-border: 237 209 176;
              --sidebar-ring: 154 88 48;
            }
          `}
        </style>
        
        <Sidebar className="border-r border-amber-200/50 bg-gradient-to-b from-amber-50 to-orange-100/30">
          <SidebarHeader className="border-b border-amber-200/30 p-4 flex justify-start items-center gap-3 bg-gradient-to-br from-white/90 to-amber-50/90 backdrop-blur-sm">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b896b995c5df98edd2366f/f08ffbda2_Logo1copy.png"
              alt="AyurSutra Icon"
              className="w-16 h-16 object-contain"
            />
            <div>
              <h2 className="font-bold text-amber-900 text-xl tracking-tight">AyurSutra</h2>
              <p className="text-xs text-amber-700/80 font-medium">Panchakarma Wellness Partner</p>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-amber-800/70 uppercase tracking-wider px-3 py-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`group hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 hover:text-amber-900 transition-all duration-300 rounded-xl mb-2 ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg transform scale-105' 
                            : 'text-amber-800'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-semibold">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-semibold text-amber-800/70 uppercase tracking-wider px-3 py-3">
                Today's Overview
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-amber-700">Appointments</span>
                    <span className="font-bold text-amber-900 bg-amber-100 px-2 py-1 rounded-full text-xs">8</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-amber-700">Active Plans</span>
                    <span className="font-bold text-amber-900 bg-orange-100 px-2 py-1 rounded-full text-xs">12</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-amber-200/30 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">Dr</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-amber-900 text-sm truncate">Dr. Practitioner</p>
                <p className="text-xs text-amber-700/80 truncate">Ayurvedic Physician</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          {/* Header with mobile trigger */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200/30 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-amber-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-amber-900">AyurSutra</h1>
            </div>
          </header>

          {/* Main content area */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
