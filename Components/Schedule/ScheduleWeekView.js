import React from 'react';
import { format, isToday } from 'date-fns';

const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);

const therapyColors = {
  'Abhyanga': 'bg-blue-200 border-blue-400', 'Shirodhara': 'bg-purple-200 border-purple-400',
  'Udvartana': 'bg-green-200 border-green-400', 'Nasya': 'bg-yellow-200 border-yellow-400',
  'Basti': 'bg-red-200 border-red-400', 'Consultation': 'bg-gray-200 border-gray-400',
  'Virechana': 'bg-orange-200 border-orange-400', 'Vamana': 'bg-pink-200 border-pink-400',
  'Raktamokshana': 'bg-rose-200 border-rose-400', 'Kizhi': 'bg-teal-200 border-teal-400', 'Akshi Tarpana': 'bg-cyan-200 border-cyan-400'
};

export default function ScheduleWeekView({ weekDays, appointments, patients, practitioners, onAppointmentClick }) {
  const getPatientName = (id) => patients.find(p => p.id === id)?.first_name || '';
  const getPractitionerName = (id) => practitioners.find(p => p.id === id)?.last_name || '';

  return (
    <div className="grid grid-cols-[auto_1fr] h-full">
      {/* Time column */}
      <div className="text-xs text-right text-amber-600">
        <div className="h-16 border-b border-r"></div>
        {timeSlots.map(time => (
          <div key={time} className="h-24 border-r pr-2 pt-1">{time}</div>
        ))}
      </div>

      {/* Days columns */}
      <div className="grid grid-cols-7">
        {weekDays.map(day => (
          <div key={day.toString()} className="border-r relative">
            <div className={`h-16 border-b p-2 text-center ${isToday(day) ? 'bg-amber-100' : ''}`}>
              <p className="font-semibold text-amber-900">{format(day, 'E')}</p>
              <p className={`text-2xl font-bold ${isToday(day) ? 'text-amber-700' : 'text-amber-500'}`}>{format(day, 'd')}</p>
            </div>
            {timeSlots.map(time => (
              <div key={time} className="h-24 border-b"></div>
            ))}
            {/* Appointments */}
            {appointments
              .filter(apt => format(new Date(apt.appointment_date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
              .map(apt => {
                const top = ((parseInt(apt.appointment_time.split(':')[0]) - 8) * 96) + (parseInt(apt.appointment_time.split(':')[1]) / 60 * 96) + 64; // 64 for header height
                const height = (apt.duration_minutes / 60) * 96;
                return (
                  <div 
                    key={apt.id}
                    onClick={() => onAppointmentClick(apt)}
                    className={`absolute left-1 right-1 p-1 rounded border-l-4 text-xs cursor-pointer ${therapyColors[apt.therapy_type] || therapyColors['Consultation']}`}
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    <p className="font-semibold truncate">{apt.therapy_type}</p>
                    <p className="truncate">{getPatientName(apt.patient_id)}</p>
                    <p className="truncate text-amber-700">w/ Dr. {getPractitionerName(apt.practitioner_id)}</p>
                  </div>
                )
            })}
          </div>
        ))}
      </div>
    </div>
  );
}