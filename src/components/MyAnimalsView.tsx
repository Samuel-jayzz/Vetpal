import React, { useState } from "react";
import {
  PawPrint,
  Plus,
  Calendar,
  Syringe,
  FileText,
  AlertCircle,
  Clock,
  Trash2,
  Edit3,
  CheckCircle2,
  Tag,
  Scale,
  Sparkles,
  Search,
  ChevronRight,
  Shield,
  Upload,
  User,
} from "lucide-react";
import { AnimalProfile, SpeciesType, ViewMode, UserProfile } from "../types";

interface MyAnimalsViewProps {
  animals: AnimalProfile[];
  currentUser?: UserProfile | null;
  onSelectAnimalForPassport: (animal: AnimalProfile) => void;
  onAddNewAnimal: (newAnimal: AnimalProfile) => void;
  onNavigate: (view: ViewMode) => void;
}

export const MyAnimalsView: React.FC<MyAnimalsViewProps> = ({
  animals,
  currentUser,
  onSelectAnimalForPassport,
  onAddNewAnimal,
  onNavigate,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterSpecies, setFilterSpecies] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // New Animal Form State
  const [formName, setFormName] = useState("");
  const [formSpecies, setFormSpecies] = useState<SpeciesType>("DOG");
  const [formBreed, setFormBreed] = useState("");
  const [formSex, setFormSex] = useState<"MALE" | "FEMALE" | "NEUTERED_MALE" | "SPAYED_FEMALE" | "FLOCK_BATCH">("MALE");
  const [formAge, setFormAge] = useState("");
  const [formWeight, setFormWeight] = useState("");
  const [formTag, setFormTag] = useState("");
  const [formAllergies, setFormAllergies] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formIsBatch, setFormIsBatch] = useState(false);
  const [formBatchCount, setFormBatchCount] = useState("1");
  const [formPhotoUrl, setFormPhotoUrl] = useState("");

  const filteredAnimals = animals.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.tagOrMicrochip && a.tagOrMicrochip.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecies = filterSpecies === "ALL" || a.species === filterSpecies;
    return matchesSearch && matchesSpecies;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const defaultPhotos: Record<SpeciesType, string> = {
      DOG: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
      CAT: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
      CATTLE: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80",
      POULTRY: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80",
      GOAT: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=600&q=80",
      SHEEP: "https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=600&q=80",
      HORSE: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=600&q=80",
      SWINE: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80",
      RABBIT: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80",
      OTHER: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=600&q=80",
    };

    const newAnimal: AnimalProfile = {
      id: `animal-${Date.now()}`,
      ownerId: currentUser ? currentUser.id : undefined,
      ownerEmail: currentUser ? currentUser.email : undefined,
      name: formName,
      species: formSpecies,
      breed: formBreed || "Domestic / Mixed",
      sex: formSex,
      age: formAge || "1 year",
      weightKg: parseFloat(formWeight) || 10,
      tagOrMicrochip: formTag || `NG-TAG-${Math.floor(100000 + Math.random() * 900000)}`,
      photoUrl: formPhotoUrl || defaultPhotos[formSpecies] || defaultPhotos.DOG,
      ownerName: currentUser ? currentUser.fullName : "Abubakar Sadiq",
      allergies: formAllergies ? formAllergies.split(",").map((s) => s.trim()) : [],
      chronicConditions: [],
      notes: formNotes,
      isLivestockBatch: formIsBatch,
      batchCount: formIsBatch ? parseInt(formBatchCount) || 100 : undefined,
      createdAt: new Date().toISOString().split("T")[0],
      vaccinations: [],
      timeline: [
        {
          id: `t-${Date.now()}`,
          animalId: `animal-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          eventType: "CONSULTATION",
          title: "Profile & Digital Passport Created",
          description: "Initial profile registration into the VetPal national health ecosystem.",
          clinicName: "VetPal Health Registry",
        },
      ],
    };

    onAddNewAnimal(newAnimal);
    setIsAddModalOpen(false);

    // Reset Form
    setFormName("");
    setFormBreed("");
    setFormAge("");
    setFormWeight("");
    setFormTag("");
    setFormAllergies("");
    setFormNotes("");
    setFormIsBatch(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-stone-800 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1">
              <PawPrint className="w-3.5 h-3.5" />
              <span>Companion & Livestock Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              My Animals & Flocks
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl mt-1">
              Maintain comprehensive health records, immunization schedules, microchip RFID tags, and digital passports for all your companion pets and farm batches.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition-all cursor-pointer flex items-center gap-2 shadow-md self-start sm:self-auto"
            id="add-animal-modal-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Animal / Batch</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by animal name, breed, microchip / ear-tag..."
              className="w-full bg-stone-800 text-white placeholder-stone-400 pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-stone-700"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "DOG", "CAT", "CATTLE", "POULTRY", "GOAT"].map((sp) => (
              <button
                key={sp}
                onClick={() => setFilterSpecies(sp)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  filterSpecies === sp
                    ? "bg-emerald-600 text-white"
                    : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                }`}
              >
                {sp === "ALL" ? "All Species" : sp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Animal Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnimals.map((animal) => {
          const dueSoonVaccines = animal.vaccinations.filter((v) => v.status === "DUE_SOON");
          return (
            <div
              key={animal.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Photo & Basic Details */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={animal.photoUrl}
                    alt={animal.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-extrabold text-stone-900 truncate">
                        {animal.name}
                      </h3>
                      <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {animal.species}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-stone-600 mt-0.5">{animal.breed}</p>
                    <p className="text-xs text-stone-500">
                      {animal.sex.replace("_", " ")} • {animal.age}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1.5">
                      <span className="flex items-center gap-1 font-mono bg-stone-50 px-1.5 py-0.5 rounded border border-stone-200 text-[10px]">
                        <Tag className="w-3 h-3 text-stone-400" />
                        <span>{animal.tagOrMicrochip || "No RFID"}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Scale className="w-3 h-3 text-stone-400" />
                        <span>{animal.weightKg} kg</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Batch count if livestock */}
                {animal.isLivestockBatch && animal.batchCount && (
                  <div className="bg-amber-50 text-amber-900 text-xs font-semibold p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                    <span>Agricultural Flock Size:</span>
                    <span className="font-extrabold">{animal.batchCount} heads / birds</span>
                  </div>
                )}

                {/* Due vaccination warning if any */}
                {dueSoonVaccines.length > 0 && (
                  <div className="bg-orange-50 text-orange-950 text-xs p-2.5 rounded-xl border border-orange-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Syringe className="w-3.5 h-3.5 text-orange-600" />
                      <span>Booster Due Soon:</span>
                    </div>
                    <p className="text-[11px] text-orange-800">
                      {dueSoonVaccines[0].vaccineName} (Due: {dueSoonVaccines[0].nextDueDate})
                    </p>
                  </div>
                )}

                {/* Allergies or Notes */}
                {animal.allergies.length > 0 && (
                  <div className="text-[11px] text-red-700 bg-red-50/70 p-2 rounded-lg border border-red-100">
                    <strong>Allergies:</strong> {animal.allergies.join(", ")}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectAnimalForPassport(animal)}
                  className="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  id={`open-passport-${animal.id}`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Digital Passport & Timeline</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Animal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-emerald-600" />
                <span>Add Animal or Flock Profile</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {/* Type Switch */}
              <div className="flex items-center gap-4 bg-stone-100 p-2 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="radio"
                    name="isBatchRadio"
                    checked={!formIsBatch}
                    onChange={() => setFormIsBatch(false)}
                  />
                  <span>Individual Companion Pet</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="radio"
                    name="isBatchRadio"
                    checked={formIsBatch}
                    onChange={() => setFormIsBatch(true)}
                  />
                  <span>Farm Batch / Flock</span>
                </label>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Animal / Batch Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Bello, Mimi, Cow #018, Broiler Batch 4"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Species *</label>
                  <select
                    value={formSpecies}
                    onChange={(e) => setFormSpecies(e.target.value as SpeciesType)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
                  >
                    <option value="DOG">Dog</option>
                    <option value="CAT">Cat</option>
                    <option value="CATTLE">Cattle / Cow</option>
                    <option value="POULTRY">Poultry / Chicken</option>
                    <option value="GOAT">Goat</option>
                    <option value="SHEEP">Sheep</option>
                    <option value="HORSE">Horse</option>
                    <option value="SWINE">Swine / Pig</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Breed</label>
                  <input
                    type="text"
                    value={formBreed}
                    onChange={(e) => setFormBreed(e.target.value)}
                    placeholder="e.g. German Shepherd, Cobb 500, White Fulani"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Age</label>
                  <input
                    type="text"
                    value={formAge}
                    onChange={(e) => setFormAge(e.target.value)}
                    placeholder="e.g. 3 years, 6 weeks"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    placeholder="e.g. 34.5"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">RFID / Tag #</label>
                  <input
                    type="text"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    placeholder="e.g. NG-CHIP-984"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              {formIsBatch && (
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Batch Animal Count</label>
                  <input
                    type="number"
                    value={formBatchCount}
                    onChange={(e) => setFormBatchCount(e.target.value)}
                    placeholder="e.g. 150"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-stone-700 block mb-1">Allergies (comma-separated)</label>
                <input
                  type="text"
                  value={formAllergies}
                  onChange={(e) => setFormAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Poultry protein"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Clinical / Owner Notes</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Any behavioral traits, special feed, or past medical events..."
                  rows={2}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-sm"
                  id="save-new-animal-btn"
                >
                  Save Animal Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
