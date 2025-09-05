import React, { useState, useEffect } from "react";
import { TreatmentPlan, Patient, Practitioner } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Heart } from "lucide-react";
import PlanList from "../components/treatmentplans/PlanList";
import PlanForm from "../components/treatmentplans/PlanForm";
import PlanDetails from "../components/treatmentplans/PlanDetails";

export default function TreatmentPlans() {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [patients, setPatients] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get('action');

  useEffect(() => {
    loadData();
    if (action === 'new') {
      setShowForm(true);
    }
  }, [action]);

  useEffect(() => {
    let filtered = plans.filter(plan => {
      const patient = patients.find(p => p.id === plan.patient_id);
      return plan.plan_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             patient?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             patient?.last_name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredPlans(filtered);
  }, [plans, patients, searchQuery]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedPlans, fetchedPatients, fetchedPractitioners] = await Promise.all([
        TreatmentPlan.list('-created_date'),
        Patient.list(),
        Practitioner.list()
      ]);
      setPlans(fetchedPlans);
      setPatients(fetchedPatients);
      setPractitioners(fetchedPractitioners);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (planData) => {
    try {
      if (editingPlan) {
        await TreatmentPlan.update(editingPlan.id, planData);
      } else {
        await TreatmentPlan.create(planData);
      }
      setShowForm(false);
      setEditingPlan(null);
      loadData();
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setShowForm(true);
    setSelectedPlan(null);
  };

  const handleNew = () => {
    setEditingPlan(null);
    setSelectedPlan(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900 flex items-center gap-3"><Heart className="w-8 h-8"/>Treatment Plans</h1>
          <Button onClick={handleNew} className="bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg"><Plus className="w-5 h-5 mr-2" /> New Plan</Button>
        </div>
        <div className="bg-white/80 rounded-xl p-6 mb-8 shadow-lg">
          <Input placeholder="Search plans by name or patient..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10"/>
          <Search className="absolute left-9 top-9 w-5 h-5 text-amber-600"/>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PlanList plans={filteredPlans} patients={patients} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} isLoading={isLoading}/>
          </div>
          <div className="space-y-6">
            {showForm && <PlanForm plan={editingPlan} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditingPlan(null); }} patients={patients} practitioners={practitioners} />}
            {selectedPlan && !showForm && <PlanDetails plan={selectedPlan} patient={patients.find(p => p.id === selectedPlan.patient_id)} practitioner={practitioners.find(p => p.id === selectedPlan.assigned_practitioner_id)} onEdit={handleEdit} />}
          </div>
        </div>
      </div>
    </div>
  );
}