import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Calendar, Users, Heart, UserCheck } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "New Patient",
      icon: Plus,
      url: createPageUrl("Patients?action=new"),
      description: "Register new patient",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Schedule Appointment", 
      icon: Calendar,
      url: createPageUrl("Schedule?action=new"),
      description: "Book new appointment",
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Treatment Plan",
      icon: Heart,
      url: createPageUrl("TreatmentPlans?action=new"),
      description: "Create new plan",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Add Practitioner",
      icon: UserCheck,
      url: createPageUrl("Practitioners?action=new"), 
      description: "Register practitioner",
      gradient: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-amber-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Link key={action.title} to={action.url}>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-auto p-4 border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:border-amber-300 transition-all duration-300 group"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-r ${action.gradient} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}>
                <action.icon className={`w-5 h-5 bg-gradient-to-r ${action.gradient} bg-clip-text text-transparent`} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-amber-900">{action.title}</p>
                <p className="text-xs text-amber-600">{action.description}</p>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}