import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Edit, User, UserCheck as PractitionerIcon, Calendar, Repeat, Clock } from "lucide-react";
import { format } from 'date-fns';

export default function PlanDetails({ plan, patient, practitioner, onEdit }) {
  const progress = plan.total_sessions > 0 ? (plan.completed_sessions / plan.total_sessions) * 100 : 0;
  
  return (
    <Card className="bg-white/90 shadow-xl border-0">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <CardTitle className="flex items-center gap-2 text-amber-900"><Heart/> Plan Details</CardTitle>
        <Button variant="outline" size="sm" onClick={() => onEdit(plan)}><Edit className="w-4 h-4 mr-1"/> Edit</Button>
      </CardHeader>
      <CardContent className="pt-4 space-y-4 max-h-96 overflow-y-auto">
        <div className="text-center">
          <h2 className="text-xl font-bold text-amber-900">{plan.plan_name}</h2>
          <Badge className={`${plan.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{plan.status}</Badge>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2"><User className="w-4 h-4 text-amber-500"/> Patient: <span className="font-semibold text-amber-800">{patient?.first_name} {patient?.last_name}</span></div>
          <div className="flex items-center gap-2"><PractitionerIcon className="w-4 h-4 text-amber-500"/> Practitioner: <span className="font-semibold text-amber-800">{practitioner?.first_name} {practitioner?.last_name}</span></div>
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-500"/> Duration: <span className="font-semibold text-amber-800">{format(new Date(plan.start_date), 'MMM d')} - {format(new Date(plan.expected_end_date), 'MMM d, yyyy')}</span></div>
        </div>
        <div>
          <h4 className="font-semibold text-amber-800 mb-2">Progress ({plan.completed_sessions}/{plan.total_sessions})</h4>
          <Progress value={progress} />
        </div>
        <div>
          <h4 className="font-semibold text-amber-800 mb-2">Description</h4>
          <p className="text-sm text-amber-700 bg-amber-50 p-2 rounded">{plan.description}</p>
        </div>
        <div>
          <h4 className="font-semibold text-amber-800 mb-2">Therapies</h4>
          <div className="space-y-2">
            {plan.therapies?.map((therapy, index) => (
              <div key={index} className="p-2 border rounded-lg bg-white">
                <p className="font-semibold text-amber-900">{therapy.therapy_type}</p>
                <div className="flex justify-between text-xs text-amber-600">
                  <span className="flex items-center gap-1"><Repeat className="w-3 h-3"/>{therapy.sessions} sessions</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{therapy.duration_minutes} min</span>
                  <span>{therapy.frequency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}