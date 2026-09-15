import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  QrCode,
  Download,
  Calendar,
  Syringe,
  Stethoscope,
  HeartPulse,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Share2,
  Printer,
  Sparkles,
  Tag,
  Scale,
  Award,
} from "lucide-react";
import { AnimalProfile, HealthTimelineEvent } from "../types";

interface DigitalPassportViewProps {
  animal: AnimalProfile;
  animals: AnimalProfile[];
  onSelectAnimal: (animal: AnimalProfile) => void;
  onAddEventToAnimal: (animalId: string, event: HealthTimelineEvent) => void;
  onBack: () => void;
}

export const DigitalPassportView: React.FC<DigitalPassportViewProps> = ({
  animal,
  animals,
  onSelectAnimal,
  onAddEventToAnimal,
  onBack,
}) => {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState<HealthTimelineEvent["eventType"]>("VACCINATION");
  const [eventDescription, setEventDescription] = useState("");
  const [eventVetName, setEventVetName] = useState("Dr. Amina Bello, DVM");
  const [eventClinic, setEventClinic] = useState("Lagos Premier Veterinary Hospital");
  const [isCopied, setIsCopied] = useState(false);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newEvt: HealthTimelineEvent = {
      id: `evt-${Date.now()}`,
      animalId: animal.id,
      date: new Date().toISOString().split("T")[0],
      eventType,
      title: eventTitle,
      description: eventDescription,
      vetName: eventVetName,
      clinicName: eventClinic,
    };

    onAddEventToAnimal(animal.id, newEvt);
    setIsAddEventOpen(false);
    setEventTitle("");
    setEventDescription("");
  };

  const handleShareOrPrint = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!animal) {
    return (
      <div className="space-y-6 pb-16">
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-2xs space-y-4 max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto text-2xl">
            🐾
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-900">No Animal Registered Yet</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Register your pet or livestock animal to generate a verifiable digital health passport, track vaccinations, and log veterinary visits.
            </p>
          </div>
          <button
            onClick={onBack}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-5 py-3 rounded-2xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Go to My Animals</span>
          </button>
        </div>
      </div>
    );
  }

  // Group events by year
  const timelineByYear = (animal.timeline || []).reduce((acc, evt) => {
    const year = evt.date.split("-")[0] || "2026";
    if (!acc[year]) acc[year] = [];
    acc[year].push(evt);
    return acc;
  }, {} as Record<string, HealthTimelineEvent[]>);

  const years = Object.keys(timelineByYear).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-purple-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="text-xs text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Animals</span>
              </button>
              <span className="text-purple-400">•</span>
              <span className="bg-purple-800 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                VETPAL VERIFIED PASSPORT
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Digital Animal Health Passport
            </h1>
            <p className="text-purple-200 text-xs sm:text-sm max-w-2xl">
              Cryptographically timestamped lifetime health identity, immunization ledger, and travel clearance certificate.
            </p>
          </div>

          {/* Switch Animal Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={animal.id}
              onChange={(e) => {
                const found = animals.find((a) => a.id === e.target.value);
                if (found) onSelectAnimal(found);
              }}
              className="bg-purple-900/90 text-white border border-purple-700 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
            >
              {animals.map((a) => (
                <option key={a.id} value={a.id} className="bg-stone-900 text-white">
                  🐾 {a.name} ({a.species})
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsAddEventOpen(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Passport Identity Certificate & QR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Official Certificate Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-5">
            {/* Header Seal */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-700" />
                <span className="font-extrabold text-xs text-stone-900 tracking-wider">
                  VETPAL HEALTH IDENTITY
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                SECURE
              </span>
            </div>

            {/* Profile Photo & Quick Stats */}
            <div className="text-center space-y-3">
              <img
                src={animal.photoUrl}
                alt={animal.name}
                className="w-28 h-28 mx-auto rounded-2xl object-cover border-4 border-purple-100 shadow-sm"
              />
              <div>
                <h2 className="text-xl font-extrabold text-stone-900">{animal.name}</h2>
                <p className="text-xs font-semibold text-purple-800">{animal.breed}</p>
                <p className="text-xs text-stone-500">{animal.sex.replace("_", " ")} • {animal.age}</p>
              </div>
            </div>

            {/* Microchip / Passport Identifiers */}
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-medium">RFID / Microchip:</span>
                <span className="font-mono font-bold text-stone-900">{animal.tagOrMicrochip || "NG-CHIP-984021"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-medium">Weight:</span>
                <span className="font-bold text-stone-900">{animal.weightKg} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-medium">Owner / Farm:</span>
                <span className="font-bold text-stone-900">{animal.ownerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-medium">Registry Date:</span>
                <span className="font-mono text-stone-700">{animal.createdAt}</span>
              </div>
            </div>

            {/* Simulated Scannable QR Code for Border / Clinic Inspection */}
            <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 text-center space-y-2">
              <div className="w-24 h-24 bg-white p-2 mx-auto rounded-xl border border-purple-300 shadow-2xs flex items-center justify-center">
                <QrCode className="w-20 h-20 text-purple-950" />
              </div>
              <div className="text-[10px] font-bold text-purple-900 uppercase tracking-wider">
                Scannable Clinical Verification QR
              </div>
              <p className="text-[10px] text-stone-500">
                Authorized vets and agricultural checkpoints can scan to authenticate immunization records.
              </p>
            </div>

            {/* Export Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleShareOrPrint}
                className="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-purple-300" />
                <span>{isCopied ? "✓ Certificate Exported!" : "Print / PDF Export"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chronological Health Timeline */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>Chronological Health & Clinical Timeline</span>
                </h3>
                <p className="text-xs text-stone-500">
                  All official treatments, vaccinations, deworming, and surgical records.
                </p>
              </div>
              <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full">
                {animal.timeline.length} Recorded Events
              </span>
            </div>

            {/* Timeline Stream */}
            <div className="space-y-8">
              {years.map((year) => (
                <div key={year} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-900 text-white text-xs font-extrabold px-3 py-1 rounded-lg">
                      {year}
                    </span>
                    <div className="flex-1 h-px bg-stone-200" />
                  </div>

                  <div className="space-y-4 pl-4 border-l-2 border-purple-200">
                    {timelineByYear[year].map((evt) => (
                      <div
                        key={evt.id}
                        className="relative bg-stone-50/80 hover:bg-stone-50 p-4 rounded-2xl border border-stone-200 shadow-2xs transition-all space-y-2"
                      >
                        {/* Timeline node dot */}
                        <div className="absolute -left-[23px] top-4 w-3.5 h-3.5 rounded-full bg-purple-600 border-2 border-white shadow-2xs" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                                evt.eventType === "VACCINATION"
                                  ? "bg-blue-100 text-blue-800"
                                  : evt.eventType === "DEWORMING"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : evt.eventType === "EMERGENCY"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {evt.eventType}
                            </span>
                            <h4 className="text-sm font-bold text-stone-900">{evt.title}</h4>
                          </div>
                          <span className="text-[11px] text-stone-500 font-mono">{evt.date}</span>
                        </div>

                        <p className="text-xs text-stone-700 leading-relaxed">{evt.description}</p>

                        {(evt.vetName || evt.clinicName) && (
                          <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-1 border-t border-stone-200/60">
                            {evt.vetName && <span>👨🏾‍⚕️ {evt.vetName}</span>}
                            {evt.clinicName && <span>🏥 {evt.clinicName}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Log Event Modal */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span>Log Health Passport Event</span>
              </h3>
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Event Type *</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
                >
                  <option value="VACCINATION">💉 Vaccination</option>
                  <option value="CONSULTATION">🩺 Veterinary Consultation</option>
                  <option value="DEWORMING">💊 Deworming / Parasite Control</option>
                  <option value="LAB_TEST">🔬 Lab Test / Bloodwork</option>
                  <option value="SURGERY">🏥 Surgery / Dental Procedure</option>
                  <option value="EMERGENCY">🚨 Emergency Treatment</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Annual Rabies Booster, Fecal Floatation Test"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Clinical Description & Notes</label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Details of procedure, vitals (heart rate, temperature), medicine batch..."
                  rows={3}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Attending Vet & Clinic</label>
                <input
                  type="text"
                  value={eventVetName}
                  onChange={(e) => setEventVetName(e.target.value)}
                  placeholder="Doctor Name"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-medium mb-1.5"
                />
                <input
                  type="text"
                  value={eventClinic}
                  onChange={(e) => setEventClinic(e.target.value)}
                  placeholder="Clinic Name"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold"
                >
                  Save to Passport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
