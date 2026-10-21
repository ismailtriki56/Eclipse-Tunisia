"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { destinations } from "@/data/destinations";
import { experiences } from "@/data/experiences";
import { circumstancesFor } from "@/lib/eclipse/destinations";
import { getImage } from "@/data/images";
import { cn } from "@/lib/cn";
import {
  Calendar,
  MapPin,
  Sparkles,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ChevronRight,
  Info,
  Loader2,
  FolderOpen,
  Send,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "destination" | "experience" | "custom";
  referenceSlug?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  title: string;
  destinationSlug: string;
  isEclipseDay?: boolean;
  activities: Activity[];
}

export interface ItineraryPlan {
  tripTitle: string;
  summary: string;
  eclipseDayNotes: string;
  days: ItineraryDay[];
}

export interface SavedTripEntry {
  id: string;
  title: string;
  savedAt: string;
  daysCount: number;
  totalityLocation: string;
  plan: ItineraryPlan;
}

export interface BookingInquiry {
  id: string;
  referenceNumber: string;
  submittedAt: string;
  tripTitle: string;
  leadName: string;
  email: string;
  phone: string;
  travelerCount: number;
  accommodationType: string;
  specialRequests: string;
  daysCount: number;
  eclipseBase: string;
}

const LOCAL_STORAGE_ACTIVE_KEY = "eclipse_tunisia_itinerary_active_v3";
const LOCAL_STORAGE_SAVED_TRIPS_KEY = "eclipse_tunisia_saved_trips_v3";
const LOCAL_STORAGE_INQUIRIES_KEY = "eclipse_tunisia_inquiries_v3";

const DEFAULT_INITIAL_PLAN: ItineraryPlan = {
  tripTitle: "Sahara & Mediterranean Totality Expedition 2027",
  summary:
    "A 5-day route through historic Carthage, Kairouan's spiritual landmarks, and totality across the Tozeur oasis and Chott el Jerid salt desert.",
  eclipseDayNotes:
    "On Monday, 2 August 2027, you are stationed in Tozeur inside the path of totality for 2 minutes and 4 seconds of midday darkness at 11:05 local time.",
  days: [
    {
      dayNumber: 1,
      date: "2027-07-31",
      title: "Arrival in Tunis & Carthage Coast",
      destinationSlug: "carthage",
      activities: [
        {
          id: "act-1",
          time: "10:00",
          title: "Arrive at Tunis-Carthage & Equipment Calibration",
          description: "Airport reception, vehicle pickup, optical equipment check, and certified solar eclipse glasses inspection.",
          type: "destination",
          referenceSlug: "tunis",
        },
        {
          id: "act-2",
          time: "15:00",
          title: "Explore the Antonine Baths at Carthage",
          description: "Visit Phoenician and Roman seaside archaeological ruins overlooking the Gulf of Tunis.",
          type: "destination",
          referenceSlug: "carthage",
        },
        {
          id: "act-3",
          time: "18:00",
          title: "Sunset Mint Tea at Sidi Bou Said",
          description: "Cobblestone stroll through the white-and-blue artists' village on the cliff.",
          type: "destination",
          referenceSlug: "sidi-bou-said",
        },
      ],
    },
    {
      dayNumber: 2,
      date: "2027-08-01",
      title: "The Great Mosque of Kairouan to Tozeur",
      destinationSlug: "tozeur",
      activities: [
        {
          id: "act-4",
          time: "09:00",
          title: "Great Mosque of Uqba in Kairouan",
          description: "Tour the 9th-century courtyard, marble columns, and monumental prayer hall.",
          type: "destination",
          referenceSlug: "kairouan",
        },
        {
          id: "act-5",
          time: "17:00",
          title: "Tozeur Oasis Palm Grove Walk",
          description: "Walk beneath 200,000 date palms and finalize tomorrow's eclipse observation ground.",
          type: "experience",
          referenceSlug: "tozeur-oasis-cultural-walk",
        },
      ],
    },
    {
      dayNumber: 3,
      date: "2027-08-02",
      title: "TOTALITY DAY: Tozeur Oasis & Chott el Jerid",
      destinationSlug: "tozeur",
      isEclipseDay: true,
      activities: [
        {
          id: "act-6",
          time: "07:30",
          title: "Pre-Dawn Departure to Observation Station",
          description: "Set up tripods, certified ISO 12312-2 solar filters, shade canopies, and hydration supplies.",
          type: "experience",
          referenceSlug: "desert-totality-viewing",
        },
        {
          id: "act-7",
          time: "09:50",
          title: "First Contact (C1) — Partial Eclipse Ingress",
          description: "Lunar disc begins biting into the solar rim. Certified solar filters mandatory.",
          type: "destination",
          referenceSlug: "tozeur",
        },
        {
          id: "act-8",
          time: "11:04",
          title: "TOTALITY (C2 to C3) — Corona Observation (2m 04s)",
          description: "Remove solar glasses to behold the solar corona, Baily's Beads, red prominences, and daytime planets.",
          type: "destination",
          referenceSlug: "tozeur",
        },
        {
          id: "act-9",
          time: "13:00",
          title: "Post-Eclipse Celebration & Oasis Shade Rest",
          description: "Cool down with cold hibiscus water and fresh dates during peak 42°C afternoon sun.",
          type: "destination",
          referenceSlug: "tozeur",
        },
      ],
    },
    {
      dayNumber: 4,
      date: "2027-08-03",
      title: "Chott el Jerid Salt Flats to Matmata",
      destinationSlug: "matmata",
      activities: [
        {
          id: "act-10",
          time: "08:30",
          title: "Crossing Chott el Jerid Salt Lake",
          description: "Drive the causeway across 7,000 km² of blinding Saharan salt crust with horizon mirages.",
          type: "destination",
          referenceSlug: "chott-el-jerid",
        },
        {
          id: "act-11",
          time: "14:00",
          title: "Troglodyte Berber Architecture in Matmata",
          description: "Underground circular courtyards carved into southern sandstone to maintain natural cool temperatures.",
          type: "destination",
          referenceSlug: "matmata",
        },
      ],
    },
    {
      dayNumber: 5,
      date: "2027-08-04",
      title: "Roman El Jem Amphitheatre & Return",
      destinationSlug: "el-jem",
      activities: [
        {
          id: "act-12",
          time: "10:00",
          title: "El Jem Roman Amphitheatre",
          description: "Walk the arena floor and subterranean galleries of North Africa's largest Roman colosseum.",
          type: "destination",
          referenceSlug: "el-jem",
        },
        {
          id: "act-13",
          time: "16:00",
          title: "Transfer to Coastal Hub or Tunis Airport",
          description: "Conclude expedition with transfer to Sousse, Monastir, or Tunis for departure flights.",
          type: "destination",
          referenceSlug: "tunis",
        },
      ],
    },
  ],
};

function addDaysToDate(dateStr: string, daysToAdd: number = 1): string {
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d + daysToAdd));
    return date.toISOString().slice(0, 10);
  } catch {
    return dateStr;
  }
}

export function ItineraryPlanner() {
  const searchParams = useSearchParams();
  const addDestParam = searchParams.get("addDest");

  // Load active plan from localStorage on client
  const [plan, setPlan] = useState<ItineraryPlan>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedActive = localStorage.getItem(LOCAL_STORAGE_ACTIVE_KEY);
        if (storedActive) {
          const parsed = JSON.parse(storedActive);
          if (parsed && Array.isArray(parsed.days) && parsed.days.length > 0) {
            return parsed;
          }
        }
      } catch {}
    }
    return DEFAULT_INITIAL_PLAN;
  });

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [dismissedSuggest, setDismissedSuggest] = useState(false);

  // Preference Controls State
  const [startDate, setStartDate] = useState(() => plan.days[0]?.date || "2027-07-31");
  const [endDate, setEndDate] = useState(
    () => plan.days[plan.days.length - 1]?.date || "2027-08-04"
  );
  const [eclipsePreference, setEclipsePreference] = useState<"totality" | "flexible">("totality");
  const [aiPace, setAiPace] = useState("moderate");
  const [aiBudget, setAiBudget] = useState("moderate");
  const [aiGroupSize, setAiGroupSize] = useState(2);
  const [aiInterests, setAiInterests] = useState<string[]>([
    "totality",
    "desert",
    "culture",
  ]);

  // AI & Generator State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiErrorNotice, setAiErrorNotice] = useState<string | null>(null);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  // Saved Itineraries Manager Drawer/Modal
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState(false);
  const [savedTrips, setSavedTrips] = useState<SavedTripEntry[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedTrips = localStorage.getItem(LOCAL_STORAGE_SAVED_TRIPS_KEY);
        if (storedTrips) {
          const parsedList = JSON.parse(storedTrips);
          if (Array.isArray(parsedList)) {
            return parsedList;
          }
        }
      } catch {}
    }
    return [];
  });

  // 4-Stage Reservation Inquiry Modal
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryStayType, setInquiryStayType] = useState("desert-camp");
  const [inquiryNotes, setInquiryNotes] = useState("");
  const [submittedInquiry, setSubmittedInquiry] = useState<BookingInquiry | null>(null);

  // New Activity Modal
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newActivityType, setNewActivityType] = useState<"destination" | "experience" | "custom">("destination");
  const [newActivityRefSlug, setNewActivityRefSlug] = useState<string>(destinations[0].slug);
  const [newActivityTime, setNewActivityTime] = useState("10:00");
  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [newActivityDesc, setNewActivityDesc] = useState("");

  const suggestedDest = useMemo(() => {
    if (!addDestParam || dismissedSuggest) return null;
    return destinations.find((d) => d.slug === addDestParam) ?? null;
  }, [addDestParam, dismissedSuggest]);

  const handleAddSuggestedDest = () => {
    if (!suggestedDest) return;
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      time: "14:00",
      title: `Visit ${suggestedDest.name}`,
      description: suggestedDest.summary,
      type: "destination",
      referenceSlug: suggestedDest.slug,
    };
    setPlan((prev) => {
      const updatedDays = prev.days.map((day, idx) =>
        idx === activeDayIndex
          ? { ...day, activities: [...day.activities, newAct] }
          : day
      );
      try {
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_KEY, JSON.stringify({ ...prev, days: updatedDays }));
      } catch {}
      return { ...prev, days: updatedDays };
    });
    setDismissedSuggest(true);
    setSavedNotice(`Added ${suggestedDest.name} to Day ${activeDayIndex + 1}!`);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  // Save current plan with custom or default title
  const handleSaveItinerary = () => {
    try {
      // 1. Save active
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_KEY, JSON.stringify(plan));

      // 2. Add to saved trips collection
      const eclipseDay = plan.days.find((d) => d.isEclipseDay || d.date === "2027-08-02");
      const eclipseDest = destinations.find((d) => d.slug === eclipseDay?.destinationSlug);

      const newEntry: SavedTripEntry = {
        id: `trip-${Date.now()}`,
        title: plan.tripTitle || "Eclipse Tunisia Expedition",
        savedAt: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        daysCount: plan.days.length,
        totalityLocation: eclipseDest?.name ?? "Tunisia",
        plan: JSON.parse(JSON.stringify(plan)),
      };

      const updated = [newEntry, ...savedTrips.filter((t) => t.title !== newEntry.title)].slice(0, 15);
      setSavedTrips(updated);
      localStorage.setItem(LOCAL_STORAGE_SAVED_TRIPS_KEY, JSON.stringify(updated));

      setSavedNotice(`Saved "${plan.tripTitle}" to your browser! Accessible from My Saved Trips.`);
      setTimeout(() => setSavedNotice(null), 3500);
    } catch (e) {
      console.error("Failed to save itinerary:", e);
      setSavedNotice("Could not save to localStorage (storage limit exceeded).");
      setTimeout(() => setSavedNotice(null), 3500);
    }
  };

  const handleLoadSavedTrip = (entry: SavedTripEntry) => {
    setPlan(entry.plan);
    setActiveDayIndex(0);
    if (entry.plan.days[0]?.date) setStartDate(entry.plan.days[0].date);
    if (entry.plan.days[entry.plan.days.length - 1]?.date) {
      setEndDate(entry.plan.days[entry.plan.days.length - 1].date);
    }
    try {
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_KEY, JSON.stringify(entry.plan));
    } catch {}
    setIsSavedTripsOpen(false);
    setSavedNotice(`Loaded saved trip: "${entry.title}"`);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleDeleteSavedTrip = (id: string) => {
    const updated = savedTrips.filter((t) => t.id !== id);
    setSavedTrips(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVED_TRIPS_KEY, JSON.stringify(updated));
    } catch {}
  };

  const handleResetToDefault = () => {
    if (confirm("Reset current itinerary back to the verified default expedition plan?")) {
      setPlan(DEFAULT_INITIAL_PLAN);
      setActiveDayIndex(0);
      setStartDate("2027-07-31");
      setEndDate("2027-08-04");
      try {
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_KEY, JSON.stringify(DEFAULT_INITIAL_PLAN));
      } catch {}
      setSavedNotice("Reset to default 5-day expedition.");
      setTimeout(() => setSavedNotice(null), 3000);
    }
  };

  // Add Day with robust date calculation
  const handleAddDay = () => {
    const lastDay = plan.days[plan.days.length - 1];
    const nextDate = lastDay ? addDaysToDate(lastDay.date, 1) : "2027-08-05";
    const nextDayNum = plan.days.length + 1;

    // Pick sensible default destination based on prior days
    const priorSlugs = plan.days.map((d) => d.destinationSlug);
    let defaultSlug = "djerba";
    if (!priorSlugs.includes("el-jem")) defaultSlug = "el-jem";
    else if (!priorSlugs.includes("mahdia")) defaultSlug = "mahdia";
    else if (!priorSlugs.includes("djerba")) defaultSlug = "djerba";
    else defaultSlug = "tunis";

    const isEclipseDay = nextDate === "2027-08-02";

    const newDay: ItineraryDay = {
      dayNumber: nextDayNum,
      date: nextDate,
      title: isEclipseDay
        ? `Day ${nextDayNum}: TOTALITY ECLIPSE OBSERVATION`
        : `Day ${nextDayNum} Discovery & Excursions`,
      destinationSlug: defaultSlug,
      isEclipseDay,
      activities: [],
    };

    const updatedPlan = {
      ...plan,
      days: [...plan.days, newDay],
    };
    setPlan(updatedPlan);
    setEndDate(nextDate);
    setActiveDayIndex(updatedPlan.days.length - 1);
    try {
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_KEY, JSON.stringify(updatedPlan));
    } catch {}
  };

  // Delete Day with re-indexing
  const handleDeleteDay = (indexToDelete: number) => {
    if (plan.days.length <= 1) {
      alert("An expedition must contain at least 1 day.");
      return;
    }

    const dayToDelete = plan.days[indexToDelete];
    if (dayToDelete.isEclipseDay || dayToDelete.date === "2027-08-02") {
      if (
        !confirm(
          "Warning: You are removing 2 August 2027, the Total Solar Eclipse day! Are you sure you want to delete this day?"
        )
      ) {
        return;
      }
    }

    const updatedDays = plan.days
      .filter((_, idx) => idx !== indexToDelete)
      .map((day, idx) => ({
        ...day,
        dayNumber: idx + 1,
      }));

    const updatedPlan = { ...plan, days: updatedDays };
    setPlan(updatedPlan);

    // Adjust active index
    if (activeDayIndex >= updatedDays.length) {
      setActiveDayIndex(updatedDays.length - 1);
    } else if (activeDayIndex === indexToDelete && activeDayIndex > 0) {
      setActiveDayIndex(activeDayIndex - 1);
    }

    if (updatedDays.length > 0) {
      setStartDate(updatedDays[0].date);
      setEndDate(updatedDays[updatedDays.length - 1].date);
    }

    try {
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_KEY, JSON.stringify(updatedPlan));
    } catch {}
  };

  // Reorder activities
  const moveActivity = (dayIdx: number, actIdx: number, direction: "up" | "down") => {
    setPlan((prev) => {
      const targetDay = prev.days[dayIdx];
      const newActs = [...targetDay.activities];
      const swapIdx = direction === "up" ? actIdx - 1 : actIdx + 1;
      if (swapIdx < 0 || swapIdx >= newActs.length) return prev;

      const temp = newActs[actIdx];
      newActs[actIdx] = newActs[swapIdx];
      newActs[swapIdx] = temp;

      const updatedDays = prev.days.map((day, idx) =>
        idx === dayIdx ? { ...day, activities: newActs } : day
      );
      const updatedPlan = { ...prev, days: updatedDays };
      try {
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_KEY, JSON.stringify(updatedPlan));
      } catch {}
      return updatedPlan;
    });
  };

  const removeActivity = (dayIdx: number, actIdx: number) => {
    setPlan((prev) => {
      const targetDay = prev.days[dayIdx];
      const newActs = targetDay.activities.filter((_, idx) => idx !== actIdx);
      const updatedDays = prev.days.map((day, idx) =>
        idx === dayIdx ? { ...day, activities: newActs } : day
      );
      const updatedPlan = { ...prev, days: updatedDays };
      try {
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_KEY, JSON.stringify(updatedPlan));
      } catch {}
      return updatedPlan;
    });
  };

  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalTitle = newActivityTitle;
    let finalDesc = newActivityDesc;

    if (newActivityType === "destination") {
      const d = destinations.find((x) => x.slug === newActivityRefSlug);
      if (d) {
        if (!finalTitle) finalTitle = `Explore ${d.name}`;
        if (!finalDesc) finalDesc = d.summary;
      }
    } else if (newActivityType === "experience") {
      const exp = experiences.find((x) => x.slug === newActivityRefSlug);
      if (exp) {
        if (!finalTitle) finalTitle = exp.title;
        if (!finalDesc) finalDesc = exp.summary;
      }
    }

    if (!finalTitle) finalTitle = "Planned Activity";

    const newAct: Activity = {
      id: `act-${Date.now()}`,
      time: newActivityTime || "12:00",
      title: finalTitle,
      description: finalDesc,
      type: newActivityType,
      referenceSlug: newActivityRefSlug,
    };

    setPlan((prev) => {
      const updatedDays = prev.days.map((day, idx) =>
        idx === activeDayIndex
          ? { ...day, activities: [...day.activities, newAct] }
          : day
      );
      const updatedPlan = { ...prev, days: updatedDays };
      try {
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_KEY, JSON.stringify(updatedPlan));
      } catch {}
      return updatedPlan;
    });

    setIsAddingActivity(false);
    setNewActivityTitle("");
    setNewActivityDesc("");
  };

  // Generate Itinerary through API with all state parameters
  const handleGeneratePlan = async () => {
    setIsAiLoading(true);
    setAiErrorNotice(null);
    setAiNotice(null);

    try {
      const res = await fetch("/api/plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate,
          endDate,
          eclipsePreference,
          pace: aiPace,
          budget: aiBudget,
          groupSize: aiGroupSize,
          interests: aiInterests,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.plan && Array.isArray(data.plan.days) && data.plan.days.length > 0) {
        setPlan(data.plan);
        setActiveDayIndex(0);
        try {
          localStorage.setItem(LOCAL_STORAGE_ACTIVE_KEY, JSON.stringify(data.plan));
        } catch {}

        if (data.notice) {
          setAiNotice(data.notice);
        } else {
          setAiNotice(`Successfully synthesized a ${data.plan.days.length}-day expedition plan.`);
        }
      } else {
        throw new Error("Invalid plan schema returned by server");
      }
    } catch (err: unknown) {
      console.error("AI Generation error:", err);
      const message = err instanceof Error ? err.message : "Network error";
      setAiErrorNotice(`Could not generate plan (${message}). Preserving your active itinerary.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Submit transparent booking inquiry
  const handleBookingInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim()) {
      alert("Please provide your name and contact email.");
      return;
    }

    const refCode = `ET-2027-${Math.floor(1000 + Math.random() * 9000)}`;
    const eclipseDay = plan.days.find((d) => d.isEclipseDay || d.date === "2027-08-02");
    const eclipseDest = destinations.find((d) => d.slug === eclipseDay?.destinationSlug);

    const inquiry: BookingInquiry = {
      id: `inquiry-${Date.now()}`,
      referenceNumber: refCode,
      submittedAt: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      tripTitle: plan.tripTitle,
      leadName: inquiryName,
      email: inquiryEmail,
      phone: inquiryPhone,
      travelerCount: aiGroupSize,
      accommodationType: inquiryStayType,
      specialRequests: inquiryNotes,
      daysCount: plan.days.length,
      eclipseBase: eclipseDest?.name || "Tozeur",
    };

    setSubmittedInquiry(inquiry);

    // Save inquiry to localStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_INQUIRIES_KEY);
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(inquiry);
      localStorage.setItem(LOCAL_STORAGE_INQUIRIES_KEY, JSON.stringify(list.slice(0, 10)));
    } catch {}
  };

  // Inspect August 2 (Eclipse Day) viewing circumstances
  const eclipseDayCircumstances = useMemo(() => {
    const eclipseDay = plan.days.find((d) => d.date === "2027-08-02" || d.isEclipseDay);
    if (!eclipseDay) return null;
    const dest = destinations.find((d) => d.slug === eclipseDay.destinationSlug);
    if (!dest) return null;
    const circ = circumstancesFor(dest);
    const isTotal = circ.visibility === "total";
    const duration = circ.centralDurationSeconds ?? 0;
    const m = Math.floor(duration / 60);
    const s = Math.round(duration % 60);
    return {
      destination: dest,
      isTotal,
      durationStr: isTotal ? `${m}m ${s.toString().padStart(2, "0")}s` : "Partial only",
      obscuration: (circ.obscuration * 100).toFixed(0),
      maxTime: circ.localTimes.maximum ?? "11:05",
    };
  }, [plan]);

  const activeDay = plan.days[activeDayIndex] || plan.days[0];
  const activeDayDest = destinations.find((d) => d.slug === activeDay?.destinationSlug);
  const activeDayAsset = activeDayDest ? getImage(activeDayDest.imageKey) : null;

  return (
    <div className="space-y-10">
      {/* Top Banner: Status & Controls */}
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-6 shadow-card lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
              Interactive Itinerary Builder
            </span>
            <span className="text-xs text-muted">·</span>
            <span className="text-xs font-medium text-muted">
              {plan.days.length} Days Planned
            </span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
            {plan.tripTitle}
          </h2>
          <p className="mt-1 text-sm text-muted max-w-2xl">{plan.summary}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSaveItinerary}
            className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2.5 text-xs font-semibold text-ivory hover:bg-navy-800 transition-colors shadow-xs"
            title="Save this itinerary to your browser"
          >
            <Save className="h-4 w-4" />
            <span>Save Itinerary</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSavedTripsOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-paper px-3.5 py-2.5 text-xs font-medium text-navy hover:bg-sand transition-colors"
            title="View previously saved itineraries"
          >
            <FolderOpen className="h-4 w-4 text-gold-600" />
            <span>My Saved Trips ({savedTrips.length})</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-paper px-3 py-2.5 text-xs font-medium text-navy hover:bg-sand transition-colors"
            title="Print or export as PDF"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-paper px-3 py-2.5 text-xs font-medium text-muted hover:text-danger hover:border-danger/30 transition-colors"
            title="Reset to default 5-day expedition"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Persistent Notification Toasts */}
      {savedNotice ? (
        <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{savedNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSavedNotice(null)}
            className="text-xs font-bold text-success hover:opacity-75"
          >
            &times;
          </button>
        </div>
      ) : null}

      {/* Suggested Destination prompt from URL */}
      {suggestedDest ? (
        <div className="flex items-center justify-between rounded-xl border border-gold-600/40 bg-gold/10 p-4 text-xs text-ink shadow-xs">
          <div className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 text-gold-600 shrink-0" />
            <span>
              You selected <strong>{suggestedDest.name}</strong> from the destination directory. Add it to Day {activeDay.dayNumber}?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddSuggestedDest}
              className="rounded-lg bg-navy px-3 py-1.5 font-semibold text-ivory hover:bg-navy-800 transition-colors"
            >
              Add to Day {activeDay.dayNumber}
            </button>
            <button
              type="button"
              onClick={() => setDismissedSuggest(true)}
              className="rounded-lg px-2.5 py-1.5 text-muted hover:text-ink"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      {/* Totality Astronomical Verification Card */}
      {eclipseDayCircumstances ? (
        <div
          className={cn(
            "flex flex-col gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between shadow-xs",
            eclipseDayCircumstances.isTotal
              ? "border-gold/60 bg-gradient-to-r from-gold/15 to-transparent"
              : "border-danger/40 bg-danger/5"
          )}
        >
          <div className="flex items-start gap-3.5">
            <span
              className={cn(
                "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold",
                eclipseDayCircumstances.isTotal
                  ? "bg-gold text-navy"
                  : "bg-danger text-ivory"
              )}
            >
              {eclipseDayCircumstances.isTotal ? "✓" : "!"}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink">
                  Astronomical Verification: 2 August 2027
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-bold uppercase",
                    eclipseDayCircumstances.isTotal
                      ? "bg-gold/25 text-gold-700"
                      : "bg-danger/20 text-danger"
                  )}
                >
                  {eclipseDayCircumstances.isTotal ? "Totality Confirmed (100%)" : "Outside Totality (Partial)"}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                {eclipseDayCircumstances.isTotal
                  ? `Your itinerary positions you in ${eclipseDayCircumstances.destination.name} for ${eclipseDayCircumstances.durationStr} of total eclipse darkness at ${eclipseDayCircumstances.maxTime} local time.`
                  : `Warning: ${eclipseDayCircumstances.destination.name} is outside the umbra path (${eclipseDayCircumstances.obscuration}% partial). Switch August 2 to Tozeur, Chott el Jerid, Djerba, Mahdia, or Kairouan to view the solar corona.`}
              </p>
            </div>
          </div>
          <Link
            href="/destinations"
            className="shrink-0 text-xs font-semibold text-navy hover:underline flex items-center gap-1"
          >
            <span>Review all totality towns</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      ) : null}

      {/* AI & Astronomical Expedition Architect Form */}
      <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-gold shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-ink">
                Expedition Architect & AI Trip Planner
              </h3>
              <p className="text-xs text-muted">
                Customizes dates, pacing, group size, and totality focus using server-side Gemini 3.8-flash and NASA eclipse calculations.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isAiLoading}
            onClick={handleGeneratePlan}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3 text-xs font-semibold text-ivory hover:bg-navy-800 disabled:opacity-60 transition-colors shadow-xs"
          >
            {isAiLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-gold" />
                <span>Architecting Expedition...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-gold" />
                <span>Generate Itinerary</span>
              </>
            )}
          </button>
        </div>

        {/* Detailed Preferences Grid */}
        <div className="mt-6 grid gap-5 border-t border-line/80 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Date Range */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">
              Start & End Dates
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <div>
                <span className="text-[0.65rem] text-muted block">Start</span>
                <input
                  type="date"
                  value={startDate}
                  min="2027-07-20"
                  max="2027-08-15"
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-line bg-ivory px-2.5 py-1.5 text-xs font-medium text-ink focus:border-navy focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[0.65rem] text-muted block">End</span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  max="2027-08-20"
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-line bg-ivory px-2.5 py-1.5 text-xs font-medium text-ink focus:border-navy focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Totality Focus */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">
              Eclipse Viewing Priority
            </label>
            <div className="mt-1.5 flex rounded-lg border border-line bg-ivory p-1">
              <button
                type="button"
                onClick={() => setEclipsePreference("totality")}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors",
                  eclipsePreference === "totality"
                    ? "bg-gold text-navy shadow-xs font-bold"
                    : "text-muted hover:text-navy"
                )}
              >
                Totality 100%
              </button>
              <button
                type="button"
                onClick={() => setEclipsePreference("flexible")}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors",
                  eclipsePreference === "flexible"
                    ? "bg-navy text-ivory shadow-xs"
                    : "text-muted hover:text-navy"
                )}
              >
                Flexible / Coast
              </button>
            </div>
            <p className="mt-1 text-[0.68rem] text-muted">
              {eclipsePreference === "totality"
                ? "Guarantees positioning inside the 100% umbra on Aug 2."
                : "Allows coastal resorts with 97–99% deep partial eclipse."}
            </p>
          </div>

          {/* Pace & Budget */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">
              Pace & Budget
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <select
                value={aiPace}
                onChange={(e) => setAiPace(e.target.value)}
                className="w-full rounded-lg border border-line bg-ivory px-2.5 py-1.5 text-xs font-medium text-ink focus:border-navy focus:outline-none"
              >
                <option value="relaxed">Relaxed</option>
                <option value="moderate">Moderate</option>
                <option value="intensive">Intensive</option>
              </select>

              <select
                value={aiBudget}
                onChange={(e) => setAiBudget(e.target.value)}
                className="w-full rounded-lg border border-line bg-ivory px-2.5 py-1.5 text-xs font-medium text-ink focus:border-navy focus:outline-none"
              >
                <option value="economy">Economy</option>
                <option value="moderate">Mid-range</option>
                <option value="luxury">Luxury / 5★</option>
              </select>
            </div>
            <span className="mt-1 text-[0.68rem] text-muted block">
              {aiPace} pace · {aiBudget} accommodation
            </span>
          </div>

          {/* Group Size */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">
              Travelers Party
            </label>
            <select
              value={aiGroupSize}
              onChange={(e) => setAiGroupSize(Number(e.target.value))}
              className="mt-1.5 w-full rounded-lg border border-line bg-ivory px-3 py-1.5 text-xs font-medium text-ink focus:border-navy focus:outline-none"
            >
              <option value={1}>Solo Explorer (1 traveler)</option>
              <option value={2}>Traveling Pair (2 travelers)</option>
              <option value={4}>Family / Small Group (4 travelers)</option>
              <option value={6}>Group Expedition (6 travelers)</option>
              <option value={10}>Large Astronomy Group (10+)</option>
            </select>
            <span className="mt-1 text-[0.68rem] text-muted block">
              Adjusts logistics & vehicle recommendations
            </span>
          </div>
        </div>

        {/* Multi-Select Interests Tags */}
        <div className="mt-5 pt-4 border-t border-line/60">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">
            Expedition Highlights & Themes
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              { id: "desert", label: "Sahara Dunes & Salt Flats" },
              { id: "culture", label: "Roman Antiquities & UNESCO Sites" },
              { id: "coast", label: "Mediterranean Coast & Islands" },
              { id: "troglodyte", label: "Berber Cave Architecture" },
              { id: "food", label: "Tunisian Gastronomy & Dates" },
              { id: "totality", label: "Dark Sky Totality Grounds" },
            ].map((interest) => {
              const active = aiInterests.includes(interest.id);
              return (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => {
                    setAiInterests((prev) =>
                      active
                        ? prev.filter((i) => i !== interest.id)
                        : [...prev, interest.id]
                    );
                  }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-navy text-ivory shadow-xs"
                      : "border border-line bg-ivory text-muted hover:text-navy hover:bg-sand/40"
                  )}
                >
                  {active ? <Check className="h-3 w-3 text-gold" /> : null}
                  <span>{interest.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI & System Feedback Banners */}
        {aiNotice ? (
          <div className="mt-5 rounded-xl border border-gold-600/30 bg-gold/10 p-4 text-xs text-ink flex items-start gap-2.5">
            <Info className="h-4 w-4 text-gold-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{aiNotice}</p>
          </div>
        ) : null}

        {aiErrorNotice ? (
          <div className="mt-5 rounded-xl border border-danger/30 bg-danger/10 p-4 text-xs text-danger flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{aiErrorNotice}</p>
          </div>
        ) : null}
      </div>

      {/* Main Day-by-Day Editor */}
      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Day Selector Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Trip Days ({plan.days.length} Total)
            </p>
            <span className="text-xs text-muted">
              {plan.days[0]?.date} &rarr; {plan.days[plan.days.length - 1]?.date}
            </span>
          </div>

          <div className="space-y-2">
            {plan.days.map((day, idx) => {
              const isSelected = idx === activeDayIndex;
              const dest = destinations.find((d) => d.slug === day.destinationSlug);
              const isEclipse = day.isEclipseDay || day.date === "2027-08-02";

              return (
                <div
                  key={day.dayNumber}
                  className={cn(
                    "group relative rounded-xl border transition-all duration-200",
                    isSelected
                      ? "border-navy bg-navy text-ivory shadow-card"
                      : "border-line bg-paper text-ink hover:bg-sand/30 hover:border-line-strong"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setActiveDayIndex(idx)}
                    className="w-full p-3.5 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-xs font-semibold uppercase tracking-wider",
                          isSelected ? "text-gold" : "text-muted"
                        )}
                      >
                        Day {day.dayNumber} · {day.date}
                      </span>
                      {isEclipse ? (
                        <span className="rounded-full bg-gold px-2 py-0.5 text-[0.65rem] font-bold text-navy">
                          Totality Climax
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 font-display text-sm font-semibold truncate">
                      {day.title}
                    </p>
                    <div
                      className={cn(
                        "mt-1 flex items-center gap-1.5 text-xs",
                        isSelected ? "text-ivory/70" : "text-muted"
                      )}
                    >
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{dest?.name ?? "Tunisia"}</span>
                      <span>· {day.activities.length} stops</span>
                    </div>
                  </button>

                  {/* Day deletion button */}
                  {plan.days.length > 1 ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDay(idx);
                      }}
                      className={cn(
                        "absolute right-2 top-2 p-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity",
                        isSelected
                          ? "text-ivory/60 hover:text-danger hover:bg-white/10"
                          : "text-muted hover:text-danger hover:bg-danger/10"
                      )}
                      title={`Delete Day ${day.dayNumber}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleAddDay}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-paper py-3 text-xs font-semibold text-muted hover:border-navy hover:text-navy transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Day {plan.days.length + 1}</span>
          </button>
        </div>

        {/* Active Day Detail & Activity Cards */}
        {activeDay ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-line bg-paper p-6 shadow-card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                      Day {activeDay.dayNumber} of {plan.days.length} · {activeDay.date}
                    </span>
                    {activeDay.isEclipseDay || activeDay.date === "2027-08-02" ? (
                      <span className="rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold text-navy">
                        Totality Climax Day
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
                    {activeDay.title}
                  </h3>
                </div>

                {/* Base Location Picker for this day */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted">Base Location:</span>
                  <select
                    value={activeDay.destinationSlug}
                    onChange={(e) => {
                      const newSlug = e.target.value;
                      setPlan((prev) => {
                        const updatedDays = prev.days.map((day, idx) =>
                          idx === activeDayIndex
                            ? { ...day, destinationSlug: newSlug }
                            : day
                        );
                        const updated = { ...prev, days: updatedDays };
                        try {
                          localStorage.setItem(LOCAL_STORAGE_ACTIVE_KEY, JSON.stringify(updated));
                        } catch {}
                        return updated;
                      });
                    }}
                    className="rounded-lg border border-line bg-ivory px-3 py-1.5 text-xs font-semibold text-ink focus:border-navy focus:outline-none"
                  >
                    {destinations.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name} ({d.region})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {activeDayAsset ? (
                <div className="relative mt-5 h-44 w-full overflow-hidden rounded-xl bg-sand">
                  <Image
                    src={activeDayAsset.url}
                    alt={activeDayAsset.alt}
                    fill
                    sizes="800px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-ivory">
                    <div>
                      <p className="text-xs font-semibold text-gold">
                        Base Destination
                      </p>
                      <p className="font-display text-lg font-semibold">
                        {activeDayDest?.name}
                      </p>
                    </div>
                    <Link
                      href={`/destinations/${activeDayDest?.slug}`}
                      className="rounded-lg bg-ivory/20 px-3 py-1 text-xs font-medium text-ivory backdrop-blur-sm hover:bg-ivory hover:text-navy transition-colors"
                    >
                      Destination Guide &rarr;
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Scheduled Activities List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display text-lg font-semibold text-ink">
                    Scheduled Stops & Activities ({activeDay.activities.length})
                  </h4>
                  <p className="text-xs text-muted">
                    Reorder stops, specify times, or insert guided desert experiences.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingActivity(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-3.5 py-2 text-xs font-semibold text-ivory hover:bg-navy-800 transition-colors shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Stop</span>
                </button>
              </div>

              {activeDay.activities.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line bg-paper p-8 text-center">
                  <Calendar className="mx-auto h-8 w-8 text-muted" />
                  <p className="mt-2 text-sm font-semibold text-ink">
                    No activities scheduled for this day yet
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Add stops from the destination catalog or reserve guided experiences.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddingActivity(true)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-sand px-3.5 py-2 text-xs font-semibold text-navy hover:bg-gold/30 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add First Stop</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeDay.activities.map((activity, actIdx) => (
                    <div
                      key={activity.id}
                      className="flex items-start justify-between rounded-xl border border-line bg-paper p-4 shadow-card hover:border-line-strong transition-colors"
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sand font-mono text-xs font-semibold text-navy">
                          {activity.time}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-ink">
                              {activity.title}
                            </span>
                            <span
                              className={cn(
                                "rounded-sm px-1.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider",
                                activity.type === "experience"
                                  ? "bg-gold/20 text-gold-700"
                                  : "bg-black/5 text-muted"
                              )}
                            >
                              {activity.type}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-muted leading-relaxed">
                            {activity.description}
                          </p>
                          {activity.referenceSlug ? (
                            <Link
                              href={
                                activity.type === "experience"
                                  ? `/experiences/${activity.referenceSlug}`
                                  : `/destinations/${activity.referenceSlug}`
                              }
                              className="mt-2 inline-flex items-center gap-1 text-[0.7rem] font-medium text-gold-600 hover:text-gold-700 hover:underline"
                            >
                              <span>Inspect {activity.type} details</span>
                              <ChevronRight className="h-3 w-3" />
                            </Link>
                          ) : null}
                        </div>
                      </div>

                      {/* Reorder and Delete Controls */}
                      <div className="flex items-center gap-1 shrink-0 ml-4">
                        <button
                          type="button"
                          disabled={actIdx === 0}
                          onClick={() => moveActivity(activeDayIndex, actIdx, "up")}
                          className="rounded-md p-1.5 text-muted hover:bg-sand hover:text-navy disabled:opacity-30"
                          title="Move earlier"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={actIdx === activeDay.activities.length - 1}
                          onClick={() => moveActivity(activeDayIndex, actIdx, "down")}
                          className="rounded-md p-1.5 text-muted hover:bg-sand hover:text-navy disabled:opacity-30"
                          title="Move later"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeActivity(activeDayIndex, actIdx)}
                          className="rounded-md p-1.5 text-muted hover:bg-danger/10 hover:text-danger"
                          title="Remove activity"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* 4-Stage Reservation Readiness & Booking Inquiry System (Rule 4) */}
      <div className="rounded-2xl border border-line bg-gradient-to-br from-paper via-sand/20 to-paper p-6 sm:p-8 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                Reservation Readiness
              </span>
              <span className="text-xs text-muted">·</span>
              <span className="text-xs font-medium text-muted">
                Transparent 4-Stage Process
              </span>
            </div>
            <h3 className="mt-1 font-display text-xl font-semibold text-ink">
              Ready to Turn This Draft into a Real Expedition?
            </h3>
            <p className="mt-1 text-xs text-muted max-w-2xl">
              Eclipse Tunisia connects your itinerary directly with licensed Tunisian incoming travel agencies, desert 4x4 drivers, and verified accommodation hosts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsInquiryModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-xs font-semibold text-ivory hover:bg-navy-800 transition-colors shadow-xs shrink-0"
          >
            <Send className="h-4 w-4 text-gold" />
            <span>Submit Operator Inquiry</span>
          </button>
        </div>

        {/* 4 Process Pillars */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-line bg-paper p-4">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-navy">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sand">
                1
              </span>
              <span>Draft Itinerary</span>
            </div>
            <p className="mt-2 text-xs font-semibold text-ink">Saved in Browser</p>
            <p className="mt-1 text-[0.7rem] text-muted leading-relaxed">
              Fully editable, zero commitment. Save locally and reorder stops at any time.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-paper p-4">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-navy">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sand">
                2
              </span>
              <span>Operator Inquiry</span>
            </div>
            <p className="mt-2 text-xs font-semibold text-ink">Direct Routing</p>
            <p className="mt-1 text-[0.7rem] text-muted leading-relaxed">
              Your dates and stops are transmitted to vetted local operators for availability checks.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-paper p-4">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-navy">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sand">
                3
              </span>
              <span>Binding Quote</span>
            </div>
            <p className="mt-2 text-xs font-semibold text-ink">Itemized Invoicing</p>
            <p className="mt-1 text-[0.7rem] text-muted leading-relaxed">
              Receive confirmed fixed rates in TND/EUR with exact vehicle, driver, and hotel names.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-paper p-4">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-navy">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sand">
                4
              </span>
              <span>Deposit & Voucher</span>
            </div>
            <p className="mt-2 text-xs font-semibold text-ink">Secured Reservation</p>
            <p className="mt-1 text-[0.7rem] text-muted leading-relaxed">
              Official travel voucher issued with emergency 24/7 contact and solar observation kit.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 text-[0.72rem] text-muted border-t border-line/60 pt-4">
          <ShieldCheck className="h-4 w-4 text-gold-600 shrink-0" />
          <span>
            <strong>No fake instant bookings:</strong> During major astronomical events, hotel capacities and desert transit permits require verified operator confirmation.
          </span>
        </div>
      </div>

      {/* Saved Trips Modal / Drawer */}
      {isSavedTripsOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-paper p-6 shadow-lift border border-line max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="font-display text-xl font-semibold text-ink">
                  My Saved Itineraries
                </h3>
                <p className="text-xs text-muted">
                  Trip plans stored securely in your browser&apos;s localStorage
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSavedTripsOpen(false)}
                className="rounded-lg p-1.5 text-muted hover:bg-sand hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
              {savedTrips.length === 0 ? (
                <div className="py-12 text-center text-muted">
                  <FolderOpen className="mx-auto h-10 w-10 text-muted/60" />
                  <p className="mt-3 text-sm font-semibold text-ink">
                    No saved itineraries yet
                  </p>
                  <p className="mt-1 text-xs">
                    Click &ldquo;Save Itinerary&rdquo; on the editor to keep drafts here.
                  </p>
                </div>
              ) : (
                savedTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-line bg-ivory p-4 hover:border-line-strong transition-colors"
                  >
                    <div>
                      <h4 className="font-display text-base font-semibold text-ink">
                        {trip.title}
                      </h4>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                        <span>{trip.daysCount} Days</span>
                        <span>·</span>
                        <span>Totality Base: {trip.totalityLocation}</span>
                        <span>·</span>
                        <span>Saved {trip.savedAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleLoadSavedTrip(trip)}
                        className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-ivory hover:bg-navy-800 transition-colors"
                      >
                        Load into Editor
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSavedTrip(trip.id)}
                        className="rounded-lg p-1.5 text-muted hover:text-danger hover:bg-danger/10"
                        title="Delete saved plan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-xs">
              <span className="text-muted">{savedTrips.length} saved plans</span>
              <button
                type="button"
                onClick={() => setIsSavedTripsOpen(false)}
                className="rounded-lg bg-sand px-4 py-2 font-medium text-navy hover:bg-sand/70"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Operator Inquiry Modal */}
      {isInquiryModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-paper p-6 shadow-lift border border-line max-h-[90vh] overflow-y-auto">
            {submittedInquiry ? (
              <div className="space-y-4 text-center py-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/20 text-success">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-ink">
                  Inquiry Transmitted Successfully
                </h3>
                <div className="rounded-xl border border-line bg-sand/30 p-4 text-left space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Inquiry Reference:</span>
                    <span className="font-mono font-bold text-navy">
                      {submittedInquiry.referenceNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Itinerary:</span>
                    <span className="font-medium text-ink">
                      {submittedInquiry.tripTitle} ({submittedInquiry.daysCount} Days)
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Lead Contact:</span>
                    <span className="font-medium text-ink">
                      {submittedInquiry.leadName} ({submittedInquiry.email})
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Eclipse Base:</span>
                    <span className="font-medium text-gold-700">
                      {submittedInquiry.eclipseBase} (Totality)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted leading-relaxed">
                  This inquiry has been logged locally with reference code <strong>{submittedInquiry.referenceNumber}</strong>. Participating Tunisian incoming agencies review inquiries within 48 hours to confirm driver permits and accommodation allocations.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsInquiryModalOpen(false);
                      setSubmittedInquiry(null);
                    }}
                    className="w-full rounded-xl bg-navy py-2.5 text-xs font-semibold text-ivory hover:bg-navy-800 transition-colors"
                  >
                    Return to Itinerary Planner
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">
                      Request Operator Proposal
                    </h3>
                    <p className="text-xs text-muted">
                      Transmit &ldquo;{plan.tripTitle}&rdquo; ({plan.days.length} Days) to local operators
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsInquiryModalOpen(false)}
                    className="rounded-lg p-1 text-muted hover:bg-sand"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleBookingInquirySubmit} className="mt-5 space-y-4 text-xs">
                  <div>
                    <label className="font-semibold uppercase tracking-wider text-muted block">
                      Lead Traveler Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Sarah Jenkins"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-line bg-ivory p-2.5 font-medium text-ink focus:border-navy focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold uppercase tracking-wider text-muted block">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="sarah@example.com"
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-line bg-ivory p-2.5 font-medium text-ink focus:border-navy focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold uppercase tracking-wider text-muted block">
                        WhatsApp / Phone (optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 555 0192"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-line bg-ivory p-2.5 font-medium text-ink focus:border-navy focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold uppercase tracking-wider text-muted block">
                      Preferred Accommodation Style
                    </label>
                    <select
                      value={inquiryStayType}
                      onChange={(e) => setInquiryStayType(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-line bg-ivory p-2.5 font-medium text-ink focus:border-navy focus:outline-none"
                    >
                      <option value="desert-camp">Authentic Saharan Bivouac & Desert Camp</option>
                      <option value="oasis-riad">Traditional Medina Riad & Oasis Hotel</option>
                      <option value="premium-5star">5-Star Luxury Resort (Tozeur / Djerba)</option>
                      <option value="budget-guesthouse">Budget Berber Guesthouse / Maison d&apos;hôtes</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold uppercase tracking-wider text-muted block">
                      Special Requirements (Optical gear, dietary, private 4x4)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Traveling with telescope tripod; need quiet open ground with unhindered eastern horizon on eclipse morning."
                      value={inquiryNotes}
                      onChange={(e) => setInquiryNotes(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-line bg-ivory p-2.5 font-medium text-ink focus:border-navy focus:outline-none"
                    />
                  </div>

                  <div className="rounded-lg border border-line bg-sand/20 p-3 text-[0.7rem] text-muted leading-relaxed">
                    <strong>Sample Reservation Notice:</strong> Submitting this inquiry creates a realistic booking request for review. No payment or credit card is processed at this stage.
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                    <button
                      type="button"
                      onClick={() => setIsInquiryModalOpen(false)}
                      className="rounded-lg border border-line px-4 py-2 font-medium text-muted hover:bg-sand"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-navy px-5 py-2 font-semibold text-ivory hover:bg-navy-800 transition-colors shadow-xs"
                    >
                      Transmit Inquiry
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Add Activity Modal */}
      {isAddingActivity ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-paper p-6 shadow-lift border border-line">
            <h3 className="font-display text-xl font-semibold text-ink">
              Add Activity to Day {activeDay.dayNumber}
            </h3>
            <p className="mt-1 text-xs text-muted">
              Choose from verified Tunisian destinations, excursions, or write a custom activity.
            </p>

            <form onSubmit={handleAddActivitySubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Activity Type
                </label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {(["destination", "experience", "custom"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewActivityType(t)}
                      className={cn(
                        "rounded-lg py-2 text-xs font-medium capitalize border transition-colors",
                        newActivityType === t
                          ? "bg-navy text-ivory border-navy"
                          : "border-line bg-ivory text-muted hover:text-ink"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {newActivityType === "destination" ? (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Select Destination
                  </label>
                  <select
                    value={newActivityRefSlug}
                    onChange={(e) => setNewActivityRefSlug(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-line bg-ivory p-2.5 text-xs font-medium text-ink focus:border-navy focus:outline-none"
                  >
                    {destinations.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name} ({d.region})
                      </option>
                    ))}
                  </select>
                </div>
              ) : newActivityType === "experience" ? (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Select Experience
                  </label>
                  <select
                    value={newActivityRefSlug}
                    onChange={(e) => setNewActivityRefSlug(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-line bg-ivory p-2.5 text-xs font-medium text-ink focus:border-navy focus:outline-none"
                  >
                    {experiences.map((exp) => (
                      <option key={exp.slug} value={exp.slug}>
                        {exp.title} ({exp.priceAmount} {exp.priceCurrency})
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newActivityTime}
                    onChange={(e) => setNewActivityTime(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-line bg-ivory p-2 text-xs font-medium text-ink focus:border-navy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Custom Title (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Leave blank for default"
                    value={newActivityTitle}
                    onChange={(e) => setNewActivityTitle(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-line bg-ivory p-2 text-xs font-medium text-ink focus:border-navy focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Notes / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional timing notes, meet-up details, or personal plans"
                  value={newActivityDesc}
                  onChange={(e) => setNewActivityDesc(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-line bg-ivory p-2 text-xs font-medium text-ink focus:border-navy focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingActivity(false)}
                  className="rounded-lg border border-line px-4 py-2 text-xs font-medium text-muted hover:bg-sand transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-navy px-4 py-2 text-xs font-semibold text-ivory hover:bg-navy-800 transition-colors"
                >
                  Add to Day {activeDay.dayNumber}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
