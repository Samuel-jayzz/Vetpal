import React, { useState, useEffect } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  Paperclip,
  FileText,
  ShieldCheck,
  Sparkles,
  Bot,
  CheckCircle2,
  Download,
  AlertTriangle,
  Clock,
  User,
  HeartPulse,
} from "lucide-react";
import { Veterinarian, AnimalProfile, Consultation } from "../types";

interface TeleconsultationRoomProps {
  vet: Veterinarian;
  animal: AnimalProfile;
  consultationReason: string;
  onEndCall: () => void;
  onSavePrescriptionToPassport: (prescription: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    signedBy: string;
  }) => void;
}

export const TeleconsultationRoom: React.FC<TeleconsultationRoomProps> = ({
  vet,
  animal,
  consultationReason,
  onEndCall,
  onSavePrescriptionToPassport,
}) => {
  const [isVideoActive, setIsVideoActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState<
    { sender: "user" | "vet" | "system"; text: string; time: string }[]
  >([
    {
      sender: "system",
      text: `Encrypted clinical teleconsultation session initiated between ${vet.name} and ${animal.ownerName}.`,
      time: "Just now",
    },
    {
      sender: "vet",
      text: `Hello! I am ${vet.name}. I have reviewed the AI triage notes for ${animal.name}. Can you position the camera towards the animal's face or abdomen so I can examine respiration rate?`,
      time: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [generatedRx, setGeneratedRx] = useState<{
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    signedBy: string;
  } | null>(null);
  const [rxSavedSuccess, setRxSavedSuccess] = useState(false);

  // Call timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Simulate realistic doctor response
    setTimeout(() => {
      const responses = [
        `Understood. The gum color looks moderately pink, which is reassuring. Continue withholding heavy dry food for the next 4 hours and let's administer oral rehydration electrolytes.`,
        `I am writing an electronic prescription for gastric mucosal protection and anti-emetic therapy. You will be able to access it directly in ${animal.name}'s Health Passport.`,
        `Please measure temperature if you have a digital thermometer, or bring them in if vomiting occurs more than 3 times before evening.`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [
        ...prev,
        {
          sender: "vet",
          text: randomResponse,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  };

  const handleDoctorGenerateRx = () => {
    const rx = {
      medication: "Maropitant Citrate (Cerenia) 16mg + Sucralfate Gastric Suspension",
      dosage: "1 tablet daily (Maropitant) + 5ml Sucralfate oral suspension",
      frequency: "Every 24 hours with a light teaspoon of bland wet food",
      duration: "5 days",
      instructions: "Keep animal well-hydrated. If vomiting with blood persists for > 12 hours, proceed immediately to Apex Emergency Center.",
      signedBy: `${vet.name} (${vet.licenseNumber})`,
    };
    setGeneratedRx(rx);
  };

  const handleSaveRx = () => {
    if (generatedRx) {
      onSavePrescriptionToPassport(generatedRx);
      setRxSavedSuccess(true);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Consultation Top Info Bar */}
      <div className="bg-stone-900 text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-stone-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{vet.name}</span>
              <span className="text-xs text-teal-400 font-medium">({vet.licenseNumber})</span>
            </div>
            <p className="text-xs text-stone-400">
              Patient: <strong className="text-stone-200">{animal.name}</strong> ({animal.breed} • {animal.age})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-stone-800 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE: {formatTimer(callDuration)}</span>
          </div>

          <button
            onClick={onEndCall}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End Call</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulated Video Room & Camera Feed */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Video Stream Container */}
          <div className="relative aspect-video bg-stone-950 rounded-3xl overflow-hidden shadow-lg border border-stone-800 flex items-center justify-center">
            {/* Vet simulated feed */}
            {isVideoActive ? (
              <img
                src={vet.avatarUrl}
                alt={vet.name}
                className="w-full h-full object-cover opacity-90 filter brightness-95"
              />
            ) : (
              <div className="text-center space-y-2 text-stone-400">
                <VideoOff className="w-12 h-12 mx-auto text-stone-600" />
                <p className="text-xs">Camera is paused</p>
              </div>
            )}

            {/* Doctor Overlay Badge */}
            <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-700 text-xs text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{vet.name} (Attending Vet)</span>
            </div>

            {/* User Patient Picture-in-Picture (PiP) */}
            <div className="absolute bottom-4 right-4 w-32 sm:w-40 aspect-video bg-stone-900 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-xl">
              <img
                src={animal.photoUrl}
                alt={animal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-2 text-[10px] font-bold text-white bg-black/60 px-1.5 rounded">
                You ({animal.name})
              </div>
            </div>

            {/* Controls Bar at bottom of video */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-stone-900/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-stone-700 shadow-2xl">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                  isMuted ? "bg-red-500 text-white" : "bg-stone-800 text-stone-200 hover:bg-stone-700"
                }`}
                title={isMuted ? "Unmute Mic" : "Mute Mic"}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsVideoActive(!isVideoActive)}
                className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                  !isVideoActive ? "bg-red-500 text-white" : "bg-stone-800 text-stone-200 hover:bg-stone-700"
                }`}
                title={isVideoActive ? "Turn Off Video" : "Turn On Video"}
              >
                {isVideoActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={handleDoctorGenerateRx}
                className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                title="Generate E-Prescription"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Issue E-Rx</span>
              </button>
            </div>
          </div>

          {/* AI Clinical Triage Notes Pinned for Doctor & Owner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between text-emerald-950 font-bold">
              <div className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-emerald-700" />
                <span>Pinned AI Triage Brief for Attending Clinician</span>
              </div>
              <span className="bg-emerald-200/80 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                HIGH PRIORITY
              </span>
            </div>
            <p className="text-emerald-900 leading-relaxed font-mono text-[11px] bg-white/80 p-3 rounded-xl border border-emerald-100">
              {consultationReason ||
                `Patient presenting with acute gastrointestinal distress (vomiting foam, lethargy > 18h). Safe hydration advised; rule out foreign body obstruction and canine parvovirus.`}
            </p>
          </div>
        </div>

        {/* Right Column: Live Chat & E-Prescription Terminal */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Chat box */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-4 flex flex-col h-[400px]">
            <div className="border-b border-stone-100 pb-2 mb-3 flex items-center justify-between">
              <h3 className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Encrypted Teleconsultation Chat</span>
              </h3>
              <span className="text-[10px] text-stone-400 font-medium">Synced with Medical Passport</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === "user"
                      ? "items-end"
                      : msg.sender === "vet"
                      ? "items-start"
                      : "items-center"
                  }`}
                >
                  {msg.sender === "system" ? (
                    <div className="bg-stone-100 text-stone-500 text-[10px] py-1 px-3 rounded-full text-center my-1">
                      {msg.text}
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-2xs space-y-1 ${
                        msg.sender === "user"
                          ? "bg-emerald-700 text-white rounded-tr-xs"
                          : "bg-stone-100 text-stone-800 rounded-tl-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-[10px] opacity-75">
                        <span>{msg.sender === "user" ? "You" : vet.name}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-stone-100 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message or symptom update..."
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white p-2 rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* E-Prescription Card Generator if doctor issued */}
          {generatedRx && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 shadow-2xs space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="bg-purple-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Official E-Prescription (Rx)
                </span>
                <span className="text-[10px] font-mono text-purple-700">Digital Seal Valid</span>
              </div>

              <div className="space-y-1 text-xs text-stone-800 bg-white p-3 rounded-xl border border-purple-100">
                <p className="font-bold text-purple-950 text-sm">{generatedRx.medication}</p>
                <p className="text-stone-600">
                  <strong>Dosage:</strong> {generatedRx.dosage} ({generatedRx.frequency})
                </p>
                <p className="text-stone-600">
                  <strong>Duration:</strong> {generatedRx.duration}
                </p>
                <p className="text-stone-500 text-[11px] italic mt-1">"{generatedRx.instructions}"</p>
                <div className="pt-2 border-t border-stone-100 text-[10px] text-stone-400 font-mono">
                  Prescribed & Digitally Signed by: {generatedRx.signedBy}
                </div>
              </div>

              <button
                onClick={handleSaveRx}
                disabled={rxSavedSuccess}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs ${
                  rxSavedSuccess
                    ? "bg-emerald-600 text-white"
                    : "bg-purple-700 hover:bg-purple-800 text-white"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {rxSavedSuccess
                    ? "✓ Synced with Health Passport"
                    : "Save E-Prescription to Digital Health Passport"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
