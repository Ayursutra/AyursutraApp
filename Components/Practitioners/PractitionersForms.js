import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCheck, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const therapyOptions = ["Abhyanga", "Shirodhara", "Udvartana", "Nasya", "Basti", "Virechana", "Vamana", "Raktamokshana", "Kizhi", "Akshi Tarpana"];

export default function PractitionerForm({ practitioner, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(practitioner || {
    first_name: "", last_name: "", specialization: [], phone: "", email: "", 
    qualification: "", experience_years: "", status: "Active", working_hours: {}
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecializationChange = (spec) => {
    const newSpecs = formData.specialization.includes(spec)
      ? formData.specialization.filter(s => s !== spec)
      : [...formData.specialization, spec];
    handleChange('specialization', newSpecs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-900">
          <UserCheck /> {practitioner ? 'Edit Practitioner' : 'Add New Practitioner'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label htmlFor="first_name">First Name</Label><Input id="first_name" value={formData.first_name} onChange={e => handleChange('first_name', e.target.value)} required /></div>
            <div className="space-y-1"><Label htmlFor="last_name">Last Name</Label><Input id="last_name" value={formData.last_name} onChange={e => handleChange('last_name', e.target.value)} required /></div>
          </div>
          <div className="space-y-1"><Label htmlFor="phone">Phone</Label><Input id="phone" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} required /></div>
          <div className="space-y-1"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} /></div>
          <div className="space-y-1"><Label htmlFor="qualification">Qualification</Label><Input id="qualification" value={formData.qualification} onChange={e => handleChange('qualification', e.target.value)} /></div>
          <div className="space-y-1"><Label htmlFor="experience">Experience (Years)</Label><Input id="experience" type="number" value={formData.experience_years} onChange={e => handleChange('experience_years', Number(e.target.value))} /></div>
          <div className="space-y-1"><Label>Status</Label>
            <Select value={formData.status} onValueChange={value => handleChange('status', value)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Specializations</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {therapyOptions.map(option => (
                <Badge key={option} onClick={() => handleSpecializationChange(option)} variant={formData.specialization.includes(option) ? 'default' : 'outline'} className="cursor-pointer">
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
          <Button type="submit"><Save className="w-4 h-4 mr-2" />{practitioner ? 'Update' : 'Save'}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}