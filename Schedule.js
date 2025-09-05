import React, { useState, useEffect } from "react";
import { Appointment, Patient, Practitioner } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { addDays, subDays, startOfWeek, endOfWeek, format, eachDayOfInterval, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import ScheduleWeekView from "../components/schedule/ScheduleWeekView";
import AppointmentForm from "../components/schedule/AppointmentForm";

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const start = startOfWeek(currentDate, { weekStartsOn: 1 });
  const end = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start, end });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedApts, fetchedPats, fetchedPracs] = await Promise.all([
        Appointment.list(), Patient.list(), Practitioner.list()
      ]);
      setAppointments(fetchedApts);
      setPatients(fetchedPats);
      setPractitioners(fetchedPracs);
    } catch (error) {
      console.error("Error loading schedule data:", error);
    }
    setIsLoading(false);
  };
  
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const handlePrevWeek = () => setCurrentDate(subDays(currentDate, 7));
  const handleToday = () => setCurrentDate(new Date());

  const handleFormSubmit = async (data) => {
    if (editingAppointment) {
      await Appointment.update(editingAppointment.id, data);
    } else {
      await Appointment.create(data);
    }
    setShowForm(false);
    setEditingAppointment(null);
    loadData();
  };

  const openForm = (appointment = null) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  return (
    <div className="h-screen flex flex-col p-4 md:p-8 bg-gradient-to-br from-amber-50 to-red-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-900 flex items-center gap-3"><CalendarIcon /> Schedule</h1>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrevWeek} variant="outline"><ChevronLeft/></Button>
          <Button onClick={handleToday} variant="outline">Today</Button>
          <Button onClick={handleNextWeek} variant="outline"><ChevronRight/></Button>
          <span className="font-semibold text-amber-800 mx-4">{format(start, 'MMM d')} - {format(end, 'MMM d, yyyy')}</span>
          <Button onClick={() => openForm()} className="bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg"><Plus className="mr-2"/> New Appointment</Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white/80 rounded-xl shadow-xl border-0">
        <ScheduleWeekView 
          weekDays={weekDays} 
          appointments={appointments}
          patients={patients}
          practitioners={practitioners}
          onAppointmentClick={openForm}
        />
      </div>

      {showForm && (
        <AppointmentForm 
          appointment={editingAppointment} 
          onCancel={() => setShowForm(false)} 
          onSubmit={handleFormSubmit}
          patients={patients}
          practitioners={practitioners}
        />
      )}
    </div>
  );
}