import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Edit, Phone, Mail, Stethoscope, Briefcase, Clock, Calendar } from "lucide-react";

export default function PractitionerDetails({ practitioner, onEdit }) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <CardTitle className="flex items-center gap-2 text-amber-900"><UserCheck /> Practitioner Details</CardTitle>
        <Button variant="outline" size="sm" onClick={() => onEdit(practitioner)}><Edit className="w-4 h-4 mr-1" /> Edit</Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-4 max-h-96 overflow-y-auto">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {practitioner.first_name?.[0]}{practitioner.last_name?.[0]}
          </div>
          <h2 className="text-xl font-bold text-amber-900">{practitioner.first_name} {practitioner.last_name}</h2>
          <p className="text-amber-600">{practitioner.qualification}</p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-500" /> <span className="text-amber-700">{practitioner.phone}</span></div>
          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-500" /> <span className="text-amber-700">{practitioner.email}</span></div>
          <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-amber-500" /> <span className="text-amber-700">{practitioner.experience_years} years of experience</span></div>
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> <Badge className={`${practitioner.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{practitioner.status}</Badge></div>
        </div>
        <div>
          <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2"><Stethoscope className="w-4 h-4" /> Specializations</h4>
          <div className="flex flex-wrap gap-2">
            {practitioner.specialization?.map(spec => <Badge key={spec} variant="secondary" className="bg-amber-100 text-amber-800">{spec}</Badge>)}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> Working Hours</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {Object.entries(practitioner.working_hours || {}).map(([day, hours]) => (
              <div key={day} className="flex justify-between">
                <span className="capitalize text-amber-600">{day}:</span>
                <span className="font-medium text-amber-800">{hours}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}