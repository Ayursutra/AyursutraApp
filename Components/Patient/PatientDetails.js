import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Heart,
  AlertCircle,
  Pill,
  UserPlus,
  Edit
} from "lucide-react";
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

export default function PatientDetails({ patient, onEdit }) {
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birth = new Date(dateOfBirth);
    const age = today.getFullYear() - birth.getFullYear();
    return `${age} years old`;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="border-b border-amber-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <User className="w-5 h-5" />
            Patient Details
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(patient)}
            className="border-amber-200 text-amber-700 hover:bg-amber-50"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 max-h-96 overflow-y-auto">
        {/* Header with Patient Info */}
        <div className="text-center pb-4 border-b border-amber-100">
          <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {patient.first_name?.[0]}{patient.last_name?.[0]}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-amber-900">
            {patient.first_name} {patient.last_name}
          </h2>
          <div className="flex justify-center gap-2 mt-2">
            <Badge className={`${statusColors[patient.status]} border-0`}>
              {patient.status}
            </Badge>
            <Badge variant="outline" className="border-amber-200 text-amber-700">
              {patient.gender}
            </Badge>
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-3">
          <h3 className="font-semibold text-amber-900 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Basic Information
          </h3>
          <div className="space-y-2 text-sm">
            {patient.date_of_birth && (
              <div className="flex justify-between">
                <span className="text-amber-600">Date of Birth:</span>
                <span className="font-medium text-amber-900">
                  {format(new Date(patient.date_of_birth), 'MMM dd, yyyy')} ({calculateAge(patient.date_of_birth)})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h3 className="font-semibold text-amber-900 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contact Information
          </h3>
          <div className="space-y-2 text-sm">
            {patient.phone && (
              <div className="flex items-center justify-between">
                <span className="text-amber-600 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Phone:
                </span>
                <span className="font-medium text-amber-900">{patient.phone}</span>
              </div>
            )}
            {patient.email && (
              <div className="flex items-center justify-between">
                <span className="text-amber-600 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Email:
                </span>
                <span className="font-medium text-amber-900">{patient.email}</span>
              </div>
            )}
            {patient.address && (
              <div className="space-y-1">
                <span className="text-amber-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Address:
                </span>
                <p className="font-medium text-amber-900 text-xs bg-amber-50 p-2 rounded">
                  {patient.address}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Ayurvedic Assessment */}
        <div className="space-y-3">
          <h3 className="font-semibold text-amber-900 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Ayurvedic Assessment
          </h3>
          <div className="space-y-2">
            {patient.prakriti && (
              <div className="flex justify-between items-center">
                <span className="text-amber-600">Prakriti:</span>
                <Badge className={`${prakritiColors[patient.prakriti]} border-0 text-xs`}>
                  {patient.prakriti}
                </Badge>
              </div>
            )}
            {patient.vikriti && (
              <div className="flex justify-between items-center">
                <span className="text-amber-600">Vikriti:</span>
                <Badge className="bg-red-100 text-red-800 border-0 text-xs">
                  {patient.vikriti}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Medical History */}
        {(patient.medical_history || patient.current_medications || patient.allergies) && (
          <div className="space-y-3">
            <h3 className="font-semibold text-amber-900 flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Medical History
            </h3>
            <div className="space-y-2 text-sm">
              {patient.medical_history && (
                <div className="space-y-1">
                  <span className="text-amber-600">Medical History:</span>
                  <p className="text-amber-900 bg-amber-50 p-2 rounded text-xs">
                    {patient.medical_history}
                  </p>
                </div>
              )}
              {patient.current_medications && (
                <div className="space-y-1">
                  <span className="text-amber-600">Current Medications:</span>
                  <p className="text-amber-900 bg-amber-50 p-2 rounded text-xs">
                    {patient.current_medications}
                  </p>
                </div>
              )}
              {patient.allergies && (
                <div className="flex items-center justify-between">
                  <span className="text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    Allergies:
                  </span>
                  <span className="font-medium text-red-700 text-xs bg-red-50 px-2 py-1 rounded">
                    {patient.allergies}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Emergency Contact */}
        {(patient.emergency_contact_name || patient.emergency_contact_phone) && (
          <div className="space-y-3">
            <h3 className="font-semibold text-amber-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Emergency Contact
            </h3>
            <div className="space-y-2 text-sm">
              {patient.emergency_contact_name && (
                <div className="flex justify-between">
                  <span className="text-amber-600">Name:</span>
                  <span className="font-medium text-amber-900">{patient.emergency_contact_name}</span>
                </div>
              )}
              {patient.emergency_contact_phone && (
                <div className="flex justify-between">
                  <span className="text-amber-600">Phone:</span>
                  <span className="font-medium text-amber-900">{patient.emergency_contact_phone}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}