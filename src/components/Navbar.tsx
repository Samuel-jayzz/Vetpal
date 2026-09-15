import React, { useState } from "react";
import {
  HeartPulse,
  AlertTriangle,
  Radio,
  Globe,
  User,
  Shield,
  Stethoscope,
  Building2,
  Wheat,
  FileText,
  Lock,
  ChevronDown,
  LogOut,
  UserPlus,
  PawPrint,
  CheckCircle2,
  Sparkles,
  Plus,
} from "lucide-react";
import { ViewMode, LanguageCode, UserRole, UserProfile } from "../types";

interface NavbarProps {
  currentView: ViewMode;
  currentRole: UserRole;
  language: LanguageCode;
  currentUser?: UserProfile | null;
  animalCount?: number;
  batchCount?: number;
  onNavigate: (view: ViewMode) => void;
  onRoleChange: (role: UserRole) => void;
  onLanguageChange: (lang: LanguageCode) => void;
  onTriggerEmergency: () => void;
  onOpenLowConnectivityModal: () => void;
  onOpenAuthModal?: (mode?: "SIGN_IN" | "SIGN_UP", role?: UserRole) => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  currentRole,
  language,
  currentUser = null,
  animalCount = 0,
  batchCount = 0,
  onNavigate,
  onRoleChange,
  onLanguageChange,
  onTriggerEmergency,
  onOpenLowConnectivityModal,
  onOpenAuthModal,
  onSignOut,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Emergency Status Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            24/7 Live Emergency Network Active
          </span>
          <span className="hidden sm:inline text-stone-300">
            Emergency Hotline: <strong className="text-white">+234 (0) 800-VETPAL-911</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLowConnectivityModal}
            className="text-[11px] flex items-center gap-1 text-emerald-300 hover:text-white underline cursor-pointer"
            title="Open USSD & Offline 2G Fallback"
          >
            <Radio className="w-3 h-3 text-amber-400" />
            <span>USSD / Low-Data Mode (*384*911#)</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("HOME")}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-stone-900">
                    Vet<span className="text-emerald-600">Pal</span>
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-1.5 py-0.5 rounded-sm">
                    ECOSYSTEM
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 hidden sm:block">
                  AI Veterinary & Livestock Health
                </p>
              </div>
            </button>
          </div>

          {/* Quick Primary Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate("HOME")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === "HOME"
                  ? "bg-emerald-50 text-emerald-700 font-bold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("CARE_COORDINATOR")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === "CARE_COORDINATOR"
                  ? "bg-teal-800 text-white font-black shadow-xs"
                  : "bg-teal-50 text-teal-900 hover:bg-teal-100 border border-teal-300"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Care Pipeline</span>
            </button>
            <button
              onClick={() => onNavigate("COMMAND_CENTER")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === "COMMAND_CENTER"
                  ? "bg-stone-900 text-emerald-400 font-black shadow-xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
              <span>Command Center</span>
            </button>
            <button
              onClick={() => onNavigate("AI_ASSISTANT")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === "AI_ASSISTANT"
                  ? "bg-emerald-50 text-emerald-700 font-bold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              Ask AI Brain
            </button>
            <button
              onClick={() => onNavigate("FIND_VET")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === "FIND_VET"
                  ? "bg-emerald-50 text-emerald-700 font-bold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              Find Vets & Clinics
            </button>
            <button
              onClick={() => onNavigate("MY_ANIMALS")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === "MY_ANIMALS"
                  ? "bg-emerald-50 text-emerald-700 font-bold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              My Animals ({animalCount})
            </button>
            <button
              onClick={() => onNavigate("PASSPORT")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === "PASSPORT"
                  ? "bg-purple-50 text-purple-700 font-bold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              Health Passport
            </button>
            <button
              onClick={() => onNavigate("FARMER_HUB")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === "FARMER_HUB"
                  ? "bg-amber-100 text-amber-900 font-bold"
                  : "text-stone-600 hover:text-amber-800 hover:bg-amber-50"
              }`}
            >
              🌾 Farmer Hub ({batchCount})
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative hidden md:block">
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="appearance-none bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-semibold py-1.5 pl-7 pr-6 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Language selection"
              >
                <option value="en">English</option>
                <option value="ha">Hausa</option>
                <option value="yo">Yorùbá</option>
                <option value="ig">Igbo</option>
              </select>
              <Globe className="w-3.5 h-3.5 text-stone-500 absolute left-2 top-2.5 pointer-events-none" />
            </div>

            {/* User Account / Profile / Sign In Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 py-1 pl-1.5 pr-2.5 rounded-xl cursor-pointer transition-colors"
                  id="user-profile-menu-btn"
                >
                  <img
                    src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-[11px] font-extrabold text-stone-900 leading-tight flex items-center gap-1">
                      <span>{currentUser.fullName.split(" ")[0]}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-[10px] text-stone-500 font-semibold">
                      {currentUser.role === "PET_OWNER"
                        ? "Pet Owner"
                        : currentUser.role === "FARMER"
                        ? "Commercial Farmer"
                        : currentUser.role === "VET"
                        ? "Vet Clinician"
                        : "Admin"}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 ml-0.5" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                        <div className="text-xs font-bold text-stone-900">{currentUser.fullName}</div>
                        <div className="text-[11px] text-stone-500">{currentUser.email || currentUser.phone}</div>
                        <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>
                            {currentUser.role === "PET_OWNER"
                              ? "Registered Pet Owner"
                              : currentUser.role === "FARMER"
                              ? "Registered Farm Enterprise"
                              : currentUser.role === "VET"
                              ? "VCN Accredited DVM"
                              : "National Portal Admin"}
                          </span>
                        </div>
                      </div>

                      <div className="pt-1 space-y-0.5">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenAuthModal?.("SIGN_UP", currentUser.role);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded-lg flex items-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Register Another Animal / Herd</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenAuthModal?.("SIGN_IN");
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg flex items-center gap-2 cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-stone-500" />
                          <span>Switch Account / Sign In</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onSignOut?.();
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 cursor-pointer border-t border-stone-100"
                        >
                          <LogOut className="w-3.5 h-3.5 text-red-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuthModal?.("SIGN_IN")}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer"
                  id="navbar-signin-btn"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuthModal?.("SIGN_UP")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
                  id="navbar-signup-btn"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register Free</span>
                </button>
              </div>
            )}

            {/* Emergency Action Button */}
            <button
              onClick={onTriggerEmergency}
              className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-xs sm:text-sm px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer animate-pulse"
              id="emergency-btn-navbar"
            >
              <AlertTriangle className="w-4 h-4 text-amber-200" />
              <span>🚨 EMERGENCY</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

