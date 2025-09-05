import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Stethoscope } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PractitionerList({ practitioners, selectedPractitioner, setSelectedPractitioner, isLoading }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {isLoading ? (
        Array(4).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </CardContent>
          </Card>
        ))
      ) : practitioners.map((practitioner) => (
        <Card 
          key={practitioner.id}
          onClick={() => setSelectedPractitioner(practitioner)}
          className={`cursor-pointer transition-all duration-200 bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl hover:scale-105 ${
            selectedPractitioner?.id === practitioner.id ? 'ring-2 ring-amber-500 shadow-2xl' : ''
          }`}
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {practitioner.first_name?.[0]}{practitioner.last_name?.[0]}
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 text-lg">
                {practitioner.first_name} {practitioner.last_name}
              </h3>
              <p className="text-sm text-amber-600">{practitioner.qualification}</p>
            </div>
            <Badge className={`${practitioner.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} ml-auto`}>
              {practitioner.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2 text-sm text-amber-800 mb-2">
              <Stethoscope className="w-4 h-4 mt-1 flex-shrink-0" />
              <p className="font-medium">Specializations:</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {practitioner.specialization?.slice(0, 3).map((spec, i) => (
                <Badge key={i} variant="secondary" className="bg-amber-100 text-amber-800">{spec}</Badge>
              ))}
              {practitioner.specialization?.length > 3 && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  +{practitioner.specialization.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}