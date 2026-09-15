// Source: Google Maps Platform Code Assist
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
  useMap,
} from "@vis.gl/react-google-maps";
import {
  MapPin,
  Navigation,
  Search,
  PhoneCall,
  Star,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink,
  Compass,
  AlertTriangle,
  RefreshCw,
  Sliders,
  ChevronRight,
  Info,
  CheckCircle2,
  Building2,
  Share2,
  Video,
  Key,
  Route as RouteIcon,
  Layers,
  Crosshair,
  UserCheck,
} from "lucide-react";
import { Clinic, Veterinarian, MapsGroundedPlace, MapsGroundingResponse } from "../types";

interface GoogleMapsRadarViewProps {
  initialClinics?: Clinic[];
  vets?: Veterinarian[];
  onBookConsultation?: (vet: Veterinarian, type: "VIDEO" | "CHAT" | "IN_PERSON" | "HOME_VISIT") => void;
  onCallVet?: (phone: string) => void;
}

// Utility: Haversine distance in kilometers
function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Sub-component to dynamically pan/zoom map when user location or selection changes
const MapRecenterController: React.FC<{
  center: { lat: number; lng: number };
  zoom: number;
}> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  }, [map, center.lat, center.lng, zoom]);

  return null;
};

// Marker component with attached InfoWindow for a registered Doctor
const DoctorMapMarker: React.FC<{
  vet: Veterinarian;
  isSelected: boolean;
  distanceKm: number;
  onSelect: () => void;
  onClose: () => void;
  onBookConsultation?: (vet: Veterinarian, type: "VIDEO" | "CHAT" | "IN_PERSON" | "HOME_VISIT") => void;
  onCallVet?: (phone: string) => void;
  userLocation: { latitude: number; longitude: number };
}> = ({
  vet,
  isSelected,
  distanceKm,
  onSelect,
  onClose,
  onBookConsultation,
  onCallVet,
  userLocation,
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  const coords = vet.coordinates || { lat: 6.4281, lng: 3.4219 };
  const isEmergency = vet.availableForEmergency;
  const isLivestock = vet.specialties.some(
    (s) =>
      s.toLowerCase().includes("poultry") ||
      s.toLowerCase().includes("cattle") ||
      s.toLowerCase().includes("livestock") ||
      s.toLowerCase().includes("ruminant")
  );

  const navUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${coords.lat},${coords.lng}`;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={coords}
        title={`${vet.name} (${vet.title})`}
        onClick={onSelect}
      >
        <Pin
          background={isEmergency ? "#dc2626" : isLivestock ? "#d97706" : "#0d9488"}
          borderColor="#ffffff"
          glyphColor="#ffffff"
          scale={isSelected ? 1.3 : 1.05}
        >
          <span className="text-xs select-none">
            {isEmergency ? "🚨" : isLivestock ? "🐄" : "🩺"}
          </span>
        </Pin>
      </AdvancedMarker>

      {isSelected && marker && (
        <InfoWindow
          anchor={marker}
          onCloseClick={onClose}
          maxWidth={340}
        >
          <div className="p-1 space-y-2.5 font-sans text-stone-900 max-w-[320px]">
            <div className="flex items-start gap-2.5">
              <img
                src={vet.avatarUrl}
                alt={vet.name}
                className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h4 className="font-extrabold text-sm text-stone-900 truncate">{vet.name}</h4>
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" title="VCN Verified" />
                </div>
                <p className="text-[11px] font-semibold text-teal-800 line-clamp-1">{vet.title}</p>
                <p className="text-[11px] text-stone-500 line-clamp-1">{vet.clinicName}</p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-stone-50 p-2 rounded-lg text-[11px]">
              <div className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{vet.rating}</span>
                <span className="text-stone-400 font-normal">({vet.reviewCount})</span>
              </div>
              <span className="font-bold text-teal-900 bg-teal-100/90 px-2 py-0.5 rounded-md">
                📍 {distanceKm} km from you
              </span>
            </div>

            <div className="flex flex-wrap gap-1">
              {vet.specialties.slice(0, 3).map((spec, i) => (
                <span
                  key={i}
                  className="bg-stone-100 text-stone-700 text-[10px] font-medium px-1.5 py-0.5 rounded"
                >
                  {spec}
                </span>
              ))}
              {vet.availableForEmergency && (
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  24/7 On-Call
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-100">
              <span className="text-stone-500">Consultation:</span>
              <span className="font-extrabold text-stone-900">₦{vet.consultationFeeNaira.toLocaleString()}</span>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <a
                href={navUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 transition-colors text-center"
              >
                <Navigation className="w-3 h-3" />
                <span>Google Route</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>

              <button
                onClick={() => {
                  if (onBookConsultation) onBookConsultation(vet, "VIDEO");
                }}
                className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Video className="w-3 h-3 text-emerald-400" />
                <span>Consult Now</span>
              </button>
            </div>

            {vet.phone && (
              <a
                href={`tel:${vet.phone}`}
                onClick={(e) => {
                  if (onCallVet) onCallVet(vet.phone);
                }}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-1 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3 h-3 text-stone-600" />
                <span>Direct Dial: {vet.phone}</span>
              </a>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
};

// Marker component for a 24/7 Hospital / Clinic
const ClinicMapMarker: React.FC<{
  clinic: Clinic;
  isSelected: boolean;
  distanceKm: number;
  onSelect: () => void;
  onClose: () => void;
  onCallVet?: (phone: string) => void;
  userLocation: { latitude: number; longitude: number };
}> = ({
  clinic,
  isSelected,
  distanceKm,
  onSelect,
  onClose,
  onCallVet,
  userLocation,
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const coords = clinic.coordinates || { lat: 6.4281, lng: 3.4219 };
  const navUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${coords.lat},${coords.lng}`;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={coords}
        title={clinic.name}
        onClick={onSelect}
      >
        <Pin
          background={clinic.emergency247 ? "#b91c1c" : "#1e40af"}
          borderColor="#ffffff"
          glyphColor="#ffffff"
          scale={isSelected ? 1.3 : 1.05}
        >
          <span className="text-xs select-none">{clinic.emergency247 ? "🚨" : "🏥"}</span>
        </Pin>
      </AdvancedMarker>

      {isSelected && marker && (
        <InfoWindow
          anchor={marker}
          onCloseClick={onClose}
          maxWidth={340}
        >
          <div className="p-1 space-y-2.5 font-sans text-stone-900 max-w-[320px]">
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-sm text-stone-900">{clinic.name}</h4>
                {clinic.emergency247 && (
                  <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                    24/7 ER
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{clinic.address}</p>
            </div>

            <div className="flex items-center justify-between bg-stone-50 p-2 rounded-lg text-[11px]">
              <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{clinic.openHours}</span>
              </div>
              <span className="font-bold text-teal-900 bg-teal-100/90 px-2 py-0.5 rounded-md">
                📍 {distanceKm} km away
              </span>
            </div>

            <div className="flex flex-wrap gap-1">
              {clinic.services.slice(0, 3).map((srv, idx) => (
                <span
                  key={idx}
                  className="bg-stone-100 text-stone-700 text-[10px] font-medium px-1.5 py-0.5 rounded"
                >
                  ✓ {srv}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <a
                href={navUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 transition-colors text-center"
              >
                <Navigation className="w-3 h-3" />
                <span>Turn-by-Turn</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>

              <a
                href={`tel:${clinic.phone}`}
                onClick={() => {
                  if (onCallVet) onCallVet(clinic.phone);
                }}
                className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3 h-3 text-emerald-400" />
                <span>Call Clinic</span>
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export const GoogleMapsRadarView: React.FC<GoogleMapsRadarViewProps> = ({
  initialClinics = [],
  vets = [],
  onBookConsultation,
  onCallVet,
}) => {
  // API Key management (reads client env var or custom input)
  const envApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || "";
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    return localStorage.getItem("vetpal_gmaps_key") || envApiKey || "";
  });
  const [showKeyInputModal, setShowKeyInputModal] = useState<boolean>(false);
  const [keyInputDraft, setKeyInputDraft] = useState<string>("");

  const activeApiKey = customApiKey || envApiKey;

  // Location state
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy?: number;
    name?: string;
  }>({
    latitude: 6.5244,
    longitude: 3.3792,
    name: "Lagos Victoria Island / Mainland, Nigeria",
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Search & Filter State
  const [filterType, setFilterType] = useState<"ALL" | "EMERGENCY" | "LIVESTOCK" | "COMPANION" | "SURGERY">("ALL");
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(50);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 6.5244,
    lng: 3.3792,
  });

  // User Marker ref for info window
  const [userMarkerRef, userMarker] = useAdvancedMarkerRef();
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);

  // Preset location options across major veterinary & agricultural regions
  const locationPresets = [
    { name: "Lagos (VI / Lekki / Ikeja)", lat: 6.5244, lng: 3.3792 },
    { name: "Abuja (FCT / Maitama / Garki)", lat: 9.0765, lng: 7.3986 },
    { name: "Ibadan (Oyo Agricultural Zone)", lat: 7.3775, lng: 3.947 },
    { name: "Kano (Livestock Hub)", lat: 12.0022, lng: 8.592 },
    { name: "Kaduna (Livestock Corridor)", lat: 10.5105, lng: 7.4165 },
    { name: "Port Harcourt (Rivers)", lat: 4.8156, lng: 7.0498 },
    { name: "Enugu (South-East)", lat: 6.4483, lng: 7.5139 },
    { name: "Nairobi (East Africa Hub)", lat: -1.2921, lng: 36.8219 },
    { name: "Accra (Ghana)", lat: 5.6037, lng: -0.187 },
  ];

  // Geolocation detector
  const detectLiveLocation = useCallback(() => {
    setIsLocating(true);
    setLocationError(null);
    setLocationSuccessMsg(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser. Please choose a preset city.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const acc = Math.round(position.coords.accuracy || 20);

        const newLoc = {
          latitude: lat,
          longitude: lng,
          accuracy: acc,
          name: `Live GPS Device Position (±${acc}m accuracy)`,
        };

        setUserLocation(newLoc);
        setMapCenter({ lat, lng });
        setMapZoom(13);
        setIsLocating(false);
        setLocationSuccessMsg(`Successfully locked GPS coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})! Sorted nearest registered doctors & hospitals.`);
        setTimeout(() => setLocationSuccessMsg(null), 5000);
      },
      (error) => {
        console.warn("Geolocation permission or timeout error:", error);
        setLocationError("GPS permission was denied or timed out. You can tap any regional city preset below to test.");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  // Preset location selector
  const handlePresetSelect = (preset: { name: string; lat: number; lng: number }) => {
    setUserLocation({
      latitude: preset.lat,
      longitude: preset.lng,
      name: preset.name,
    });
    setMapCenter({ lat: preset.lat, lng: preset.lng });
    setMapZoom(12);
    setLocationSuccessMsg(`Switched location to ${preset.name}`);
    setTimeout(() => setLocationSuccessMsg(null), 3000);
  };

  // Compute live distances for all doctors and clinics
  const processedDoctors = useMemo(() => {
    return vets.map((vet) => {
      const coords = vet.coordinates || { lat: 6.4281, lng: 3.4219 };
      const dist = calculateHaversineDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        coords.lat,
        coords.lng
      );
      return {
        ...vet,
        calculatedDistanceKm: dist,
        coords,
      };
    });
  }, [vets, userLocation.latitude, userLocation.longitude]);

  const processedClinics = useMemo(() => {
    return initialClinics.map((clinic) => {
      const coords = clinic.coordinates || { lat: 6.4281, lng: 3.4219 };
      const dist = calculateHaversineDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        coords.lat,
        coords.lng
      );
      return {
        ...clinic,
        calculatedDistanceKm: dist,
        coords,
      };
    });
  }, [initialClinics, userLocation.latitude, userLocation.longitude]);

  // Filtered and proximity-sorted items
  const filteredAndSortedEntities = useMemo(() => {
    let docList = [...processedDoctors];
    let clinicList = [...processedClinics];

    // Filter by category
    if (filterType === "EMERGENCY") {
      docList = docList.filter((d) => d.availableForEmergency);
      clinicList = clinicList.filter((c) => c.emergency247);
    } else if (filterType === "LIVESTOCK") {
      docList = docList.filter((d) =>
        d.specialties.some(
          (s) =>
            s.toLowerCase().includes("poultry") ||
            s.toLowerCase().includes("livestock") ||
            s.toLowerCase().includes("cattle") ||
            s.toLowerCase().includes("ruminant") ||
            s.toLowerCase().includes("swine")
        )
      );
      clinicList = clinicList.filter((c) =>
        c.services.some(
          (s) =>
            s.toLowerCase().includes("poultry") ||
            s.toLowerCase().includes("livestock") ||
            s.toLowerCase().includes("farm") ||
            s.toLowerCase().includes("herd")
        )
      );
    } else if (filterType === "COMPANION") {
      docList = docList.filter((d) =>
        d.specialties.some(
          (s) =>
            s.toLowerCase().includes("small animal") ||
            s.toLowerCase().includes("canine") ||
            s.toLowerCase().includes("feline") ||
            s.toLowerCase().includes("surgery")
        )
      );
    } else if (filterType === "SURGERY") {
      docList = docList.filter((d) =>
        d.specialties.some(
          (s) =>
            s.toLowerCase().includes("surgery") ||
            s.toLowerCase().includes("orthopedic") ||
            s.toLowerCase().includes("radiology")
        )
      );
      clinicList = clinicList.filter((c) =>
        c.services.some((s) => s.toLowerCase().includes("surgery") || s.toLowerCase().includes("surgical"))
      );
    }

    // Filter by text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      docList = docList.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.clinicName.toLowerCase().includes(q) ||
          d.specialties.some((s) => s.toLowerCase().includes(q))
      );
      clinicList = clinicList.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q) ||
          c.services.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Combined unified list
    const combined: Array<{
      id: string;
      type: "VET" | "CLINIC";
      title: string;
      subtitle: string;
      distanceKm: number;
      rating: number;
      reviews: number;
      phone: string;
      emergency: boolean;
      coords: { lat: number; lng: number };
      vetData?: Veterinarian;
      clinicData?: Clinic;
    }> = [
      ...docList.map((d) => ({
        id: `vet-${d.id}`,
        type: "VET" as const,
        title: d.name,
        subtitle: `${d.title} • ${d.clinicName}`,
        distanceKm: d.calculatedDistanceKm,
        rating: d.rating,
        reviews: d.reviewCount,
        phone: d.phone,
        emergency: d.availableForEmergency,
        coords: d.coords,
        vetData: d,
      })),
      ...clinicList.map((c) => ({
        id: `clinic-${c.id}`,
        type: "CLINIC" as const,
        title: c.name,
        subtitle: `${c.address} (${c.openHours})`,
        distanceKm: c.calculatedDistanceKm,
        rating: c.rating,
        reviews: c.vetsCount * 18 + 24,
        phone: c.phone,
        emergency: c.emergency247,
        coords: c.coords,
        clinicData: c,
      })),
    ];

    // Filter by search radius (unless radius is huge)
    const withinRadius = combined.filter((item) => item.distanceKm <= searchRadiusKm);

    // Sort strictly by nearest distance to user's GPS
    return (withinRadius.length > 0 ? withinRadius : combined).sort(
      (a, b) => a.distanceKm - b.distanceKm
    );
  }, [processedDoctors, processedClinics, filterType, searchQuery, searchRadiusKm]);

  // Nearest item overall
  const nearestEntity = filteredAndSortedEntities[0] || null;

  const handleSaveApiKey = () => {
    const trimmed = keyInputDraft.trim();
    setCustomApiKey(trimmed);
    localStorage.setItem("vetpal_gmaps_key", trimmed);
    setShowKeyInputModal(false);
  };

  return (
    <div className="space-y-6" id="google-maps-radar-view">
      {/* 1. Header & Live Geolocation Control Deck */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-md space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-teal-950 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full border border-teal-800/80">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Google Maps Platform Verified Spatial Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Google Maps Location & Nearest Vet Doctors
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl">
              Pinpoint your exact GPS location to instantly discover nearest registered veterinarians, on-call emergency trauma clinics, and livestock ambulatory doctors.
            </p>
          </div>

          {/* Current GPS Target & Locate Me Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-stone-950/90 p-2.5 rounded-2xl border border-stone-800 shrink-0">
            <div className="flex items-center gap-2.5 px-3 py-1 text-xs">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-stone-400">User GPS Coordinates</p>
                <p className="font-semibold text-white truncate max-w-[220px]">
                  {userLocation.name || `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`}
                </p>
              </div>
            </div>

            <button
              onClick={detectLiveLocation}
              disabled={isLocating}
              className="bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
              id="locate-me-gps-btn"
            >
              <Crosshair className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`} />
              <span>{isLocating ? "Detecting GPS..." : "📍 Locate Me (Live GPS)"}</span>
            </button>
          </div>
        </div>

        {/* Success / Error Banners */}
        {locationSuccessMsg && (
          <div className="bg-emerald-950/80 border border-emerald-800/80 rounded-xl p-3 text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{locationSuccessMsg}</span>
          </div>
        )}

        {locationError && (
          <div className="bg-amber-950/80 border border-amber-800/80 rounded-xl p-3 text-xs text-amber-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{locationError}</span>
            </div>
            <button
              onClick={() => setLocationError(null)}
              className="text-amber-400 hover:underline font-semibold cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Quick Regional Corridors */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-800 text-xs text-stone-400">
          <span className="font-semibold text-stone-300 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-teal-400" />
            <span>Quick City & Regional Corridors:</span>
          </span>
          {locationPresets.map((preset) => {
            const isSelected =
              Math.abs(userLocation.latitude - preset.lat) < 0.05 &&
              Math.abs(userLocation.longitude - preset.lng) < 0.05;
            return (
              <button
                key={preset.name}
                onClick={() => handlePresetSelect(preset)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-teal-500 text-stone-950 font-bold shadow-xs"
                    : "bg-stone-800 hover:bg-stone-700 text-stone-300"
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>

        {/* Category Filter Chips & Radius Selector */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          {/* Care category filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "ALL", label: "🏢 All Registered Providers" },
              { id: "EMERGENCY", label: "🚨 24/7 Emergency & ICU" },
              { id: "LIVESTOCK", label: "🐄 Farm & Livestock Vets" },
              { id: "COMPANION", label: "🐕 Dogs, Cats & Pets" },
              { id: "SURGERY", label: "🩺 Surgical & Orthopedics" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filterType === f.id
                    ? "bg-white text-stone-950 shadow-xs"
                    : "bg-stone-800/90 text-stone-300 hover:bg-stone-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Radius and Custom Key config button */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-stone-400">Radius:</span>
            {[10, 25, 50, 100].map((radius) => (
              <button
                key={radius}
                onClick={() => setSearchRadiusKm(radius)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  searchRadiusKm === radius
                    ? "bg-teal-600 text-white font-bold"
                    : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                }`}
              >
                {radius}km
              </button>
            ))}

            <button
              onClick={() => {
                setKeyInputDraft(activeApiKey);
                setShowKeyInputModal(true);
              }}
              className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
              title="Google Maps API Key Settings"
            >
              <Key className="w-3 h-3 text-teal-400" />
              <span>{activeApiKey ? "API Key Configured" : "Add Demo Key"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Google Maps API Key Modal */}
      {showKeyInputModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-stone-900 text-lg">Google Maps API Key</h3>
              </div>
              <button
                onClick={() => setShowKeyInputModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Google Maps Platform provides rich interactive maps and vector pins. You can use your own key from Google Cloud Console or generate a free instant <strong>Maps Demo Key</strong>:
            </p>

            <div className="bg-teal-50 p-3 rounded-xl border border-teal-200 text-xs text-teal-900 space-y-1">
              <p className="font-bold">✨ Quick Zero-Cost Prototyping:</p>
              <p className="text-[11px] text-teal-800">
                1. Open <a href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_mcp_codeassist_v1_aistudio" target="_blank" rel="noreferrer" className="underline font-bold text-teal-950">Google Maps Demo Key Portal</a>
                <br />
                2. Sign in and copy the revealed demo key into the box below.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Enter API Key / Demo Key:</label>
              <input
                type="text"
                value={keyInputDraft}
                onChange={(e) => setKeyInputDraft(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyInputModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Nearest Recommended Provider Callout Bar */}
      {nearestEntity && (
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white rounded-2xl p-4 sm:p-5 border border-teal-700/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white text-teal-900 flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
              {nearestEntity.emergency ? "🚨" : "🩺"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-400 text-emerald-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                  Closest To Your Location
                </span>
                <span className="text-xs font-extrabold text-teal-200">
                  {nearestEntity.distanceKm} km away
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {nearestEntity.title}
              </h3>
              <p className="text-xs text-teal-100 line-clamp-1">{nearestEntity.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${nearestEntity.coords.lat},${nearestEntity.coords.coords ? nearestEntity.coords.lng : nearestEntity.coords.lng}`}
              target="_blank"
              rel="noreferrer"
              className="bg-white hover:bg-teal-50 text-teal-950 font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5 text-teal-700" />
              <span>Google Maps Route</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            {nearestEntity.phone && (
              <a
                href={`tel:${nearestEntity.phone}`}
                onClick={() => {
                  if (onCallVet) onCallVet(nearestEntity.phone);
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* 4. Interactive Google Maps Canvas & Nearest Providers List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Google Map */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-700" />
                <h3 className="font-bold text-sm text-stone-900">Interactive Location Map</h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500 font-medium">
                  {filteredAndSortedEntities.length} Registered Places Mapped
                </span>
              </div>
            </div>

            {/* Google Map Container with explicit CSS height */}
            <div
              className="w-full h-96 sm:h-[500px] rounded-2xl overflow-hidden relative border border-stone-200 bg-stone-100"
              style={{ minHeight: "400px" }}
            >
              <APIProvider apiKey={activeApiKey || "AIzaSy_demo_maps_preview"}>
                <Map
                  mapId="DEMO_MAP_ID"
                  defaultCenter={{ lat: userLocation.latitude, lng: userLocation.longitude }}
                  defaultZoom={mapZoom}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                  style={{ width: "100%", height: "100%" }}
                >
                  <MapRecenterController center={mapCenter} zoom={mapZoom} />

                  {/* 1. User Location Marker */}
                  <AdvancedMarker
                    ref={userMarkerRef}
                    position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
                    title="Your Current Location"
                    onClick={() => setIsUserInfoOpen(true)}
                  >
                    <Pin
                      background="#2563eb"
                      borderColor="#ffffff"
                      glyphColor="#ffffff"
                      scale={1.3}
                    >
                      <span className="text-xs font-bold select-none">📍</span>
                    </Pin>
                  </AdvancedMarker>

                  {isUserInfoOpen && userMarker && (
                    <InfoWindow
                      anchor={userMarker}
                      onCloseClick={() => setIsUserInfoOpen(false)}
                      maxWidth={260}
                    >
                      <div className="p-1 space-y-1 font-sans text-xs">
                        <p className="font-extrabold text-blue-700">📍 Your Current GPS Position</p>
                        <p className="text-stone-600 text-[11px]">
                          {userLocation.name || `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          All clinic & doctor distances are measured relative to this coordinate.
                        </p>
                      </div>
                    </InfoWindow>
                  )}

                  {/* 2. Registered Doctors Markers */}
                  {processedDoctors.map((vet) => {
                    const isSelected = selectedEntityId === `vet-${vet.id}`;
                    return (
                      <DoctorMapMarker
                        key={vet.id}
                        vet={vet}
                        isSelected={isSelected}
                        distanceKm={vet.calculatedDistanceKm}
                        onSelect={() => {
                          setSelectedEntityId(`vet-${vet.id}`);
                          setMapCenter(vet.coords);
                        }}
                        onClose={() => setSelectedEntityId(null)}
                        onBookConsultation={onBookConsultation}
                        onCallVet={onCallVet}
                        userLocation={userLocation}
                      />
                    );
                  })}

                  {/* 3. 24/7 Emergency Clinics Markers */}
                  {processedClinics.map((clinic) => {
                    const isSelected = selectedEntityId === `clinic-${clinic.id}`;
                    return (
                      <ClinicMapMarker
                        key={clinic.id}
                        clinic={clinic}
                        isSelected={isSelected}
                        distanceKm={clinic.calculatedDistanceKm}
                        onSelect={() => {
                          setSelectedEntityId(`clinic-${clinic.id}`);
                          setMapCenter(clinic.coords);
                        }}
                        onClose={() => setSelectedEntityId(null)}
                        onCallVet={onCallVet}
                        userLocation={userLocation}
                      />
                    );
                  })}
                </Map>
              </APIProvider>
            </div>

            {/* Map Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block shadow-xs" />
                  <span>You (GPS)</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-teal-600 inline-block shadow-xs" />
                  <span>Verified Vet Doctor</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-red-600 inline-block shadow-xs" />
                  <span>24/7 Emergency Trauma</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-amber-600 inline-block shadow-xs" />
                  <span>Livestock & Farm Vet</span>
                </span>
              </div>
              <button
                onClick={detectLiveLocation}
                className="text-teal-700 hover:text-teal-900 font-bold underline cursor-pointer text-[11px]"
              >
                Re-center Map
              </button>
            </div>
          </div>
        </div>

        {/* Right: Proximity-Sorted Providers List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 mr-2">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter doctors by name, specialty..."
                className="w-full bg-white text-stone-900 placeholder-stone-400 pl-8 pr-3 py-2 rounded-xl text-xs font-medium border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <span className="text-[11px] font-bold text-teal-800 shrink-0 bg-teal-50 px-2.5 py-1.5 rounded-lg">
              Sorted by Nearest
            </span>
          </div>

          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredAndSortedEntities.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center space-y-3">
                <MapPin className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-sm font-bold text-stone-800">No registered doctors in this radius.</p>
                <p className="text-xs text-stone-500">
                  Try expanding the search radius above or selecting a different care category.
                </p>
                <button
                  onClick={() => {
                    setFilterType("ALL");
                    setSearchRadiusKm(100);
                  }}
                  className="bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Reset Filters (100km Radius)
                </button>
              </div>
            ) : (
              filteredAndSortedEntities.map((item) => {
                const isSelected = selectedEntityId === item.id;
                const isVet = item.type === "VET";

                const navUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${item.coords.lat},${item.coords.lng}`;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedEntityId(item.id);
                      setMapCenter(item.coords);
                      setMapZoom(14);
                    }}
                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? "border-teal-500 ring-2 ring-teal-500/30 shadow-md bg-teal-50/20"
                        : "border-stone-200 hover:border-stone-300 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0">
                        {isVet && item.vetData?.avatarUrl ? (
                          <img
                            src={item.vetData.avatarUrl}
                            alt={item.title}
                            className="w-11 h-11 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-base shrink-0 border border-teal-100">
                            {item.emergency ? "🚨" : "🏥"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-sm text-stone-900 truncate">{item.title}</h4>
                            {item.emergency && (
                              <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                                24/7 ER
                              </span>
                            )}
                            <span className="bg-teal-50 text-teal-800 text-[10px] font-semibold px-1.5 py-0.2 rounded">
                              {isVet ? "Licensed Vet" : "Animal Hospital"}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{item.subtitle}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-teal-900 bg-teal-100/90 px-2 py-1 rounded-lg">
                          {item.distanceKm} km
                        </span>
                      </div>
                    </div>

                    {/* Ratings & Specialty badges */}
                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{item.rating}</span>
                        <span className="text-stone-400 font-normal">({item.reviews})</span>
                      </div>

                      {isVet && item.vetData && (
                        <span className="text-xs font-extrabold text-stone-800">
                          Fee: ₦{item.vetData.consultationFeeNaira.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Quick action buttons */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                      <a
                        href={item.phone ? `tel:${item.phone}` : "tel:+234800938725"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onCallVet && item.phone) onCallVet(item.phone);
                        }}
                        className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-stone-600" />
                        <span>{item.phone ? "Call Doctor" : "Call Clinic"}</span>
                      </a>

                      <a
                        href={navUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Google Route</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>

                      {isVet && item.vetData && onBookConsultation && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookConsultation(item.vetData!, "VIDEO");
                          }}
                          className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Book Video Teleconsultation"
                        >
                          <Video className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Teleconsult</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
