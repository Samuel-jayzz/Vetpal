import React, { useState } from "react";
import {
  WifiOff,
  PhoneCall,
  MessageSquare,
  Copy,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Signal,
  Smartphone,
  Play,
  RotateCcw,
} from "lucide-react";
import { LanguageCode } from "../types";

interface LowConnectivityModalProps {
  isOpen: boolean;
  language: LanguageCode;
  onClose: () => void;
}

export const LowConnectivityModal: React.FC<LowConnectivityModalProps> = ({
  isOpen,
  language,
  onClose,
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"INFO" | "SIMULATOR">("SIMULATOR");

  // USSD Simulator State
  const [ussdInput, setUssdInput] = useState("*384*911#");
  const [ussdScreenText, setUssdScreenText] = useState<string>(
    `VetPal Africa USSD Gateway (*384*911#)\n1. 🚨 Animal Emergency Triage\n2. 👨🏾‍⚕️ Find On-Call Vet Nearby\n3. 🌾 Farmer & Herd Quick Check\n4. 💉 Vaccination / Deworming SMS`
  );
  const [ussdHistory, setUssdHistory] = useState<string>("");
  const [userReply, setUserReply] = useState("");
  const [isLoadingUssd, setIsLoadingUssd] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(true);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSendUssd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userReply.trim() && isSessionActive) return;

    setIsLoadingUssd(true);
    const newText = ussdHistory ? `${ussdHistory}*${userReply.trim()}` : userReply.trim();
    setUssdHistory(newText);
    setUserReply("");

    try {
      const res = await fetch("/api/ussd-gateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "sim-session-991",
          phoneNumber: "+2348039991234",
          text: newText,
        }),
      });
      const responseText = await res.text();
      setUssdScreenText(responseText.replace(/^CON\s+/, "").replace(/^END\s+/, ""));
      if (responseText.startsWith("END")) {
        setIsSessionActive(false);
      }
    } catch {
      setUssdScreenText("Connection timeout. Please retry dialing *384*911#.");
      setIsSessionActive(false);
    } finally {
      setIsLoadingUssd(false);
    }
  };

  const handleResetSession = () => {
    setUssdHistory("");
    setUserReply("");
    setIsSessionActive(true);
    setUssdScreenText(
      `VetPal Africa USSD Gateway (*384*911#)\n1. 🚨 Animal Emergency Triage\n2. 👨🏾‍⚕️ Find On-Call Vet Nearby\n3. 🌾 Farmer & Herd Quick Check\n4. 💉 Vaccination / Deworming SMS`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-stone-900 text-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-700 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Signal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                VetPal Low-Connectivity & USSD Fallback
              </h3>
              <p className="text-xs text-stone-400">Works on 2G/3G feature phones with zero internet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab("SIMULATOR")}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === "SIMULATOR"
                ? "bg-amber-500 text-stone-950 shadow-xs"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            📱 Live USSD Simulator (*384*911#)
          </button>
          <button
            onClick={() => setActiveTab("INFO")}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === "INFO"
                ? "bg-amber-500 text-stone-950 shadow-xs"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            📋 SMS & Shortcode Codes
          </button>
        </div>

        {activeTab === "SIMULATOR" ? (
          <div className="space-y-4">
            {/* Feature phone green-screen simulator */}
            <div className="bg-emerald-950/80 border-2 border-emerald-800 rounded-2xl p-4 font-mono text-emerald-300 text-xs shadow-inner space-y-3 min-h-[160px] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] text-emerald-500 border-b border-emerald-900 pb-1">
                <span>📶 2G GSM (MTN/Airtel/Glo)</span>
                <span>*384*911#</span>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">
                {isLoadingUssd ? "Transmitting via SS7 gateway..." : ussdScreenText}
              </div>
              <div className="text-[10px] text-emerald-600 pt-1 border-t border-emerald-900">
                {isSessionActive ? "Session Active — enter reply number below" : "Session Terminated."}
              </div>
            </div>

            {/* Input action */}
            {isSessionActive ? (
              <form onSubmit={handleSendUssd} className="flex gap-2">
                <input
                  type="text"
                  value={userReply}
                  onChange={(e) => setUserReply(e.target.value)}
                  placeholder="Enter menu number (e.g. 1, 2, 3)"
                  className="flex-1 bg-stone-950 border border-stone-700 text-white px-3 py-2 rounded-xl text-xs font-mono focus:outline-none focus:border-amber-400"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isLoadingUssd || !userReply.trim()}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Send
                </button>
              </form>
            ) : (
              <button
                onClick={handleResetSession}
                className="w-full bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Dial *384*911# Again</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* USSD Code Section */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Direct USSD Code
                </span>
                <span className="text-[10px] text-stone-400">Zero Internet Required</span>
              </div>
              <div className="flex items-center justify-between bg-stone-900 p-3 rounded-xl border border-stone-700">
                <span className="font-mono text-xl font-black text-amber-300 tracking-wider">
                  *384*911#
                </span>
                <button
                  onClick={() => handleCopy("*384*911#")}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedText === "*384*911#" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === "*384*911#" ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* SMS Triage Gateway */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  SMS AI Triage Shortcode
                </span>
                <span className="text-[10px] text-stone-400">Standard SMS Rates</span>
              </div>
              <div className="flex items-center justify-between bg-stone-900 p-3 rounded-xl border border-stone-700">
                <span className="font-mono text-base font-bold text-teal-300">
                  Send to <strong className="text-white">38120</strong>
                </span>
                <button
                  onClick={() => handleCopy("38120")}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedText === "38120" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === "38120" ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 24/7 Hotline Call */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-stone-800">
          <a
            href="tel:+234800938725"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Voice Emergency Hotline</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
