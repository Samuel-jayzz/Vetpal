import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Shield,
  Radio,
  MapPin,
  TrendingUp,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Eye,
  FileSpreadsheet,
  Building2,
  Globe,
  Share2,
  Users,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  EpiSignal,
  CommandCenterStats,
  CoordinatedCareCase,
  SpeciesType,
  ViewMode,
} from "../types";

interface CommandCenterViewProps {
  stats: CommandCenterStats;
  signals: EpiSignal[];
  cases: CoordinatedCareCase[];
  onNavigate: (view: ViewMode) => void;
  onDispatchInvestigation?: (signalId: string) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  stats,
  signals,
  cases,
  onNavigate,
  onDispatchInvestigation,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedSpecies, setSelectedSpecies] = useState<string>("ALL");
  const [activeSignalId, setActiveSignalId] = useState<string>(signals[0]?.id || "");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const activeSignal = signals.find((s) => s.id === activeSignalId) || signals[0];

  const filteredSignals = signals.filter((s) => {
    if (selectedSeverity !== "ALL" && s.severity !== selectedSeverity) return false;
    if (selectedSpecies !== "ALL" && !s.species.includes(selectedSpecies as SpeciesType)) return false;
    return true;
  });

  const handleExportData = (format: "CSV" | "JSON" | "PDF") => {
    setExportNotice(`Exporting National Epidemiological Bulletin in ${format} format...`);
    setTimeout(() => {
      setExportNotice(`Export completed. Ready for FAO EMPRES-i / NVRI Vom archive.`);
      setTimeout(() => setExportNotice(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Institutional Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>EPIDEMIOLOGICAL SURVEILLANCE RADAR</span>
              </span>
              <span className="text-stone-400 text-xs font-semibold">
                One Health Multi-Stakeholder Intelligence
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Animal Health Command Center
            </h1>
            <p className="text-stone-300 text-sm leading-relaxed">
              Connecting farmers, veterinary practitioners, researchers, NGOs, and government
              animal-health programmes to identify emerging signals and coordinate systemic public health
              interventions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleExportData("CSV")}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-bold cursor-pointer transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Bulletin</span>
            </button>
            <button
              onClick={() => onNavigate("CARE_COORDINATOR")}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>+ Coordinate Clinical Case</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Institutional Stakeholders Band */}
        <div className="mt-6 pt-4 border-t border-stone-800/80 flex flex-wrap items-center gap-6 text-[11px] text-stone-400">
          <span className="font-semibold text-stone-300">Surveillance Partners:</span>
          <span>• National Veterinary Research Institute (NVRI Vom)</span>
          <span>• Veterinary Council of Nigeria (VCN)</span>
          <span>• Federal Ministry of Agriculture & Food Security</span>
          <span>• FAO One Health Intelligence Engine</span>
        </div>
      </div>

      {/* Export Feedback Toast */}
      {exportNotice && (
        <div className="p-3 bg-emerald-950 text-emerald-200 text-xs font-bold rounded-2xl border border-emerald-700 shadow-md flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Key Institutional Metrics (The requested stats) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Cases This Week
          </span>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            {stats.casesThisWeek}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
            ↑ 12% vs prior week
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Active Cases
          </span>
          <div className="text-2xl sm:text-3xl font-black text-blue-900 mt-1">
            {stats.activeCases}
          </div>
          <div className="text-[10px] text-stone-400 font-semibold mt-0.5">
            Under active care
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Urgent Cases
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-1">
            {stats.urgentCases}
          </div>
          <div className="text-[10px] text-amber-600 font-bold mt-0.5">
            Same-day vet visits
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Critical Cases
          </span>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-1">
            {stats.criticalCases}
          </div>
          <div className="text-[10px] text-rose-600 font-bold mt-0.5">
            Emergency ICU active
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Recovered
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
            {stats.recoveredCases}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
            Verified recovery
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Auto Follow-Ups
          </span>
          <div className="text-2xl sm:text-3xl font-black text-purple-900 mt-1">
            {stats.totalFollowUpsConducted}
          </div>
          <div className="text-[10px] text-purple-600 font-bold mt-0.5">
            24h / 48h / 7d checks
          </div>
        </div>
      </div>

      {/* Crucial Institutional Principle Banner */}
      <div className="bg-amber-50 rounded-2xl p-4 sm:p-5 border border-amber-200 flex items-start gap-3.5 text-xs text-amber-950">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-extrabold uppercase tracking-wide text-amber-900">
            Surveillance Principle: Emerging Signals vs Confirmed Outbreaks
          </div>
          <p className="leading-relaxed text-amber-900/90">
            <strong>Important:</strong> VetPal identifies statistical clusters and clinical patterns as{" "}
            <span className="underline decoration-amber-500 font-black">emerging signals</span>, not
            confirmed outbreaks, until qualified state and national veterinary authorities investigate and
            laboratory serology/PCR confirms the pathogen.
          </p>
        </div>
      </div>

      {/* Main Grid: Emerging Signals Radar (Left 7 Cols) & Syndromic Intelligence (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Emerging Signals Section */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <span>Emerging Signals</span>
                <span className="text-xs bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-bold">
                  {filteredSignals.length}
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                Spatial clusters triggering automated anomaly thresholds
              </p>
            </div>

            {/* Severity Filter Tabs */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
              {["ALL", "CRITICAL", "URGENT", "WATCH"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                    selectedSeverity === sev
                      ? "bg-white text-stone-950 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Signals List */}
          <div className="space-y-3">
            {filteredSignals.map((sig) => {
              const isSelected = sig.id === activeSignal?.id;
              return (
                <div
                  key={sig.id}
                  onClick={() => setActiveSignalId(sig.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? "bg-white border-stone-800 shadow-md ring-1 ring-stone-900"
                      : "bg-white border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                            sig.severity === "CRITICAL"
                              ? "bg-rose-100 text-rose-800"
                              : sig.severity === "URGENT"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-stone-200 text-stone-800"
                          }`}
                        >
                          {sig.severity} SIGNAL
                        </span>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                          {sig.investigationStatus.replace(/_/g, " ")}
                        </span>

                        <span className="text-[11px] text-stone-400 font-mono">
                          {sig.timeframe}
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-stone-900 leading-snug">
                        {sig.title}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-lg font-black text-stone-900">
                        {sig.caseCount}
                      </span>
                      <div className="text-[10px] text-stone-400">cases</div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {sig.details}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>
                        {sig.region} ({sig.lga}) • Radius: {sig.radiusKm} km
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-bold text-stone-700">
                      <span>Reported by {sig.reportedByVetCount} local clinicians</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Signal Action Hub & Syndromic Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Signal Inspection Card */}
          {activeSignal && (
            <div className="bg-stone-900 text-white rounded-3xl p-6 border border-stone-800 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Investigative Dossier
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  ID: {activeSignal.id}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-white leading-tight">
                  {activeSignal.title}
                </h3>
                <div className="text-xs text-stone-400 mt-1">
                  Syndrome: <strong className="text-stone-200">{activeSignal.syndrome}</strong>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Recommended Regional Protocols:
                </span>
                <div className="space-y-1.5">
                  {activeSignal.recommendedIntervention.map((rec, i) => (
                    <div
                      key={i}
                      className="text-xs text-stone-200 bg-stone-800/80 p-2.5 rounded-xl border border-stone-700/60 flex items-start gap-2"
                    >
                      <span className="text-emerald-400 font-bold shrink-0">{i + 1}.</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-2">
                <button
                  onClick={() =>
                    alert(
                      `Field Task Force dispatched to ${activeSignal.lga}. NVRI mobile diagnostic vehicle alerted.`
                    )
                  }
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer transition-colors text-center"
                >
                  Dispatch Field Lab
                </button>
                <button
                  onClick={() => onNavigate("CARE_COORDINATOR")}
                  className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold cursor-pointer transition-colors"
                >
                  View Cases
                </button>
              </div>
            </div>
          )}

          {/* Syndromic Surveillance Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              Syndromic Distribution (Past 14 Days)
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-stone-800">Respiratory Complex & Cough</span>
                  <span className="text-stone-600">42% (146 cases)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: "42%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-stone-800">Gastrointestinal & Enteritis</span>
                  <span className="text-stone-600">28% (97 cases)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "28%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-stone-800">Systemic Pyrexia & Vector-Borne</span>
                  <span className="text-stone-600">16% (55 cases)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "16%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-stone-800">Lameness & Musculoskeletal</span>
                  <span className="text-stone-600">9% (31 cases)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: "9%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-stone-800">Acute Peracute Mortality</span>
                  <span className="text-stone-600">5% (18 cases)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: "5%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
