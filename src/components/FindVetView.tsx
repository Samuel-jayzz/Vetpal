import React, { useState } from "react";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  PhoneCall,
  Video,
  MessageSquare,
  Clock,
  Navigation,
  Filter,
  CheckCircle2,
  Calendar,
  Building2,
  Sparkles,
  ChevronRight,
  Info,
} from "lucide-react";
import { Veterinarian, Clinic, AnimalProfile } from "../types";
import { GoogleMapsRadarView } from "./GoogleMapsRadarView";

interface FindVetViewProps {
  vets: Veterinarian[];
  clinics: Clinic[];
  animals: AnimalProfile[];
  onBookConsultation: (vet: Veterinarian, type: "VIDEO" | "CHAT" | "IN_PERSON" | "HOME_VISIT") => void;
  onCallVet: (vetPhone: string) => void;
}

export const FindVetView: React.FC<FindVetViewProps> = ({
  vets,
  clinics,
  animals,
  onBookConsultation,
  onCallVet,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("ALL");
  const [onlyEmergency, setOnlyEmergency] = useState(false);
  const [activeTab, setActiveTab] = useState<"VETS" | "CLINICS" | "MAP">("VETS");
  const [selectedVetDetails, setSelectedVetDetails] = useState<Veterinarian | null>(null);

  const specialtiesList = [
    { id: "ALL", label: "All Care" },
    { id: "Small Animals", label: "🐕 Dogs & Cats" },
    { id: "Poultry", label: "🐔 Poultry & Avian" },
    { id: "Livestock", label: "🐄 Cattle & Ruminants" },
    { id: "Emergency", label: "🚨 24/7 Emergency & ICU" },
    { id: "Surgery", label: "🩺 Soft Tissue Surgery" },
  ];

  const filteredVets = vets.filter((vet) => {
    const matchesSearch =
      vet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vet.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      vet.clinicName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === "ALL" ||
      vet.specialties.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));

    const matchesEmergency = !onlyEmergency || vet.availableForEmergency;

    return matchesSearch && matchesSpecialty && matchesEmergency;
  });

  const filteredClinics = clinics.filter((clinic) => {
    const matchesSearch =
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEmergency = !onlyEmergency || clinic.emergency247;
    return matchesSearch && matchesEmergency;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Title Header */}
      <div className="bg-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-teal-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-teal-800 text-teal-200 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% VCN-Verified Practitioners</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Find a Veterinarian & Animal Hospital
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm max-w-2xl mt-1">
              Connect with vetted companion animal clinicians, farm livestock consultants, and 24/7 trauma centers near you.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-teal-950/80 p-1.5 rounded-2xl border border-teal-700/50 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("MAP")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                activeTab === "MAP" ? "bg-teal-500 text-stone-950 shadow-xs" : "text-teal-200 hover:text-white"
              }`}
            >
              <span>🗺️ Google Maps Radar</span>
              <span className="bg-teal-900 text-teal-200 text-[10px] px-1.5 py-0.2 rounded-full">Live GPS</span>
            </button>
            <button
              onClick={() => setActiveTab("VETS")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === "VETS" ? "bg-teal-600 text-white" : "text-teal-200 hover:text-white"
              }`}
            >
              Veterinarians ({filteredVets.length})
            </button>
            <button
              onClick={() => setActiveTab("CLINICS")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === "CLINICS" ? "bg-teal-600 text-white" : "text-teal-200 hover:text-white"
              }`}
            >
              Hospitals & Clinics ({filteredClinics.length})
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, specialty (poultry, surgery), clinic..."
              className="w-full bg-white text-stone-900 placeholder-stone-400 pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyEmergency(!onlyEmergency)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                onlyEmergency
                  ? "bg-red-500 text-white shadow-sm ring-2 ring-red-300"
                  : "bg-teal-800 text-teal-100 hover:bg-teal-700"
              }`}
            >
              <span>🚨 24/7 Emergency Only</span>
            </button>
          </div>
        </div>

        {/* Specialty Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {specialtiesList.map((spec) => (
            <button
              key={spec.id}
              onClick={() => setSelectedSpecialty(spec.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedSpecialty === spec.id
                  ? "bg-white text-teal-950 shadow-xs"
                  : "bg-teal-800/80 text-teal-100 hover:bg-teal-700"
              }`}
            >
              {spec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "VETS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVets.map((vet) => (
            <div
              key={vet.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    <img
                      src={vet.avatarUrl}
                      alt={vet.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-600 shrink-0"
                    />
                    {vet.isOnlineNow && (
                      <span
                        className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-1 -right-1"
                        title="Online Now"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-base font-bold text-stone-900 truncate flex items-center gap-1.5">
                        <span>{vet.name}</span>
                        {vet.verified && (
                          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" title="Verified Practitioner" />
                        )}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{vet.rating}</span>
                        <span className="text-stone-400 font-normal">({vet.reviewCount})</span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-teal-800">{vet.title}</p>
                    <p className="text-xs text-stone-500 truncate">{vet.clinicName}</p>

                    <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{vet.distanceKm} km away</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>Responds &lt; {vet.responseTimeMinutes}m</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specialties & License */}
                <div className="flex flex-wrap gap-1.5">
                  {vet.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="bg-stone-100 text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                    >
                      {spec}
                    </span>
                  ))}
                  <span className="bg-teal-50 text-teal-800 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md">
                    {vet.licenseNumber}
                  </span>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{vet.bio}</p>
              </div>

              {/* Pricing & Actions */}
              <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-stone-400 font-medium">Consultation Fee</div>
                  <div className="text-base font-extrabold text-stone-900">
                    ₦{vet.consultationFeeNaira.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onCallVet(vet.phone)}
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                    title={`Call ${vet.name}`}
                  >
                    <PhoneCall className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onBookConsultation(vet, "VIDEO")}
                    className="bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Book Teleconsult</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hospital & Clinics View */}
      {activeTab === "CLINICS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-stone-900">{clinic.name}</h3>
                    {clinic.emergency247 && (
                      <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        24/7 ER
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{clinic.address}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-1 rounded-lg">
                    {clinic.distanceKm} km
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-semibold">{clinic.openHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>{clinic.vetsCount} on-duty veterinary surgeons</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {clinic.services.map((srv, idx) => (
                  <span
                    key={idx}
                    className="bg-stone-100 text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                  >
                    ✓ {srv}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                <a
                  href={`tel:${clinic.phone}`}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{clinic.phone}</span>
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(clinic.name + " " + clinic.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Visual Radar Map with Real-Time Google Maps Grounding */}
      {activeTab === "MAP" && (
        <GoogleMapsRadarView
          initialClinics={clinics}
          vets={vets}
          onBookConsultation={onBookConsultation}
          onCallVet={onCallVet}
        />
      )}
    </div>
  );
};
