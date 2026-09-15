import React, { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Users,
  AlertTriangle,
  FileCheck,
  CheckCircle,
  XCircle,
  Activity,
  Send,
  Radio,
  Search,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Veterinarian, DiseaseAlert, AnimalProfile, FarmerBatch, UserProfile } from "../types";

interface AdminPortalViewProps {
  vets: Veterinarian[];
  alerts: DiseaseAlert[];
  animals?: AnimalProfile[];
  batches?: FarmerBatch[];
  users?: UserProfile[];
  currentUser?: UserProfile | null;
  onApproveVet: (vetId: string) => void;
  onBroadcastAlert: (alert: DiseaseAlert) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  vets,
  alerts,
  animals = [],
  batches = [],
  users = [],
  currentUser,
  onApproveVet,
  onBroadcastAlert,
}) => {
  const [activeTab, setActiveTab] = useState<"VETS" | "SURVEILLANCE" | "METRICS">("VETS");
  const [newDisease, setNewDisease] = useState("");
  const [newRegion, setNewRegion] = useState("Oyo State");
  const [newSeverity, setNewSeverity] = useState<"CRITICAL" | "HIGH" | "MEDIUM">("HIGH");
  const [newRecommendation, setNewRecommendation] = useState("");
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const pendingVets = [
    {
      id: "vet-pending-1",
      name: "Dr. Farouk Al-Hassan",
      title: "Veterinary Surgeon (BSc DVM Zaria)",
      licenseNumber: "VCN/2024/0981",
      clinicName: "Arewa Livestock & Equine Clinic, Kaduna",
      specialties: ["Cattle", "Horses", "Field Surgery"],
      avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
      submittedDate: "2026-08-25",
      status: "PENDING_VERIFICATION",
    },
    {
      id: "vet-pending-2",
      name: "Dr. Ngozi Okonkwo",
      title: "Poultry Pathologist & Biosecurity Consultant",
      licenseNumber: "VCN/2023/4512",
      clinicName: "Enugu Agrovets & Diagnostic Lab",
      specialties: ["Poultry Disease", "Vaccine Protocol", "Nutrition"],
      avatarUrl: "https://images.unsplash.com/photo-1594824813591-105151528bb2?auto=format&fit=crop&w=400&q=80",
      submittedDate: "2026-08-26",
      status: "PENDING_VERIFICATION",
    },
  ];

  const [unapprovedList, setUnapprovedList] = useState(pendingVets);

  const handleApprove = (vetId: string) => {
    setUnapprovedList((prev) => prev.filter((v) => v.id !== vetId));
    onApproveVet(vetId);
  };

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisease.trim()) return;

    const alert: DiseaseAlert = {
      id: `alert-${Date.now()}`,
      disease: newDisease,
      speciesAffected: ["POULTRY", "CATTLE"],
      severity: newSeverity,
      state: newRegion,
      region: "Southwest / Ag Belt",
      radiusKm: 25,
      reportedDate: new Date().toISOString().split("T")[0],
      recommendation: newRecommendation || "Implement strict quarantine and report sudden mortalities immediately to VetPal authorities.",
    };

    onBroadcastAlert(alert);
    setBroadcastSuccess(true);
    setNewDisease("");
    setNewRecommendation("");
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-stone-800 text-purple-300 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>National Animal Health Administration & Regulatory Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              VetPal Ecosystem Administration
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm max-w-2xl mt-1">
              Admin: <span className="text-white font-bold">{currentUser?.fullName || "Sid Achaba"}</span> ({currentUser?.email || "sidachaba13@gmail.com"}) • VCN practitioner license auditing, national disease surveillance, and system teleconsultation quality governance.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-800 p-1.5 rounded-2xl border border-stone-700">
            <button
              onClick={() => setActiveTab("VETS")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "VETS" ? "bg-purple-600 text-white" : "text-stone-300 hover:text-white"
              }`}
            >
              License Verification ({unapprovedList.length})
            </button>
            <button
              onClick={() => setActiveTab("SURVEILLANCE")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "SURVEILLANCE" ? "bg-purple-600 text-white" : "text-stone-300 hover:text-white"
              }`}
            >
              Disease Broadcaster
            </button>
            <button
              onClick={() => setActiveTab("METRICS")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "METRICS" ? "bg-purple-600 text-white" : "text-stone-300 hover:text-white"
              }`}
            >
              National KPIs
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Practitioner License Verification */}
      {activeTab === "VETS" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-purple-600" />
                  <span>Pending Veterinary Council License Audits</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Verify DVM certificates and VCN state registrations prior to approving telemedicine & e-Rx issuance.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                {unapprovedList.length} Pending Approval
              </span>
            </div>

            {unapprovedList.length === 0 ? (
              <div className="text-center py-10 text-stone-400 text-xs space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="font-bold text-stone-700 text-sm">All Veterinary Practitioner Applications Audited!</p>
                <p>No unverified clinicians in the approval queue.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {unapprovedList.map((vet) => (
                  <div
                    key={vet.id}
                    className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <img
                          src={vet.avatarUrl}
                          alt={vet.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-stone-200 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-stone-900">{vet.name}</h4>
                            <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                              {vet.licenseNumber}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-stone-600">{vet.title}</p>
                          <p className="text-xs text-stone-500">{vet.clinicName}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {vet.specialties.map((s, idx) => (
                              <span
                                key={idx}
                                className="bg-stone-200 text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleApprove(vet.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve & Issue Badge</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Disease Surveillance Broadcaster */}
      {activeTab === "SURVEILLANCE" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-600 animate-pulse" />
                <span>Broadcast Epizootic Outbreak Warning</span>
              </h3>
              <p className="text-xs text-stone-500">
                Pushes emergency SMS & in-app alerts to all registered farmers & clinics in the designated corridor.
              </p>

              <form onSubmit={handleCreateBroadcast} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Disease Name *</label>
                  <input
                    type="text"
                    required
                    value={newDisease}
                    onChange={(e) => setNewDisease(e.target.value)}
                    placeholder="e.g. African Swine Fever (ASF), Contagious Bovine Pleuropneumonia"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Affected State / Zone</label>
                    <select
                      value={newRegion}
                      onChange={(e) => setNewRegion(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
                    >
                      <option value="Oyo State">Oyo State (Ibadan / Oyo)</option>
                      <option value="Kano State">Kano State (Dawanau)</option>
                      <option value="Lagos State">Lagos State (Epe / Ikorodu)</option>
                      <option value="Kaduna State">Kaduna State (Zaria)</option>
                      <option value="Ogun State">Ogun State (Abeokuta / Sagamu)</option>
                      <option value="Enugu State">Enugu State (Nsukka)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Severity Level</label>
                    <select
                      value={newSeverity}
                      onChange={(e) => setNewSeverity(e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
                    >
                      <option value="CRITICAL">🚨 Critical / High Mortality</option>
                      <option value="HIGH">⚠️ High Alert</option>
                      <option value="MEDIUM">⚡ Medium Monitoring</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Recommended Biosecurity Countermeasure</label>
                  <textarea
                    value={newRecommendation}
                    onChange={(e) => setNewRecommendation(e.target.value)}
                    placeholder="e.g. Restrict bird transportation. Sanitize feed trucks with quaternary ammonium."
                    rows={3}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium"
                  />
                </div>

                {broadcastSuccess && (
                  <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl border border-emerald-200 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Emergency Outbreak Alert Broadcasted to {users.filter((u) => u.role === "FARMER").length || 1} Registered Farm Units ({batches.length} Active Flocks/Herds)!
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit National Health Broadcast</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900">Active Outbreak Feeds ({alerts.length})</h3>
            <div className="space-y-3">
              {alerts.map((al) => (
                <div key={al.id} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">{al.disease}</span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                      {al.state}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{al.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: National KPIs - Strictly Real Dynamic Active Data */}
      {activeTab === "METRICS" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase">Registered Users</span>
              <div className="text-3xl font-black text-stone-900">{users.length}</div>
              <div className="text-xs text-emerald-600 font-semibold">
                {users.filter((u) => u.role === "PET_OWNER").length} Guardians • {users.filter((u) => u.role === "FARMER").length} Farmers
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase">Registered Animals</span>
              <div className="text-3xl font-black text-purple-700">{animals.length}</div>
              <div className="text-xs text-stone-500">Digital Health Passports</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase">Livestock Headcount</span>
              <div className="text-3xl font-black text-amber-600">
                {batches.reduce((sum, b) => sum + (b.currentCount || 0), 0).toLocaleString()}
              </div>
              <div className="text-xs text-stone-500">{batches.length} Active Farm Batches</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase">Verified Doctors</span>
              <div className="text-3xl font-black text-teal-700">{vets.length}</div>
              <div className="text-xs text-emerald-600">VCN License Verified</div>
            </div>
          </div>

          {/* Active Registry Breakdown List */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900">Active Registered Accounts ({users.length})</h3>
            <div className="divide-y divide-stone-100">
              {users.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-stone-900">{u.fullName}</p>
                    <p className="text-[11px] text-stone-500">{u.email} • {u.phone} • {u.state}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    u.role === "VET"
                      ? "bg-teal-50 text-teal-700 border border-teal-200"
                      : u.role === "FARMER"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : u.role === "ADMIN"
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
