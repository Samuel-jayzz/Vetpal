import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Phone,
  MessageSquare,
  FileText,
  UserCheck,
  Stethoscope,
  Activity,
  Mic,
  MicOff,
  Camera,
  Video,
  Radio,
  Share2,
  ChevronRight,
  Shield,
  ArrowRight,
  Sparkles,
  Info,
  MapPin,
  RefreshCw,
  Award,
  Calendar,
  AlertOctagon,
  Eye,
  Check,
  Copy,
  Sliders,
  ExternalLink,
} from "lucide-react";
import {
  CoordinatedCareCase,
  SpeciesType,
  Veterinarian,
  AnimalProfile,
  ViewMode,
  LanguageCode,
} from "../types";

interface CareCoordinatorViewProps {
  cases: CoordinatedCareCase[];
  vets: Veterinarian[];
  animals: AnimalProfile[];
  onSaveCase: (updatedCase: CoordinatedCareCase) => void;
  onCreateNewCase: (newCase: CoordinatedCareCase) => void;
  onNavigate: (view: ViewMode) => void;
  onOpenCommandCenter: () => void;
}

export const CareCoordinatorView: React.FC<CareCoordinatorViewProps> = ({
  cases,
  vets,
  animals,
  onSaveCase,
  onCreateNewCase,
  onNavigate,
  onOpenCommandCenter,
}) => {
  // Active Case selection or creation
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || "");
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New Case Form State
  const [reportStatement, setReportStatement] = useState("");
  const [reportChannel, setReportChannel] = useState<CoordinatedCareCase["channel"]>("TEXT");
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesType>("GOAT");
  const [animalName, setAnimalName] = useState("");
  const [animalAge, setAnimalAge] = useState("");
  const [ownerName, setOwnerName] = useState("Adewale O.");
  const [ownerPhone, setOwnerPhone] = useState("+234 803 123 4567");
  const [ownerLocation, setOwnerLocation] = useState("Kano Municipal, Kano State");
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Interactive step editing state for active case
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [newFollowUpResponse, setNewFollowUpResponse] = useState("");
  const [selectedOutcomeState, setSelectedOutcomeState] = useState<
    "RECOVERED" | "IMPROVING" | "UNCHANGED" | "WORSE" | "DIED"
  >("IMPROVING");

  // Treatment form draft
  const [treatmentAssessment, setTreatmentAssessment] = useState("");
  const [treatmentDiagnosis, setTreatmentDiagnosis] = useState("");
  const [treatmentAdministered, setTreatmentAdministered] = useState("");
  const [treatmentPrescription, setTreatmentPrescription] = useState("");
  const [treatmentWithdrawalDays, setTreatmentWithdrawalDays] = useState(0);

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Steps definition for 9-step pipeline
  const pipelineSteps = [
    { number: 1, label: "Report", tag: "Multi-Channel Input", icon: "📝" },
    { number: 2, label: "Triage", tag: "Minimal Questions", icon: "🩺" },
    { number: 3, label: "Classify", tag: "Routine / Urgent / Critical", icon: "🏷️" },
    { number: 4, label: "Respond", tag: "Nearest Vet / VPP", icon: "📍" },
    { number: 5, label: "Create Case", tag: "Structured Handoff", icon: "📋" },
    { number: 6, label: "Treatment", tag: "Assessment & Rx", icon: "💉" },
    { number: 7, label: "Follow-Up", tag: "24h / 48h / 7d Auto", icon: "🔔" },
    { number: 8, label: "Outcome", tag: "Recovery Status", icon: "📊" },
    { number: 9, label: "Learning", tag: "Health Intel & Records", icon: "🌐" },
  ];

  // Voice recording simulation
  const toggleVoiceRecording = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setVoiceDuration(0);
      const interval = setInterval(() => {
        setVoiceDuration((prev) => {
          if (prev >= 12) {
            clearInterval(interval);
            setIsRecordingVoice(false);
            setReportStatement("My goat has stopped eating, coughing heavily with green nasal discharge since yesterday.");
            return 12;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecordingVoice(false);
    }
  };

  // Quick Preset Reports
  const handleQuickPreset = (preset: {
    statement: string;
    species: SpeciesType;
    name: string;
    age: string;
    loc: string;
    channel: CoordinatedCareCase["channel"];
    photoUrl?: string;
  }) => {
    setReportStatement(preset.statement);
    setSelectedSpecies(preset.species);
    setAnimalName(preset.name);
    setAnimalAge(preset.age);
    setOwnerLocation(preset.loc);
    setReportChannel(preset.channel);
    if (preset.photoUrl) setPhotoPreview(preset.photoUrl);
  };

  // Submit New Case
  const handleCreateCaseSubmit = () => {
    if (!reportStatement.trim()) return;

    const matchedVet = vets[0];
    const generatedCaseNumber = `VP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Triage synthesis based on statement
    const isCritical =
      reportStatement.toLowerCase().includes("vomit") ||
      reportStatement.toLowerCase().includes("blood") ||
      reportStatement.toLowerCase().includes("dying") ||
      reportStatement.toLowerCase().includes("mortality") ||
      reportStatement.toLowerCase().includes("bloat");

    const isUrgent =
      !isCritical &&
      (reportStatement.toLowerCase().includes("cough") ||
        reportStatement.toLowerCase().includes("fever") ||
        reportStatement.toLowerCase().includes("not eating") ||
        reportStatement.toLowerCase().includes("sick"));

    const classification = isCritical ? "CRITICAL" : isUrgent ? "URGENT" : "ROUTINE";

    const newCase: CoordinatedCareCase = {
      id: `case-${Date.now()}`,
      caseNumber: generatedCaseNumber,
      status: "DISPATCHED",
      channel: reportChannel,
      reportedAt: new Date().toISOString(),
      animalInfo: {
        name: animalName || `${selectedSpecies} Patient`,
        species: selectedSpecies,
        age: animalAge || "Adult",
        weightKg: selectedSpecies === "GOAT" ? 25 : selectedSpecies === "POULTRY" ? 1.5 : 12,
        ownerName: ownerName || "Animal Custodian",
        ownerPhone: ownerPhone || "+234 800 000 0000",
        locationName: ownerLocation || "Local LGA Hub",
        coordinates: { lat: 10.5105, lng: 7.4165 },
      },
      initialReport: {
        statement: reportStatement,
        voiceAudioDurationSec: reportChannel === "VOICE" ? voiceDuration || 12 : undefined,
        mediaUrl: photoPreview || undefined,
        mediaType: photoPreview ? "PHOTO" : reportChannel === "VOICE" ? "AUDIO" : undefined,
      },
      triage: {
        questionsAndAnswers: [
          {
            question: "How long has the animal shown these signs?",
            answer: "Observed within the last 24-36 hours.",
            clinicalSignificance: "Defines acute vs chronic clinical trajectory.",
          },
          {
            question: "Is the animal drinking water, eating, or standing comfortably?",
            answer: "Appetite markedly depressed; lethargic.",
            clinicalSignificance: "Assesses hydration risk and immediate metabolic support requirement.",
          },
          {
            question: "Are there other animals in the group or household with similar symptoms?",
            answer: "Isolated to this animal currently, but neighbors report similar signs.",
            clinicalSignificance: "Crucial for biosecurity containment and syndromic cluster tracking.",
          },
        ],
        classification,
        classificationReason: `Automated VetPal clinical triage evaluated signs: "${reportStatement.slice(0, 70)}...". Urgency calibrated to prevent severe complications.`,
        redFlagsDetected: isCritical
          ? ["Severe Acute Vulnerability", "Dehydration / Fluid Deficit Risk", "Requires Immediate Clinical Stabilization"]
          : isUrgent
          ? ["Acute Anorexia", "Systemic Fever Sign", "Same-Day Professional Evaluation Indicated"]
          : ["Routine Preventative Concern"],
        triageCompletedAt: new Date().toISOString(),
      },
      professionalMatch: {
        vetId: matchedVet.id,
        vetName: matchedVet.name,
        vetTitle: matchedVet.title,
        isVPP: false,
        clinicName: matchedVet.clinicName,
        phone: matchedVet.phone,
        distanceKm: matchedVet.distanceKm,
        specialtyMatched: `${selectedSpecies} Clinical Assessment`,
        availabilityStatus: matchedVet.isOnlineNow ? "Online / Available" : "On-Call Emergency",
        emergencyCapable: matchedVet.availableForEmergency,
        dispatchNotificationSentAt: new Date().toISOString(),
        dispatchChannel: "WHATSAPP_STRUCT",
      },
      treatmentRecord: undefined,
      followUps: [
        {
          id: `fup-${Date.now()}-1`,
          milestone: "24H",
          scheduledDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
          status: "PENDING",
          questionPrompt: `VetPal Automated Check: How is ${animalName || "the animal"} now? Has appetite or breathing improved?`,
        },
        {
          id: `fup-${Date.now()}-2`,
          milestone: "48H",
          scheduledDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
          status: "PENDING",
          questionPrompt: `VetPal 48h Review: Is ${animalName || "the animal"} responding well to treatment?`,
        },
        {
          id: `fup-${Date.now()}-3`,
          milestone: "7D",
          scheduledDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
          status: "PENDING",
          questionPrompt: `VetPal Final Checkpoint: Full recovery verification and withdrawal tracking.`,
        },
      ],
      learningAndGovernance: {
        consentGranted: true,
        anonymizedId: `EPI-${selectedSpecies.slice(0, 3)}-${Date.now().toString().slice(-4)}`,
        contributedToEpiIntelligence: true,
        syndromeCategory:
          selectedSpecies === "POULTRY" || selectedSpecies === "GOAT"
            ? "RESPIRATORY"
            : "GASTROINTESTINAL",
        geoLgaOrZone: ownerLocation,
      },
    };

    onCreateNewCase(newCase);
    setSelectedCaseId(newCase.id);
    setIsCreatingNew(false);
    setActiveStepTab(5); // Jump to Structured Case view
  };

  // Record treatment on active case
  const handleSaveTreatment = () => {
    if (!treatmentDiagnosis && !treatmentAdministered) return;

    const updatedCase: CoordinatedCareCase = {
      ...activeCase,
      status: "UNDER_TREATMENT",
      treatmentRecord: {
        recordedAt: new Date().toISOString(),
        veterinarianName: activeCase.professionalMatch?.vetName || "Attending Veterinarian",
        licenseNumber: "VCN-REG-07821",
        clinicalAssessment: treatmentAssessment || "Physical exam confirms triage findings.",
        provisionalDiagnosis: treatmentDiagnosis,
        treatmentAdministered,
        prescription: treatmentPrescription
          ? {
              medication: treatmentPrescription,
              dosage: "As clinically prescribed",
              frequency: "Twice daily",
              duration: "5 days",
              instructions: "Administer with food or warm water drench.",
              withdrawalPeriodDays: treatmentWithdrawalDays,
            }
          : undefined,
        ownerInstructions: [
          "Keep animal in clean, dry shelter separated from healthy flock.",
          "Provide clean water and fresh soft fodder.",
          "Report any worsening symptoms immediately.",
        ],
        warningSignsToWatch: ["Inability to stand", "Labored breathing", "Hypothermia"],
      },
    };

    onSaveCase(updatedCase);
    setActiveStepTab(7); // Jump to follow-up
  };

  // Answer automated follow-up
  const handleAnswerFollowUp = (milestone: "24H" | "48H" | "7D") => {
    if (!newFollowUpResponse.trim()) return;

    const updatedFollowUps = activeCase.followUps.map((f) => {
      if (f.milestone === milestone) {
        return {
          ...f,
          status: "RESPONDED" as const,
          response: newFollowUpResponse,
          outcomeState: selectedOutcomeState,
          respondedAt: new Date().toISOString(),
        };
      }
      return f;
    });

    const isFinalResolved = selectedOutcomeState === "RECOVERED" || selectedOutcomeState === "DIED";

    const updatedCase: CoordinatedCareCase = {
      ...activeCase,
      status: isFinalResolved ? "RESOLVED" : "FOLLOW_UP_SCHEDULED",
      followUps: updatedFollowUps,
      finalOutcome: isFinalResolved ? selectedOutcomeState : activeCase.finalOutcome,
      outcomeRecordedAt: isFinalResolved ? new Date().toISOString() : activeCase.outcomeRecordedAt,
    };

    onSaveCase(updatedCase);
    setNewFollowUpResponse("");
    if (isFinalResolved) {
      setActiveStepTab(8);
    }
  };

  // Structured Case Sheet text for WhatsApp / SMS handoff
  const generateStructuredHandoffText = (c: CoordinatedCareCase) => {
    return `📋 *VETPAL CLINICAL CASE HANDOFF* [${c.caseNumber}]
--------------------------------------
🚨 *URGENCY:* ${c.triage.classification} PRIORITY
📅 *DATE/TIME:* ${new Date(c.reportedAt).toLocaleString()}
🐾 *PATIENT:* ${c.animalInfo.name} (${c.animalInfo.species} - ${c.animalInfo.age || "Age N/A"}, ${c.animalInfo.weightKg}kg)
👤 *OWNER:* ${c.animalInfo.ownerName} (${c.animalInfo.ownerPhone})
📍 *LOCATION:* ${c.animalInfo.locationName}
--------------------------------------
💬 *INITIAL REPORT (${c.channel}):*
"${c.initialReport.statement}"

🔍 *TRIAGE ASSESSMENT:*
${c.triage.questionsAndAnswers.map((qa, i) => `Q${i + 1}: ${qa.question}\nAns: ${qa.answer}`).join("\n")}

⚠️ *RED FLAGS DETECTED:*
${c.triage.redFlagsDetected.map((rf) => `• ${rf}`).join("\n")}

🎯 *ASSIGNED VET/VPP:* ${c.professionalMatch?.vetName || "Dr. Amina Bello"}
🏥 *CLINIC:* ${c.professionalMatch?.clinicName || "VetPal Telemedicine Hub"}
--------------------------------------
✅ *ACTION REQUESTED:* Please acknowledge receipt and record clinical findings in VetPal portal.`;
  };

  const handleCopyPayload = () => {
    const text = generateStructuredHandoffText(activeCase);
    navigator.clipboard.writeText(text);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Top Header Banner: Value Proposition */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE CORE SYSTEM ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              End-to-End Animal Care Pipeline
            </h1>
            <p className="text-stone-300 text-sm leading-relaxed">
              Taking animal custodians from{" "}
              <span className="text-amber-300 font-semibold italic">"Something is wrong with my animal"</span>{" "}
              all the way to{" "}
              <span className="text-teal-300 font-semibold italic">
                "Assessed, professional contacted, treatment recorded, and VetPal is following up."
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setIsCreatingNew(true);
                setActiveStepTab(1);
              }}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-black text-xs cursor-pointer transition-all shadow-md flex items-center gap-2"
            >
              <span>+ Start New Case Flow</span>
            </button>
            <button
              onClick={onOpenCommandCenter}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-teal-200 border border-teal-500/30 font-bold text-xs cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Command Center Intel</span>
            </button>
          </div>
        </div>

        {/* 9-Step Visual Flow Stepper */}
        <div className="mt-8 pt-6 border-t border-stone-700/60 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[760px] gap-2">
            {pipelineSteps.map((step, idx) => {
              const isSelected = activeStepTab === step.number;
              return (
                <button
                  key={step.number}
                  onClick={() => {
                    setIsCreatingNew(false);
                    setActiveStepTab(step.number);
                  }}
                  className={`flex-1 flex flex-col items-center p-2 rounded-2xl text-center transition-all cursor-pointer group ${
                    isSelected
                      ? "bg-teal-500/20 border border-teal-400 shadow-sm"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                      isSelected
                        ? "bg-teal-400 text-stone-950 scale-110"
                        : "bg-stone-800 text-stone-300 group-hover:text-white"
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`text-[11px] font-bold whitespace-nowrap ${
                      isSelected ? "text-teal-300" : "text-stone-300"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[9px] text-stone-400 truncate max-w-[80px]">
                    {step.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Case Switcher & Quick Filters */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider whitespace-nowrap">
            Active Cases:
          </span>
          {cases.map((c) => {
            const isSelected = c.id === activeCase?.id && !isCreatingNew;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCaseId(c.id);
                  setIsCreatingNew(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    c.triage.classification === "CRITICAL"
                      ? "bg-rose-500 animate-pulse"
                      : c.triage.classification === "URGENT"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                />
                <span>{c.caseNumber}</span>
                <span className="text-[10px] text-stone-400">({c.animalInfo.name})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsCreatingNew(true);
              setActiveStepTab(1);
            }}
            className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
          >
            <span>+ New Report</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {isCreatingNew ? (
        /* ================= NEW CASE CREATION FLOW ================= */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                Step 1 of 9 • Universal Reporting
              </span>
              <h2 className="text-xl font-black text-stone-900">
                "Something is wrong with my animal"
              </h2>
              <p className="text-xs text-stone-500">
                Support for all channels: voice, text, photo, video, USSD, or WhatsApp simulation.
              </p>
            </div>
            <button
              onClick={() => setIsCreatingNew(false)}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Quick Real-world Presets */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-600">Quick Test Scenarios:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleQuickPreset({
                    statement: "My goat is sick. High fever, refused fodder since yesterday, thick nasal crust and coughing.",
                    species: "GOAT",
                    name: "Zuma",
                    age: "1.5 yrs",
                    loc: "Kano Municipal / Dawanau",
                    channel: "VOICE",
                  })
                }
                className="p-2.5 rounded-xl border border-stone-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-stone-900 group-hover:text-teal-900">
                  🐐 "My goat is sick" (Voice)
                </div>
                <div className="text-[11px] text-stone-500 truncate">
                  Fever, coughing, nasal discharge
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickPreset({
                    statement: "4-month puppy suddenly weak, vomited yellow bile 4 times, refusing to stand.",
                    species: "DOG",
                    name: "Bruno",
                    age: "4 months",
                    loc: "Lekki Phase 1, Lagos",
                    channel: "PHOTO",
                    photoUrl:
                      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80",
                  })
                }
                className="p-2.5 rounded-xl border border-stone-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-stone-900 group-hover:text-teal-900">
                  🐶 "Puppy vomiting bile" (Photo)
                </div>
                <div className="text-[11px] text-stone-500 truncate">
                  Pediatric dehydration risk
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickPreset({
                    statement: "Broiler flock pen 3 gasping loudly with rales and 14 mortalities overnight.",
                    species: "POULTRY",
                    name: "Broiler Pen 3",
                    age: "4.5 weeks",
                    loc: "Kaduna North / Rigachikun",
                    channel: "WHATSAPP",
                  })
                }
                className="p-2.5 rounded-xl border border-stone-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-stone-900 group-hover:text-teal-900">
                  🐔 "Flock coughing & mortality" (WhatsApp)
                </div>
                <div className="text-[11px] text-stone-500 truncate">
                  Commercial poultry cluster
                </div>
              </button>
            </div>
          </div>

          {/* Channel Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700">Input Channel:</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "TEXT", label: "📝 Text Input", desc: "Standard form" },
                { id: "VOICE", label: "🎙️ Voice Note", desc: "Local audio recording" },
                { id: "PHOTO", label: "📸 Photo Upload", desc: "Visual lesions" },
                { id: "VIDEO", label: "🎥 Video Stream", desc: "Gait & respiratory" },
                { id: "USSD", label: "📟 USSD (*384*911#)", desc: "2G dumb-phone" },
                { id: "WHATSAPP", label: "💬 WhatsApp Bridge", desc: "Chat integration" },
              ].map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setReportChannel(ch.id as CoordinatedCareCase["channel"])}
                  className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                    reportChannel === ch.id
                      ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                      : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Simulator if Voice selected */}
          {reportChannel === "VOICE" && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white cursor-pointer transition-transform ${
                    isRecordingVoice ? "bg-rose-600 animate-pulse scale-110" : "bg-amber-600 hover:bg-amber-700"
                  }`}
                >
                  {isRecordingVoice ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    {isRecordingVoice ? "Listening in local dialect / English..." : "Tap Mic to Record Animal Symptoms"}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {isRecordingVoice ? `Recording: ${voiceDuration}s (Simulating auto-transcribe)` : "Supports Hausa, Yoruba, Igbo, Pidgin & English"}
                  </div>
                </div>
              </div>
              {voiceDuration > 0 && (
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-200/60 px-2.5 py-1 rounded-lg">
                  {voiceDuration}s captured
                </span>
              )}
            </div>
          )}

          {/* Animal Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Species</label>
              <select
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value as SpeciesType)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-stone-300 bg-white"
              >
                <option value="GOAT">Goat (Caprine)</option>
                <option value="DOG">Dog (Canine)</option>
                <option value="POULTRY">Poultry / Flock</option>
                <option value="CATTLE">Cattle (Bovine)</option>
                <option value="SHEEP">Sheep (Ovine)</option>
                <option value="CAT">Cat (Feline)</option>
                <option value="SWINE">Swine / Pig</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Animal / Batch Name</label>
              <input
                type="text"
                value={animalName}
                onChange={(e) => setAnimalName(e.target.value)}
                placeholder="e.g. Zuma or Pen 3"
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Location / LGA</label>
              <input
                type="text"
                value={ownerLocation}
                onChange={(e) => setOwnerLocation(e.target.value)}
                placeholder="e.g. Kano Municipal"
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-stone-300"
              />
            </div>
          </div>

          {/* Statement TextArea */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Describe What Is Happening With The Animal:
            </label>
            <textarea
              rows={3}
              value={reportStatement}
              onChange={(e) => setReportStatement(e.target.value)}
              placeholder="e.g. My goat stopped eating yesterday, coughing with white mucus and feels very hot..."
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {photoPreview && (
            <div className="relative inline-block border border-stone-200 rounded-xl overflow-hidden">
              <img src={photoPreview} alt="Attached symptom" className="w-36 h-28 object-cover" />
              <button
                type="button"
                onClick={() => setPhotoPreview(null)}
                className="absolute top-1 right-1 bg-stone-900/80 text-white rounded-full p-1 text-[10px]"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={handleCreateCaseSubmit}
              disabled={!reportStatement.trim()}
              className={`px-6 py-3 rounded-xl font-black text-xs cursor-pointer flex items-center gap-2 transition-all ${
                reportStatement.trim()
                  ? "bg-teal-600 hover:bg-teal-500 text-white shadow-md"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
              }`}
            >
              <span>Coordinate Clinical Response</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ================= ACTIVE CASE DETAIL & 9-STEP WORKFLOW ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Case Overview & Current Step Navigator (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Case Snapshot Card */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
                  Case File
                </span>
                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                    activeCase.triage.classification === "CRITICAL"
                      ? "bg-rose-100 text-rose-800"
                      : activeCase.triage.classification === "URGENT"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {activeCase.triage.classification}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <span>{activeCase.animalInfo.name}</span>
                  <span className="text-xs font-normal text-stone-500">
                    ({activeCase.animalInfo.species})
                  </span>
                </h3>
                <div className="text-xs text-stone-500 mt-0.5">
                  Case ID: <strong className="text-stone-800">{activeCase.caseNumber}</strong>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span className="text-stone-400">Owner:</span>
                  <span className="font-semibold text-stone-800">
                    {activeCase.animalInfo.ownerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Phone:</span>
                  <span className="font-mono text-stone-800">
                    {activeCase.animalInfo.ownerPhone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Location:</span>
                  <span className="font-semibold text-stone-800">
                    {activeCase.animalInfo.locationName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Report Channel:</span>
                  <span className="font-bold text-teal-700">
                    {activeCase.channel}
                  </span>
                </div>
              </div>

              {/* Status Timeline Milestone */}
              <div className="pt-2 border-t border-stone-200 space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Workflow Milestones
                </span>
                <div className="space-y-1">
                  {pipelineSteps.map((s) => {
                    const isPassed =
                      (s.number <= 5 && activeCase.professionalMatch) ||
                      (s.number <= 6 && activeCase.treatmentRecord) ||
                      (s.number <= 7 && activeCase.followUps.length > 0) ||
                      (s.number <= 8 && activeCase.finalOutcome);

                    const isCurrent = activeStepTab === s.number;

                    return (
                      <button
                        key={s.number}
                        onClick={() => setActiveStepTab(s.number)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-teal-50 text-teal-900 font-bold border border-teal-300"
                            : "hover:bg-stone-100 text-stone-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isPassed
                                ? "bg-teal-600 text-white"
                                : isCurrent
                                ? "bg-teal-100 text-teal-800"
                                : "bg-stone-200 text-stone-500"
                            }`}
                          >
                            {isPassed ? "✓" : s.number}
                          </span>
                          <span>{s.label}</span>
                        </div>
                        <span className="text-[10px] text-stone-400">{s.tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Step-Specific Interactive Workspace (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: REPORT */}
            {activeStepTab === 1 && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <h3 className="text-base font-black text-stone-900">Step 1: Patient Report</h3>
                  </div>
                  <span className="text-xs bg-stone-100 px-2.5 py-1 rounded-full text-stone-600 font-semibold">
                    Via {activeCase.channel}
                  </span>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                    Initial Owner Statement
                  </span>
                  <p className="text-sm font-semibold text-stone-800 italic">
                    "{activeCase.initialReport.statement}"
                  </p>
                </div>

                {activeCase.initialReport.mediaUrl && (
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-stone-600">Attached Media:</span>
                    <img
                      src={activeCase.initialReport.mediaUrl}
                      alt="Lesion or symptom"
                      className="w-full max-w-sm rounded-2xl border border-stone-200"
                    />
                  </div>
                )}

                {activeCase.initialReport.voiceAudioDurationSec && (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">
                        Voice Note ({activeCase.initialReport.voiceAudioDurationSec}s)
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Speech-to-Text transcribed automatically for triage engine
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-3">
                  <button
                    onClick={() => setActiveStepTab(2)}
                    className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Proceed to Triage</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: TRIAGE */}
            {activeStepTab === 2 && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <div>
                      <h3 className="text-base font-black text-stone-900">Step 2: Clinical Triage</h3>
                      <p className="text-[11px] text-stone-500">
                        VetPal asked the minimum necessary high-signal clinical questions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {activeCase.triage.questionsAndAnswers.map((qa, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs font-bold text-teal-900">
                          Q{i + 1}: {qa.question}
                        </span>
                        <span className="text-[10px] font-semibold text-stone-400 bg-stone-200 px-2 py-0.5 rounded-md shrink-0">
                          Signal Check
                        </span>
                      </div>
                      <div className="text-xs text-stone-800 bg-white p-2.5 rounded-xl border border-stone-200 font-medium">
                        Answer: <strong>{qa.answer}</strong>
                      </div>
                      <div className="text-[11px] text-teal-700 italic flex items-center gap-1">
                        <Info className="w-3 h-3 shrink-0" />
                        <span>Clinical rationale: {qa.clinicalSignificance}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveStepTab(3)}
                    className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>View Classification</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CLASSIFY */}
            {activeStepTab === 3 && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      3
                    </span>
                    <div>
                      <h3 className="text-base font-black text-stone-900">Step 3: Classification</h3>
                      <p className="text-[11px] text-stone-500">
                        Categorized into Routine, Urgent, or Critical triage priority.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Priority Banner */}
                <div
                  className={`p-5 rounded-2xl border flex items-center gap-4 ${
                    activeCase.triage.classification === "CRITICAL"
                      ? "bg-rose-50 border-rose-300 text-rose-950"
                      : activeCase.triage.classification === "URGENT"
                      ? "bg-amber-50 border-amber-300 text-amber-950"
                      : "bg-emerald-50 border-emerald-300 text-emerald-950"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${
                      activeCase.triage.classification === "CRITICAL"
                        ? "bg-rose-600 text-white"
                        : activeCase.triage.classification === "URGENT"
                        ? "bg-amber-600 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {activeCase.triage.classification === "CRITICAL"
                      ? "🔴"
                      : activeCase.triage.classification === "URGENT"
                      ? "🟠"
                      : "🟢"}
                  </div>
                  <div>
                    <h4 className="text-base font-black uppercase">
                      {activeCase.triage.classification} Priority Care
                    </h4>
                    <p className="text-xs leading-relaxed mt-0.5">
                      {activeCase.triage.classificationReason}
                    </p>
                  </div>
                </div>

                {/* Red Flags */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                    Identified Red Flags & Clinical Warnings:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeCase.triage.redFlagsDetected.map((rf, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 flex items-center gap-2"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{rf}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveStepTab(4)}
                    className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Match Professional</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: RESPOND (Find appropriate professional) */}
            {activeStepTab === 4 && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      4
                    </span>
                    <div>
                      <h3 className="text-base font-black text-stone-900">
                        Step 4: Professional Matching
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Instead of merely giving AI advice: VetPal identifies the nearest available Vet or VPP.
                      </p>
                    </div>
                  </div>
                </div>

                {activeCase.professionalMatch ? (
                  <div className="p-5 rounded-2xl border border-teal-300 bg-teal-50/50 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-200 text-teal-900 mb-1">
                          <CheckCircle2 className="w-3 h-3 text-teal-800" />
                          <span>Matched Veterinary Professional</span>
                        </div>
                        <h4 className="text-lg font-black text-stone-900">
                          {activeCase.professionalMatch.vetName}
                        </h4>
                        <div className="text-xs text-stone-600">
                          {activeCase.professionalMatch.vetTitle} •{" "}
                          <strong className="text-stone-800">
                            {activeCase.professionalMatch.clinicName}
                          </strong>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xl font-black text-teal-700">
                          {activeCase.professionalMatch.distanceKm} km
                        </span>
                        <div className="text-[11px] text-stone-500">From patient location</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-teal-200/60 text-xs">
                      <div className="p-2 bg-white rounded-xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">Specialty:</span>
                        <span className="font-bold text-stone-800">
                          {activeCase.professionalMatch.specialtyMatched}
                        </span>
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">Availability:</span>
                        <span className="font-bold text-emerald-700">
                          {activeCase.professionalMatch.availabilityStatus}
                        </span>
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">Emergency Ready:</span>
                        <span className="font-bold text-stone-800">
                          {activeCase.professionalMatch.emergencyCapable ? "24/7 Capable" : "Standard"}
                        </span>
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">Direct Channel:</span>
                        <span className="font-bold text-stone-800">
                          {activeCase.professionalMatch.dispatchChannel}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-stone-50 rounded-2xl text-center text-xs text-stone-500">
                    Matching nearest doctor in progress...
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveStepTab(5)}
                    className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>View Structured Case</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: CREATE CASE (Structured Case Sheet) */}
            {activeStepTab === 5 && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      5
                    </span>
                    <div>
                      <h3 className="text-base font-black text-stone-900">Step 5: Structured Case Creation</h3>
                      <p className="text-[11px] text-stone-500">
                        The professional receives a structured clinical case rather than a random WhatsApp message.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyPayload}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                  >
                    {copiedPayload ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-600" />
                        <span>Copy Handoff</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Structured Clinical Sheet Preview */}
                <div className="bg-stone-950 text-stone-100 font-mono text-xs p-4 sm:p-6 rounded-2xl space-y-3 overflow-x-auto shadow-inner border border-stone-800">
                  <div className="flex justify-between border-b border-stone-800 pb-2 text-teal-400 font-bold">
                    <span>📋 VETPAL CLINICAL CASE #{activeCase.caseNumber}</span>
                    <span className="text-amber-400">PRIORITY: {activeCase.triage.classification}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-300">
                    <div>
                      Patient: <span className="text-white font-bold">{activeCase.animalInfo.name}</span> (
                      {activeCase.animalInfo.species}, {activeCase.animalInfo.weightKg}kg)
                    </div>
                    <div>
                      Owner: <span className="text-white font-bold">{activeCase.animalInfo.ownerName}</span> (
                      {activeCase.animalInfo.ownerPhone})
                    </div>
                    <div>Location: {activeCase.animalInfo.locationName}</div>
                    <div>Channel: {activeCase.channel}</div>
                  </div>

                  <div className="pt-2 border-t border-stone-800 text-stone-200">
                    <span className="text-stone-400 block text-[10px]">PRESENTING CHIEF COMPLAINT:</span>
                    <p className="italic text-teal-200">"{activeCase.initialReport.statement}"</p>
                  </div>

                  <div className="pt-2 border-t border-stone-800 space-y-1">
                    <span className="text-stone-400 block text-[10px]">STANDARDIZED TRIAGE RESPONSES:</span>
                    {activeCase.triage.questionsAndAnswers.map((qa, i) => (
                      <div key={i} className="text-[11px] text-stone-300">
                        • {qa.question} → <span className="text-white font-bold">{qa.answer}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-stone-800">
                    <span className="text-stone-400 block text-[10px]">RED FLAG ALERTS:</span>
                    <div className="text-rose-300 text-[11px]">
                      {activeCase.triage.redFlagsDetected.join(" | ")}
                    </div>
                  </div>
                </div>

                {/* Dispatch Simulation Actions */}
                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-stone-900">
                      Dispatched to: {activeCase.professionalMatch?.vetName || "Dr. Amina Bello"}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Structured payload sent via {activeCase.professionalMatch?.dispatchChannel || "WHATSAPP_STRUCT"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        window.open(
                          `https://wa.me/?text=${encodeURIComponent(
                            generateStructuredHandoffText(activeCase)
                          )}`
                        );
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open WhatsApp</span>
                    </button>
                    <button
                      onClick={() => setActiveStepTab(6)}
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <span>Record Treatment</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: TREATMENT (Vet records assessment, treatment, prescription, instructions) */}
            {activeStepTab === 6 && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      6
                    </span>
                    <div>
                      <h3 className="text-base font-black text-stone-900">Step 6: Clinical Treatment</h3>
                      <p className="text-[11px] text-stone-500">
                        Vet records: assessment, treatment, prescription, and instructions.
                      </p>
                    </div>
                  </div>
                </div>

                {activeCase.treatmentRecord ? (
                  /* Display already recorded treatment */
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900">
                          Recorded Clinical Record
                        </span>
                        <span className="text-xs text-stone-500 font-mono">
                          {new Date(activeCase.treatmentRecord.recordedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-stone-800">
                        Attending Doctor:{" "}
                        <strong className="text-stone-900">
                          {activeCase.treatmentRecord.veterinarianName}
                        </strong>{" "}
                        ({activeCase.treatmentRecord.licenseNumber})
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 font-bold uppercase block">
                          Provisional Diagnosis
                        </span>
                        <div className="font-bold text-stone-900 mt-1">
                          {activeCase.treatmentRecord.provisionalDiagnosis}
                        </div>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 font-bold uppercase block">
                          Treatment Administered
                        </span>
                        <div className="text-stone-800 mt-1">
                          {activeCase.treatmentRecord.treatmentAdministered}
                        </div>
                      </div>
                    </div>

                    {activeCase.treatmentRecord.prescription && (
                      <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
                        <span className="text-xs font-black text-purple-950 uppercase tracking-wider block">
                          💊 E-Prescription & Regimen
                        </span>
                        <div className="text-xs text-stone-800 font-semibold">
                          {activeCase.treatmentRecord.prescription.medication}
                        </div>
                        <div className="text-[11px] text-stone-600">
                          Dosage: {activeCase.treatmentRecord.prescription.dosage} • Frequency:{" "}
                          {activeCase.treatmentRecord.prescription.frequency} • Duration:{" "}
                          {activeCase.treatmentRecord.prescription.duration}
                        </div>
                        {activeCase.treatmentRecord.prescription.withdrawalPeriodDays &&
                          activeCase.treatmentRecord.prescription.withdrawalPeriodDays > 0 && (
                            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md mt-1">
                              <Shield className="w-3 h-3 text-amber-700" />
                              <span>
                                Food Safety Withdrawal:{" "}
                                {activeCase.treatmentRecord.prescription.withdrawalPeriodDays} days
                              </span>
                            </div>
                          )}
                      </div>
                    )}

                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-stone-500 uppercase block">
                        Owner Instructions & Warning Signs:
                      </span>
                      <ul className="list-disc list-inside text-stone-700 space-y-0.5">
                        {activeCase.treatmentRecord.ownerInstructions.map((ins, i) => (
                          <li key={i}>{ins}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setActiveStepTab(7)}
                        className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Follow-Up Automation</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Form to record treatment */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Provisional Diagnosis
                        </label>
                        <input
                          type="text"
                          value={treatmentDiagnosis}
                          onChange={(e) => setTreatmentDiagnosis(e.target.value)}
                          placeholder="e.g. Caprine Pasteurellosis / CPV Enteritis"
                          className="w-full text-xs font-semibold p-2.5 rounded-xl border border-stone-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Food Withdrawal (Days, if livestock)
                        </label>
                        <input
                          type="number"
                          value={treatmentWithdrawalDays}
                          onChange={(e) => setTreatmentWithdrawalDays(Number(e.target.value))}
                          placeholder="e.g. 28"
                          className="w-full text-xs font-semibold p-2.5 rounded-xl border border-stone-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Treatment Administered & Injections Given
                      </label>
                      <textarea
                        rows={2}
                        value={treatmentAdministered}
                        onChange={(e) => setTreatmentAdministered(e.target.value)}
                        placeholder="e.g. Oxytetracycline 20% L.A. (3ml deep IM), Flunixin meglumine (1.5ml IM), Oral electrolyte drench 1L..."
                        className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Prescription & Ongoing Medication
                      </label>
                      <input
                        type="text"
                        value={treatmentPrescription}
                        onChange={(e) => setTreatmentPrescription(e.target.value)}
                        placeholder="e.g. Amoxicillin Clavulanate 250mg PO BID for 7 days"
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Clinical Assessment Notes
                      </label>
                      <textarea
                        rows={2}
                        value={treatmentAssessment}
                        onChange={(e) => setTreatmentAssessment(e.target.value)}
                        placeholder="e.g. Temp 40.5C, crackles in left lung lobe, mucous membranes hyperemic..."
                        className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSaveTreatment}
                        disabled={!treatmentDiagnosis && !treatmentAdministered}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                          treatmentDiagnosis || treatmentAdministered
                            ? "bg-teal-600 hover:bg-teal-500 text-white shadow-sm"
                            : "bg-stone-200 text-stone-400 cursor-not-allowed"
                        }`}
                      >
                        Save Treatment & Launch Follow-Up
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 7: FOLLOW-UP (VetPal automatically asks: "How is the animal now?") */}
            {activeStepTab === 7 && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      7
                    </span>
                    <div>
                      <h3 className="text-base font-black text-stone-900">Step 7: Automated Follow-Up</h3>
                      <p className="text-[11px] text-stone-500">
                        VetPal automatically asks: "How is the animal now?" at 24h / 48h / 7 days.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {activeCase.followUps.map((fup) => (
                    <div
                      key={fup.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        fup.status === "RESPONDED"
                          ? "bg-emerald-50/60 border-emerald-300"
                          : "bg-stone-50 border-stone-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-stone-900 text-white">
                            {fup.milestone} Checkpoint
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              fup.status === "RESPONDED"
                                ? "bg-emerald-200 text-emerald-900"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {fup.status === "RESPONDED" ? "Completed" : "Pending Scheduled"}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {new Date(fup.scheduledDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="mt-2 text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                        <span>VetPal Query: "{fup.questionPrompt}"</span>
                      </div>

                      {fup.status === "RESPONDED" ? (
                        <div className="mt-2 p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                          <div className="text-xs text-stone-800">
                            Owner Reply: <strong>"{fup.response}"</strong>
                          </div>
                          {fup.outcomeState && (
                            <span
                              className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                fup.outcomeState === "RECOVERED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : fup.outcomeState === "IMPROVING"
                                  ? "bg-teal-100 text-teal-800"
                                  : fup.outcomeState === "WORSE"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-stone-200 text-stone-700"
                              }`}
                            >
                              Status: {fup.outcomeState}
                            </span>
                          )}
                        </div>
                      ) : (
                        /* Input response to pending follow up */
                        <div className="mt-3 p-3 bg-white rounded-xl border border-stone-200 space-y-3">
                          <span className="text-xs font-bold text-stone-700 block">
                            Simulate Owner Check-in Response:
                          </span>
                          <input
                            type="text"
                            value={newFollowUpResponse}
                            onChange={(e) => setNewFollowUpResponse(e.target.value)}
                            placeholder="e.g. Temperature dropped, she stood up and ate fresh fodder today!"
                            className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                          />
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] text-stone-500 mr-1">Condition:</span>
                              {(
                                ["RECOVERED", "IMPROVING", "UNCHANGED", "WORSE", "DIED"] as const
                              ).map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => setSelectedOutcomeState(st)}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                                    selectedOutcomeState === st
                                      ? "bg-stone-900 text-white"
                                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAnswerFollowUp(fup.milestone)}
                              disabled={!newFollowUpResponse.trim()}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                                newFollowUpResponse.trim()
                                  ? "bg-teal-600 hover:bg-teal-500 text-white shadow-xs"
                                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
                              }`}
                            >
                              Log Follow-Up
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveStepTab(8)}
                    className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>View Outcome</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 8: OUTCOME (Recovered / improving / unchanged / worse / died) */}
            {activeStepTab === 8 && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      8
                    </span>
                    <div>
                      <h3 className="text-base font-black text-stone-900">Step 8: Patient Outcome</h3>
                      <p className="text-[11px] text-stone-500">
                        Definitive status: Recovered / improving / unchanged / worse / died.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                    Current Recovery Status:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(
                      [
                        { id: "RECOVERED", label: "Recovered", icon: "🟢", bg: "bg-emerald-500" },
                        { id: "IMPROVING", label: "Improving", icon: "🟡", bg: "bg-teal-500" },
                        { id: "UNCHANGED", label: "Unchanged", icon: "⚪", bg: "bg-stone-400" },
                        { id: "WORSE", label: "Worse", icon: "🟠", bg: "bg-amber-500" },
                        { id: "DIED", label: "Died", icon: "⚫", bg: "bg-stone-800" },
                      ] as const
                    ).map((out) => {
                      const isCurrent = activeCase.finalOutcome === out.id;
                      return (
                        <button
                          key={out.id}
                          type="button"
                          onClick={() => {
                            const updatedCase: CoordinatedCareCase = {
                              ...activeCase,
                              finalOutcome: out.id,
                              outcomeRecordedAt: new Date().toISOString(),
                              status:
                                out.id === "RECOVERED" || out.id === "DIED"
                                  ? "RESOLVED"
                                  : "UNDER_TREATMENT",
                            };
                            onSaveCase(updatedCase);
                          }}
                          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                            isCurrent
                              ? "border-teal-500 bg-white shadow-md scale-105"
                              : "border-stone-200 bg-white hover:bg-stone-100"
                          }`}
                        >
                          <div className="text-xl mb-1">{out.icon}</div>
                          <div
                            className={`text-xs font-black ${
                              isCurrent ? "text-teal-800" : "text-stone-700"
                            }`}
                          >
                            {out.label}
                          </div>
                          {isCurrent && (
                            <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-800">
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveStepTab(9)}
                    className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Inspect Health Intelligence</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 9: LEARNING & INTELLIGENCE */}
            {activeStepTab === 9 && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      9
                    </span>
                    <div>
                      <h3 className="text-base font-black text-stone-900">
                        Step 9: Learning & Population-Level Health Intel
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        The case becomes part of the animal's health record and—with proper consent,
                        anonymization and governance—contributes to population intelligence.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left: Health Passport Sync */}
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-purple-950">
                      <Award className="w-4 h-4 text-purple-700" />
                      <span>Synchronized to Health Passport</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      This clinical episode, triage rating, prescription, and follow-up milestones are
                      permanently bound to{" "}
                      <strong className="text-stone-800">{activeCase.animalInfo.name}</strong>'s Digital
                      Health Passport.
                    </p>
                    <button
                      onClick={() => onNavigate("PASSPORT")}
                      className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Open Digital Passport
                    </button>
                  </div>

                  {/* Right: Anonymized Epidemiological Contribution */}
                  <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-teal-950">
                      <Shield className="w-4 h-4 text-teal-700" />
                      <span>Anonymized Governance & Privacy</span>
                    </div>
                    <div className="text-xs text-stone-600 space-y-1">
                      <div>
                        Anonymized Signal ID:{" "}
                        <strong className="font-mono text-stone-800">
                          {activeCase.learningAndGovernance.anonymizedId}
                        </strong>
                      </div>
                      <div>
                        Syndrome Cluster:{" "}
                        <span className="font-bold text-teal-800">
                          {activeCase.learningAndGovernance.syndromeCategory}
                        </span>
                      </div>
                      <div>Corridor: {activeCase.learningAndGovernance.geoLgaOrZone}</div>
                      <div className="text-[11px] text-stone-500 pt-1">
                        ✓ All Personally Identifiable Information (PII) stripped prior to aggregation.
                      </div>
                    </div>

                    <button
                      onClick={onOpenCommandCenter}
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>View in Command Center</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
