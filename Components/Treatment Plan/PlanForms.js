import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Heart, Save, X } from "lucide-react";

const therapyOptions = ["Abhyanga", "Shirodhara", "Udvartana", "Nasya", "Basti", "Virechana", "Vamana", "Raktamokshana", "Kizhi", "Akshi Tarpana"];

export default function PlanForm({ plan, onSubmit, onCancel, patients, practitioners }) {
  const [formData, setFormData] = useState(plan || {
    patient_id: "", plan_name: "", description: "", total_sessions: 0, therapies: [], start_date: "", expected_end_date: "", status: "Active", assigned_practitioner_id: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTherapyChange = (index, field, value) => {
    const newTherapies = [...formData.therapies];
    newTherapies[index][field] = value;
    handleChange('therapies', newTherapies);
  };
  
  const addTherapy = () => {
    const newTherapies = [...(formData.therapies || []), { therapy_type: "", sessions: 1, duration_minutes: 60, frequency: "Daily" }];
    handleChange('therapies', newTherapies);
  };

  const removeTherapy = (index) => {
    const newTherapies = formData.therapies.filter((_, i) => i !== index);
    handleChange('therapies', newTherapies);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const totalSessions = formData.therapies.reduce((sum, t) => sum + Number(t.sessions), 0);
    onSubmit({ ...formData, total_sessions: totalSessions });
  };
  
  return (
    <Card className="bg-white/90 shadow-xl border-0">
      <CardHeader><CardTitle className="flex items-center gap-2 text-amber-900"><Heart /> {plan ? 'Edit' : 'New'} Treatment Plan</CardTitle></CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Patient</Label><Select value={formData.patient_id} onValueChange={v => handleChange('patient_id', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1"><Label>Practitioner</Label><Select value={formData.assigned_practitioner_id} onValueChange={v => handleChange('assigned_practitioner_id', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{practitioners.map(p => <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div className="space-y-1"><Label>Plan Name</Label><Input value={formData.plan_name} onChange={e => handleChange('plan_name', e.target.value)} required/></div>
          <div className="space-y-1"><Label>Description</Label><Textarea value={formData.description} onChange={e => handleChange('description', e.target.value)}/></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Start Date</Label><Input type="date" value={formData.start_date} onChange={e => handleChange('start_date', e.target.value)} required/></div>
            <div className="space-y-1"><Label>End Date</Label><Input type="date" value={formData.expected_end_date} onChange={e => handleChange('expected_end_date', e.target.value)} required/></div>
          </div>
          <div>
            <Label>Therapies</Label>
            <div className="space-y-2">
              {formData.therapies?.map((therapy, index) => (
                <div key={index} className="flex gap-2 items-end p-2 border rounded">
                  <div className="flex-1"><Label className="text-xs">Type</Label><Select value={therapy.therapy_type} onValueChange={v => handleTherapyChange(index, 'therapy_type', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{therapyOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label className="text-xs">Sessions</Label><Input className="w-16" type="number" value={therapy.sessions} onChange={e => handleTherapyChange(index, 'sessions', Number(e.target.value))}/></div>
                  <div><Label className="text-xs">Duration</Label><Input className="w-16" type="number" value={therapy.duration_minutes} onChange={e => handleTherapyChange(index, 'duration_minutes', Number(e.target.value))}/></div>
                  <Button type="button" size="icon" variant="destructive" onClick={() => removeTherapy(index)}><Trash2 className="w-4 h-4"/></Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addTherapy} className="w-full"><Plus className="w-4 h-4 mr-2"/> Add Therapy</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
          <Button type="submit"><Save className="w-4 h-4 mr-2" />{plan ? 'Update' : 'Save'} Plan</Button>
        </CardFooter>
      </form>
    </Card>
  );
}