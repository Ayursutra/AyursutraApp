import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const therapyOptions = ["Abhyanga", "Shirodhara", "Udvartana", "Nasya", "Basti", "Virechana", "Vamana", "Raktamokshana", "Kizhi", "Akshi Tarpana", "Consultation", "Follow-up"];

export default function AppointmentForm({ appointment, onCancel, onSubmit, patients, practitioners }) {
  const [formData, setFormData] = useState(appointment || {
    patient_id: "", practitioner_id: "", therapy_type: "", appointment_date: "", appointment_time: "",
    duration_minutes: 60, status: "Scheduled", notes: "", fees: 0, payment_status: "Pending"
  });

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };
  
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{appointment ? 'Edit' : 'New'} Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Patient</Label><Select value={formData.patient_id} onValueChange={v => handleChange('patient_id', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Practitioner</Label><Select value={formData.practitioner_id} onValueChange={v => handleChange('practitioner_id', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{practitioners.map(p => <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Therapy</Label><Select value={formData.therapy_type} onValueChange={v => handleChange('therapy_type', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{therapyOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Date</Label><Input type="date" value={formData.appointment_date} onChange={e => handleChange('appointment_date', e.target.value)} /></div>
            <div><Label>Time</Label><Input type="time" value={formData.appointment_time} onChange={e => handleChange('appointment_time', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Duration (min)</Label><Input type="number" value={formData.duration_minutes} onChange={e => handleChange('duration_minutes', Number(e.target.value))} /></div>
            <div><Label>Status</Label><Select value={formData.status} onValueChange={v => handleChange('status', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{["Scheduled", "In Progress", "Completed", "Cancelled", "No Show"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div><Label>Notes</Label><Textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}