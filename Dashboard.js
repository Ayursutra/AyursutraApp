import React, { useState, useEffect } from "react";
import { Patient, Practitioner, Appointment, TreatmentPlan } from "@/entities/all";
import { 
  Users, 
  Calendar, 
  Heart, 
  UserCheck,
  TrendingUp,
  Activity,
  Clock,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

import StatsGrid from "../components/dashboard/StatsGrid";
import RecentAppointments from "../components/dashboard/RecentAppointments";
import TodaySchedule from "../components/dashboard/TodaySchedule";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    patients: [],
    appointments: [],
    treatmentPlans: [],
    practitioners: [],
    todayAppointments: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [patients, appointments, treatmentPlans, practitioners] = await Promise.all([
        Patient.list('-created_date'),
        Appointment.list('-created_date'),
        TreatmentPlan.list('-created_date'), 
        Practitioner.list('first_name')
      ]);

      const today = format(new Date(), 'yyyy-MM-dd');
      const todayAppointments = appointments.filter(apt => apt.appointment_date === today);

      setDashboardData({
        patients,
        appointments,
        treatmentPlans,
        practitioners,
        todayAppointments
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
    setIsLoading(false);
  };

  const calculateStats = () => {
    const activePatients = dashboardData.patients.filter(p => p.status === 'Active').length;
    const todaysAppointments = dashboardData.todayAppointments.length;
    const activePlans = dashboardData.treatmentPlans.filter(tp => tp.status === 'Active').length;
    const totalRevenue = dashboardData.appointments
      .filter(apt => apt.payment_status === 'Paid')
      .reduce((sum, apt) => sum + (apt.fees || 0), 0);

    return { activePatients, todaysAppointments, activePlans, totalRevenue };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
            Welcome to AyurSutra
          </h1>
          <p className="text-amber-700 text-lg">
            Panchakarma Patient Management Dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsGrid
            title="Active Patients"
            value={stats.activePatients}
            icon={Users}
            gradient="from-blue-500 to-blue-600"
            description="Currently under treatment"
          />
          <StatsGrid
            title="Today's Appointments"
            value={stats.todaysAppointments}
            icon={Calendar}
            gradient="from-green-500 to-green-600" 
            description="Scheduled for today"
          />
          <StatsGrid
            title="Active Treatment Plans"
            value={stats.activePlans}
            icon={Heart}
            gradient="from-purple-500 to-purple-600"
            description="Ongoing therapies"
          />
          <StatsGrid
            title="Monthly Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            gradient="from-amber-500 to-orange-600"
            description="This month's earnings"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <TodaySchedule 
              appointments={dashboardData.todayAppointments}
              patients={dashboardData.patients}
              practitioners={dashboardData.practitioners}
              isLoading={isLoading}
            />
            
            <RecentAppointments
              appointments={dashboardData.appointments.slice(0, 5)}
              patients={dashboardData.patients}
              practitioners={dashboardData.practitioners}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <QuickActions />
            
            {/* Practitioner Status */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <UserCheck className="w-5 h-5" />
                  Practitioner Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.practitioners.slice(0, 4).map((practitioner) => (
                    <div key={practitioner.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <div>
                        <p className="font-medium text-amber-900">
                          {practitioner.first_name} {practitioner.last_name}
                        </p>
                        <p className="text-sm text-amber-600">
                          {practitioner.specialization?.[0] || 'General'}
                        </p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        practitioner.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}