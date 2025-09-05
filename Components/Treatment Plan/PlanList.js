import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function PlanList({ plans, patients, selectedPlan, setSelectedPlan, isLoading }) {
  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : '...';
  };
  
  return (
    <div className="space-y-4">
      {isLoading ? (
        Array(3).fill(0).map((_, i) => (
          <Card key={i} className="p-4"><Skeleton className="h-24 w-full" /></Card>
        ))
      ) : plans.map(plan => (
        <Card key={plan.id} onClick={() => setSelectedPlan(plan)} className={`cursor-pointer transition-all duration-200 bg-white/80 border-0 shadow-xl hover:shadow-2xl ${selectedPlan?.id === plan.id ? 'ring-2 ring-amber-500' : ''}`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-amber-900">{plan.plan_name}</h3>
                <p className="text-sm text-amber-700">{getPatientName(plan.patient_id)}</p>
              </div>
              <Badge className={`${plan.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{plan.status}</Badge>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-amber-600 mb-1">
                <span>Progress</span>
                <span>{plan.completed_sessions} / {plan.total_sessions} sessions</span>
              </div>
              <Progress value={(plan.completed_sessions / plan.total_sessions) * 100} className="h-2" />
            </div>
            <div className="text-xs text-amber-500 mt-2">
              <span>{format(new Date(plan.start_date), 'MMM dd, yyyy')}</span> - <span>{format(new Date(plan.expected_end_date), 'MMM dd, yyyy')}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}