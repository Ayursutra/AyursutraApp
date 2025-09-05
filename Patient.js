
import React, { useState, useEffect, useCallback } from "react";
import { Patient, TreatmentPlan } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, User, Phone, Mail } from "lucide-react";

import PatientList from "../components/patients/PatientList";
import PatientForm from "../components/patients/PatientForm";
import PatientDetails from "../components/patients/PatientDetails";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get('action');

  const filterPatients = useCallback(() => {
    let filtered = patients;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(patient =>
        `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone?.includes(searchQuery) ||
        patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(patient => patient.status === statusFilter);
    }

    setFilteredPatients(filtered);
  }, [patients, searchQuery, statusFilter]); // Dependencies for useCallback

  useEffect(() => {
    loadPatients();
    
    // Check if we should show the form based on URL
    if (action === 'new') {
      setShowForm(true);
    }
  }, [action]);

  useEffect(() => {
    filterPatients();
  }, [filterPatients]); // Dependency for useEffect

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const fetchedPatients = await Patient.list('-created_date');
      setPatients(fetchedPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (patientData) => {
    try {
      if (editingPatient) {
        await Patient.update(editingPatient.id, patientData);
      } else {
        await Patient.create(patientData);
      }
      setShowForm(false);
      setEditingPatient(null);
      loadPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
    setSelectedPatient(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-900 mb-2">Patients</h1>
            <p className="text-amber-700">Manage your patient records</p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Patient
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-amber-600" />
              <Input
                placeholder="Search patients by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-amber-200 focus:border-amber-400"
              />
            </div>
            <div className="flex gap-2">
              {["All", "Active", "Inactive", "Complete"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status 
                    ? "bg-gradient-to-r from-amber-500 to-orange-600" 
                    : "border-amber-200 text-amber-700 hover:bg-amber-50"
                  }
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-amber-600">
            <span>Total Patients: <strong>{patients.length}</strong></span>
            <span>•</span>
            <span>Active: <strong>{patients.filter(p => p.status === 'Active').length}</strong></span>
            <span>•</span>
            <span>Showing: <strong>{filteredPatients.length}</strong></span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Patient List */}
          <div className="lg:col-span-2">
            <PatientList
              patients={filteredPatients}
              selectedPatient={selectedPatient}
              setSelectedPatient={setSelectedPatient}
              onEdit={handleEdit}
              isLoading={isLoading}
            />
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {showForm && (
              <PatientForm
                patient={editingPatient}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingPatient(null);
                }}
              />
            )}
            
            {selectedPatient && !showForm && (
              <PatientDetails
                patient={selectedPatient}
                onEdit={handleEdit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
