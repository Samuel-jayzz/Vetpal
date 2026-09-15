/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ViewMode,
  UserRole,
  LanguageCode,
  AnimalProfile,
  Veterinarian,
  Clinic,
  FarmerBatch,
  DiseaseAlert,
  TriageAssessment,
  HealthTimelineEvent,
  UserProfile,
  CoordinatedCareCase,
  EpiSignal,
  CommandCenterStats,
} from "./types";
import {
  INITIAL_ANIMALS,
  MOCK_VETS,
  MOCK_CLINICS,
  INITIAL_BATCHES,
  MOCK_DISEASE_ALERTS,
  INITIAL_USERS,
  INITIAL_COORDINATED_CASES,
  INITIAL_EPI_SIGNALS,
  INITIAL_COMMAND_CENTER_STATS,
} from "./data/mockData";
import { Navbar } from "./components/Navbar";
import { HomeScreen } from "./components/HomeScreen";
import { EmergencyView } from "./components/EmergencyView";
import { AIAssistantView } from "./components/AIAssistantView";
import { FindVetView } from "./components/FindVetView";
import { MyAnimalsView } from "./components/MyAnimalsView";
import { DigitalPassportView } from "./components/DigitalPassportView";
import { FarmerHubView } from "./components/FarmerHubView";
import { AdminPortalView } from "./components/AdminPortalView";
import { TeleconsultationRoom } from "./components/TeleconsultationRoom";
import { LowConnectivityModal } from "./components/LowConnectivityModal";
import { AuthModal } from "./components/AuthModal";
import { WelcomeAuthScreen } from "./components/WelcomeAuthScreen";
import { CareCoordinatorView } from "./components/CareCoordinatorView";
import { CommandCenterView } from "./components/CommandCenterView";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>("HOME");
  const [currentRole, setCurrentRole] = useState<UserRole>("PET_OWNER");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [isLowConnectivityModalOpen, setIsLowConnectivityModalOpen] = useState(false);

  // User & Auth State (null by default to show the first-impression onboarding & auth interface)
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"SIGN_IN" | "SIGN_UP">("SIGN_IN");
  const [authModalRole, setAuthModalRole] = useState<UserRole>("PET_OWNER");

  // Core Dynamic State
  const [animals, setAnimals] = useState<AnimalProfile[]>(INITIAL_ANIMALS);
  const [selectedAnimalForPassport, setSelectedAnimalForPassport] = useState<AnimalProfile>(INITIAL_ANIMALS[0]);
  const [vets, setVets] = useState<Veterinarian[]>(MOCK_VETS);
  const [clinics, setClinics] = useState<Clinic[]>(MOCK_CLINICS);
  const [farmerBatches, setFarmerBatches] = useState<FarmerBatch[]>(INITIAL_BATCHES);
  const [diseaseAlerts, setDiseaseAlerts] = useState<DiseaseAlert[]>(MOCK_DISEASE_ALERTS);

  // End-to-End Care Coordinator & Health Intelligence State
  const [coordinatedCases, setCoordinatedCases] = useState<CoordinatedCareCase[]>(INITIAL_COORDINATED_CASES);
  const [epiSignals, setEpiSignals] = useState<EpiSignal[]>(INITIAL_EPI_SIGNALS);
  const [commandCenterStats, setCommandCenterStats] = useState<CommandCenterStats>(INITIAL_COMMAND_CENTER_STATS);

  // Active Teleconsultation Context
  const [activeTeleVet, setActiveTeleVet] = useState<Veterinarian | null>(null);
  const [activeTeleAnimal, setActiveTeleAnimal] = useState<AnimalProfile>(INITIAL_ANIMALS[0]);
  const [activeTeleReason, setActiveTeleReason] = useState<string>("");

  // AI Triage Initial query
  const [initialTriageQuery, setInitialTriageQuery] = useState<string>("");

  // Toast Notification
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Auth Handlers
  const handleOpenAuthModal = (mode: "SIGN_IN" | "SIGN_UP" = "SIGN_IN", role?: UserRole) => {
    setAuthModalMode(mode);
    if (role) {
      setAuthModalRole(role);
    } else if (currentUser) {
      setAuthModalRole(currentUser.role);
    } else {
      setAuthModalRole(currentRole);
    }
    setIsAuthModalOpen(true);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    showNotification("Signed out of VetPal session.");
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.role === "FARMER") setCurrentView("FARMER_HUB");
    else if (user.role === "VET") setCurrentView("FIND_VET");
    else if (user.role === "ADMIN") setCurrentView("ADMIN_PORTAL");
    else setCurrentView("HOME");
    showNotification(`Welcome back, ${user.fullName}!`);
  };

  const handleRegister = (
    newUser: UserProfile,
    initialAnimal?: AnimalProfile,
    initialBatch?: FarmerBatch,
    initialVetClinic?: Veterinarian
  ) => {
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setCurrentRole(newUser.role);

    if (initialAnimal) {
      setAnimals((prev) => [initialAnimal, ...prev]);
      setSelectedAnimalForPassport(initialAnimal);
    }
    if (initialBatch) {
      setFarmerBatches((prev) => [initialBatch, ...prev]);
    }
    if (initialVetClinic) {
      setVets((prev) => [initialVetClinic, ...prev]);
    }

    if (newUser.role === "FARMER") {
      setCurrentView("FARMER_HUB");
    } else if (newUser.role === "VET") {
      setCurrentView("FIND_VET");
    } else if (initialAnimal) {
      setCurrentView("MY_ANIMALS");
    } else {
      setCurrentView("HOME");
    }

    showNotification(`Account created successfully for ${newUser.fullName}!`);
  };

  // Start AI Triage with custom prompt
  const handleStartTriage = (query?: string) => {
    if (query) setInitialTriageQuery(query);
    setCurrentView("AI_ASSISTANT");
  };

  // Open Emergency Mode immediately
  const handleTriggerEmergency = () => {
    setCurrentView("EMERGENCY");
  };

  // Book Consultation / Teleconsultation
  const handleBookConsultation = (
    vet: Veterinarian,
    type: "VIDEO" | "CHAT" | "IN_PERSON" | "HOME_VISIT" = "VIDEO"
  ) => {
    setActiveTeleVet(vet);
    setActiveTeleAnimal(animals[0]);
    setActiveTeleReason("Scheduled Consultation for routine check & assessment");
    setCurrentView("TELECONSULTATION");
    showNotification(`Consultation room opened with ${vet.name}`);
  };

  // Start emergency teleconsult directly
  const handleStartEmergencyTeleconsult = (vetId: string, animalId: string, emergencyReason: string) => {
    const foundVet = vets.find((v) => v.id === vetId) || vets[0];
    const foundAnimal = animals.find((a) => a.id === animalId) || animals[0];
    setActiveTeleVet(foundVet);
    setActiveTeleAnimal(foundAnimal);
    setActiveTeleReason(emergencyReason);
    setCurrentView("TELECONSULTATION");
    showNotification(`Emergency priority session opened with ${foundVet.name}`);
  };

  // Save AI Assessment to Health Passport
  const handleSaveTriageToPassport = (assessment: TriageAssessment) => {
    const targetAnimalId = animals[0]?.id;
    const newEvent: HealthTimelineEvent = {
      id: `triage-evt-${Date.now()}`,
      animalId: targetAnimalId,
      date: new Date().toISOString().split("T")[0],
      eventType: "EMERGENCY",
      title: `AI Triage: ${assessment.urgencyLevel} Priority`,
      description: `${assessment.summary}. Recommended actions: ${assessment.immediateGuidance.slice(0, 2).join("; ")}`,
      vetName: "VetPal Clinical AI Engine",
      clinicName: "VetPal Telemedicine Gateway",
    };

    setAnimals((prev) =>
      prev.map((a) =>
        a.id === targetAnimalId
          ? {
              ...a,
              timeline: [newEvent, ...a.timeline],
            }
          : a
      )
    );
    showNotification(`Assessment added to ${animals[0]?.name}'s Digital Health Passport!`);
  };

  // Save Doctor E-Prescription to Health Passport
  const handleSavePrescriptionToPassport = (prescription: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    signedBy: string;
  }) => {
    if (!activeTeleAnimal) return;

    const newEvent: HealthTimelineEvent = {
      id: `rx-evt-${Date.now()}`,
      animalId: activeTeleAnimal.id,
      date: new Date().toISOString().split("T")[0],
      eventType: "CONSULTATION",
      title: `E-Prescription: ${prescription.medication}`,
      description: `Dosage: ${prescription.dosage}, Frequency: ${prescription.frequency}, Duration: ${prescription.duration}. Instructions: ${prescription.instructions}. Digitally signed by ${prescription.signedBy}`,
      vetName: activeTeleVet?.name || "Attending Veterinarian",
      clinicName: activeTeleVet?.clinicName || "VetPal Clinical Network",
    };

    setAnimals((prev) =>
      prev.map((a) =>
        a.id === activeTeleAnimal.id
          ? {
              ...a,
              timeline: [newEvent, ...a.timeline],
            }
          : a
      )
    );
    showNotification(`E-Prescription saved to ${activeTeleAnimal.name}'s Health Passport!`);
  };

  // Add new Animal Profile
  const handleAddNewAnimal = (newAnimal: AnimalProfile) => {
    setAnimals((prev) => [newAnimal, ...prev]);
    showNotification(`Added ${newAnimal.name} to your animal registry.`);
  };

  // Add event to Animal Passport
  const handleAddEventToAnimal = (animalId: string, event: HealthTimelineEvent) => {
    setAnimals((prev) =>
      prev.map((a) =>
        a.id === animalId
          ? {
              ...a,
              timeline: [event, ...a.timeline],
            }
          : a
      )
    );
    showNotification("Logged event in Digital Health Passport.");
  };

  // Coordinated Care Pipeline Handlers
  const handleSaveCase = (updatedCase: CoordinatedCareCase) => {
    setCoordinatedCases((prev) =>
      prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
    );

    if (updatedCase.treatmentRecord) {
      const matchedAnimal = animals.find(
        (a) => a.name.toLowerCase() === updatedCase.animalInfo.name.toLowerCase()
      );
      if (matchedAnimal) {
        const newEvt: HealthTimelineEvent = {
          id: `case-evt-${Date.now()}`,
          animalId: matchedAnimal.id,
          date: new Date().toISOString().split("T")[0],
          eventType: "CONSULTATION",
          title: `Care Protocol #${updatedCase.caseNumber}: ${updatedCase.treatmentRecord.provisionalDiagnosis}`,
          description: `Administered: ${updatedCase.treatmentRecord.treatmentAdministered}. Outcome: ${updatedCase.finalOutcome || "Follow-up ongoing"}`,
          vetName: updatedCase.treatmentRecord.veterinarianName,
          clinicName: updatedCase.professionalMatch?.clinicName || "VetPal Clinical Network",
        };
        setAnimals((prev) =>
          prev.map((a) =>
            a.id === matchedAnimal.id ? { ...a, timeline: [newEvt, ...a.timeline] } : a
          )
        );
      }
    }

    showNotification(`Case ${updatedCase.caseNumber} updated across the care pipeline.`);
  };

  const handleCreateNewCase = (newCase: CoordinatedCareCase) => {
    setCoordinatedCases((prev) => [newCase, ...prev]);
    setCommandCenterStats((prev) => ({
      ...prev,
      casesThisWeek: prev.casesThisWeek + 1,
      activeCases: prev.activeCases + 1,
      urgentCases: newCase.triage.classification === "URGENT" ? prev.urgentCases + 1 : prev.urgentCases,
      criticalCases: newCase.triage.classification === "CRITICAL" ? prev.criticalCases + 1 : prev.criticalCases,
    }));
    showNotification(`Case ${newCase.caseNumber} initiated across 9-step care coordinator!`);
  };

  // Select animal and view passport
  const handleSelectAnimalForPassport = (animal: AnimalProfile) => {
    setSelectedAnimalForPassport(animal);
    setCurrentView("PASSPORT");
  };

  // User-scoped data filtering for personalized portals
  // Admin sees all records across the national network; individual users see their own registered animals and batches.
  // If not logged in, show demo animal/batch records.
  const userAnimals = currentUser
    ? currentUser.role === "ADMIN"
      ? animals
      : animals.filter((a) => {
          if (a.ownerId && a.ownerId === currentUser.id) return true;
          if (a.ownerEmail && currentUser.email && a.ownerEmail.toLowerCase() === currentUser.email.toLowerCase()) return true;
          if (currentUser.registeredAnimalIds && currentUser.registeredAnimalIds.includes(a.id)) return true;
          if (a.ownerName && a.ownerName.toLowerCase() === currentUser.fullName.toLowerCase()) return true;
          return false;
        })
    : animals;

  const userBatches = currentUser
    ? currentUser.role === "ADMIN"
      ? farmerBatches
      : farmerBatches.filter((b) => {
          if (b.ownerId && b.ownerId === currentUser.id) return true;
          if (b.ownerEmail && currentUser.email && b.ownerEmail.toLowerCase() === currentUser.email.toLowerCase()) return true;
          if (currentUser.registeredBatchIds && currentUser.registeredBatchIds.includes(b.id)) return true;
          return false;
        })
    : farmerBatches;

  // Add new livestock batch
  const handleAddFarmerBatch = (batch: FarmerBatch) => {
    setFarmerBatches((prev) => [batch, ...prev]);
    showNotification(`Registered flock/herd: ${batch.name}`);
  };

  // Update mortality count
  const handleUpdateBatchMortality = (batchId: string, addedMortality: number) => {
    setFarmerBatches((prev) =>
      prev.map((b) => {
        if (b.id === batchId) {
          const newMort = b.mortalityCount + addedMortality;
          const newCount = Math.max(0, b.currentCount - addedMortality);
          return {
            ...b,
            mortalityCount: newMort,
            currentCount: newCount,
          };
        }
        return b;
      })
    );
    showNotification(`Recorded ${addedMortality} mortality update.`);
  };

  // Admin approves vet
  const handleApproveVet = (vetId: string) => {
    showNotification("Practitioner license approved and accredited on VetPal.");
  };

  // Admin broadcasts disease outbreak
  const handleBroadcastAlert = (alert: DiseaseAlert) => {
    setDiseaseAlerts((prev) => [alert, ...prev]);
    showNotification(`National broadcast dispatched to regional livestock farmers.`);
  };

  // Switch role helper (e.g. switching to FARMER switches to FARMER_HUB)
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === "FARMER") setCurrentView("FARMER_HUB");
    else if (role === "ADMIN") setCurrentView("ADMIN_PORTAL");
    else if (role === "VET") setCurrentView("FIND_VET");
    else setCurrentView("HOME");
  };

  // If user is not authenticated, present the first-impression Welcome & Auth Onboarding Gateway
  if (!currentUser) {
    return (
      <WelcomeAuthScreen
        onLogin={handleLogin}
        onRegister={handleRegister}
        existingUsers={users}
        animalsCount={animals.length}
        batchesCount={farmerBatches.length}
        vetsCount={vets.length}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col selection:bg-emerald-200">
      {/* Top Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        currentRole={currentRole}
        language={language}
        currentUser={currentUser}
        animalCount={animals.length}
        batchCount={farmerBatches.length}
        onNavigate={(view) => setCurrentView(view)}
        onRoleChange={handleRoleChange}
        onLanguageChange={(lang) => setLanguage(lang)}
        onTriggerEmergency={handleTriggerEmergency}
        onOpenLowConnectivityModal={() => setIsLowConnectivityModalOpen(true)}
        onOpenAuthModal={handleOpenAuthModal}
        onSignOut={handleSignOut}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-stone-700 animate-in fade-in slide-in-from-top-3 duration-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === "HOME" && (
          <HomeScreen
            animals={userAnimals}
            vets={vets}
            clinics={clinics}
            diseaseAlerts={diseaseAlerts}
            language={language}
            currentUser={currentUser}
            onStartTriage={handleStartTriage}
            onTriggerEmergency={handleTriggerEmergency}
            onNavigate={(view) => setCurrentView(view)}
            onSelectAnimalForPassport={handleSelectAnimalForPassport}
            onOpenAuthModal={handleOpenAuthModal}
          />
        )}

        {currentView === "EMERGENCY" && (
          <EmergencyView
            animals={userAnimals}
            clinics={clinics}
            vets={vets}
            onStartTeleconsult={handleStartEmergencyTeleconsult}
            onBack={() => setCurrentView("HOME")}
          />
        )}

        {currentView === "AI_ASSISTANT" && (
          <AIAssistantView
            animals={userAnimals}
            language={language}
            initialQuery={initialTriageQuery}
            onNavigate={(view) => setCurrentView(view)}
            onBookVet={(triageNote) => {
              setActiveTeleVet(vets[0]);
              setActiveTeleAnimal(userAnimals[0] || animals[0]);
              setActiveTeleReason(triageNote);
              setCurrentView("TELECONSULTATION");
            }}
            onSaveToPassport={handleSaveTriageToPassport}
            onTriggerEmergency={handleTriggerEmergency}
          />
        )}

        {currentView === "FIND_VET" && (
          <FindVetView
            vets={vets}
            clinics={clinics}
            animals={userAnimals}
            onBookConsultation={handleBookConsultation}
            onCallVet={(phone) => {
              window.open(`tel:${phone}`);
            }}
          />
        )}

        {currentView === "MY_ANIMALS" && (
          <MyAnimalsView
            animals={userAnimals}
            currentUser={currentUser}
            onSelectAnimalForPassport={handleSelectAnimalForPassport}
            onAddNewAnimal={handleAddNewAnimal}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === "PASSPORT" && (
          <DigitalPassportView
            animal={selectedAnimalForPassport || userAnimals[0] || animals[0]}
            animals={userAnimals}
            onSelectAnimal={(animal) => setSelectedAnimalForPassport(animal)}
            onAddEventToAnimal={handleAddEventToAnimal}
            onBack={() => setCurrentView("MY_ANIMALS")}
          />
        )}

        {currentView === "FARMER_HUB" && (
          <FarmerHubView
            batches={userBatches}
            alerts={diseaseAlerts}
            language={language}
            currentUser={currentUser}
            onAddBatch={handleAddFarmerBatch}
            onUpdateBatchMortality={handleUpdateBatchMortality}
          />
        )}

        {currentView === "ADMIN_PORTAL" && (
          <AdminPortalView
            vets={vets}
            alerts={diseaseAlerts}
            animals={animals}
            batches={farmerBatches}
            users={users}
            currentUser={currentUser}
            onApproveVet={handleApproveVet}
            onBroadcastAlert={handleBroadcastAlert}
          />
        )}

        {currentView === "TELECONSULTATION" && activeTeleVet && (
          <TeleconsultationRoom
            vet={activeTeleVet}
            animal={activeTeleAnimal || animals[0]}
            consultationReason={activeTeleReason}
            onEndCall={() => setCurrentView("HOME")}
            onSavePrescriptionToPassport={handleSavePrescriptionToPassport}
          />
        )}

        {currentView === "CARE_COORDINATOR" && (
          <CareCoordinatorView
            cases={coordinatedCases}
            vets={vets}
            animals={userAnimals}
            onSaveCase={handleSaveCase}
            onCreateNewCase={handleCreateNewCase}
            onNavigate={(view) => setCurrentView(view)}
            onOpenCommandCenter={() => setCurrentView("COMMAND_CENTER")}
          />
        )}

        {currentView === "COMMAND_CENTER" && (
          <CommandCenterView
            stats={commandCenterStats}
            signals={epiSignals}
            cases={coordinatedCases}
            onNavigate={(view) => setCurrentView(view)}
            onDispatchInvestigation={(signalId) => {
              setEpiSignals((prev) =>
                prev.map((s) =>
                  s.id === signalId ? { ...s, investigationStatus: "FIELD_TEAM_DISPATCHED" } : s
                )
              );
              showNotification("Field epidemiological team dispatched for laboratory swabbing.");
            }}
          />
        )}
      </main>

      {/* Auth & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        initialRole={authModalRole}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        existingUsers={users}
      />

      {/* Low-Connectivity & USSD Fallback Modal */}
      <LowConnectivityModal
        isOpen={isLowConnectivityModalOpen}
        language={language}
        onClose={() => setIsLowConnectivityModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-800">VetPal Ecosystem</span>
            <span>•</span>
            <span>Licensed Animal Healthcare & Telemedicine</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsLowConnectivityModalOpen(true)}
              className="text-stone-700 hover:text-emerald-700 font-semibold cursor-pointer"
            >
              USSD (*384*911#) & SMS Fallback
            </button>
            <button
              onClick={() => setCurrentView("ADMIN_PORTAL")}
              className="text-stone-700 hover:text-purple-700 font-semibold cursor-pointer"
            >
              Regulatory & VCN Portal
            </button>
            <span className="text-stone-400">
              Safety rule: "VetPal assists decision-making; veterinarians make clinical decisions."
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
