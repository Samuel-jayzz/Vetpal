import React, { useState } from "react";
import {
  X,
  User,
  Wheat,
  Stethoscope,
  ShieldCheck,
  Mail,
  Lock,
  Phone,
  MapPin,
  PawPrint,
  CheckCircle2,
  AlertCircle,
  Building,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Clock,
  Layers,
  ChevronDown,
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
} from "../types";

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: "SIGN_IN" | "SIGN_UP";
  initialRole?: UserRole;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  onRegister: (
    user: UserProfile,
    initialAnimal?: AnimalProfile,
    initialBatch?: FarmerBatch,
    initialVetClinic?: Veterinarian
  ) => void;
  existingUsers: UserProfile[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = "SIGN_IN",
  initialRole = "PET_OWNER",
  onClose,
  onLogin,
  onRegister,
  existingUsers,
}) => {
  const [mode, setMode] = useState<"SIGN_IN" | "SIGN_UP">(initialMode);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [step, setStep] = useState<1 | 2>(1); // 1 = User Account, 2 = Animal/Herd/Clinic Registration
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Sign In Form State
  const [signInIdentifier, setSignInIdentifier] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up - Step 1: User Details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+234 ");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [password, setPassword] = useState("");
  const [stateName, setStateName] = useState("Lagos State");
  const [cityOrLga, setCityOrLga] = useState("");
  const [address, setAddress] = useState("");

  // Farmer specific Step 1
  const [farmName, setFarmName] = useState("");
  const [farmType, setFarmType] = useState<FarmerBatch["farmType"]>("POULTRY");
  const [farmSizeAcreage, setFarmSizeAcreage] = useState("10");

  // Vet specific Step 1
  const [vetTitle, setVetTitle] = useState("Doctor of Veterinary Medicine (DVM)");
  const [licenseNumber, setLicenseNumber] = useState("VCN/REG/");
  const [clinicName, setClinicName] = useState("");
  const [specialties, setSpecialties] = useState("Small Animal & Avian Medicine");
  const [consultationFee, setConsultationFee] = useState("5000");
  const [availableEmergency, setAvailableEmergency] = useState(true);

  // Sign Up - Step 2: Animal / Flock / Practice Registration
  // For Pet Owner
  const [registerAnimalNow, setRegisterAnimalNow] = useState(true);
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState<SpeciesType>("DOG");
  const [petBreed, setPetBreed] = useState("");
  const [petSex, setPetSex] = useState<AnimalProfile["sex"]>("MALE");
  const [petAge, setPetAge] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [petTag, setPetTag] = useState("");
  const [petAllergies, setPetAllergies] = useState("");
  const [petNotes, setPetNotes] = useState("");

  // For Farmer
  const [registerBatchNow, setRegisterBatchNow] = useState(true);
  const [batchName, setBatchName] = useState("");
  const [batchSpecies, setBatchSpecies] = useState<SpeciesType>("POULTRY");
  const [batchHeadcount, setBatchHeadcount] = useState("1000");
  const [batchAgeWeeks, setBatchAgeWeeks] = useState("3");
  const [batchAvgWeight, setBatchAvgWeight] = useState("1.2");
  const [batchHousing, setBatchHousing] = useState("Deep Litter Poultry Pen A");

  // For Vet Practice
  const [registerClinicNow, setRegisterClinicNow] = useState(true);
  const [clinicAddress, setClinicAddress] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");
  const [openHours, setOpenHours] = useState("8:00 AM - 6:00 PM (24/7 On-Call)");

  if (!isOpen) return null;

  const handleQuickDemoLogin = (user: UserProfile) => {
    setSuccessToast(`Welcome back, ${user.fullName}!`);
    setTimeout(() => {
      onLogin(user);
      onClose();
    }, 400);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signInIdentifier.trim()) {
      setErrorMessage("Please enter your registered email address or phone number.");
      return;
    }

    // Match existing or create realistic session
    let matched = existingUsers.find(
      (u) =>
        u.email.toLowerCase() === signInIdentifier.trim().toLowerCase() ||
        u.phone.replace(/\s+/g, "") === signInIdentifier.replace(/\s+/g, "")
    );

    if (!matched && (signInIdentifier.trim().toLowerCase() === "sidachaba13@gmail.com" || signInIdentifier.trim().toLowerCase().includes("sidachaba"))) {
      matched = existingUsers.find((u) => u.role === "ADMIN") || {
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

    if (matched) {
      setSuccessToast(`Signed in successfully as ${matched.fullName}`);
      setTimeout(() => {
        onLogin(matched);
        onClose();
      }, 400);
    } else {
      // Create authenticated user with current inputs
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        fullName: signInIdentifier.includes("@") ? signInIdentifier.split("@")[0] : "Verified User",
        email: signInIdentifier.includes("@") ? signInIdentifier : `${signInIdentifier.replace(/[^0-9]/g, "")}@vetpal.ng`,
        phone: signInIdentifier.includes("@") ? "+234 800 000 0000" : signInIdentifier,
        role: role,
        state: "Federal Capital Territory",
        cityOrLga: "Abuja",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setSuccessToast(`Signed in successfully!`);
      setTimeout(() => {
        onLogin(newUser);
        onClose();
      }, 400);
    }
  };

  const handleStep1Proceed = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMessage("Please provide at least an email address or mobile phone number.");
      return;
    }

    // Advance to Step 2 for animal/herd registration
    setStep(2);
  };

  const handleFinalRegister = () => {
    setErrorMessage(null);
    const userId = `user-${Date.now()}`;

    // 1. Create User Profile
    const defaultAvatars = {
      PET_OWNER: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      FARMER: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80",
      VET: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80",
      ADMIN: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    };

    const newUserProfile: UserProfile = {
      id: userId,
      fullName: fullName.trim(),
      email: email.trim() || `${phone.replace(/[^0-9]/g, "")}@vetpal.ng`,
      phone: phone.trim() || "+234 800 000 0000",
      role: role,
      avatarUrl: avatarUrl.trim() || defaultAvatars[role] || defaultAvatars.PET_OWNER,
      state: stateName,
      cityOrLga: cityOrLga || "Metropolis",
      address: address,
      createdAt: new Date().toISOString().split("T")[0],
      registeredAnimalIds: [],
      registeredBatchIds: [],
    };

    if (role === "FARMER") {
      newUserProfile.farmerInfo = {
        farmName: farmName || `${fullName.split(" ")[0]}'s Commercial Farm`,
        farmType: farmType,
        farmSizeAcreage: parseFloat(farmSizeAcreage) || 10,
        primarySpecies: batchSpecies,
        smsAlertsEnabled: true,
      };
    } else if (role === "VET") {
      newUserProfile.vetInfo = {
        title: vetTitle || "Doctor of Veterinary Medicine",
        licenseNumber: licenseNumber || `VCN-${Math.floor(1000 + Math.random() * 9000)}`,
        clinicName: clinicName || `${fullName}'s Veterinary Clinic`,
        clinicAddress: clinicAddress || address,
        specialties: specialties.split(",").map((s) => s.trim()),
        yearsExperience: 5,
        consultationFeeNaira: parseFloat(consultationFee) || 5000,
        availableForEmergency: availableEmergency,
        isVerified: true,
      };
    }

    // 2. Prepare Registered Animal Profile if Pet Owner
    let newAnimal: AnimalProfile | undefined = undefined;
    if (role === "PET_OWNER" && registerAnimalNow && petName.trim()) {
      const animalId = `pet-reg-${Date.now()}`;
      newAnimal = {
        id: animalId,
        ownerId: userId,
        ownerEmail: newUserProfile.email,
        name: petName.trim(),
        species: petSpecies,
        breed: petBreed.trim() || `${petSpecies} Standard`,
        sex: petSex,
        age: petAge.trim() || "1 year",
        weightKg: parseFloat(petWeight) || (petSpecies === "DOG" ? 15 : petSpecies === "CAT" ? 4 : 20),
        tagOrMicrochip: petTag.trim() || `VP-${Math.floor(100000 + Math.random() * 900000)}`,
        photoUrl:
          petSpecies === "DOG"
            ? "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80"
            : petSpecies === "CAT"
            ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80"
            : petSpecies === "CATTLE"
            ? "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80"
            : petSpecies === "POULTRY"
            ? "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80"
            : "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=600&q=80",
        ownerName: fullName.trim(),
        allergies: petAllergies ? [petAllergies] : [],
        chronicConditions: [],
        notes: petNotes || "Registered via VetPal Onboarding Gateway",
        isLivestockBatch: false,
        createdAt: new Date().toISOString().split("T")[0],
        vaccinations: [],
        timeline: [
          {
            id: `reg-evt-${Date.now()}`,
            animalId: animalId,
            date: new Date().toISOString().split("T")[0],
            eventType: "CONSULTATION",
            title: "Initial VetPal Registration",
            description: `Animal profile created with owner ${fullName.trim()}. Digital Health Passport activated.`,
            clinicName: "VetPal Clinical Network",
          },
        ],
      };
      newUserProfile.registeredAnimalIds = [animalId];
    }

    // 3. Prepare Registered Batch if Farmer
    let newBatch: FarmerBatch | undefined = undefined;
    if (role === "FARMER" && registerBatchNow && batchName.trim()) {
      const batchId = `b-reg-${Date.now()}`;
      const count = parseInt(batchHeadcount) || 500;
      newBatch = {
        id: batchId,
        ownerId: userId,
        ownerEmail: newUserProfile.email,
        name: batchName.trim(),
        species: batchSpecies,
        breed: `${batchSpecies} Commercial Strain`,
        farmType: farmType,
        initialCount: count,
        currentCount: count,
        mortalityCount: 0,
        ageWeeks: parseInt(batchAgeWeeks) || 3,
        currentAvgWeightKg: parseFloat(batchAvgWeight) || 1.2,
        housingType: batchHousing || "Standard Controlled Livestock Pen",
        startDate: new Date().toISOString().split("T")[0],
        feedSchedule: {
          feedType: "Commercial Nutrient Balanced Ration",
          dailyQuantityKg: Math.round(count * 0.12),
          frequencyPerDay: 2,
        },
        withdrawalPeriods: [],
      };
      newUserProfile.registeredBatchIds = [batchId];
    }

    // 4. Prepare Registered Clinic / Vet if Vet
    let newVetClinic: Veterinarian | undefined = undefined;
    if (role === "VET" && registerClinicNow) {
      newVetClinic = {
        id: `vet-reg-${Date.now()}`,
        name: fullName.trim().startsWith("Dr.") ? fullName.trim() : `Dr. ${fullName.trim()}, DVM`,
        title: vetTitle,
        avatarUrl: newUserProfile.avatarUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
        clinicName: clinicName || `${fullName.trim()}'s Veterinary Clinic`,
        clinicId: `clinic-reg-${Date.now()}`,
        verified: true,
        licenseNumber: licenseNumber || `VCN-REG-${Math.floor(1000 + Math.random() * 9000)}`,
        rating: 5.0,
        reviewCount: 1,
        specialties: specialties.split(",").map((s) => s.trim()),
        distanceKm: 1.2,
        address: clinicAddress || address || `${stateName}, Nigeria`,
        phone: phone || "+234 800 000 0000",
        consultationFeeNaira: parseFloat(consultationFee) || 5000,
        availableForEmergency: availableEmergency,
        isOnlineNow: true,
        responseTimeMinutes: 5,
        bio: `Accredited veterinary practitioner licensed under the Veterinary Council of Nigeria (VCN). Specializing in ${specialties}.`,
        education: "Faculty of Veterinary Medicine (DVM)",
        consultationTypes: ["VIDEO", "CHAT", "IN_PERSON", "HOME_VISIT"],
      };
    }

    setSuccessToast(`Account & registry created successfully!`);
    setTimeout(() => {
      onRegister(newUserProfile, newAnimal, newBatch, newVetClinic);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white border border-stone-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        id="vetpal-auth-modal"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">
                {mode === "SIGN_IN" ? "Sign In to VetPal" : "Create Your VetPal Account"}
              </h2>
              <p className="text-xs text-emerald-200">
                {mode === "SIGN_IN"
                  ? "Access your registered animals, telehealth records & farm insights"
                  : step === 1
                  ? "Step 1 of 2: Personal & Practitioner Profile"
                  : "Step 2 of 2: Register Your Animals, Herds or Clinic"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            id="close-auth-modal-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3 shrink-0">
          <button
            onClick={() => {
              setMode("SIGN_IN");
              setErrorMessage(null);
            }}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              mode === "SIGN_IN"
                ? "border-emerald-600 text-emerald-700 font-extrabold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
            id="tab-auth-signin"
          >
            🔑 Sign In
          </button>
          <button
            onClick={() => {
              setMode("SIGN_UP");
              setStep(1);
              setErrorMessage(null);
            }}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              mode === "SIGN_UP"
                ? "border-emerald-600 text-emerald-700 font-extrabold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
            id="tab-auth-signup"
          >
            📝 Register / Sign Up (Free)
          </button>
        </div>

        {/* Notification / Toast inside modal */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successToast && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* ======================= MODE 1: SIGN IN ======================= */}
          {mode === "SIGN_IN" && (
            <div className="space-y-6">
              {/* Quick 1-Click Demo Profiles */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-600">
                    ⚡ Quick Demo Profiles (1-Click Instant Access)
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    Pre-configured
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {existingUsers.slice(0, 3).map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleQuickDemoLogin(u)}
                      className="p-3 bg-white border border-stone-200 hover:border-emerald-500 rounded-xl text-left transition-all hover:shadow-xs group cursor-pointer flex flex-col justify-between"
                      id={`quick-demo-user-${u.role.toLowerCase()}`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <img
                          src={u.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                          alt={u.fullName}
                          className="w-7 h-7 rounded-full object-cover border border-stone-200"
                        />
                        <div>
                          <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-700 leading-tight">
                            {u.fullName.split(" ")[0]}
                          </div>
                          <div className="text-[10px] font-semibold text-stone-500">
                            {u.role === "PET_OWNER"
                              ? "🐶 Pet Owner"
                              : u.role === "FARMER"
                              ? "🌾 Farmer"
                              : u.role === "VET"
                              ? "🩺 Vet Doctor"
                              : "🔒 VCN Admin"}
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-stone-400 truncate">{u.cityOrLga}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Standard Sign In Form */}
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Email Address or Mobile Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={signInIdentifier}
                      onChange={(e) => setSignInIdentifier(e.target.value)}
                      placeholder="e.g. abubakar@example.com or 0803 456 7890"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                      id="signin-identifier-input"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-700">Password</label>
                    <span className="text-[11px] text-emerald-700 hover:underline cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                      id="signin-password-input"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                  id="signin-submit-btn"
                >
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* ======================= MODE 2: SIGN UP / REGISTRATION ======================= */}
          {mode === "SIGN_UP" && step === 1 && (
            <form onSubmit={handleStep1Proceed} className="space-y-5">
              {/* Account Category Selector */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-2">
                  Select Your Account Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole("PET_OWNER")}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      role === "PET_OWNER"
                        ? "border-emerald-600 bg-emerald-50/70 shadow-xs"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                    id="role-select-pet-owner"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-2">
                      <PawPrint className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-stone-900">Pet Owner</div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Dogs, cats, birds, horses & companion animals
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("FARMER")}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      role === "FARMER"
                        ? "border-amber-600 bg-amber-50/70 shadow-xs"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                    id="role-select-farmer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-2">
                      <Wheat className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-stone-900">Farmer / Pastoralist</div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Commercial poultry, cattle herds, sheep & goats
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("VET")}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      role === "VET"
                        ? "border-teal-600 bg-teal-50/70 shadow-xs"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                    id="role-select-vet"
                  >
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold mb-2">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-stone-900">Veterinary Doctor</div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Licensed DVM, clinical surgeons & vet clinics
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* General User Profile Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {role === "VET" ? "Practitioner Full Name" : "Your Full Name"} *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={role === "VET" ? "Dr. Chioma Nwachukwu, DVM" : "e.g. Ibrahim Musa"}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      id="signup-fullname-input"
                    />
                    <User className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobile Phone (For 24/7 Alerts & SMS) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 123 4567"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      id="signup-phone-input"
                    />
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      id="signup-email-input"
                    />
                    <Mail className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">State / Province</label>
                  <select
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="Lagos State">Lagos State</option>
                    <option value="Federal Capital Territory">Abuja (FCT)</option>
                    <option value="Kaduna State">Kaduna State</option>
                    <option value="Kano State">Kano State</option>
                    <option value="Oyo State">Oyo State (Ibadan)</option>
                    <option value="Rivers State">Rivers State (Port Harcourt)</option>
                    <option value="Enugu State">Enugu State</option>
                    <option value="Edo State">Edo State (Benin City)</option>
                    <option value="Ogun State">Ogun State</option>
                    <option value="Plateau State">Plateau State (Jos)</option>
                    <option value="Kenya (Nairobi)">Kenya (Nairobi / Rift Valley)</option>
                    <option value="Ghana (Accra / Kumasi)">Ghana (Accra / Kumasi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">City or LGA</label>
                  <input
                    type="text"
                    value={cityOrLga}
                    onChange={(e) => setCityOrLga(e.target.value)}
                    placeholder="e.g. Ikeja / Maitama / Zaria"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Create Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Profile Picture Upload & Presets */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2.5">
                <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Profile Picture (Upload or Pick Avatar)</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-normal">Optional</span>
                </label>

                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={
                        avatarUrl ||
                        (role === "VET"
                          ? "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80"
                          : role === "FARMER"
                          ? "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80"
                          : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80")
                      }
                      alt="Profile Preview"
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600 shadow-2xs"
                    />
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <label className="bg-white hover:bg-stone-100 text-stone-800 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-stone-300 cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs">
                        <Upload className="w-3 h-3 text-emerald-600" />
                        <span>Upload Photo</span>
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
                          className="text-[10px] text-stone-500 hover:text-red-500 cursor-pointer font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5">
                      <span className="text-[10px] text-stone-400 font-medium">Presets:</span>
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
                            avatarUrl === url ? "ring-2 ring-emerald-600 border-white scale-110" : "border-stone-300 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Role-Specific Fields in Step 1 */}
              {role === "FARMER" && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3">
                  <div className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Wheat className="w-3.5 h-3.5" />
                    <span>Commercial Farm Details</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 mb-1">Farm Enterprise Name</label>
                      <input
                        type="text"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        placeholder="e.g. GreenMeadows Poultry Farm"
                        className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 mb-1">Primary Farm Type</label>
                      <select
                        value={farmType}
                        onChange={(e) => setFarmType(e.target.value as FarmerBatch["farmType"])}
                        className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="POULTRY">Poultry (Layers/Broilers)</option>
                        <option value="DAIRY_CATTLE">Dairy Cattle</option>
                        <option value="BEEF_CATTLE">Beef Cattle / Pastoral</option>
                        <option value="GOATS">Goat Herd</option>
                        <option value="SHEEP">Sheep Flock</option>
                        <option value="SWINE">Swine / Piggery</option>
                        <option value="MIXED">Integrated / Mixed Livestock</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 mb-1">Approx Acreage / Scale</label>
                      <input
                        type="number"
                        value={farmSizeAcreage}
                        onChange={(e) => setFarmSizeAcreage(e.target.value)}
                        placeholder="e.g. 15 Acres"
                        className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {role === "VET" && (
                <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 space-y-3">
                  <div className="text-xs font-extrabold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>VCN Clinical Accreditation & Practice</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-teal-900 mb-1">VCN License # *</label>
                      <input
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="VCN/REG/2021/4921"
                        className="w-full bg-white border border-teal-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-teal-900 mb-1">Hospital / Clinic Name</label>
                      <input
                        type="text"
                        value={clinicName}
                        onChange={(e) => setClinicName(e.target.value)}
                        placeholder="e.g. Apex Premier Vet Hospital"
                        className="w-full bg-white border border-teal-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-teal-900 mb-1">Teleconsult Fee (₦)</label>
                      <input
                        type="number"
                        value={consultationFee}
                        onChange={(e) => setConsultationFee(e.target.value)}
                        placeholder="5000"
                        className="w-full bg-white border border-teal-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1 Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  id="signup-step1-next-btn"
                >
                  <span>Continue to Step 2: Register Animals / Practice</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ======================= MODE 2: SIGN UP - STEP 2 (ANIMAL/HERD/CLINIC REGISTRATION) ======================= */}
          {mode === "SIGN_UP" && step === 2 && (
            <div className="space-y-5">
              {/* Back button & step banner */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Profile Details</span>
                </button>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {role === "PET_OWNER"
                    ? "🐾 Companion Pet Registration"
                    : role === "FARMER"
                    ? "🌾 Initial Flock / Herd Registry"
                    : "🩺 Clinical Network Setup"}
                </span>
              </div>

              {/* 1. PET OWNER ANIMAL REGISTRATION */}
              {role === "PET_OWNER" && (
                <div className="space-y-4">
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-950">Register Your First Companion Pet Now</div>
                      <p className="text-[11px] text-emerald-800">
                        Create their Digital Health Passport, track vaccinations & enable instant emergency triage.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={registerAnimalNow}
                        onChange={(e) => setRegisterAnimalNow(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {registerAnimalNow && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-stone-50 border border-stone-200 rounded-2xl p-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Pet Name *</label>
                        <input
                          type="text"
                          value={petName}
                          onChange={(e) => setPetName(e.target.value)}
                          placeholder="e.g. Simba, Bruno, or Bella"
                          className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500"
                          id="pet-name-reg-input"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Species</label>
                        <select
                          value={petSpecies}
                          onChange={(e) => setPetSpecies(e.target.value as SpeciesType)}
                          className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="DOG">🐕 Dog / Canine</option>
                          <option value="CAT">🐈 Cat / Feline</option>
                          <option value="HORSE">🐎 Horse / Equine</option>
                          <option value="RABBIT">🐇 Rabbit</option>
                          <option value="GOAT">🐐 Companion Goat</option>
                          <option value="OTHER">🦜 Exotic / Bird / Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Breed</label>
                        <input
                          type="text"
                          value={petBreed}
                          onChange={(e) => setPetBreed(e.target.value)}
                          placeholder="e.g. Boerboel, German Shepherd, Persian"
                          className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Sex & Reproductive Status</label>
                        <select
                          value={petSex}
                          onChange={(e) => setPetSex(e.target.value as AnimalProfile["sex"])}
                          className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="MALE">Male (Intact)</option>
                          <option value="FEMALE">Female (Intact)</option>
                          <option value="NEUTERED_MALE">Neutered Male</option>
                          <option value="SPAYED_FEMALE">Spayed Female</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Age</label>
                        <input
                          type="text"
                          value={petAge}
                          onChange={(e) => setPetAge(e.target.value)}
                          placeholder="e.g. 2 years or 8 months"
                          className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={petWeight}
                          onChange={(e) => setPetWeight(e.target.value)}
                          placeholder="e.g. 28.5"
                          className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Microchip ID, Collar Tag or Known Allergies
                        </label>
                        <input
                          type="text"
                          value={petTag}
                          onChange={(e) => setPetTag(e.target.value)}
                          placeholder="e.g. NG-CHIP-48291, Penicillin allergy"
                          className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. FARMER FLOCK / HERD REGISTRATION */}
              {role === "FARMER" && (
                <div className="space-y-4">
                  <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-amber-950">Register Initial Livestock Batch / Herd</div>
                      <p className="text-[11px] text-amber-800">
                        Enables mortality curve tracking, withdrawal period alerts & outbreak geofencing.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={registerBatchNow}
                        onChange={(e) => setRegisterBatchNow(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  {registerBatchNow && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-stone-50 border border-stone-200 rounded-2xl p-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Flock/Herd Batch Name *</label>
                        <input
                          type="text"
                          value={batchName}
                          onChange={(e) => setBatchName(e.target.value)}
                          placeholder="e.g. Broiler Batch #5 (Pen 2)"
                          className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-amber-500"
                          id="batch-name-reg-input"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Livestock Species</label>
                        <select
                          value={batchSpecies}
                          onChange={(e) => setBatchSpecies(e.target.value as SpeciesType)}
                          className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="POULTRY">🐔 Poultry (Broilers / Layers)</option>
                          <option value="CATTLE">🐄 Cattle (Dairy / Beef)</option>
                          <option value="GOAT">🐐 Goats (Boer / Red Sokoto)</option>
                          <option value="SHEEP">🐑 Sheep (Balami / Yankasa)</option>
                          <option value="SWINE">🐖 Swine / Pigs</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Headcount / Bird Count</label>
                        <input
                          type="number"
                          value={batchHeadcount}
                          onChange={(e) => setBatchHeadcount(e.target.value)}
                          placeholder="e.g. 2000"
                          className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Current Age (Weeks)</label>
                        <input
                          type="number"
                          value={batchAgeWeeks}
                          onChange={(e) => setBatchAgeWeeks(e.target.value)}
                          placeholder="e.g. 4"
                          className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-stone-700 mb-1">Housing & Pen Type</label>
                        <input
                          type="text"
                          value={batchHousing}
                          onChange={(e) => setBatchHousing(e.target.value)}
                          placeholder="e.g. Deep Litter System with automated drinkers"
                          className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. VET CLINIC PROFILE REGISTRATION */}
              {role === "VET" && (
                <div className="space-y-4">
                  <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-teal-950">Publish Clinic & Telehealth Directory Listing</div>
                      <p className="text-[11px] text-teal-800">
                        Receive direct patient referrals, instant video consultations & e-prescribing tools.
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-stone-50 border border-stone-200 rounded-2xl p-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Clinical Specialization</label>
                      <input
                        type="text"
                        value={specialties}
                        onChange={(e) => setSpecialties(e.target.value)}
                        placeholder="e.g. Small Animal Surgery, Avian Medicine"
                        className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Clinic Consultation Hours</label>
                      <input
                        type="text"
                        value={openHours}
                        onChange={(e) => setOpenHours(e.target.value)}
                        placeholder="8:00 AM - 6:00 PM (24/7 Emergency)"
                        className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 mb-1">Physical Clinic Street Address</label>
                      <input
                        type="text"
                        value={clinicAddress}
                        onChange={(e) => setClinicAddress(e.target.value)}
                        placeholder="e.g. Plot 12, Commercial Road, Victoria Island, Lagos"
                        className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Complete Registration Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinalRegister}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  id="signup-final-submit-btn"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  <span>Complete Registration & Open Dashboard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
