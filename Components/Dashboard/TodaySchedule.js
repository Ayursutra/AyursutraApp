import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Heart, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const therapyColors = {
  'Abhyanga': 'bg-blue-100 text-blue-800',
  'Shirodhara': 'bg-purple-100 text-purple-800',
  'Udvartana': 'bg-green-100 text-green-800',
  'Nasya': 'bg-yellow-100 text-yellow-800',
  'Basti': 'bg-red-100 text-red-800',
  'Consultation': 'bg-gray-100 text-gray-800'
};

export default function TodaySchedule({ appointments, patients, practitioners, isLoading }) {
  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';
  };

  const getPractitionerName = (practitionerId) => {
    const practitioner = practitioners.find(p => p.id === practitionerId);
    return practitioner ? `${practitioner.first_name} ${practitioner.last_name}` : 'Unknown Practitioner';
  };

  const sortedAppointments = appointments.sort((a, b) => {
    return a.appointment_time.localeCompare(b.appointment_time);
  });

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="border-b border-amber-100">
        <CardTitle className="flex items-center gap-2 text-amber-900">
          <Clock className="w-5 h-5" />
          Today's Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-16" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : sortedAppointments.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-amber-600" />
            </div>
            <p className="text-amber-700 font-medium">No appointments scheduled for today</p>
            <p className="text-amber-600 text-sm mt-1">Enjoy a peaceful day!</p>
          </div>
        ) : (
          <div className="divide-y divide-amber-100">
            {sortedAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-amber-50/50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-amber-900">
                        {format(new Date(`2000-01-01T${appointment.appointment_time}`), 'HH:mm')}
                      </p>
                      <p className="text-xs text-amber-600">
                        {appointment.duration_minutes}min
                      </p>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-amber-600" />
                        <span className="font-semibold text-amber-900">
                          {getPatientName(appointment.patient_id)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-amber-700">
                          {getPractitionerName(appointment.practitioner_id)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge 
                      className={`${therapyColors[appointment.therapy_type] || therapyColors['Consultation']} border-0 font-medium`}
                    >
                      {appointment.therapy_type}
                    </Badge>
                    <p className="text-xs text-amber-600 mt-1">
                      {appointment.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
