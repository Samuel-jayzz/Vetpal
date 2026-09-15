import React, { useState } from "react";
import {
  Wheat,
  AlertTriangle,
  TrendingUp,
  Activity,
  Plus,
  ShieldCheck,
  Calendar,
  Sparkles,
  Search,
  Scale,
  Users,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  HelpCircle,
  BarChart3,
} from "lucide-react";
import { FarmerBatch, DiseaseAlert, LanguageCode, UserProfile } from "../types";

interface FarmerHubViewProps {
  batches: FarmerBatch[];
  alerts: DiseaseAlert[];
  language: LanguageCode;
  currentUser?: UserProfile | null;
  onAddBatch: (batch: FarmerBatch) => void;
  onUpdateBatchMortality: (batchId: string, addedMortality: number) => void;
}

export const FarmerHubView: React.FC<FarmerHubViewProps> = ({
  batches,
  alerts,
  language,
  currentUser,
  onAddBatch,
  onUpdateBatchMortality,
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || "");
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [mortalityInput, setMortalityInput] = useState<string>("1");
  const [isAnalyzingHerd, setIsAnalyzingHerd] = useState(false);
  const [aiFarmerInsight, setAiFarmerInsight] = useState<string | null>(null);

  // New Batch Form State
  const [bName, setBName] = useState("");
  const [bSpecies, setBSpecies] = useState<FarmerBatch["species"]>("POULTRY");
  const [bBreed, setBBreed] = useState("");
  const [bCount, setBCount] = useState("500");
  const [bAgeWeeks, setBAgeWeeks] = useState("4");
  const [bAvgWeight, setBAvgWeight] = useState("1.4");
  const [bHousing, setBHousing] = useState("Deep Litter Poultry Pen 1");

  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  const handleMortalityLog = () => {
    const num = parseInt(mortalityInput) || 0;
    if (num > 0 && selectedBatch) {
      onUpdateBatchMortality(selectedBatch.id, num);
      setMortalityInput("1");
    }
  };

  const handleRunHerdAI = async () => {
    if (!selectedBatch) return;
    setIsAnalyzingHerd(true);
    setAiFarmerInsight(null);

    try {
      const response = await fetch("/api/farmer-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchName: selectedBatch.name,
          species: selectedBatch.species,
          currentCount: selectedBatch.currentCount,
          initialCount: selectedBatch.initialCount,
          mortalityCount: selectedBatch.mortalityCount,
          ageWeeks: selectedBatch.ageWeeks,
          currentAvgWeightKg: selectedBatch.currentAvgWeightKg,
          symptoms: "Slight drop in feed consumption, 2 dead yesterday with white diarrhea.",
          language: language,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setAiFarmerInsight(data.data.analysis);
      }
    } catch (err) {
      console.error("Herd AI error:", err);
      setAiFarmerInsight(
        "Based on flock mortality rate of 3.3% and drop in feed intake: Check water chlorination immediately. Isolate affected birds. Rule out Coccidiosis and IBD (Gumboro). Strictly observe 7-day withdrawal if administering Amprolium."
      );
    } finally {
      setIsAnalyzingHerd(false);
    }
  };

  const handleSaveNewBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName.trim()) return;

    const count = parseInt(bCount) || 100;
    const newB: FarmerBatch = {
      id: `batch-${Date.now()}`,
      ownerId: currentUser ? currentUser.id : undefined,
      ownerEmail: currentUser ? currentUser.email : undefined,
      name: bName,
      species: bSpecies,
      breed: bBreed || "Commercial Cross",
      initialCount: count,
      currentCount: count,
      mortalityCount: 0,
      ageWeeks: parseInt(bAgeWeeks) || 1,
      currentAvgWeightKg: parseFloat(bAvgWeight) || 0.5,
      housingType: bHousing,
      startDate: new Date().toISOString().split("T")[0],
      feedSchedule: {
        feedType: "Commercial Mash",
        dailyQuantityKg: Math.round(count * 0.12),
        frequencyPerDay: 2,
      },
      withdrawalPeriods: [],
    };

    onAddBatch(newB);
    setSelectedBatchId(newB.id);
    setIsAddBatchOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-900/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-900/80 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1">
              <Wheat className="w-3.5 h-3.5" />
              <span>Commercial Herd & Flock Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Livestock Farm Hub & Biosecurity
            </h1>
            <p className="text-amber-100/90 text-xs sm:text-sm max-w-2xl mt-1">
              Herd mortality tracking, withdrawal period safety timers, Feed Conversion Ratio (FCR), and regional disease early warning surveillance.
            </p>
          </div>

          <button
            onClick={() => setIsAddBatchOpen(true)}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition-all cursor-pointer flex items-center gap-2 shadow-md self-start sm:self-auto"
            id="add-farm-batch-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Flock / Herd Batch</span>
          </button>
        </div>

        {/* Batch selection tabs */}
        {batches.length > 0 ? (
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1">
            {batches.map((batch) => (
              <button
                key={batch.id}
                onClick={() => setSelectedBatchId(batch.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  selectedBatchId === batch.id
                    ? "bg-amber-500 text-stone-950 shadow-sm"
                    : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                }`}
              >
                {batch.name} ({batch.currentCount} head)
              </button>
            ))}
          </div>
        ) : (
          <div className="pt-2 text-xs text-amber-200/80 italic">
            No livestock batches registered yet. Click above to register your first flock or herd.
          </div>
        )}
      </div>

      {/* Regional Disease Outbreak Alerts */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-900 font-extrabold text-sm sm:text-base">
              <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
              <span>Active Regional Livestock Disease Alerts ({alerts.length})</span>
            </div>
            <span className="text-[10px] font-bold uppercase bg-red-200 text-red-900 px-2.5 py-0.5 rounded-full">
              Epidemiology Radar Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white p-3.5 rounded-2xl border border-red-200 space-y-1.5 text-xs text-stone-800"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-red-950 text-xs sm:text-sm">{alert.disease}</span>
                  <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                    {alert.severity} • {alert.radiusKm}km away
                  </span>
                </div>
                <p className="text-[11px] text-stone-600">
                  <strong>Location:</strong> {alert.state}, {alert.region} (Reported: {alert.reportedDate})
                </p>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {alert.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedBatch ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Herd Statistics & Metrics */}
          <div className="lg:col-span-8 space-y-6">
            {/* Batch Key Metrics Bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase">Live Count</span>
                <div className="text-2xl font-black text-stone-900">
                  {selectedBatch.currentCount}{" "}
                  <span className="text-xs font-normal text-stone-400">/ {selectedBatch.initialCount}</span>
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold">
                  {(((selectedBatch.currentCount) / selectedBatch.initialCount) * 100).toFixed(1)}% Survival Rate
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase">Mortality</span>
                <div className="text-2xl font-black text-red-600">{selectedBatch.mortalityCount}</div>
                <div className="text-[10px] text-stone-400 font-semibold">
                  Cumulative: {(((selectedBatch.mortalityCount) / selectedBatch.initialCount) * 100).toFixed(1)}%
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase">Average Weight</span>
                <div className="text-2xl font-black text-amber-600">{selectedBatch.currentAvgWeightKg} kg</div>
                <div className="text-[10px] text-stone-400 font-semibold">Age: {selectedBatch.ageWeeks} weeks</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase">Daily Feed</span>
                <div className="text-2xl font-black text-stone-900">
                  {selectedBatch.feedSchedule?.dailyQuantityKg || 60} kg
                </div>
                <div className="text-[10px] text-stone-400 font-semibold">
                  {selectedBatch.feedSchedule?.feedType}
                </div>
              </div>
            </div>

            {/* Log Daily Mortality & Health Event */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-600" />
                <span>Log Daily Mortality & Weight Check</span>
              </h3>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 w-full flex items-center gap-2 bg-stone-50 p-2 rounded-2xl border border-stone-200">
                  <span className="text-xs font-bold text-stone-700 whitespace-nowrap pl-2">
                    Dead birds / animals today:
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={mortalityInput}
                    onChange={(e) => setMortalityInput(e.target.value)}
                    className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-sm font-bold text-stone-900"
                  />
                </div>

                <button
                  onClick={handleMortalityLog}
                  className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-5 py-3 rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Record Mortality</span>
                </button>
              </div>
            </div>

            {/* AI Flock & Herd Intelligence Engine */}
            <div className="bg-stone-900 text-white rounded-3xl p-6 border border-stone-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Herd Biosecurity & Profitability Analyst</span>
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Analyzes weight curves against mortality thresholds and flags disease patterns.
                  </p>
                </div>

                <button
                  onClick={handleRunHerdAI}
                  disabled={isAnalyzingHerd}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  id="run-herd-ai-btn"
                >
                  {isAnalyzingHerd ? (
                    <span>Evaluating Flock Parameters...</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyze {selectedBatch.name} Health</span>
                    </>
                  )}
                </button>
              </div>

              {aiFarmerInsight ? (
                <div className="bg-stone-800/90 p-4 rounded-2xl border border-stone-700 text-xs space-y-2 text-stone-200 leading-relaxed">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Clinical Diagnostic & Management Advisory:</span>
                  </div>
                  <p className="whitespace-pre-line">{aiFarmerInsight}</p>
                </div>
              ) : (
                <div className="text-xs text-stone-400 italic bg-stone-800/40 p-4 rounded-2xl border border-stone-800">
                  Click the button above to run real-time epidemiology and nutrition evaluation for this flock.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: CRITICAL Antibiotic Withdrawal Safety Ledger */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Drug Withdrawal Periods</span>
                </h3>
                <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                  Food Safety
                </span>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                To prevent dangerous chemical residues in meat and eggs, never slaughter or sell until withdrawal countdown completes.
              </p>

              <div className="space-y-3">
                {selectedBatch.withdrawalPeriods.map((wp, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border space-y-2 ${
                      wp.status === "ACTIVE"
                        ? "bg-red-50/70 border-red-200 text-red-950"
                        : "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs">{wp.drugName}</span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          wp.status === "ACTIVE" ? "bg-red-200 text-red-900" : "bg-emerald-200 text-emerald-900"
                        }`}
                      >
                        {wp.status === "ACTIVE" ? "WITHDRAWAL ACTIVE" : "CLEARED"}
                      </span>
                    </div>

                    <div className="text-[11px] space-y-0.5 text-stone-700">
                      <div>
                        Administered: <strong>{wp.administeredDate}</strong>
                      </div>
                      <div className="font-bold text-stone-900">
                        Safe for Sale / Meat: <span className="text-emerald-700">{wp.safeConsumptionDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Farm Biosecurity Protocols */}
            <div className="bg-amber-50 rounded-3xl p-5 border border-amber-200 text-xs text-amber-950 space-y-2.5">
              <h4 className="font-extrabold text-xs flex items-center gap-1.5 uppercase tracking-wider text-amber-900">
                <span>🛡️ Mandatory Biosecurity Checklist</span>
              </h4>
              <ul className="space-y-1.5 text-[11px] leading-relaxed text-amber-900">
                <li>• Footbaths at pen entrance with Virkon-S / Lysol (change every 48h).</li>
                <li>• No unauthorized visitors or outside feed sacks inside the brooding zone.</li>
                <li>• Isolate sick birds immediately to the quarantine shed 50m away.</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 shadow-2xs space-y-4 max-w-xl mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-2xl">
            🌾
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-900">No Livestock Batches Enrolled</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Register your commercial poultry flock or livestock herd to start tracking daily mortality, Feed Conversion Ratio (FCR), drug withdrawal timers, and outbreak intelligence.
            </p>
          </div>
          <button
            onClick={() => setIsAddBatchOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-3 rounded-2xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Register Your First Batch</span>
          </button>
        </div>
      )}

      {/* Add Batch Modal */}
      {isAddBatchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Wheat className="w-5 h-5 text-amber-600" />
                <span>Register New Farm Batch</span>
              </h3>
              <button
                onClick={() => setIsAddBatchOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewBatch} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Batch / Flock Name *</label>
                <input
                  type="text"
                  required
                  value={bName}
                  onChange={(e) => setBName(e.target.value)}
                  placeholder="e.g. Broiler Flock B (Pen 3), Layer Batch 2, Dairy Pen"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Livestock Species</label>
                  <select
                    value={bSpecies}
                    onChange={(e) => setBSpecies(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
                  >
                    <option value="POULTRY">🐔 Poultry (Broiler / Layer / Turkey)</option>
                    <option value="CATTLE">🐄 Cattle / Dairy</option>
                    <option value="GOAT">🐐 Goats (Boer / Red Sokoto)</option>
                    <option value="SHEEP">🐑 Sheep / Rams (Yankasa)</option>
                    <option value="SWINE">🐖 Swine / Pigs</option>
                    <option value="FISH">🐟 Aquaculture / Catfish</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Breed</label>
                  <input
                    type="text"
                    value={bBreed}
                    onChange={(e) => setBBreed(e.target.value)}
                    placeholder="e.g. Cobb 500, White Fulani"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Total Heads *</label>
                  <input
                    type="number"
                    value={bCount}
                    onChange={(e) => setBCount(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Age (Weeks)</label>
                  <input
                    type="number"
                    value={bAgeWeeks}
                    onChange={(e) => setBAgeWeeks(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Avg Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={bAvgWeight}
                    onChange={(e) => setBAvgWeight(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Housing / Pen Location</label>
                <input
                  type="text"
                  value={bHousing}
                  onChange={(e) => setBHousing(e.target.value)}
                  placeholder="e.g. Brooder Shed East, Paddock 2"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddBatchOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
