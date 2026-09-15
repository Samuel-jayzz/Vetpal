export type SpeciesType =
  | "DOG"
  | "CAT"
  | "CATTLE"
  | "POULTRY"
  | "GOAT"
  | "SHEEP"
  | "HORSE"
  | "SWINE"
  | "RABBIT"
  | "OTHER";

export type UrgencyLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type UserRole = "PET_OWNER" | "FARMER" | "VET" | "ADMIN";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  state: string;
  cityOrLga: string;
  address?: string;
  createdAt: string;
  // Farmer specific attributes
  farmerInfo?: {
    farmName: string;
    farmType: "POULTRY" | "DAIRY_CATTLE" | "BEEF_CATTLE" | "GOATS" | "SHEEP" | "SWINE" | "MIXED";
    farmSizeAcreage?: number;
    primarySpecies: SpeciesType;
    smsAlertsEnabled: boolean;
  };
  // Vet specific attributes
  vetInfo?: {
    title: string;
    licenseNumber: string;
    clinicName: string;
    clinicAddress?: string;
    specialties: string[];
    yearsExperience: number;
    consultationFeeNaira: number;
    availableForEmergency: boolean;
    isVerified: boolean;
  };
  registeredAnimalIds?: string[];
  registeredBatchIds?: string[];
}

export type CareType =
  | "EMERGENCY_CLINIC"
  | "SAME_DAY_VET"
  | "TELECONSULT_TODAY"
  | "HOME_MONITORING";

export interface AnimalProfile {
  id: string;
  ownerId?: string;
  ownerEmail?: string;
  name: string;
  species: SpeciesType;
  breed: string;
  sex: "MALE" | "FEMALE" | "NEUTERED_MALE" | "SPAYED_FEMALE" | "FLOCK_BATCH";
  age: string;
  weightKg: number;
  tagOrMicrochip?: string;
  photoUrl: string;
  ownerName: string;
  allergies: string[];
  chronicConditions: string[];
  notes?: string;
  isLivestockBatch?: boolean;
  batchCount?: number;
  createdAt: string;
  vaccinations: VaccineRecord[];
  timeline: HealthTimelineEvent[];
}

export interface HealthTimelineEvent {
  id: string;
  animalId: string;
  date: string;
  eventType: "VACCINATION" | "CONSULTATION" | "EMERGENCY" | "DEWORMING" | "LAB_TEST" | "SURGERY" | "MEDICATION";
  title: string;
  description: string;
  vetName?: string;
  clinicName?: string;
  badgeColor?: string;
  prescription?: string;
  documents?: string[];
}

export interface VaccineRecord {
  id: string;
  animalId: string;
  vaccineName: string;
  dateAdministered: string;
  nextDueDate: string;
  administeredByVet?: string;
  batchNumber?: string;
  status: "UP_TO_DATE" | "DUE_SOON" | "OVERDUE";
}

export interface WhatShouldIDoNowAction {
  primaryAction: {
    title: string;
    description: string;
    actionType: "CALL_EMERGENCY" | "BOOK_TELEVET" | "DISPATCH_VET" | "VISIT_CLINIC" | "HOME_STABILIZE";
    badgeText: string;
    buttonLabel: string;
    etaOrUrgency: string;
  };
  immediateSteps: string[];
  strictDoNots: string[];
  secondaryOptions: {
    label: string;
    actionType: "CALL_CLINIC" | "WHATSAPP_HANDOFF" | "OPEN_CARE_PIPELINE" | "SAVE_PASSPORT";
    note?: string;
  }[];
}

export interface TriageAssessment {
  urgencyLevel: UrgencyLevel;
  urgencyTitle: string;
  summary: string;
  immediateGuidance: string[];
  whatNotToDo: string[];
  followUpQuestions: string[];
  recommendedCareType: CareType;
  redFlagAlerts?: string[];
  vetHandoffNote: string;
  localizedText?: string;
  timestamp: string;
  animalName?: string;
  symptoms?: string;
  whatShouldIDoNow?: WhatShouldIDoNowAction;
}

export interface Veterinarian {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  clinicName: string;
  clinicId: string;
  verified: boolean;
  licenseNumber: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  distanceKm: number;
  address: string;
  phone: string;
  consultationFeeNaira: number;
  availableForEmergency: boolean;
  isOnlineNow: boolean;
  responseTimeMinutes: number;
  bio: string;
  education: string;
  consultationTypes: ("VIDEO" | "CHAT" | "IN_PERSON" | "HOME_VISIT")[];
  coordinates?: { lat: number; lng: number };
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  phone: string;
  emergency247: boolean;
  rating: number;
  vetsCount: number;
  openHours: string;
  services: string[];
  coordinates: { lat: number; lng: number };
}

export interface Consultation {
  id: string;
  animalId: string;
  animalName: string;
  species: SpeciesType;
  vetId: string;
  vetName: string;
  date: string;
  time: string;
  type: "VIDEO" | "CHAT" | "IN_PERSON" | "HOME_VISIT";
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  reason: string;
  triageId?: string;
  prescription?: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    signedBy: string;
  };
  feeNaira: number;
  isPaid: boolean;
}

export interface FarmerBatch {
  id: string;
  ownerId?: string;
  ownerEmail?: string;
  name: string;
  batchName?: string;
  species: SpeciesType;
  breed?: string;
  farmType?: "POULTRY" | "DAIRY_CATTLE" | "BEEF_CATTLE" | "GOATS" | "SHEEP" | "SWINE" | "MIXED";
  initialCount: number;
  currentCount: number;
  mortalityCount: number;
  ageWeeks: number;
  currentAvgWeightKg: number;
  housingType: string;
  startDate: string;
  feedSchedule?: {
    feedType: string;
    dailyQuantityKg: number;
    frequencyPerDay: number;
  };
  withdrawalPeriods: {
    drugName: string;
    administeredDate: string;
    safeConsumptionDate: string;
    status: "ACTIVE" | "CLEARED";
  }[];
}

export interface DiseaseAlert {
  id: string;
  disease: string;
  title?: string;
  speciesAffected: SpeciesType[];
  severity: "CRITICAL" | "HIGH" | "ELEVATED" | "MEDIUM" | "MODERATE";
  state: string;
  region: string;
  radiusKm: number;
  reportedDate: string;
  recommendation: string;
  precautionSummary?: string;
  biosecurityActions?: string[];
}

export interface MapsGroundedPlace {
  id: string;
  title: string;
  uri: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  rating?: number;
  reviewCount?: number;
  openNow?: boolean;
  phone?: string;
  snippet?: string;
  types?: string[];
  reviewSnippets?: string[];
  source?: "google_maps_grounding" | "verified_database" | "web_grounding";
}

export interface MapsGroundingResponse {
  summary: string;
  places: MapsGroundedPlace[];
  groundingChunks?: any[];
  searchQueries?: string[];
  userLocation: {
    latitude: number;
    longitude: number;
    name?: string;
  };
}

export type ViewMode =
  | "HOME"
  | "CARE_COORDINATOR"
  | "COMMAND_CENTER"
  | "AI_ASSISTANT"
  | "AI_TRIAGE"
  | "EMERGENCY"
  | "FIND_VET"
  | "TELECONSULTATION"
  | "TELECONSULT"
  | "MY_ANIMALS"
  | "PASSPORT"
  | "HEALTH_PASSPORT"
  | "VACCINES"
  | "FARMER_HUB"
  | "FARMER_MODE"
  | "ADMIN_PORTAL"
  | "VET_PORTAL"
  | "CLINIC_PORTAL"
  | "DISEASE_INTEL";

export interface CoordinatedCareCase {
  id: string;
  caseNumber: string;
  status:
    | "REPORTED"
    | "TRIAGED"
    | "DISPATCHED"
    | "UNDER_TREATMENT"
    | "FOLLOW_UP_SCHEDULED"
    | "RESOLVED"
    | "CLOSED";
  channel: "TEXT" | "VOICE" | "PHOTO" | "VIDEO" | "USSD" | "WHATSAPP";
  reportedAt: string;
  animalInfo: {
    name: string;
    species: SpeciesType;
    age?: string;
    weightKg?: number;
    isBatch?: boolean;
    batchCount?: number;
    ownerName: string;
    ownerPhone: string;
    locationName: string;
    coordinates?: { lat: number; lng: number };
    registeredAnimalId?: string;
  };
  initialReport: {
    statement: string;
    voiceAudioDurationSec?: number;
    mediaUrl?: string;
    mediaType?: "PHOTO" | "VIDEO" | "AUDIO";
  };
  triage: {
    questionsAndAnswers: { question: string; answer: string; clinicalSignificance: string }[];
    classification: "ROUTINE" | "URGENT" | "CRITICAL";
    classificationReason: string;
    redFlagsDetected: string[];
    triageCompletedAt: string;
  };
  professionalMatch?: {
    vetId: string;
    vetName: string;
    vetTitle: string;
    isVPP?: boolean; // Veterinary Paraprofessional
    clinicName: string;
    phone: string;
    distanceKm: number;
    specialtyMatched: string;
    availabilityStatus: string;
    emergencyCapable: boolean;
    dispatchNotificationSentAt: string;
    dispatchChannel: "IN_APP" | "WHATSAPP_STRUCT" | "SMS_DISPATCH";
  };
  treatmentRecord?: {
    recordedAt: string;
    veterinarianName: string;
    licenseNumber: string;
    clinicalAssessment: string;
    provisionalDiagnosis: string;
    treatmentAdministered: string;
    prescription?: {
      medication: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string;
      withdrawalPeriodDays?: number;
    };
    ownerInstructions: string[];
    warningSignsToWatch: string[];
  };
  followUps: {
    id: string;
    milestone: "24H" | "48H" | "7D";
    scheduledDate: string;
    status: "PENDING" | "SENT" | "RESPONDED";
    questionPrompt: string; // "How is the animal now?"
    response?: string;
    outcomeState?: "RECOVERED" | "IMPROVING" | "UNCHANGED" | "WORSE" | "DIED";
    respondedAt?: string;
    notes?: string;
  }[];
  finalOutcome?: "RECOVERED" | "IMPROVING" | "UNCHANGED" | "WORSE" | "DIED";
  outcomeRecordedAt?: string;
  learningAndGovernance: {
    consentGranted: boolean;
    anonymizedId: string;
    contributedToEpiIntelligence: boolean;
    syndromeCategory:
      | "RESPIRATORY"
      | "GASTROINTESTINAL"
      | "SYSTEMIC_FEVER"
      | "MORTALITY_SPIKE"
      | "NEUROLOGICAL"
      | "REPRODUCTIVE"
      | "DERMATOLOGY"
      | "OTHER";
    geoLgaOrZone: string;
  };
}

export interface EpiSignal {
  id: string;
  title: string;
  species: SpeciesType[];
  syndrome: string;
  region: string;
  lga: string;
  radiusKm: number;
  caseCount: number;
  timeframe: string;
  severity: "CRITICAL" | "URGENT" | "WATCH";
  investigationStatus:
    | "UNDER_INVESTIGATION"
    | "FIELD_TEAM_DISPATCHED"
    | "LAB_CONFIRMED"
    | "EPIDEMIOLOGICAL_WATCH"
    | "RESOLVED";
  details: string;
  detectedDate: string;
  reportedByVetCount: number;
  recommendedIntervention: string[];
  isOfficialConfirmed: boolean;
}

export interface CommandCenterStats {
  casesThisWeek: number;
  activeCases: number;
  urgentCases: number;
  criticalCases: number;
  recoveredCases: number;
  totalFollowUpsConducted: number;
}

export type LanguageCode = "en" | "ha" | "yo" | "ig";

export interface TranslationStrings {
  appName: string;
  tagline: string;
  emergencyBtn: string;
  askAiBtn: string;
  findVetBtn: string;
  myAnimalsBtn: string;
  healthPassportBtn: string;
  farmerModeBtn: string;
  vaccinesBtn?: string;
  searchPlaceholder: string;
  voicePrompt: string;
  safeTriageBanner: string;
  emergencyModeNotice?: string;
}
