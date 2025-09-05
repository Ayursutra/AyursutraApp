import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, User, Phone, Mail, Edit, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const statusColors = {
  'Active': 'bg-green-100 text-green-800',
  'Inactive': 'bg-gray-100 text-gray-800',
  'Complete': 'bg-blue-100 text-blue-800'
};

const prakritiColors = {
  'Vata': 'bg-purple-100 text-purple-800',
  'Pitta': 'bg-red-100 text-red-800', 
  'Kapha': 'bg-blue-100 text-blue-800',
  'Vata-Pitta': 'bg-indigo-100 text-indigo-800',
  'Vata-Kapha': 'bg-cyan-100 text-cyan-800',
  'Pitta-Kapha': 'bg-orange-100 text-orange-800',
  'Tridosha': 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800'
};

export default function PatientList({ patients, selectedPatient, setSelectedPatient, onEdit, isLoading }) {
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birth = new Date(dateOfBirth);
    const age = today.getFullYear() - birth.getFullYear();
    return age;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="border-b border-amber-100">
        <CardTitle className="flex items-center gap-2 text-amber-900">
          <Users className="w-5 h-5" />
          Patient Records ({patients.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">No Patients Found</h3>
            <p className="text-amber-600 mb-6">Start by adding your first patient to the system.</p>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
              Add First Patient
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-amber-100">
            {patients.map((patient) => (
              <div 
                key={patient.id} 
                className={`p-6 cursor-pointer transition-all duration-200 hover:bg-amber-50/50 ${
                  selectedPatient?.id === patient.id ? 'bg-amber-100/50 border-l-4 border-amber-500' : ''
                }`}
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {patient.first_name?.[0]}{patient.last_name?.[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900 text-lg">
                        {patient.first_name} {patient.last_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-amber-600">
                        {patient.date_of_birth && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {calculateAge(patient.date_of_birth)} years
                          </span>
                        )}
                        <span>•</span>
                        <span>{patient.gender}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={`${statusColors[patient.status]} border-0 font-medium`}>
                      {patient.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(patient);
                      }}
                      className="border-amber-200 text-amber-600 hover:bg-amber-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {patient.prakriti && (
                    <Badge className={`${prakritiColors[patient.prakriti]} border-0 text-xs`}>
                      Prakriti: {patient.prakriti}
                    </Badge>
                  )}
                  {patient.vikriti && patient.vikriti !== patient.prakriti && (
                    <Badge className="bg-red-100 text-red-800 border-0 text-xs">
                      Vikriti: {patient.vikriti}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {patient.phone && (
                    <div className="flex items-center gap-2 text-amber-600">
                      <Phone className="w-3 h-3" />
                      <span>{patient.phone}</span>
                    </div>
                  )}
                  {patient.email && (
                    <div className="flex items-center gap-2 text-amber-600">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}