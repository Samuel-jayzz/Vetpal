import React, { useState } from "react";
import {
  AlertTriangle,
  Bot,
  Stethoscope,
  PawPrint,
  Syringe,
  FileText,
  Mic,
  MicOff,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Clock,
  Sparkles,
  Search,
  Radio,
  Tractor,
  Activity,
  ChevronRight,
  Info,
  Calendar,
  AlertOctagon,
  UserPlus,
  Wheat,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { ViewMode, AnimalProfile, DiseaseAlert, LanguageCode, Veterinarian, Clinic, UserProfile, UserRole } from "../types";
import { TRANSLATIONS } from "../data/mockData";

interface HomeScreenProps {
  animals: AnimalProfile[];
  vets: Veterinarian[];
  clinics: Clinic[];
  diseaseAlerts: DiseaseAlert[];
  language: LanguageCode;
  currentUser?: UserProfile | null;
  onStartTriage: (query?: string) => void;
  onTriggerEmergency: () => void;
  onNavigate: (view: ViewMode) => void;
  onSelectAnimalForPassport: (animal: AnimalProfile) => void;
  onOpenAuthModal?: (mode?: "SIGN_IN" | "SIGN_UP", role?: UserRole) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  animals,
  vets,
  clinics,
  diseaseAlerts,
  language,
  currentUser,
  onStartTriage,
  onTriggerEmergency,
  onNavigate,
  onSelectAnimalForPassport,
  onOpenAuthModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isListening, setIsListening] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const quickSymptoms = [
    { label: "Dog vomiting & not eating", species: "Dog", icon: "🐕", urgency: "High" },
    { label: "Puppy with bloody diarrhea", species: "Puppy", icon: "🐶", urgency: "Critical" },
    { label: "Goat swollen abdomen / bloat", species: "Goat", icon: "🐐", urgency: "Critical" },
    { label: "Chicken sneezing & gasping", species: "Poultry", icon: "🐔", urgency: "High" },
    { label: "Cat straining in litter box", species: "Cat", icon: "🐱", urgency: "Critical" },
    { label: "Cow sudden milk drop & fever", species: "Cattle", icon: "🐄", urgency: "High" },
  ];

  const handleVoiceToggle = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      onStartTriage("My animal is lethargic, coughing and refuses feed.");
      return;
    }
    try {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === "ha" ? "ha-NG" : language === "yo" ? "yo-NG" : language === "ig" ? "ig-NG" : "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        setIsListening(false);
        onStartTriage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch {
      setIsListening(false);
      onStartTriage("My animal is lethargic, coughing and refuses feed.");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onStartTriage(searchTerm.trim());
    } else {
      onStartTriage();
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Hero / Prompt Search Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-700/40">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>AI Animal Triage & Veterinary Rapid Handoff</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            What do you need help with?
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
            Something is wrong with your animal? VetPal assesses urgency, gives safe immediate guidance, and instantly connects you to verified veterinarians.
          </p>

          {/* Prominent Search / Voice Input Bar */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-xl border-2 border-emerald-400/50 focus-within:border-emerald-300 transition-all">
              <Search className="w-6 h-6 text-stone-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full px-3 py-3 text-stone-900 placeholder-stone-400 text-sm sm:text-base font-medium focus:outline-none bg-transparent"
                id="home-symptom-input"
              />
              <div className="flex items-center gap-1.5 mr-1">
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                  title="Voice input"
                  id="home-voice-btn"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-700" />}
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  id="home-triage-submit-btn"
                >
                  <span>Triage</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Quick Symptom Chips */}
          <div className="space-y-2 pt-2">
            <div className="text-xs text-emerald-200/80 font-medium">
              Common acute concerns (Click for instant triage):
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {quickSymptoms.map((symptom, idx) => (
                <button
                  key={idx}
                  onClick={() => onStartTriage(symptom.label)}
                  className="bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/50 hover:border-emerald-500 text-emerald-100 hover:text-white text-xs font-medium px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{symptom.icon}</span>
                  <span>{symptom.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Safety Boundary Notice Banner */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-xs sm:text-sm shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-amber-950">
            VetPal Core Clinical Philosophy & Safety Rule
          </p>
          <p className="text-amber-800/90 text-xs">
            {t.safeTriageBanner} VetPal assists emergency decision-making, isolates risks, and never administers human NSAIDs/paracetamol which can be fatal to pets.
          </p>
        </div>
      </div>

      {/* THE HEART OF THE SYSTEM: Coordinated Animal Health Response & Command Center */}
      <section className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-black border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE CORE SYSTEM ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Coordinated Animal Health Response
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              VetPal's differentiation isn't just "we have more features"—it is:{" "}
              <strong className="text-teal-300">"We coordinate the entire animal-health response."</strong>{" "}
              Taking you from <span className="text-amber-300 italic">"Something is wrong with my animal"</span> all
              the way to <span className="text-emerald-300 italic">"Problem assessed, professional contacted, treatment recorded, and VetPal is following up."</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate("CARE_COORDINATOR")}
              className="px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-black text-xs cursor-pointer transition-all shadow-md flex items-center gap-2"
            >
              <span>Launch 9-Step Care Flow</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("COMMAND_CENTER")}
              className="px-4 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-500/30 font-bold text-xs cursor-pointer transition-all flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Health Intelligence Hub</span>
            </button>
          </div>
        </div>

        {/* 9-Step Summary Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 pt-2 border-t border-stone-800/80 text-center">
          {[
            { step: "1", title: "Report", sub: "Voice/Text/WhatsApp" },
            { step: "2", title: "Triage", sub: "Minimal Questions" },
            { step: "3", title: "Classify", sub: "Routine / Urgent / Critical" },
            { step: "4", title: "Respond", sub: "Nearest Vet / VPP" },
            { step: "5", title: "Create Case", sub: "Structured Handoff" },
            { step: "6", title: "Treatment", sub: "Prescription & Rx" },
            { step: "7", title: "Follow-Up", sub: "24h / 48h / 7d Auto" },
            { step: "8", title: "Outcome", sub: "Recovery Tracking" },
            { step: "9", title: "Learning", sub: "Epi Intelligence" },
          ].map((s, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-stone-800/60 border border-stone-700/60 hover:bg-stone-800 transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-black text-[10px] inline-flex items-center justify-center mb-1">
                {s.step}
              </span>
              <div className="text-xs font-extrabold text-white">{s.title}</div>
              <div className="text-[9px] text-stone-400 truncate">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Role Registration & Dual Animal Registry Gateway */}
      <section className="bg-gradient-to-br from-stone-900 via-stone-850 to-emerald-950 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-stone-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Unified Animal & Practitioner Registry</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {currentUser ? `Active Account: ${currentUser.fullName}` : "Join VetPal: Register Yourself & Your Animals"}
            </h3>
            <p className="text-xs text-stone-300 max-w-xl">
              {currentUser
                ? `Logged in as a ${
                    currentUser.role === "PET_OWNER"
                      ? "Pet Owner"
                      : currentUser.role === "FARMER"
                      ? "Commercial Farmer"
                      : currentUser.role === "VET"
                      ? "VCN Accredited Doctor"
                      : "National Admin"
                  }. Register additional pets, livestock batches or manage clinical settings.`
                : "Free digital health passports, automated vaccination schedules, farm mortality tracking & licensed telehealth for owners, farmers and veterinary clinicians across Africa."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!currentUser ? (
              <>
                <button
                  onClick={() => onOpenAuthModal?.("SIGN_IN")}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-xs px-4 py-2.5 rounded-xl transition-all border border-stone-700 cursor-pointer"
                  id="home-banner-signin-btn"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuthModal?.("SIGN_UP")}
                  className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-stone-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  id="home-banner-register-btn"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register Free</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onOpenAuthModal?.("SIGN_UP", currentUser.role)}
                className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                id="home-banner-register-animal-btn"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {currentUser.role === "FARMER"
                    ? "Register New Flock/Herd"
                    : currentUser.role === "VET"
                    ? "Update Clinic Profile"
                    : "Register New Pet"}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Quick Registration Direct Doors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() => onOpenAuthModal?.("SIGN_UP", "PET_OWNER")}
            className="bg-stone-900/90 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/60 rounded-2xl p-4 transition-all cursor-pointer group space-y-2.5"
            id="door-pet-owner-reg"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <PawPrint className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Register <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div>
              <div className="text-xs font-extrabold text-white">🐶 For Pet Owners</div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Register dogs, cats & companion animals for 24/7 AI triage & Digital Passports.
              </p>
            </div>
          </div>

          <div
            onClick={() => onOpenAuthModal?.("SIGN_UP", "FARMER")}
            className="bg-stone-900/90 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/60 rounded-2xl p-4 transition-all cursor-pointer group space-y-2.5"
            id="door-farmer-reg"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Wheat className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Register <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div>
              <div className="text-xs font-extrabold text-white">🌾 For Farmers & Herds</div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Register commercial poultry, cattle & goat herds with automated SMS disease alerts.
              </p>
            </div>
          </div>

          <div
            onClick={() => onOpenAuthModal?.("SIGN_UP", "VET")}
            className="bg-stone-900/90 hover:bg-stone-800 border border-stone-800 hover:border-teal-500/60 rounded-2xl p-4 transition-all cursor-pointer group space-y-2.5"
            id="door-vet-reg"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Register <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div>
              <div className="text-xs font-extrabold text-white">🩺 For Vet Professionals</div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Accredit your DVM license, publish your clinic & provide telehealth consultations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main 6 Big Action Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Primary Care Services
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            Available 24/7 on web & low-data mobile
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: 🚨 EMERGENCY MODE */}
          <div
            onClick={onTriggerEmergency}
            id="card-action-emergency"
            className="group relative overflow-hidden bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border border-red-500"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-7 h-7 text-amber-200 animate-pulse" />
              </div>
              <span className="bg-red-950/60 text-red-200 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Immediate Action
              </span>
            </div>
            <div className="mt-4 space-y-1.5">
              <h3 className="text-xl font-extrabold text-white">
                🚨 Emergency Mode
              </h3>
              <p className="text-red-100 text-xs sm:text-sm">
                1-Click critical triage, CPR guides, vital stabilization & instant 24/7 on-call hospital dispatch.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-amber-200 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Enter Emergency Protocol</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: 🤖 ASK VETPAL AI */}
          <div
            onClick={() => onStartTriage()}
            id="card-action-ai-triage"
            className="group bg-white hover:bg-emerald-50/40 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all cursor-pointer border border-stone-200 hover:border-emerald-300"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bot className="w-7 h-7" />
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                Multi-Modal AI
              </span>
            </div>
            <div className="mt-4 space-y-1.5">
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                🤖 Ask VetPal AI
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm">
                Guided clinical questioning, photo symptom check, life-saving precautions & differential triage.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-700 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Start AI Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: 🩺 FIND A VET & GOOGLE MAPS RADAR */}
          <div
            onClick={() => onNavigate("FIND_VET")}
            id="card-action-find-vet"
            className="group bg-white hover:bg-teal-50/40 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all cursor-pointer border border-stone-200 hover:border-teal-300"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Stethoscope className="w-7 h-7" />
              </div>
              <span className="bg-teal-100 text-teal-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-600" />
                <span>Google Maps Grounded</span>
              </span>
            </div>
            <div className="mt-4 space-y-1.5">
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-teal-700 transition-colors">
                🗺️ Find Vet & Live Maps Radar
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm">
                Access real-time Google Maps spatial data from your current GPS location to find 24/7 ER clinics, vetted doctors & farm ambulances.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-teal-700 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Google Maps Radar</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 4: 🐾 MY ANIMALS & FLOCKS */}
          <div
            onClick={() => onNavigate("MY_ANIMALS")}
            id="card-action-my-animals"
            className="group bg-white hover:bg-stone-50 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all cursor-pointer border border-stone-200 hover:border-stone-300"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PawPrint className="w-7 h-7" />
              </div>
              <span className="bg-stone-100 text-stone-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                {animals.length} Profiles
              </span>
            </div>
            <div className="mt-4 space-y-1.5">
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                🐾 My Animals & Flocks
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm">
                Manage companion pets (dogs, cats) and livestock batch profiles with tags and medical histories.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-stone-700 gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Animal Registry</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 5: 📋 DIGITAL HEALTH PASSPORT */}
          <div
            onClick={() => {
              if (animals[0]) onSelectAnimalForPassport(animals[0]);
              onNavigate("PASSPORT");
            }}
            id="card-action-health-passport"
            className="group bg-white hover:bg-purple-50/40 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all cursor-pointer border border-stone-200 hover:border-purple-300"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7" />
              </div>
              <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                Official Records
              </span>
            </div>
            <div className="mt-4 space-y-1.5">
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-purple-700 transition-colors">
                📋 Digital Health Passport
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm">
                Lifetime medical timeline, verified e-prescriptions, QR code certificates & lab diagnostics.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-purple-700 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Health Passport</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 6: 🌾 FARMER & HERD MODE */}
          <div
            onClick={() => onNavigate("FARMER_HUB")}
            id="card-action-farmer-hub"
            className="group bg-white hover:bg-amber-50/40 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all cursor-pointer border border-stone-200 hover:border-amber-300"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Tractor className="w-7 h-7" />
              </div>
              <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-full">
                Livestock Suite
              </span>
            </div>
            <div className="mt-4 space-y-1.5">
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                🌾 Farmer & Herd Hub
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm">
                Batch mortality surveillance, feed conversion tracking, drug withdrawal periods & flock biosecurity.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-amber-800 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Enter Farmer Hub</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Regional Animal Health Intelligence & Outbreak Radar */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              Regional Disease Surveillance & Outbreak Radar
            </h2>
          </div>
          <span className="text-xs text-stone-500">Live VCN & NVRI Bulletins</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {diseaseAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    alert.severity === "CRITICAL"
                      ? "bg-red-100 text-red-800"
                      : alert.severity === "HIGH"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {alert.severity} ALERT
                </span>
                <span className="text-[11px] text-stone-400 font-medium">{alert.reportedDate}</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 leading-snug">{alert.disease}</h4>
                <p className="text-xs text-stone-500 mt-1">{alert.recommendation}</p>
              </div>
              <div className="text-[11px] font-semibold text-stone-600 bg-stone-50 px-2.5 py-1 rounded-lg">
                📍 {alert.region} ({alert.state}) • {alert.radiusKm} km alert radius
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
