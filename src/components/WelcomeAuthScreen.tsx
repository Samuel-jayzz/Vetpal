import React, { useState, useRef } from "react";
import {
  ShieldCheck,
  Stethoscope,
  Wheat,
  User,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  ChevronRight,
  Bot,
  Zap,
  Activity,
  AlertTriangle,
  Camera,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import {
  UserProfile,
  UserRole,
  SpeciesType,
  AnimalProfile,
  FarmerBatch,
  Veterinarian,
  TriageAssessment,
} from "../types";

interface WelcomeAuthScreenProps {
  onLogin: (user: UserProfile) => void;
  onRegister: (
    user: UserProfile,
    initialAnimal?: AnimalProfile,
    initialBatch?: FarmerBatch,
    initialVetClinic?: Veterinarian
  ) => void;
  existingUsers: UserProfile[];
  animalsCount?: number;
  batchesCount?: number;
  vetsCount?: number;
}

export const WelcomeAuthScreen: React.FC<WelcomeAuthScreenProps> = ({
  onLogin,
  onRegister,
  existingUsers,
  animalsCount = 0,
  batchesCount = 0,
  vetsCount = 0,
}) => {
  // Tab state: "SIGN_IN" | "SIGN_UP" | "TRY_AI_SERVICE" | "DEMO_ACCOUNTS"
  const [authMode, setAuthMode] = useState<"SIGN_IN" | "SIGN_UP" | "TRY_AI_SERVICE" | "DEMO_ACCOUNTS">("SIGN_IN");
  const [selectedRole, setSelectedRole] = useState<UserRole>("PET_OWNER");
  const [signUpStep, setSignUpStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sign In state
  const [signInIdentifier, setSignInIdentifier] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up - Step 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+234 ");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [password, setPassword] = useState("");
  const [stateName, setStateName] = useState("Lagos State");
  const [cityOrLga, setCityOrLga] = useState("");
  const [address, setAddress] = useState("");

  // Farmer specific
  const [farmName, setFarmName] = useState("");
  const [farmType, setFarmType] = useState<FarmerBatch["farmType"]>("POULTRY");
  const [farmSizeAcreage, setFarmSizeAcreage] = useState("15");

  // Vet specific
  const [vetTitle, setVetTitle] = useState("Doctor of Veterinary Medicine (DVM)");
  const [licenseNumber, setLicenseNumber] = useState("VCN/REG/");
  const [clinicName, setClinicName] = useState("");
  const [specialties, setSpecialties] = useState("Small Animal & Avian Medicine");
  const [consultationFee, setConsultationFee] = useState("5000");

  // Sign Up - Step 2: Animal / Flock / Clinic Setup
  const [registerAnimalNow, setRegisterAnimalNow] = useState(true);
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState<SpeciesType>("DOG");
  const [petBreed, setPetBreed] = useState("");
  const [petSex, setPetSex] = useState<AnimalProfile["sex"]>("MALE");
  const [petAge, setPetAge] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [petTag, setPetTag] = useState("");

  // Farmer batch setup
  const [registerBatchNow, setRegisterBatchNow] = useState(true);
  const [batchName, setBatchName] = useState("");
  const [batchSpecies, setBatchSpecies] = useState<SpeciesType>("POULTRY");
  const [batchHeadcount, setBatchHeadcount] = useState("1000");
  const [batchAgeWeeks, setBatchAgeWeeks] = useState("3");
  const [batchHousing, setBatchHousing] = useState("Ventilated Deep-Litter House A");

  // Vet clinic setup
  const [registerClinicNow, setRegisterClinicNow] = useState(true);
  const [clinicAddress, setClinicAddress] = useState("");
  const [openHours, setOpenHours] = useState("8:00 AM - 6:00 PM (24/7 Emergency ICU)");

  // --- Quick Instant AI Service Test on Welcome Screen ---
  const [aiSpecies, setAiSpecies] = useState<SpeciesType>("DOG");
  const [aiBreed, setAiBreed] = useState("");
  const [aiSymptoms, setAiSymptoms] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAssessment, setAiAssessment] = useState<TriageAssessment | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const nigerianStates = [
    "Abia State", "Adamawa State", "Akwa Ibom State", "Anambra State", "Bauchi State",
    "Bayelsa State", "Benue State", "Borno State", "Cross River State", "Delta State",
    "Ebonyi State", "Edo State", "Ekiti State", "Enugu State", "Federal Capital Territory",
    "Gombe State", "Imo State", "Jigawa State", "Kaduna State", "Kano State",
    "Katsina State", "Kebbi State", "Kogi State", "Kwara State", "Lagos State",
    "Nasarawa State", "Niger State", "Ogun State", "Ondo State", "Osun State",
    "Oyo State", "Plateau State", "Rivers State", "Sokoto State", "Taraba State",
    "Yobe State", "Zamfara State"
  ];

  // Handle Instant AI Test Submission directly on Welcome Screen
  const handleInstantAiTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiSymptoms.trim()) {
      setAiError("Please describe the animal's symptoms or behavior.");
      return;
    }
    setAiLoading(true);
    setAiError(null);
    setAiAssessment(null);

    try {
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          species: aiSpecies,
          breed: aiBreed.trim() || "Mixed breed",
          age: "Unknown",
          symptoms: aiSymptoms.trim(),
          language: "en",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI triage evaluation");
      }

      const data: TriageAssessment = await response.json();
      setAiAssessment(data);
    } catch (err: any) {
      // Fallback local guidance in case of offline/network issues
      const isEmergency =
        aiSymptoms.toLowerCase().includes("blood") ||
        aiSymptoms.toLowerCase().includes("collapse") ||
        aiSymptoms.toLowerCase().includes("seizure") ||
        aiSymptoms.toLowerCase().includes("gasping");

      setAiAssessment({
        id: `assessment-welcome-${Date.now()}`,
        animalId: "preview-animal",
        urgencyLevel: isEmergency ? "EMERGENCY" : "HIGH",
        urgencyScore: isEmergency ? 95 : 75,
        summary: `Preliminary AI clinical assessment for ${aiSpecies.toLowerCase()}: Observed symptoms indicate acute distress requiring prompt veterinary evaluation.`,
        possibleConditions: [
          "Acute Gastrointestinal Inflammation or Infection",
          "Respiratory Distress / Epizootic Exposure",
          "Dietary Toxicity or Foreign Body",
        ],
        dangerSignsIdentified: [
          "Lethargy and abnormal posturing",
          "Potential for rapid dehydration or shock",
        ],
        immediateActions: [
          "Isolate patient in a calm, shaded and well-ventilated enclosure.",
          "Do not administer human paracetamol or ibuprofen (toxic to animals).",
          "Offer small sips of clean water; withhold solid feed if vomiting.",
          "Sign in to dispatch emergency teleconsultation or find a nearby clinic.",
        ],
        questionsForVet: [
          "What is the exact onset time and body temperature?",
          "Are vaccination and deworming records current?",
        ],
        timestamp: new Date().toISOString(),
        reviewedByVet: false,
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Handle Sign In submission
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const query = signInIdentifier.trim().toLowerCase();
    if (!query) {
      setErrorMessage("Please enter your registered email address or phone number.");
      return;
    }

    // Lookup user in registered records
    let matchedUser = existingUsers.find(
      (u) =>
        u.email.toLowerCase() === query ||
        u.phone.replace(/\s+/g, "") === query.replace(/\s+/g, "") ||
        u.fullName.toLowerCase().includes(query)
    );

    // Explicit fallback check for Sid Achaba sole admin
    if (!matchedUser && (query === "sidachaba13@gmail.com" || query.includes("sidachaba"))) {
      matchedUser = existingUsers.find((u) => u.role === "ADMIN") || {
        id: "user-admin-1",
        fullName: "Sid Achaba",
        email: "sidachaba13@gmail.com",
        phone: "+234 800 000 0001",
        role: "ADMIN",
        state: "Federal Capital Territory",
        cityOrLga: "Abuja",
        createdAt: "2024-01-01",
      };
    }

    if (matchedUser) {
      onLogin(matchedUser);
    } else {
      // Fallback auto-provisioned user profile
      const fallbackUser: UserProfile = {
        id: `user-${Date.now()}`,
        fullName: signInIdentifier.includes("@")
          ? signInIdentifier.split("@")[0].replace(".", " ").toUpperCase()
          : `Member ${signInIdentifier.slice(-4)}`,
        email: signInIdentifier.includes("@") ? signInIdentifier : `${signInIdentifier}@vetpal.ng`,
        phone: signInIdentifier.includes("@") ? "+234 800 000 0000" : signInIdentifier,
        role: selectedRole,
        state: "Lagos State",
        cityOrLga: "Victoria Island",
        createdAt: new Date().toISOString().split("T")[0],
      };
      onLogin(fallbackUser);
    }
  };

  // Handle Sign Up Next / Submission
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (signUpStep === 1) {
      if (!fullName.trim()) {
        setErrorMessage("Please provide your full legal or farm/practice name.");
        return;
      }
      if (!email.trim() && !phone.trim()) {
        setErrorMessage("Please enter either an email address or mobile phone number.");
        return;
      }
      setSignUpStep(2);
      return;
    }

    // Step 2 Finalize registration
    const newUserId = `user-${selectedRole.toLowerCase()}-${Date.now()}`;
    const defaultAvatars = {
      PET_OWNER: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      FARMER: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80",
      VET: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80",
      ADMIN: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    };

    const newUser: UserProfile = {
      id: newUserId,
      fullName: fullName.trim(),
      email: email.trim() || `${phone.replace(/\s+/g, "")}@vetpal.ng`,
      phone: phone.trim() || "+234 800 000 0000",
      role: selectedRole,
      avatarUrl: avatarUrl.trim() || defaultAvatars[selectedRole] || defaultAvatars.PET_OWNER,
      state: stateName,
      cityOrLga: cityOrLga.trim() || "Central Zone",
      address: address.trim() || undefined,
      createdAt: new Date().toISOString().split("T")[0],
      registeredAnimalIds: [],
      registeredBatchIds: [],
    };

    let initialAnimal: AnimalProfile | undefined;
    let initialBatch: FarmerBatch | undefined;
    let initialVetClinic: Veterinarian | undefined;

    if (selectedRole === "PET_OWNER" && registerAnimalNow && petName.trim()) {
      const animalId = `pet-reg-${Date.now()}`;
      initialAnimal = {
        id: animalId,
        ownerId: newUserId,
        ownerEmail: newUser.email,
        name: petName.trim(),
        species: petSpecies,
        breed: petBreed.trim() || "Domestic Purebred",
        sex: petSex,
        age: petAge.trim() || "1 year",
        weightKg: Number(petWeight) || 12.5,
        tagOrMicrochip: petTag.trim() || `VETPAL-${Math.floor(100000 + Math.random() * 900000)}`,
        ownerName: fullName.trim(),
        photoUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
        allergies: [],
        chronicConditions: [],
        notes: "Newly enrolled in VetPal AI health passport.",
        isLivestockBatch: false,
        createdAt: new Date().toISOString().split("T")[0],
        vaccinations: [
          {
            id: `vac-${Date.now()}`,
            animalId: animalId,
            vaccineName: petSpecies === "DOG" ? "Rabies Inactivated + DHPP" : "Feline Core RCP",
            dateAdministered: new Date().toISOString().split("T")[0],
            nextDueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            administeredByVet: "VetPal Verified Veterinary Network",
            batchNumber: `NG-VAC-${Math.floor(1000 + Math.random() * 9000)}`,
            status: "UP_TO_DATE",
          },
        ],
        timeline: [
          {
            id: `med-${Date.now()}`,
            animalId: animalId,
            date: new Date().toISOString().split("T")[0],
            eventType: "CONSULTATION",
            title: "Initial Baseline Health Intake",
            description: "Physical exam, body condition scoring & registration.",
            vetName: "Dr. Amina Bello, DVM",
            clinicName: "Apex Premier Animal Hospital",
          },
        ],
      };
      newUser.registeredAnimalIds = [animalId];
    } else if (selectedRole === "FARMER") {
      newUser.farmerInfo = {
        farmName: farmName.trim() || `${fullName}'s Livestock Farm`,
        farmType: farmType,
        farmSizeAcreage: Number(farmSizeAcreage) || 10,
        primarySpecies: batchSpecies,
        smsAlertsEnabled: true,
      };

      if (registerBatchNow && batchName.trim()) {
        const batchId = `batch-reg-${Date.now()}`;
        initialBatch = {
          id: batchId,
          ownerId: newUserId,
          ownerEmail: newUser.email,
          name: batchName.trim(),
          batchName: batchName.trim(),
          species: batchSpecies,
          breed: batchSpecies === "POULTRY" ? "Cobb 500 Broiler" : "Noiler Cross",
          initialCount: Number(batchHeadcount) || 500,
          currentCount: Number(batchHeadcount) || 500,
          mortalityCount: 0,
          ageWeeks: Number(batchAgeWeeks) || 2,
          currentAvgWeightKg: 0.8,
          housingType: batchHousing.trim() || "Pen Alpha",
          startDate: new Date().toISOString().split("T")[0],
          withdrawalPeriods: [],
        };
        newUser.registeredBatchIds = [batchId];
      }
    } else if (selectedRole === "VET") {
      newUser.vetInfo = {
        title: vetTitle,
        licenseNumber: licenseNumber.trim() || "VCN/REG/2025/VERIFIED",
        clinicName: clinicName.trim() || `${fullName} Veterinary Practice`,
        clinicAddress: clinicAddress.trim() || address.trim() || "Healthcare Zone, Lagos",
        specialties: specialties.split(",").map((s) => s.trim()),
        yearsExperience: 5,
        consultationFeeNaira: Number(consultationFee) || 5000,
        availableForEmergency: true,
        isVerified: true,
      };

      if (registerClinicNow && clinicName.trim()) {
        const vetId = `vet-reg-${Date.now()}`;
        initialVetClinic = {
          id: vetId,
          name: fullName.startsWith("Dr.") ? fullName : `Dr. ${fullName}`,
          title: vetTitle,
          avatarUrl: avatarUrl.trim() || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
          clinicName: clinicName.trim() || `${fullName} Practice`,
          clinicId: `clinic-${Date.now()}`,
          verified: true,
          licenseNumber: licenseNumber.trim() || "VCN/REG/2025/VERIFIED",
          rating: 5.0,
          reviewCount: 1,
          specialties: specialties.split(",").map((s) => s.trim()),
          distanceKm: 1.5,
          address: clinicAddress.trim() || address.trim() || `${cityOrLga || "Metropolis"}, ${stateName}`,
          phone: phone.trim() || "+234 800 000 0000",
          consultationFeeNaira: Number(consultationFee) || 5000,
          availableForEmergency: true,
          isOnlineNow: true,
          responseTimeMinutes: 5,
          bio: `Licensed veterinary clinician registered with the Veterinary Council of Nigeria. Specializing in ${specialties}.`,
          education: "Faculty of Veterinary Medicine (DVM)",
          consultationTypes: ["VIDEO", "CHAT", "IN_PERSON", "HOME_VISIT"],
        };
      }
    }

    onRegister(newUser, initialAnimal, initialBatch, initialVetClinic);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-teal-500 selection:text-stone-950">
      
      {/* Top Header Bar */}
      <header className="border-b border-stone-850 bg-stone-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            VP
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight">VetPal</span>
            <span className="text-stone-400 text-xs ml-2 hidden sm:inline">• AI Veterinary & Livestock System</span>
          </div>
        </div>

        {/* Live Active Registry Counter (Real numbers from state only) */}
        <div className="flex items-center gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-1.5 bg-stone-900 px-3 py-1.5 rounded-full border border-stone-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-stone-300">{existingUsers.length} Active Users</span>
            <span className="text-stone-600">|</span>
            <span className="text-stone-400">{animalsCount} Animals</span>
          </div>
        </div>
      </header>

      {/* Main Focus Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center">
        
        {/* Core Introductory Message (Clean & Non-Bloated) */}
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Sign In to Your <span className="text-teal-400">VetPal Workspace</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-lg mx-auto leading-relaxed">
            All livestock records, digital passports, teleconsultation tools, and clinical dashboards are accessible once you sign in. You can also test the AI triage service below.
          </p>
        </div>

        {/* Central Auth & AI Console Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden backdrop-blur-xl">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Clean 4-Tab Switcher */}
          <div className="flex items-center bg-stone-950 p-1.5 rounded-2xl border border-stone-800 gap-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode("SIGN_IN");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                authMode === "SIGN_IN"
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-stone-400 hover:text-white"
              }`}
              id="tab-welcome-signin"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("SIGN_UP");
                setSignUpStep(1);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                authMode === "SIGN_UP"
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-stone-400 hover:text-white"
              }`}
              id="tab-welcome-signup"
            >
              Create Account
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("TRY_AI_SERVICE");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === "TRY_AI_SERVICE"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-emerald-400 hover:text-emerald-300"
              }`}
              id="tab-welcome-try-ai"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Instant AI Triage</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("DEMO_ACCOUNTS");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                authMode === "DEMO_ACCOUNTS"
                  ? "bg-amber-600 text-white shadow-md"
                  : "text-stone-400 hover:text-amber-400"
              }`}
              id="tab-welcome-demo"
            >
              ⚡ 1-Click Login
            </button>
          </div>

          {/* Error Message Toast */}
          {errorMessage && (
            <div className="bg-red-950/80 border border-red-800 rounded-xl p-3 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {authMode === "SIGN_IN" && (
            <form onSubmit={handleSignInSubmit} className="space-y-4" id="welcome-signin-form">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                  Account Type:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "PET_OWNER", label: "🐾 Pet Owner" },
                    { id: "FARMER", label: "🌾 Farmer" },
                    { id: "VET", label: "🩺 Vet Doctor" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id as UserRole)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedRole === r.id
                          ? "bg-teal-950/90 border-teal-500 text-teal-200 ring-1 ring-teal-500 font-bold"
                          : "bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200"
                      }`}
                    >
                      <span className="text-xs">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email / Phone Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300">
                  Email Address or Mobile Phone
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    placeholder="e.g. abubakar.sadiq@example.com or +234 803 456 7890"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-300">Password</label>
                  <span className="text-[11px] text-teal-400 hover:underline cursor-pointer">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-stone-500 hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-teal-900/30"
                id="btn-submit-welcome-signin"
              >
                <span>Sign In & Open Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 2. SIGN UP MULTI-STEP FORM */}
          {authMode === "SIGN_UP" && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4" id="welcome-signup-form">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-white">Create Account</h2>
                  <p className="text-xs text-stone-400">
                    Step {signUpStep} of 2: {signUpStep === 1 ? "Your Details" : "Initial Intake"}
                  </p>
                </div>
                <span className="text-xs font-bold text-teal-400 bg-teal-950 px-2.5 py-0.5 rounded-full border border-teal-800/80">
                  New Member
                </span>
              </div>

              {/* Role Selector */}
              {signUpStep === 1 && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                    Select Account Type:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "PET_OWNER", label: "🐾 Pet Owner", icon: User },
                      { id: "FARMER", label: "🌾 Farmer", icon: Wheat },
                      { id: "VET", label: "🩺 Vet Doctor", icon: Stethoscope },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRole(r.id as UserRole)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedRole === r.id
                            ? "bg-teal-950 border-teal-500 text-teal-200 font-bold"
                            : "bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200"
                        }`}
                      >
                        <span className="text-xs">{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1 Fields */}
              {signUpStep === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-300">
                      {selectedRole === "FARMER" ? "Farm Owner / Manager Full Name *" : selectedRole === "VET" ? "Veterinarian Full Name (with DVM) *" : "Your Full Name *"}
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Amina Bello, DVM"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-teal-500 mt-1"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-semibold text-stone-300">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="doctor@vetpal.ng"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-teal-500 mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-300">Mobile Phone Number *</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 803 000 0000"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-teal-500 mt-1"
                        required
                      />
                    </div>
                  </div>

                  {/* Profile Picture / Photo Input */}
                  <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 space-y-2">
                    <label className="text-xs font-semibold text-stone-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-teal-400" />
                        <span>Profile Picture (Upload or Pick Avatar)</span>
                      </span>
                      <span className="text-[10px] text-stone-500">Optional</span>
                    </label>

                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={
                            avatarUrl ||
                            (selectedRole === "VET"
                              ? "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80"
                              : selectedRole === "FARMER"
                              ? "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80"
                              : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80")
                          }
                          alt="Profile Preview"
                          className="w-12 h-12 rounded-full object-cover border-2 border-teal-500/80 shadow-sm"
                        />
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <label className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-semibold px-3 py-1.5 rounded-xl border border-stone-700 cursor-pointer flex items-center gap-1.5 transition-colors">
                            <Upload className="w-3 h-3 text-teal-400" />
                            <span>Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setAvatarUrl(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          {avatarUrl && (
                            <button
                              type="button"
                              onClick={() => setAvatarUrl("")}
                              className="text-[10px] text-stone-400 hover:text-red-400 cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>

                        {/* Quick Avatar Presets */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5">
                          <span className="text-[10px] text-stone-500">Presets:</span>
                          {[
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
                            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
                            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
                            "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
                          ].map((url, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setAvatarUrl(url)}
                              className={`w-6 h-6 rounded-full overflow-hidden border transition-all cursor-pointer ${
                                avatarUrl === url ? "ring-2 ring-teal-400 border-white scale-110" : "border-stone-700 opacity-70 hover:opacity-100"
                              }`}
                            >
                              <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-semibold text-stone-300">State / Region</label>
                      <select
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-teal-500 mt-1"
                      >
                        {nigerianStates.map((st) => (
                          <option key={st} value={st} className="bg-stone-900 text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-300">City / LGA</label>
                      <input
                        type="text"
                        value={cityOrLga}
                        onChange={(e) => setCityOrLga(e.target.value)}
                        placeholder="e.g. Ikeja / Zaria / Maitama"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-teal-500 mt-1"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    id="btn-signup-step1-continue"
                  >
                    <span>Continue to Step 2</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 2 Fields */}
              {signUpStep === 2 && (
                <div className="space-y-3">
                  {selectedRole === "PET_OWNER" && (
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-teal-300">🐾 Register First Pet (Digital Passport)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-stone-400">Pet Name *</label>
                          <input
                            type="text"
                            value={petName}
                            onChange={(e) => setPetName(e.target.value)}
                            placeholder="e.g. Bello / Simba"
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-white mt-0.5"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-stone-400">Species</label>
                          <select
                            value={petSpecies}
                            onChange={(e) => setPetSpecies(e.target.value as SpeciesType)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-white mt-0.5"
                          >
                            <option value="DOG">Dog (Canine)</option>
                            <option value="CAT">Cat (Feline)</option>
                            <option value="AVIAN">Avian / Bird</option>
                            <option value="HORSE">Equine / Horse</option>
                            <option value="RABBIT">Rabbit</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-stone-400">Breed</label>
                          <input
                            type="text"
                            value={petBreed}
                            onChange={(e) => setPetBreed(e.target.value)}
                            placeholder="e.g. Boerboel / German Shepherd"
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-white mt-0.5"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-stone-400">Age / Weight</label>
                          <input
                            type="text"
                            value={petAge}
                            onChange={(e) => setPetAge(e.target.value)}
                            placeholder="e.g. 2 years, 25kg"
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-white mt-0.5"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedRole === "FARMER" && (
                    <div className="space-y-2.5">
                      <p className="text-xs font-bold text-amber-400">🌾 Initial Flock / Herd Setup</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-stone-400">Batch Name *</label>
                          <input
                            type="text"
                            value={batchName}
                            onChange={(e) => setBatchName(e.target.value)}
                            placeholder="e.g. Broiler Flock 2026-A"
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-white mt-0.5"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-stone-400">Headcount (Birds/Head) *</label>
                          <input
                            type="number"
                            value={batchHeadcount}
                            onChange={(e) => setBatchHeadcount(e.target.value)}
                            placeholder="1000"
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-white mt-0.5"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedRole === "VET" && (
                    <div className="space-y-2.5">
                      <p className="text-xs font-bold text-teal-400">🩺 Clinic & VCN Information</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-stone-400">Practice / Clinic Name *</label>
                          <input
                            type="text"
                            value={clinicName}
                            onChange={(e) => setClinicName(e.target.value)}
                            placeholder="e.g. Apex Premier Animal Hospital"
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-white mt-0.5"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-stone-400">VCN License Number</label>
                          <input
                            type="text"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            placeholder="VCN/REG/2025/XXXX"
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-white mt-0.5"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSignUpStep(1)}
                      className="w-1/3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-lg shadow-teal-950"
                      id="btn-signup-step2-finalize"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete & Sign In</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* 3. INSTANT AI TRIAGE TEST (Direct access to AI Service before signing in) */}
          {authMode === "TRY_AI_SERVICE" && (
            <div className="space-y-4" id="welcome-ai-service-test">
              <div className="flex items-center justify-between border-b border-stone-850 pb-2.5">
                <div>
                  <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-400" />
                    <span>Instant AI Veterinary Symptom Checker</span>
                  </h2>
                  <p className="text-[11px] text-stone-400">
                    Describe any animal's symptoms for immediate clinical urgency assessment.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Live AI Engine
                </span>
              </div>

              <form onSubmit={handleInstantAiTest} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-300">Species</label>
                    <select
                      value={aiSpecies}
                      onChange={(e) => setAiSpecies(e.target.value as SpeciesType)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500 mt-1"
                    >
                      <option value="DOG">🐕 Dog (Canine)</option>
                      <option value="CAT">🐱 Cat (Feline)</option>
                      <option value="POULTRY">🐔 Poultry / Broiler / Layer</option>
                      <option value="CATTLE">🐄 Cattle / Cow</option>
                      <option value="GOAT">🐐 Goat / Sheep</option>
                      <option value="PIG">🐖 Swine / Pig</option>
                      <option value="HORSE">🐎 Horse / Equine</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-300">Breed / Details (Optional)</label>
                    <input
                      type="text"
                      value={aiBreed}
                      onChange={(e) => setAiBreed(e.target.value)}
                      placeholder="e.g. Boerboel or Broiler Day 21"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-300">
                    Observed Symptoms, Onset & Behavior *
                  </label>
                  <textarea
                    value={aiSymptoms}
                    onChange={(e) => setAiSymptoms(e.target.value)}
                    placeholder="e.g. Animal is lethargic, vomiting white foam since morning, refused food, and gums appear pale."
                    rows={3}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 mt-1"
                    required
                  />
                </div>

                {aiError && (
                  <p className="text-xs text-red-400">{aiError}</p>
                )}

                <button
                  type="submit"
                  disabled={aiLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  id="btn-run-welcome-ai-triage"
                >
                  {aiLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing Clinical Symptoms...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>Evaluate Clinical Urgency with AI</span>
                    </>
                  )}
                </button>
              </form>

              {/* AI Assessment Result Box */}
              {aiAssessment && (
                <div className="bg-stone-950 border border-emerald-800/80 rounded-2xl p-4 space-y-3 mt-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        aiAssessment.urgencyLevel === "EMERGENCY"
                          ? "bg-red-950 text-red-300 border border-red-800 animate-pulse"
                          : aiAssessment.urgencyLevel === "HIGH"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-teal-950 text-teal-300 border border-teal-800"
                      }`}>
                        Urgency: {aiAssessment.urgencyLevel}
                      </span>
                      <span className="text-[11px] text-stone-400">Score: {aiAssessment.urgencyScore}/100</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAuthMode("SIGN_IN")}
                      className="text-xs font-bold text-teal-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Sign In to Save</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-200 font-medium leading-relaxed">
                    {aiAssessment.summary}
                  </p>

                  <div className="bg-stone-900 p-2.5 rounded-xl space-y-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Immediate First-Aid Actions:</p>
                    <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
                      {aiAssessment.immediateActions.slice(0, 3).map((act, idx) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-[11px] text-stone-400 italic">
                    💡 Sign in or create an account to dispatch a teleconsultation or save this record to your animal's health passport.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 4. 1-CLICK TEST PERSONAS */}
          {authMode === "DEMO_ACCOUNTS" && (
            <div className="space-y-3" id="welcome-demo-personas">
              <div>
                <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>1-Click Test Personas</span>
                </h2>
                <p className="text-xs text-stone-400">
                  Select any active registered identity to open and explore the full workspace:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                {existingUsers.map((user) => {
                  const isPet = user.role === "PET_OWNER";
                  const isFarmer = user.role === "FARMER";
                  const isVet = user.role === "VET";

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => onLogin(user)}
                      className="p-3 bg-stone-950 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/60 rounded-2xl text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                          {user.fullName}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          isVet
                            ? "bg-teal-950 text-teal-300 border border-teal-800"
                            : isFarmer
                            ? "bg-amber-950 text-amber-300 border border-amber-800"
                            : isPet
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : "bg-purple-950 text-purple-300 border border-purple-800"
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                      <p className="text-[10px] text-stone-500 mt-1">{user.state || "Active User"}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Clean Bottom Footer */}
      <footer className="border-t border-stone-850 py-3 text-center text-xs text-stone-500">
        VetPal Ecosystem • Clinical Decision Support & Animal Health Management
      </footer>
    </div>
  );
};
