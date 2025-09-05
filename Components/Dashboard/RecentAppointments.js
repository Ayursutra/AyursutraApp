import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Heart, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const statusColors = {
  'Scheduled': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800', 
  'Completed': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'No Show': 'bg-gray-100 text-gray-800'
};

export default function RecentAppointments({ appointments, patients, practitioners, isLoading }) {
  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';
  };

  const getPractitionerName = (practitionerId) => {
    const practitioner = practitioners.find(p => p.id === practitionerId);
    return practitioner ? `Dr. ${practitioner.first_name} ${practitioner.last_name}` : 'Unknown Practitioner';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="border-b border-amber-100">
        <CardTitle className="flex items-center gap-2 text-amber-900">
          <Calendar className="w-5 h-5" />
          Recent Appointments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-amber-600" />
            </div>
            <p className="text-amber-700 font-medium">No appointments yet</p>
            <p className="text-amber-600 text-sm mt-1">Start scheduling appointments for your patients</p>
          </div>
        ) : (
          <div className="divide-y divide-amber-100">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-amber-50/50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-amber-900 truncate">
                        {getPatientName(appointment.patient_id)}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-amber-600">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {appointment.therapy_type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(appointment.appointment_date), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Badge 
                    className={`${statusColors[appointment.status] || statusColors['Scheduled']} border-0 font-medium`}
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}