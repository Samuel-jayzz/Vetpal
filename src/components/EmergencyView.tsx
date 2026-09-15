import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  PhoneCall,
  MapPin,
  Clock,
  HeartPulse,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Navigation,
  FileSpreadsheet,
  Compass,
  Sparkles,
} from "lucide-react";
import { AnimalProfile, Clinic, Veterinarian } from "../types";
import { GoogleMapsRadarView } from "./GoogleMapsRadarView";

interface EmergencyViewProps {
  animals: AnimalProfile[];
  clinics: Clinic[];
  vets: Veterinarian[];
  onStartTeleconsult: (vetId: string, animalId: string, emergencyReason: string) => void;
  onBack: () => void;
}

export const EmergencyView: React.FC<EmergencyViewProps> = ({
  animals,
  clinics,
  vets,
  onStartTeleconsult,
  onBack,
}) => {
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>(animals[0]?.id || "unknown");
  const [selectedRedFlags, setSelectedRedFlags] = useState<string[]>(["Difficulty breathing / gasping"]);
  const [isDispatched, setIsDispatched] = useState(false);
  const [dispatchTimer, setDispatchTimer] = useState(180);
  const [activeFirstAidStep, setActiveFirstAidStep] = useState<"cpr" | "bleeding" | "poison" | "bloat" | "choking">("cpr");
  const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
  const [showLiveMapsRadar, setShowLiveMapsRadar] = useState(false);

  const redFlagOptions = [
    { id: "breathing", label: "Difficulty breathing / Choking / Blue gums", severity: "CRITICAL", icon: "🫁" },
    { id: "bleeding", label: "Severe arterial bleeding / Deep laceration", severity: "CRITICAL", icon: "🩸" },
    { id: "seizure", label: "Active seizure / Tremors / Unresponsive", severity: "CRITICAL", icon: "⚡" },
    { id: "bloat", label: "Swollen stomach / Restless dry retching (Bloat/GDV)", severity: "CRITICAL", icon: "⚠️" },
    { id: "poison", label: "Toxin ingestion / Snake bite / Pesticide", severity: "CRITICAL", icon: "🧪" },
    { id: "dystocia", label: "Birthing distress / Straining without delivery > 45m", severity: "HIGH", icon: "🐄" },
    { id: "trauma", label: "Vehicular accident / Suspected broken limb", severity: "HIGH", icon: "🦴" },
    { id: "paralysis", label: "Sudden back leg paralysis / Dragging paws", severity: "HIGH", icon: "🐾" },
  ];

  const emergencyClinics = clinics.filter((c) => c.emergency247);
  const emergencyVets = vets.filter((v) => v.availableForEmergency);

  const selectedAnimal = animals.find((a) => a.id === selectedAnimalId) || {
    id: "unknown",
    name: "Unregistered Animal",
    species: "DOG",
    breed: "Unknown",
    age: "Unknown",
    weightKg: 20,
  };

  const toggleRedFlag = (flagLabel: string) => {
    setSelectedRedFlags((prev) =>
      prev.includes(flagLabel) ? prev.filter((f) => f !== flagLabel) : [...prev, flagLabel]
    );
  };

  // Emergency dispatch timer effect
  useEffect(() => {
    let interval: any;
    if (isDispatched && dispatchTimer > 0) {
      interval = setInterval(() => {
        setDispatchTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isDispatched, dispatchTimer]);

  // Audio CPR metronome beep simulation
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let timer: any = null;

    if (isMetronomePlaying) {
      try {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const intervalMs = (60 / 110) * 1000; // 110 bpm standard for animal CPR
        timer = setInterval(() => {
          if (!audioCtx) return;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(880, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.08);
        }, intervalMs);
      } catch (err) {
        console.log("AudioContext not allowed or not supported", err);
      }
    }

    return () => {
      if (timer) clearInterval(timer);
      if (audioCtx) audioCtx.close();
    };
  }, [isMetronomePlaying]);

  const handleDispatchEmergency = () => {
    setIsDispatched(true);
    setDispatchTimer(180);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Emergency Top Alert Banner */}
      <div className="bg-red-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-red-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white text-red-600 flex items-center justify-center font-black shadow-md shrink-0 animate-bounce">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-950 text-red-200 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  EMERGENCY MODE ACTIVE
                </span>
                <span className="text-xs text-red-100 font-medium">GPS Radar: Lagos / West Africa</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Life-Threatening Animal Emergency
              </h1>
            </div>
          </div>
          <button
            onClick={onBack}
            className="self-start sm:self-center bg-red-800 hover:bg-red-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            ← Exit Emergency Mode
          </button>
        </div>

        <p className="text-red-100 text-sm max-w-3xl">
          Do not panic. Follow the immediate stabilization steps below while we route your case to the nearest on-call emergency veterinary hospital.
        </p>

        {/* 1-Click Dial Nearest Hospital */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href="tel:+234800938725"
            className="bg-white hover:bg-stone-100 text-red-700 font-extrabold px-6 py-3.5 rounded-2xl text-base flex items-center gap-2 shadow-lg hover:scale-102 transition-all cursor-pointer"
            id="emergency-call-now-btn"
          >
            <PhoneCall className="w-5 h-5 text-red-600 animate-pulse" />
            <span>CALL 24/7 EMERGENCY DISPATCH (+234 800-VETPAL-911)</span>
          </a>

          {!isDispatched ? (
            <button
              onClick={handleDispatchEmergency}
              className="bg-red-950 hover:bg-black text-red-100 hover:text-white font-bold px-5 py-3.5 rounded-2xl text-sm transition-all cursor-pointer flex items-center gap-2"
              id="emergency-auto-dispatch-btn"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Broadcast Case to 3 Nearest Clinics</span>
            </button>
          ) : (
            <div className="bg-emerald-950 text-emerald-300 font-semibold px-4 py-3 rounded-2xl text-xs flex items-center gap-2 border border-emerald-500/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Case Broadcasted! On-call vet ETA: ~{Math.floor(dispatchTimer / 60)}m {dispatchTimer % 60}s
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Step 1: Select Animal & Red Flags */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Animal Selection */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              1. Which animal is in distress?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {animals.map((animal) => (
                <button
                  key={animal.id}
                  onClick={() => setSelectedAnimalId(animal.id)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedAnimalId === animal.id
                      ? "border-red-500 bg-red-50/70 text-red-950 ring-2 ring-red-500/20"
                      : "border-stone-200 hover:border-stone-300 bg-stone-50/50"
                  }`}
                >
                  <div className="font-bold text-sm text-stone-900">{animal.name}</div>
                  <div className="text-xs text-stone-500">
                    {animal.breed} • {animal.age}
                  </div>
                </button>
              ))}
              <button
                onClick={() => setSelectedAnimalId("unknown")}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedAnimalId === "unknown"
                    ? "border-red-500 bg-red-50/70 text-red-950 ring-2 ring-red-500/20"
                    : "border-stone-200 hover:border-stone-300 bg-stone-50/50"
                }`}
              >
                <div className="font-bold text-sm text-stone-900">+ Other Animal</div>
                <div className="text-xs text-stone-500">Unregistered / Stray</div>
              </button>
            </div>
          </div>

          {/* Critical Symptoms Checklist */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              2. Select Critical Red-Flag Symptoms:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {redFlagOptions.map((flag) => {
                const isSelected = selectedRedFlags.includes(flag.label);
                return (
                  <button
                    key={flag.id}
                    onClick={() => toggleRedFlag(flag.label)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? "border-red-500 bg-red-50 text-red-950 font-semibold"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <span className="text-lg">{flag.icon}</span>
                    <div className="text-xs leading-snug">{flag.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Interactive Life-Saving First Aid Protocol */}
          <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md space-y-5 border border-stone-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                  <HeartPulse className="w-5 h-5" />
                  <span>Immediate Life-Saving Stabilization Instructions</span>
                </h3>
                <p className="text-xs text-stone-300">
                  Perform these safe actions while in transit to the veterinary hospital.
                </p>
              </div>

              {/* Protocol selector tabs */}
              <div className="flex flex-wrap gap-1">
                {(
                  [
                    { id: "cpr", label: "🫀 CPR" },
                    { id: "bleeding", label: "🩸 Bleeding" },
                    { id: "choking", label: "🫁 Choking" },
                    { id: "poison", label: "🧪 Poison" },
                    { id: "bloat", label: "⚠️ Bloat" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFirstAidStep(tab.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      activeFirstAidStep === tab.id
                        ? "bg-amber-400 text-stone-950"
                        : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CPR Guidance with metronome */}
            {activeFirstAidStep === "cpr" && (
              <div className="space-y-4 text-sm text-stone-200">
                <div className="bg-stone-800/80 p-4 rounded-xl space-y-2 border border-stone-700">
                  <h4 className="font-bold text-white text-base">
                    Cardiopulmonary Resuscitation (Animal CPR Protocol):
                  </h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-stone-300 leading-relaxed">
                    <li>Lay animal on their RIGHT side on a firm flat surface.</li>
                    <li>Check airway: Gently pull tongue forward and clear vomit/saliva with a cloth.</li>
                    <li>
                      Position hands over the widest part of the ribcage (behind elbow). Compress chest 1/3 to 1/2 of its width.
                    </li>
                    <li>Rate: 100 to 120 compressions per minute (30 compressions : 2 rescue breaths).</li>
                  </ol>
                </div>

                <div className="flex items-center justify-between bg-stone-800 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-bold text-stone-300">
                      CPR Rhythm Cadence Guide (110 BPM):
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMetronomePlaying(!isMetronomePlaying)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isMetronomePlaying
                        ? "bg-red-500 text-white"
                        : "bg-amber-400 hover:bg-amber-300 text-stone-950"
                    }`}
                  >
                    {isMetronomePlaying ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span>Stop Metronome</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>Start Audio Beep Rhythm</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Bleeding protocol */}
            {activeFirstAidStep === "bleeding" && (
              <div className="bg-stone-800/80 p-4 rounded-xl space-y-2 border border-stone-700 text-xs text-stone-300">
                <h4 className="font-bold text-white text-sm">Arterial & Wound Hemorrhage Protocol:</h4>
                <ul className="list-disc list-inside space-y-1.5">
                  <li>Apply direct, firm pressure with a clean cotton towel or gauze for at least 5 continuous minutes without lifting.</li>
                  <li>If blood soaks through, do NOT remove the original cloth; layer more clean towels on top.</li>
                  <li>Elevate the bleeding limb above heart level if possible.</li>
                  <li>Do NOT apply tight wire tourniquets that cause limb necrosis.</li>
                </ul>
              </div>
            )}

            {/* Choking protocol */}
            {activeFirstAidStep === "choking" && (
              <div className="bg-stone-800/80 p-4 rounded-xl space-y-2 border border-stone-700 text-xs text-stone-300">
                <h4 className="font-bold text-white text-sm">Foreign Body Airway Obstruction (Heimlich):</h4>
                <ul className="list-disc list-inside space-y-1.5">
                  <li>Carefully open mouth. If an object is clearly visible, sweep it out with a finger, taking care not to push it deeper.</li>
                  <li>For medium/large dogs: Stand behind them, clasp hands around abdomen just behind the last rib, and apply 4-5 sharp upward thrusts.</li>
                  <li>For cats/small dogs: Hold animal against your chest with their back to you and compress abdomen with two hands.</li>
                </ul>
              </div>
            )}

            {/* Poison protocol */}
            {activeFirstAidStep === "poison" && (
              <div className="bg-stone-800/80 p-4 rounded-xl space-y-2 border border-stone-700 text-xs text-stone-300">
                <h4 className="font-bold text-white text-sm">Toxic Chemical / Ingestion Protocol:</h4>
                <ul className="list-disc list-inside space-y-1.5">
                  <li>Take a photo of the chemical container, plant, or snake for the emergency veterinarian.</li>
                  <li>NEVER induce vomiting if the substance was corrosive (bleach, battery acid) or petroleum-based.</li>
                  <li>NEVER administer milk, salt, or raw eggs — these can accelerate toxin absorption or cause hypernatremia.</li>
                  <li>Transport immediately with sample of packaging.</li>
                </ul>
              </div>
            )}

            {/* Bloat protocol */}
            {activeFirstAidStep === "bloat" && (
              <div className="bg-stone-800/80 p-4 rounded-xl space-y-2 border border-stone-700 text-xs text-stone-300">
                <h4 className="font-bold text-white text-sm">Gastric Dilatation-Volvulus (GDV / Bloat):</h4>
                <ul className="list-disc list-inside space-y-1.5">
                  <li>Bloat is a surgical emergency where the stomach twists and cuts off blood supply.</li>
                  <li>Do NOT give water, food, or antacids.</li>
                  <li>Minimize walking or jarring movement; carry the animal gently into the vehicle.</li>
                  <li>Call the emergency clinic immediately so the surgical suite and anesthesia team are prepped before arrival.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Nearest 24/7 Emergency Clinics & On-Call Vets */}
        <div className="space-y-6">
          {/* Nearest 24/7 Clinics */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Nearest 24/7 Emergency Clinics</span>
              </h3>
              <button
                onClick={() => setShowLiveMapsRadar(!showLiveMapsRadar)}
                className="text-[10px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-full border border-teal-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-teal-600" />
                <span>{showLiveMapsRadar ? "Close Radar" : "🗺️ Live Maps Radar"}</span>
              </button>
            </div>

            {/* Expandable Live Google Maps Radar */}
            {showLiveMapsRadar && (
              <div className="pt-2 border-t border-stone-200">
                <GoogleMapsRadarView
                  initialClinics={clinics}
                  vets={vets}
                  onCallVet={(phone) => window.open(`tel:${phone}`, "_self")}
                />
              </div>
            )}

            <div className="space-y-3">
              {emergencyClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-red-50/30 hover:border-red-300 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-stone-900">{clinic.name}</h4>
                      <p className="text-[11px] text-stone-500">{clinic.address}</p>
                    </div>
                    <span className="text-xs font-bold text-red-700 shrink-0 bg-red-100 px-2 py-0.5 rounded-md">
                      {clinic.distanceKm} km
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${clinic.phone}`}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Hospital</span>
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(clinic.name + " " + clinic.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>GPS</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* On-Call Tele-Emergency Vet */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              <span>Live On-Call Emergency Clinician</span>
            </h3>

            {emergencyVets[0] && (
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={emergencyVets[0].avatarUrl}
                    alt={emergencyVets[0].name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <div className="font-bold text-xs text-stone-900">{emergencyVets[0].name}</div>
                    <div className="text-[11px] text-emerald-800 font-medium">
                      {emergencyVets[0].title}
                    </div>
                    <div className="text-[10px] text-stone-500">
                      Response time: &lt; {emergencyVets[0].responseTimeMinutes} mins
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onStartTeleconsult(
                      emergencyVets[0].id,
                      selectedAnimal.id,
                      `CRITICAL EMERGENCY: ${selectedRedFlags.join(", ")}`
                    )
                  }
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Start Immediate Teleconsultation (₦{emergencyVets[0].consultationFeeNaira})</span>
                </button>
              </div>
            )}
          </div>

          {/* SBAR Veterinary Handoff Note Preview */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-2">
            <div className="font-bold text-stone-700 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-stone-500" />
              <span>Auto-Generated Clinical Handoff Note (SBAR):</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-200 font-mono text-[11px] text-stone-700 leading-relaxed">
              <p>
                <strong>S (Situation):</strong> {selectedAnimal.name} ({selectedAnimal.breed}) in acute distress.
              </p>
              <p>
                <strong>B (Background):</strong> Age: {selectedAnimal.age}, Wt: {selectedAnimal.weightKg}kg.
              </p>
              <p>
                <strong>A (Assessment):</strong> Red flags: {selectedRedFlags.join(", ") || "Acute collapse"}.
              </p>
              <p>
                <strong>R (Recommendation):</strong> Immediate intravenous access & emergency examination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
