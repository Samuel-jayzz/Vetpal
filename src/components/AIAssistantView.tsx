import React, { useState, useRef } from "react";
import {
  Bot,
  Send,
  Camera,
  Image as ImageIcon,
  Mic,
  MicOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldCheck,
  PhoneCall,
  Calendar,
  FilePlus,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Stethoscope,
  X,
  ArrowRight,
  MessageSquare,
  ShieldAlert,
  AlertOctagon,
  Copy,
  Check,
  Zap,
} from "lucide-react";
import { AnimalProfile, TriageAssessment, LanguageCode, ViewMode } from "../types";
import { TRANSLATIONS } from "../data/mockData";

interface AIAssistantViewProps {
  animals: AnimalProfile[];
  language: LanguageCode;
  initialQuery?: string;
  onNavigate: (view: ViewMode) => void;
  onBookVet: (triageNote: string) => void;
  onSaveToPassport: (assessment: TriageAssessment) => void;
  onTriggerEmergency: () => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  animals,
  language,
  initialQuery = "",
  onNavigate,
  onBookVet,
  onSaveToPassport,
  onTriggerEmergency,
}) => {
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>(animals[0]?.id || "custom");
  const [customSpecies, setCustomSpecies] = useState<string>("DOG");
  const [customAge, setCustomAge] = useState<string>("3 years");
  const [customWeight, setCustomWeight] = useState<string>("20 kg");
  const [symptomText, setSymptomText] = useState<string>(initialQuery);
  const [durationText, setDurationText] = useState<string>("Since yesterday");
  const [hasVomiting, setHasVomiting] = useState(false);
  const [hasBlood, setHasBlood] = useState(false);
  const [drinkingWater, setDrinkingWater] = useState<"YES" | "NO" | "UNSURE">("YES");
  const [toxinExposure, setToxinExposure] = useState<"YES" | "NO" | "UNSURE">("NO");
  const [humanMedsGiven, setHumanMedsGiven] = useState<"YES" | "NO">("NO");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [assessment, setAssessment] = useState<TriageAssessment | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [savedToPassportSuccess, setSavedToPassportSuccess] = useState(false);
  const [copiedHandoff, setCopiedHandoff] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const selectedAnimal = animals.find((a) => a.id === selectedAnimalId);

  const copyVetHandoff = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHandoff(true);
    setTimeout(() => setCopiedHandoff(false), 2500);
  };

  const handleWhatsAppHandoff = (note: string) => {
    const text = encodeURIComponent(`*VetPal Emergency Clinical Triage Handoff*\n\n${note}\n\nPatient: ${selectedAnimal?.name || "Animal"} (${selectedAnimal?.species || customSpecies})\nPlease advise on immediate intervention.`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in your browser.");
      return;
    }
    try {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === "ha" ? "ha-NG" : language === "yo" ? "yo-NG" : language === "ig" ? "ig-NG" : "en-US";
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptomText((prev) => (prev ? `${prev}. ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } catch {
      setIsListening(false);
    }
  };

  const handleRunTriage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!symptomText.trim()) return;

    setIsLoading(true);
    setAssessment(null);
    setSavedToPassportSuccess(false);

    try {
      const payload = {
        name: selectedAnimal?.name || "Patient Animal",
        species: selectedAnimal?.species || customSpecies,
        breed: selectedAnimal?.breed || "Mixed breed",
        age: selectedAnimal?.age || customAge,
        weight: selectedAnimal?.weightKg || customWeight,
        symptoms: symptomText,
        duration: durationText,
        language: language,
        isEmergency: hasBlood || toxinExposure === "YES",
        additionalContext: `Drinking water: ${drinkingWater}. Toxin access: ${toxinExposure}. Human meds given: ${humanMedsGiven}. Vomiting: ${hasVomiting ? "YES" : "NO"}.`,
        imageBase64: imageFile,
      };

      const response = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setAssessment({
          ...resData.data,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          animalName: selectedAnimal?.name || "Patient Animal",
          symptoms: symptomText,
        });
      }
    } catch (err) {
      console.error("Triage API failure:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassport = () => {
    if (assessment) {
      onSaveToPassport(assessment);
      setSavedToPassportSuccess(true);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Title & Philosophy Banner */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 flex items-center justify-center font-bold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-800 text-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                THE VETPAL BRAIN
              </span>
              <span className="text-xs text-emerald-200">Powered by Gemini 3.7</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              AI Animal Health & Clinical Triage
            </h1>
          </div>
        </div>
        <p className="text-emerald-100 text-xs sm:text-sm max-w-3xl">
          Describe the symptoms via text, voice, or photos. VetPal guides your questions, identifies danger signs, suggests safe first-aid, and connects you to licensed veterinarians.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Triage input & guided questionnaire */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleRunTriage} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-6">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Step 1: Patient Profile & Guided Questions</span>
            </h2>

            {/* Select Animal */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Select Animal:
              </label>
              <div className="flex flex-wrap gap-2">
                {animals.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSelectedAnimalId(a.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedAnimalId === a.id
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20"
                        : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    🐾 {a.name} ({a.species})
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedAnimalId("custom")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    selectedAnimalId === "custom"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20"
                      : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  + New / Other Animal
                </button>
              </div>
            </div>

            {/* Custom animal fields if selected */}
            {selectedAnimalId === "custom" && (
              <div className="grid grid-cols-3 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Species</label>
                  <select
                    value={customSpecies}
                    onChange={(e) => setCustomSpecies(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-1.5 text-xs font-medium"
                  >
                    <option value="DOG">Dog / Puppy</option>
                    <option value="CAT">Cat / Kitten</option>
                    <option value="CATTLE">Cattle / Cow</option>
                    <option value="POULTRY">Poultry / Chicken</option>
                    <option value="GOAT">Goat</option>
                    <option value="SHEEP">Sheep</option>
                    <option value="HORSE">Horse</option>
                    <option value="SWINE">Pig / Swine</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Approx. Age</label>
                  <input
                    type="text"
                    value={customAge}
                    onChange={(e) => setCustomAge(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-1.5 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Approx. Weight</label>
                  <input
                    type="text"
                    value={customWeight}
                    onChange={(e) => setCustomWeight(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-1.5 text-xs font-medium"
                  />
                </div>
              </div>
            )}

            {/* Symptoms Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Describe what is happening:
                </label>
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                    isListening ? "text-red-600 animate-pulse" : "text-emerald-700 hover:text-emerald-800"
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? "Listening..." : "Dictate via Voice"}</span>
                </button>
              </div>
              <textarea
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                placeholder="e.g. My dog has been vomiting yellow foam since yesterday, refused breakfast, and is hiding under the bed..."
                rows={4}
                className="w-full rounded-xl border border-stone-300 p-3.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                required
              />
            </div>

            {/* Guided Clinical Quick Check Questions */}
            <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Guided Clinical Check (Quick Answers):
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Duration */}
                <div>
                  <span className="font-semibold text-stone-700 block mb-1">How long has this occurred?</span>
                  <select
                    value={durationText}
                    onChange={(e) => setDurationText(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs"
                  >
                    <option value="Less than 2 hours">Less than 2 hours (Sudden)</option>
                    <option value="Since yesterday (12-24h)">Since yesterday (12-24h)</option>
                    <option value="2-3 days">2-3 days</option>
                    <option value="Over a week">Over a week (Chronic)</option>
                  </select>
                </div>

                {/* Drinking Water */}
                <div>
                  <span className="font-semibold text-stone-700 block mb-1">Is the animal drinking water?</span>
                  <div className="flex gap-2">
                    {(["YES", "NO", "UNSURE"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setDrinkingWater(opt)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                          drinkingWater === opt
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-stone-700 border-stone-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Blood in vomit or stool */}
                <div>
                  <span className="font-semibold text-stone-700 block mb-1">Any visible blood in vomit / stool?</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setHasBlood(false)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                        !hasBlood ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-stone-700"
                      }`}
                    >
                      No Blood
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasBlood(true)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                        hasBlood ? "bg-red-600 text-white border-red-600" : "bg-white text-stone-700"
                      }`}
                    >
                      Yes, Blood Seen 🩸
                    </button>
                  </div>
                </div>

                {/* Poison / Toxin access */}
                <div>
                  <span className="font-semibold text-stone-700 block mb-1">Possible poison/snake/garbage?</span>
                  <div className="flex gap-2">
                    {(["NO", "YES", "UNSURE"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setToxinExposure(opt)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                          toxinExposure === opt
                            ? opt === "YES"
                              ? "bg-red-600 text-white border-red-600"
                              : "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-stone-700 border-stone-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Photo / Visual attachment */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Attach Photo (Optional — Wounds, Eyes, Skin, Stool, Poultry Comb):
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              {!imageFile ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-xl p-4 text-center cursor-pointer transition-colors flex items-center justify-center gap-2 text-xs font-semibold text-stone-600"
                >
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>Click to take photo or upload image</span>
                </button>
              ) : (
                <div className="relative inline-block">
                  <img
                    src={imageFile}
                    alt="Symptom upload preview"
                    className="w-24 h-24 object-cover rounded-xl border border-stone-300"
                  />
                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-sm hover:bg-red-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Triage Button */}
            <button
              type="submit"
              disabled={isLoading || !symptomText.trim()}
              className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              id="ai-generate-triage-btn"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing with VetPal Clinical AI Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Clinical Triage Assessment</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right column: Triage Assessment Results Screen */}
        <div className="lg:col-span-5 space-y-6">
          {!assessment && !isLoading && (
            <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-stone-800 text-base">
                VetPal AI Triage Assessment Ready
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                Provide your animal's symptoms on the left to receive immediate triage urgency, safety guidelines, and clinical handoff notes.
              </p>
              <div className="pt-2 text-left bg-white p-4 rounded-xl border border-stone-200 text-xs space-y-2 text-stone-600">
                <div className="font-bold text-stone-800">What you will receive:</div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Urgency level (Critical, High, Medium, Low)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Safe first-aid stabilization actions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Critical "What NOT to do" precautions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Automated SBAR note for the attending vet</span>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-2xs text-center space-y-4 animate-pulse">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                <Sparkles className="w-7 h-7 animate-spin" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">
                Evaluating Clinical Risk Factors...
              </h3>
              <p className="text-xs text-stone-500">
                Cross-referencing species physiological parameters, poison interactions, and urgency scoring.
              </p>
            </div>
          )}

          {assessment && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md space-y-5 animate-in fade-in duration-300">
              {/* Urgency Badge */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                  assessment.urgencyLevel === "CRITICAL"
                    ? "bg-red-50 border-red-300 text-red-950"
                    : assessment.urgencyLevel === "HIGH"
                    ? "bg-orange-50 border-orange-300 text-orange-950"
                    : assessment.urgencyLevel === "MEDIUM"
                    ? "bg-amber-50 border-amber-300 text-amber-950"
                    : "bg-emerald-50 border-emerald-300 text-emerald-950"
                }`}
              >
                <AlertTriangle
                  className={`w-6 h-6 shrink-0 mt-0.5 ${
                    assessment.urgencyLevel === "CRITICAL"
                      ? "text-red-600 animate-bounce"
                      : assessment.urgencyLevel === "HIGH"
                      ? "text-orange-600"
                      : "text-amber-600"
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white shadow-2xs">
                      {assessment.urgencyLevel} PRIORITY
                    </span>
                    <span className="text-xs font-semibold opacity-75">{assessment.timestamp}</span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base mt-1">{assessment.urgencyTitle}</h3>
                  <p className="text-xs mt-1.5 opacity-90 leading-relaxed">{assessment.summary}</p>
                </div>
              </div>

              {/* ⭐ "WHAT SHOULD I DO NOW?" ACTION CARD ⭐ */}
              {/* Prevents long AI explanation fatigue by placing the single most crucial operational next action front and center */}
              <div
                id="what-should-i-do-now-card"
                className={`rounded-2xl border-2 p-5 shadow-sm space-y-4 transition-all ${
                  assessment.urgencyLevel === "CRITICAL"
                    ? "bg-linear-to-br from-red-50 to-amber-50/50 border-red-500/80 ring-2 ring-red-400/20"
                    : assessment.urgencyLevel === "HIGH"
                    ? "bg-linear-to-br from-orange-50 to-amber-50/50 border-orange-500/80 ring-2 ring-orange-400/20"
                    : "bg-linear-to-br from-emerald-50 to-teal-50/40 border-emerald-600/70 ring-2 ring-emerald-400/20"
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b pb-3 border-stone-200/80">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg text-white ${
                      assessment.urgencyLevel === "CRITICAL"
                        ? "bg-red-600"
                        : assessment.urgencyLevel === "HIGH"
                        ? "bg-orange-600"
                        : "bg-emerald-600"
                    }`}>
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black tracking-tight text-stone-900 uppercase">
                        What Should I Do Now?
                      </h4>
                      <p className="text-[11px] font-medium text-stone-600">
                        Immediate recommended operational step
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                    assessment.urgencyLevel === "CRITICAL"
                      ? "bg-red-600 text-white animate-pulse"
                      : assessment.urgencyLevel === "HIGH"
                      ? "bg-orange-600 text-white"
                      : "bg-emerald-700 text-white"
                  }`}>
                    {assessment.whatShouldIDoNow?.primaryAction?.etaOrUrgency ||
                      (assessment.urgencyLevel === "CRITICAL" ? "Act within 15 mins" : "Consult today")}
                  </span>
                </div>

                {/* Primary Recommended Action Highlight */}
                <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Primary Directive:
                      </span>
                      <h5 className="font-extrabold text-stone-900 text-sm sm:text-base leading-snug">
                        {assessment.whatShouldIDoNow?.primaryAction?.title ||
                          (assessment.urgencyLevel === "CRITICAL"
                            ? "Open 1-Click Emergency Response & Dispatch"
                            : "Connect with Licensed Vet via Teleconsult")}
                      </h5>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {assessment.whatShouldIDoNow?.primaryAction?.description ||
                          (assessment.urgencyLevel === "CRITICAL"
                            ? "Animal presents with acute clinical danger signs. Contact on-duty emergency clinician immediately."
                            : "Veterinary clinical assessment needed to prescribe proper dosage and rule out secondary infections.")}
                      </p>
                    </div>
                  </div>

                  {/* Primary Big Action Button */}
                  <div className="pt-1">
                    {assessment.urgencyLevel === "CRITICAL" ? (
                      <button
                        onClick={onTriggerEmergency}
                        id="action-card-primary-emergency-btn"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.99] animate-pulse"
                      >
                        <AlertTriangle className="w-5 h-5" />
                        <span>{assessment.whatShouldIDoNow?.primaryAction?.buttonLabel || "🚨 1-CLICK EMERGENCY RESPONSE"}</span>
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onBookVet(assessment.vetHandoffNote)}
                        id="action-card-primary-televet-btn"
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all active:scale-[0.99]"
                      >
                        <Stethoscope className="w-5 h-5" />
                        <span>{assessment.whatShouldIDoNow?.primaryAction?.buttonLabel || "🩺 Connect with On-Call Vet (Teleconsult)"}</span>
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2-3 Bullet Immediate Stabilization Steps */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Right Now While Waiting:</span>
                  </span>
                  <div className="space-y-1">
                    {(assessment.whatShouldIDoNow?.immediateSteps || assessment.immediateGuidance.slice(0, 3)).map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 bg-white/80 p-2.5 rounded-lg border border-stone-200/70">
                        <span className="font-bold text-emerald-700 shrink-0 w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strict Do-Nots Warning in Action Card */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-red-800 uppercase tracking-wide flex items-center gap-1.5">
                    <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                    <span>Strictly Do NOT Do:</span>
                  </span>
                  <div className="space-y-1">
                    {(assessment.whatShouldIDoNow?.strictDoNots || assessment.whatNotToDo.slice(0, 2)).map((warn, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-red-950 bg-red-100/70 p-2.5 rounded-lg border border-red-200">
                        <span className="font-bold text-red-600 shrink-0">✕</span>
                        <span className="leading-snug font-medium">{warn}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secondary Fast Options: WhatsApp Handoff, Live Maps Clinic, Copy Note */}
                <div className="pt-2 border-t border-stone-200/80 space-y-2">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    Alternative / Fast Options:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => onNavigate("FIND_VET")}
                      id="action-card-find-clinic-btn"
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold cursor-pointer text-left transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 shrink-0">
                        <PhoneCall className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="font-bold">Find Clinic (GPS)</div>
                        <div className="text-[10px] text-stone-500 font-normal">Registered hospitals</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleWhatsAppHandoff(assessment.vetHandoffNote)}
                      id="action-card-whatsapp-btn"
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 text-emerald-900 text-xs font-semibold cursor-pointer text-left transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-600 text-white shrink-0">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="font-bold">WhatsApp Vet Note</div>
                        <div className="text-[10px] text-emerald-700 font-normal">Formatted clinical share</div>
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                    <button
                      onClick={() => copyVetHandoff(assessment.vetHandoffNote)}
                      className="text-stone-600 hover:text-stone-900 text-[11px] font-semibold flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      {copiedHandoff ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied Doctor's Note!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-stone-500" />
                          <span>Copy Structured Note for Vet</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleSavePassport}
                      disabled={savedToPassportSuccess}
                      className="text-purple-700 hover:text-purple-900 text-[11px] font-semibold flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                    >
                      <FilePlus className="w-3 h-3 text-purple-600" />
                      <span>{savedToPassportSuccess ? "✓ In Passport" : "Save to Passport"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Localized translation if available */}
              {assessment.localizedText && (
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs text-stone-800 space-y-1">
                  <span className="font-bold text-stone-900 uppercase text-[10px]">
                    Localized Translation ({language.toUpperCase()}):
                  </span>
                  <p className="italic">{assessment.localizedText}</p>
                </div>
              )}

              {/* Safe Immediate Guidance Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>What to do right now (Safe Guidance):</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-700 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                  {assessment.immediateGuidance.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-emerald-700 shrink-0">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What NOT to do warnings */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Crucial Safety Rules (What NOT To Do):</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-red-950 bg-red-50/60 p-3.5 rounded-xl border border-red-200">
                  {assessment.whatNotToDo.map((warn, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-red-600 shrink-0">⚠️</span>
                      <span className="font-medium">{warn}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Questions for the Doctor */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-stone-500" />
                  <span>Be Ready To Tell The Vet:</span>
                </h4>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
                  {assessment.followUpQuestions.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-stone-400">•</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                {assessment.urgencyLevel === "CRITICAL" && (
                  <button
                    onClick={onTriggerEmergency}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md animate-pulse"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>🚨 OPEN 1-CLICK EMERGENCY RESPONSE</span>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onBookVet(assessment.vetHandoffNote)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    id="triage-book-vet-btn"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Book Teleconsult</span>
                  </button>

                  <button
                    onClick={() => onNavigate("FIND_VET")}
                    className="bg-stone-800 hover:bg-stone-900 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    id="triage-find-clinic-btn"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Find Nearest Clinic</span>
                  </button>
                </div>

                <button
                  onClick={handleSavePassport}
                  disabled={savedToPassportSuccess}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 border ${
                    savedToPassportSuccess
                      ? "bg-purple-50 text-purple-900 border-purple-300"
                      : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                  }`}
                  id="triage-save-passport-btn"
                >
                  <FilePlus className="w-3.5 h-3.5 text-purple-600" />
                  <span>
                    {savedToPassportSuccess
                      ? "✓ Saved to Digital Health Passport"
                      : "Add Assessment to Animal's Health Passport"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
