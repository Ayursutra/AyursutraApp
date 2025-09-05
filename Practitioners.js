import React, { useState, useEffect } from "react";
import { Practitioner } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, UserCheck } from "lucide-react";

import PractitionerList from "../components/practitioners/PractitionerList";
import PractitionerForm from "../components/practitioners/PractitionerForm";
import PractitionerDetails from "../components/practitioners/PractitionerDetails";

export default function Practitioners() {
  const [practitioners, setPractitioners] = useState([]);
  const [filteredPractitioners, setFilteredPractitioners] = useState([]);
  const [selectedPractitioner, setSelectedPractitioner] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPractitioner, setEditingPractitioner] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get('action');

  useEffect(() => {
    loadPractitioners();
    
    if (action === 'new') {
      setShowForm(true);
    }
  }, [action]);

  useEffect(() => {
    let filtered = practitioners.filter(p => 
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialization?.join(' ').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPractitioners(filtered);
  }, [practitioners, searchQuery]);

  const loadPractitioners = async () => {
    setIsLoading(true);
    try {
      const fetchedPractitioners = await Practitioner.list('first_name');
      setPractitioners(fetchedPractitioners);
      setFilteredPractitioners(fetchedPractitioners);
    } catch (error) {
      console.error('Error loading practitioners:', error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (practitionerData) => {
    try {
      if (editingPractitioner) {
        await Practitioner.update(editingPractitioner.id, practitionerData);
      } else {
        await Practitioner.create(practitionerData);
      }
      setShowForm(false);
      setEditingPractitioner(null);
      loadPractitioners();
    } catch (error) {
      console.error('Error saving practitioner:', error);
    }
  };

  const handleEdit = (practitioner) => {
    setEditingPractitioner(practitioner);
    setShowForm(true);
    setSelectedPractitioner(null);
  };

  const handleNew = () => {
    setEditingPractitioner(null);
    setSelectedPractitioner(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-900 mb-2 flex items-center gap-3">
              <UserCheck className="w-8 h-8"/>
              Practitioners
            </h1>
            <p className="text-amber-700">Manage your team of Ayurvedic specialists</p>
          </div>
          <Button 
            onClick={handleNew}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Practitioner
          </Button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border-0">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-amber-600" />
            <Input
              placeholder="Search by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-amber-200 focus:border-amber-400"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PractitionerList
              practitioners={filteredPractitioners}
              selectedPractitioner={selectedPractitioner}
              setSelectedPractitioner={setSelectedPractitioner}
              isLoading={isLoading}
            />
          </div>

          <div className="space-y-6">
            {showForm && (
              <PractitionerForm
                practitioner={editingPractitioner}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingPractitioner(null);
                }}
              />
            )}
            
            {selectedPractitioner && !showForm && (
              <PractitionerDetails
                practitioner={selectedPractitioner}
                onEdit={handleEdit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}