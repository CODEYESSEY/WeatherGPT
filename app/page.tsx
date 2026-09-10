"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface LocationData {
  name: string;
  region: string;
  coords: [number, number];
  temp: number;
  feels: number;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  wind: string;
  precip: number;
  pressure: number;
  uv: string | number;
  aqi: number | null;
  visibility: string | number;
  insight: string;
  hourlyTemps: number[];
  hourlyPrecip: number[];
  hourlyLabels?: string[];
  daily: Array<{
    day: string;
    icon: string;
    condition: string;
    high: number;
    low: number;
    pop: string;
  }>;
}

interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
}

interface WarningItem {
  type: "SEVERE" | "WATCH" | "NORMAL";
  icon: string;
  title: string;
  message: string;
  value: string;
}

const DEFAULT_LOCATIONS: Record<string, LocationData> = {
  ghaziabad: {
    name: "Ghaziabad",
    region: "Uttar Pradesh, India",
    coords: [28.6692, 77.4538],
    temp: 31,
    feels: 34,
    condition: "Partly Cloudy",
    high: 34,
    low: 26,
    humidity: 78,
    wind: "14 km/h E",
    precip: 65,
    pressure: 1008,
    uv: "6 (Mod)",
    aqi: 168,
    visibility: "4.5 km",
    insight:
      "Rain probability increases through late evening. Outdoor activities are most favorable before 06:00 PM. High atmospheric humidity will maintain an elevated heat index.",
    hourlyTemps: [29, 30, 31, 33, 34, 32, 30, 28, 27],
    hourlyPrecip: [10, 15, 20, 45, 65, 80, 70, 40, 20],
    hourlyLabels: ["12 PM", "03 PM", "06 PM", "09 PM", "12 AM", "03 AM", "06 AM", "09 AM", "12 PM"],
    daily: [
      { day: "Today", icon: "fa-cloud-sun-rain", condition: "Storms late", high: 34, low: 26, pop: "65%" },
      { day: "Thu", icon: "fa-cloud-showers-heavy", condition: "Heavy Rain", high: 31, low: 25, pop: "85%" },
      { day: "Fri", icon: "fa-cloud-sun", condition: "Partly Cloudy", high: 33, low: 26, pop: "20%" },
      { day: "Sat", icon: "fa-sun", condition: "Mostly Sunny", high: 35, low: 27, pop: "10%" },
      { day: "Sun", icon: "fa-cloud-bolt", condition: "Thunderstorms", high: 32, low: 25, pop: "75%" },
      { day: "Mon", icon: "fa-cloud", condition: "Overcast", high: 30, low: 24, pop: "40%" },
      { day: "Tue", icon: "fa-sun", condition: "Clear Sky", high: 34, low: 26, pop: "05%" },
    ],
  },
  delhi: {
    name: "Delhi NCR",
    region: "National Capital Territory, India",
    coords: [28.6139, 77.209],
    temp: 33,
    feels: 37,
    condition: "Hazy & Warm",
    high: 36,
    low: 27,
    humidity: 72,
    wind: "12 km/h SE",
    precip: 40,
    pressure: 1006,
    uv: "8 (High)",
    aqi: 210,
    visibility: "3.8 km",
    insight:
      "Air quality degradation highlighted alongside rising heat conditions. Hydration alerts active for outdoor field crews.",
    hourlyTemps: [30, 32, 33, 35, 36, 34, 32, 30, 29],
    hourlyPrecip: [5, 10, 15, 20, 40, 50, 30, 15, 10],
    hourlyLabels: ["12 PM", "03 PM", "06 PM", "09 PM", "12 AM", "03 AM", "06 AM", "09 AM", "12 PM"],
    daily: [
      { day: "Today", icon: "fa-smog", condition: "Haze / Heat", high: 36, low: 27, pop: "40%" },
      { day: "Thu", icon: "fa-cloud-sun-rain", condition: "Scattered Rain", high: 33, low: 26, pop: "60%" },
      { day: "Fri", icon: "fa-cloud", condition: "Cloudy", high: 34, low: 26, pop: "30%" },
      { day: "Sat", icon: "fa-sun", condition: "Sunny", high: 37, low: 28, pop: "00%" },
      { day: "Sun", icon: "fa-cloud-sun", condition: "Passing Clouds", high: 36, low: 27, pop: "15%" },
      { day: "Mon", icon: "fa-cloud-bolt", condition: "Late Storms", high: 32, low: 25, pop: "70%" },
      { day: "Tue", icon: "fa-sun", condition: "Clear", high: 35, low: 26, pop: "10%" },
    ],
  },
  mumbai: {
    name: "Mumbai",
    region: "Maharashtra, India",
    coords: [19.076, 72.8777],
    temp: 29,
    feels: 33,
    condition: "Heavy Coastal Rain",
    high: 30,
    low: 25,
    humidity: 88,
    wind: "28 km/h SW",
    precip: 90,
    pressure: 1004,
    uv: "4 (Mod)",
    aqi: 65,
    visibility: "2.5 km",
    insight:
      "Monsoon activity peak. Marine warnings deployed along coastal shipping routes. High tide alignment expected at 17:30.",
    hourlyTemps: [28, 28, 29, 30, 29, 28, 28, 27, 27],
    hourlyPrecip: [80, 85, 90, 95, 90, 85, 75, 70, 60],
    hourlyLabels: ["12 PM", "03 PM", "06 PM", "09 PM", "12 AM", "03 AM", "06 AM", "09 AM", "12 PM"],
    daily: [
      { day: "Today", icon: "fa-cloud-showers-heavy", condition: "Monsoon Rain", high: 30, low: 25, pop: "90%" },
      { day: "Thu", icon: "fa-cloud-bolt", condition: "Heavy Storms", high: 29, low: 24, pop: "95%" },
      { day: "Fri", icon: "fa-cloud-showers-heavy", condition: "Continuous Rain", high: 29, low: 25, pop: "85%" },
      { day: "Sat", icon: "fa-cloud-sun-rain", condition: "Breaks in Rain", high: 31, low: 26, pop: "60%" },
      { day: "Sun", icon: "fa-cloud-showers-heavy", condition: "Showers", high: 30, low: 25, pop: "70%" },
      { day: "Mon", icon: "fa-cloud-sun", condition: "Humid & Mixed", high: 32, low: 26, pop: "40%" },
      { day: "Tue", icon: "fa-cloud-showers-heavy", condition: "Rain", high: 30, low: 25, pop: "75%" },
    ],
  },
};

export default function WeatherDashboard() {
  const [locations, setLocations] = useState<Record<string, LocationData>>(DEFAULT_LOCATIONS);
  const [currentLocKey, setCurrentLocKey] = useState<string>("ghaziabad");
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [isHindi, setIsHindi] = useState<boolean>(false);
  const [activeHourlyTab, setActiveHourlyTab] = useState<"temp" | "precip">("temp");
  const [activeMapLayer, setActiveMapLayer] = useState<"rain" | "wind" | "hazards">("rain");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [systemMode, setSystemMode] = useState<string>("LIVE WEATHER");
  const [toastMessage, setToastMessage] = useState<string>("");
  const [chatInput, setChatInput] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>("Just now");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "assistant",
      text: "Hello! I am WeatherGPT. I analyze real-time climate telemetry, radar signals, and predictive AI models. How can I assist your plans today?",
    },
  ]);

  const mapInstanceRef = useRef<any>(null);
  const mapOverlayRef = useRef<any>(null);
  const chartInstanceRef = useRef<any>(null);
  const searchTimerRef = useRef<any>(null);
  const toastTimerRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const loc = locations[currentLocKey] || DEFAULT_LOCATIONS.ghaziabad;

  // Temperature conversions
  const formatTempVal = (valC: number | string) => {
    const num = Number(valC);
    if (!Number.isFinite(num)) return "—";
    if (unit === "F") return Math.round((num * 9) / 5 + 32);
    return Math.round(num);
  };

  const formatTemp = (valC: number | string) => {
    return `${formatTempVal(valC)}°${unit}`;
  };

  const formatUV = (value: string | number) => {
    if (value === null || value === undefined || value === "") return "—";
    const num = Number.parseFloat(String(value));
    if (!Number.isFinite(num)) return String(value);
    const label = num >= 11 ? "Extreme" : num >= 8 ? "Very High" : num >= 6 ? "High" : num >= 3 ? "Mod" : "Low";
    return `${Math.round(num)} (${label})`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage("");
    }, 3200);
  };

  // Live Weather Fetcher
  const loadRealWeather = async (key: string, forceToast = false) => {
    const targetLoc = locations[key] || DEFAULT_LOCATIONS[key];
    if (!targetLoc) return;

    const [latitude, longitude] = targetLoc.coords;
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      "&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,pressure_msl,weather_code" +
      "&hourly=temperature_2m,apparent_temperature,precipitation_probability,uv_index,visibility,wind_speed_10m" +
      "&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max" +
      "&forecast_days=7&timezone=auto";
    const airUrl =
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}` +
      "&current=us_aqi,pm2_5,pm10&timezone=auto";

    setIsLoadingWeather(true);
    try {
      const [weatherRes, airRes] = await Promise.all([fetch(weatherUrl), fetch(airUrl)]);
      if (!weatherRes.ok) throw new Error(`Open-Meteo returned ${weatherRes.status}`);

      const json = await weatherRes.json();
      const airJson = airRes.ok ? await airRes.json() : null;
      const c = json.current;
      if (!c) throw new Error("No current-conditions block in response");

      const hourIndex = findCurrentHourIndex(json.hourly?.time, c.time);
      const h = json.hourly || {};
      const daily = json.daily || {};

      const updated: LocationData = {
        ...targetLoc,
        temp: roundOr(targetLoc.temp, c.temperature_2m),
        feels: roundOr(targetLoc.feels, c.apparent_temperature),
        humidity: roundOr(targetLoc.humidity, c.relative_humidity_2m),
        wind: `${roundOr(0, c.wind_speed_10m)} km/h ${degreesToCardinal(c.wind_direction_10m)}`,
        pressure: roundOr(targetLoc.pressure, c.pressure_msl),
        condition: getCondition(c.weather_code),
        precip: roundOr(targetLoc.precip, h.precipitation_probability?.[hourIndex]),
        uv: h.uv_index?.[hourIndex] ?? targetLoc.uv,
        visibility: Number.isFinite(h.visibility?.[hourIndex])
          ? `${(h.visibility[hourIndex] / 1000).toFixed(1)} km`
          : targetLoc.visibility,
        high: roundOr(targetLoc.high, daily.temperature_2m_max?.[0]),
        low: roundOr(targetLoc.low, daily.temperature_2m_min?.[0]),
        aqi: airJson?.current?.us_aqi ? roundOr(targetLoc.aqi, airJson.current.us_aqi) : targetLoc.aqi,
      };

      const chartStart = hourIndex;
      const chartIndexes = Array.from({ length: 9 }, (_, index) =>
        Math.min(chartStart + index * 3, (h.time?.length || 1) - 1)
      );
      const liveTemps = chartIndexes.map((idx) => h.temperature_2m?.[idx]).filter(Number.isFinite);
      const livePrecip = chartIndexes.map((idx) => h.precipitation_probability?.[idx]).filter(Number.isFinite);

      if (liveTemps.length) updated.hourlyTemps = liveTemps;
      if (livePrecip.length) updated.hourlyPrecip = livePrecip;
      if (h.time?.length) updated.hourlyLabels = chartIndexes.map((idx) => formatHourLabel(h.time?.[idx]));

      if (daily.time?.length) {
        updated.daily = daily.time.slice(0, 7).map((date: string, index: number) => ({
          day:
            index === 0
              ? "Today"
              : new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", { weekday: "short" }),
          icon: getWeatherIcon(daily.weather_code?.[index]),
          condition: getCondition(daily.weather_code?.[index]),
          high: roundOr(targetLoc.high, daily.temperature_2m_max?.[index]),
          low: roundOr(targetLoc.low, daily.temperature_2m_min?.[index]),
          pop: `${Math.round(daily.precipitation_probability_max?.[index] ?? 0)}%`,
        }));
      }

      updated.insight = buildInsight(updated);

      setLocations((prev) => ({ ...prev, [key]: updated }));
      setSystemMode("LIVE WEATHER");
      setLastUpdatedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

      if (forceToast) showToast(`Updated ${updated.name} with live conditions.`);
    } catch (err: any) {
      console.warn("Open-Meteo telemetry fallback:", err?.message);
      setSystemMode("FALLBACK MODE");
      if (forceToast) showToast("Live weather unavailable; using offline cache.");
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // City Search Handler
  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    if (!val || val.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            val.trim()
          )}&count=6&language=en&format=json`
        );
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error("Geocoding failed:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const selectCity = (city: any) => {
    const key = `city-${city.latitude}-${city.longitude}`;
    const newRecord: LocationData = {
      name: city.name,
      region: [city.admin1, city.country].filter(Boolean).join(", ") || "Selected location",
      coords: [city.latitude, city.longitude],
      temp: 0,
      feels: 0,
      condition: "Loading weather…",
      high: 0,
      low: 0,
      humidity: 0,
      wind: "—",
      precip: 0,
      pressure: 1012,
      uv: "—",
      aqi: null,
      visibility: "—",
      insight: "Fetching live conditions for this location…",
      hourlyTemps: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      hourlyPrecip: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      daily: [{ day: "Today", icon: "fa-cloud", condition: "Loading…", high: 0, low: 0, pop: "—" }],
    };

    setLocations((prev) => ({ ...prev, [key]: newRecord }));
    setCurrentLocKey(key);
    setSearchQuery("");
    setSearchResults([]);
    loadRealWeather(key, true);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      showToast("Location access is not supported by this browser.");
      return;
    }
    showToast("Requesting GPS coordinates…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const key = `device-${coords.latitude.toFixed(4)}-${coords.longitude.toFixed(4)}`;
        const newRecord: LocationData = {
          name: "My Location",
          region: "Current Device Location",
          coords: [coords.latitude, coords.longitude],
          temp: 0,
          feels: 0,
          condition: "Loading weather…",
          high: 0,
          low: 0,
          humidity: 0,
          wind: "—",
          precip: 0,
          pressure: 1012,
          uv: "—",
          aqi: null,
          visibility: "—",
          insight: "Fetching live conditions for your location…",
          hourlyTemps: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          hourlyPrecip: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          daily: [{ day: "Today", icon: "fa-cloud", condition: "Loading…", high: 0, low: 0, pop: "—" }],
        };
        setLocations((prev) => ({ ...prev, [key]: newRecord }));
        setCurrentLocKey(key);
        setIsLocationModalOpen(false);
        loadRealWeather(key, true);
      },
      () => showToast("Location permission unavailable. Select a city instead."),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  // Voice Recognition
  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Voice input is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = isHindi ? "hi-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setChatInput(transcript);
      setIsListening(false);
      handleSendChat(transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
      showToast("Voice input was not captured. Try typing instead.");
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.start();
  };

  // Chat Submission Handler
  const handleSendChat = async (overridePrompt?: string) => {
    const query = (overridePrompt || chatInput).trim();
    if (!query || isAiLoading) return;

    const userMsg: ChatMessage = { sender: "user", text: query };
    const pendingMsg: ChatMessage = { sender: "assistant", text: "⏳ Analyzing weather telemetry..." };

    setChatMessages((prev) => [...prev, userMsg, pendingMsg]);
    setChatInput("");
    setIsAiLoading(true);

    const temp = Number(loc.temp) || 0;
    const humidity = Number(loc.humidity) || 0;
    const rain = Number(loc.precip) || 0;
    const wind = parseFloat(loc.wind) || 0;
    const aqi = Number(loc.aqi) || 0;
    const visibility = parseFloat(String(loc.visibility)) || 0;

    let travelRisk = rain >= 70 || wind >= 40 || (visibility > 0 && visibility < 2) ? "HIGH" : rain >= 40 || wind >= 25 ? "MODERATE" : "LOW";
    let floodRisk = rain >= 70 ? "HIGH" : rain >= 40 ? "MODERATE" : "LOW";
    let weatherRisk = wind >= 45 || rain >= 80 ? "HIGH" : wind >= 30 || rain >= 50 ? "MODERATE" : "LOW";

    const languageInstruction = isHindi
      ? "Reply completely in Hindi using Devanagari script. Keep technical weather terms clear and actionable."
      : "Reply in concise, clear English.";

    const prompt = `
You are WeatherGPT, a world-class AI meteorologist and climate decision-support system for India.

REAL-TIME WEATHER TELEMETRY:
• Location: ${loc.name}, ${loc.region} (Coordinates: ${loc.coords[0].toFixed(4)}°N, ${loc.coords[1].toFixed(4)}°E)
• Condition: ${loc.condition}
• Temperature: ${temp}°C (Feels like: ${loc.feels}°C)
• High / Low Today: ${loc.high}°C / ${loc.low}°C
• Relative Humidity: ${humidity}%
• Precipitation Probability: ${rain}%
• Wind Velocity: ${loc.wind} (Speed: ${wind} km/h)
• Atmospheric Pressure: ${loc.pressure} hPa
• Air Quality Index: US AQI ${aqi || "N/A"}
• Visibility: ${visibility} km
• UV Index: ${loc.uv}

COMPUTED SECTOR RISK ANALYSIS:
• Travel Safety Risk: ${travelRisk}
• Urban / Local Flood Risk: ${floodRisk}
• Extreme Weather Risk: ${weatherRisk}

USER QUERY:
"${query}"

INSTRUCTIONS:
1. Provide a precise, highly intelligent answer directly grounded in the real-time telemetry above.
2. If the user asks about travel, roads, or commuting, analyze highway visibility, wind gust effects, and rainfall delays.
3. If the user asks about agriculture or farming, advise on irrigation scheduling, pesticide spray safety windows, and crop stress.
4. If the user asks about rain or storms, specify timing and probability directly from data.
5. ${languageInstruction}

FORMAT YOUR RESPONSE CLEARLY AS:
🌤 **Situation Analysis**: [Concise status based on real numbers]
⚠️ **Risk Assessment**: [Specific risks across travel, health, or agriculture]
💡 **Actionable Recommendations**: [Clear, high-value steps for the user]
📊 **Scientific Rationale**: [Atmospheric pressure, humidity, wind indicators]
`;

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

      const answer = data.text || "Analysis complete.";
      const providerBadge = data.provider ? `\n\n⚡ ${data.provider}` : "";
      setChatMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { sender: "assistant", text: answer + providerBadge };
        return next;
      });
    } catch (err: any) {
      console.error("AI Error:", err);
      setChatMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          sender: "assistant",
          text: `🌤 Situation: ${loc.condition} in ${loc.name}, ${loc.temp}°C with ${loc.precip}% rain chance.\n⚠️ Risk: ${travelRisk}\n💡 Recommendation: ${
            loc.precip >= 50 ? "Carry rain protection and avoid low-lying roads." : "Conditions are generally suitable for normal activities."
          }\n📊 Reason: Atmospheric moisture is at ${loc.humidity}% with wind speed of ${loc.wind}.`,
        };
        return next;
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    loadRealWeather(currentLocKey);
  }, [currentLocKey]);

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Leaflet Map Init & Sync
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initLeaflet = () => {
      const L = (window as any).L;
      if (!L) return;

      if (!mapInstanceRef.current) {
        const mapContainer = document.getElementById("weatherMap");
        if (!mapContainer) return;

        mapInstanceRef.current = L.map("weatherMap").setView(loc.coords, 11);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);
      } else {
        mapInstanceRef.current.setView(loc.coords, 11);
      }

      // Overlays
      if (mapOverlayRef.current) {
        mapInstanceRef.current.removeLayer(mapOverlayRef.current);
      }

      let overlay;
      if (activeMapLayer === "rain") {
        overlay = L.circle(loc.coords, {
          color: "#38bdf8",
          fillColor: "#0284c7",
          fillOpacity: 0.35,
          radius: 9000,
        });
      } else if (activeMapLayer === "wind") {
        overlay = L.polygon(
          [
            [loc.coords[0] + 0.05, loc.coords[1] - 0.05],
            [loc.coords[0] + 0.08, loc.coords[1] + 0.02],
            [loc.coords[0] - 0.02, loc.coords[1] + 0.06],
          ],
          { color: "#6366f1", fillColor: "#818cf8", fillOpacity: 0.35 }
        );
      } else if (activeMapLayer === "hazards") {
        overlay = L.circle(loc.coords, {
          color: "#ef4444",
          fillColor: "#f87171",
          fillOpacity: 0.45,
          radius: 6000,
        });
      }

      if (overlay) {
        overlay.addTo(mapInstanceRef.current);
        mapOverlayRef.current = overlay;
      }
    };

    const timer = setTimeout(initLeaflet, 400);
    return () => clearTimeout(timer);
  }, [loc.coords, activeMapLayer]);

  // Chart.js Init & Sync
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initChart = () => {
      const Chart = (window as any).Chart;
      if (!Chart) return;

      const canvas = document.getElementById("hourlyChart") as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const isTemp = activeHourlyTab === "temp";
      const labels = loc.hourlyLabels || ["12 PM", "03 PM", "06 PM", "09 PM", "12 AM", "03 AM", "06 AM", "09 AM", "12 PM"];
      const data = isTemp ? loc.hourlyTemps.map((t) => formatTempVal(t)) : loc.hourlyPrecip;

      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: isTemp ? `Temperature (°${unit})` : "Precipitation Probability (%)",
              data: data,
              borderColor: isTemp ? "#38bdf8" : "#6366f1",
              backgroundColor: isTemp ? "rgba(56, 189, 248, 0.12)" : "rgba(99, 102, 241, 0.15)",
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointBackgroundColor: isTemp ? "#38bdf8" : "#6366f1",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: "index",
              intersect: false,
              backgroundColor: "#161c26",
              titleColor: "#f8fafc",
              bodyColor: "#a5f3fc",
              borderColor: "rgba(255,255,255,0.1)",
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              grid: { color: "rgba(255, 255, 255, 0.05)" },
              ticks: { color: "#64748b" },
            },
            y: {
              grid: { color: "rgba(255, 255, 255, 0.05)" },
              ticks: { color: "#64748b" },
            },
          },
        },
      });
    };

    const timer = setTimeout(initChart, 350);
    return () => clearTimeout(timer);
  }, [loc.hourlyTemps, loc.hourlyPrecip, activeHourlyTab, unit]);

  // Sector decision support calculations
  const tempNum = Number(loc.temp) || 0;
  const humidityNum = Number(loc.humidity) || 0;
  const rainNum = Number(loc.precip) || 0;
  const windNum = parseFloat(loc.wind) || 0;
  const aqiNum = Number(loc.aqi) || 0;
  const visNum = parseFloat(String(loc.visibility)) || 0;

  const irrigation = rainNum >= 60 ? "Low — Delay" : humidityNum >= 75 ? "Moderate" : "High — Irrigate";
  const spray = rainNum >= 50 || windNum >= 25 ? "Unfavorable" : "Favorable";
  const cropStress = tempNum >= 38 || humidityNum < 35 ? "High" : tempNum >= 32 || humidityNum >= 80 ? "Moderate" : "Low";
  const floodRisk = rainNum >= 70 ? "High" : rainNum >= 40 ? "Moderate" : "Low";
  const drainage = rainNum >= 70 ? "High Load" : rainNum >= 40 ? "Moderate Load" : "Normal";
  const emergency = rainNum >= 70 || windNum >= 45 ? "Alert" : rainNum >= 40 || windNum >= 30 ? "Watch" : "Standby";
  const visibilityRisk = visNum > 0 && visNum < 2 ? "Severe" : visNum > 0 && visNum < 5 ? "Reduced" : "Good";
  const travelRisk = rainNum >= 70 || windNum >= 40 || (visNum > 0 && visNum < 2) ? "High" : rainNum >= 40 || windNum >= 25 ? "Moderate" : "Low";
  const transitDelay = travelRisk === "High" ? "+30+ mins" : travelRisk === "Moderate" ? "+15-30 mins" : "Minimal";
  const weatherRisk = windNum >= 45 || rainNum >= 80 ? "High" : windNum >= 30 || rainNum >= 50 ? "Moderate" : "Low";
  const windKnots = Math.round(windNum * 0.539957);

  // Early warnings generator
  const warnings: WarningItem[] = [];
  if (rainNum >= 70) {
    warnings.push({
      type: "SEVERE",
      icon: "fa-cloud-showers-heavy",
      title: "Heavy Rain Warning",
      message: `Rain probability is ${rainNum}%. High risk of waterlogging and slick roads.`,
      value: `${rainNum}%`,
    });
  } else if (rainNum >= 40) {
    warnings.push({
      type: "WATCH",
      icon: "fa-cloud-rain",
      title: "Rain Advisory",
      message: `Rain probability is ${rainNum}%. Carry rain gear and exercise caution.`,
      value: `${rainNum}%`,
    });
  }

  if (windNum >= 45) {
    warnings.push({
      type: "SEVERE",
      icon: "fa-wind",
      title: "High Wind Warning",
      message: `Wind gusts reached ${windNum} km/h. High-profile vehicles should use caution.`,
      value: `${windNum} km/h`,
    });
  } else if (windNum >= 30) {
    warnings.push({
      type: "WATCH",
      icon: "fa-wind",
      title: "Breezy Conditions",
      message: `Wind speed is ${windNum} km/h.`,
      value: `${windNum} km/h`,
    });
  }

  if (aqiNum >= 200) {
    warnings.push({
      type: "SEVERE",
      icon: "fa-smog",
      title: "Poor Air Quality",
      message: `AQI is ${aqiNum}. Sensitive groups should avoid prolonged outdoor exposure.`,
      value: `AQI ${aqiNum}`,
    });
  } else if (aqiNum >= 150) {
    warnings.push({
      type: "WATCH",
      icon: "fa-smog",
      title: "Air Quality Advisory",
      message: `AQI is ${aqiNum}. Consider limiting unnecessary outdoor exercise.`,
      value: `AQI ${aqiNum}`,
    });
  }

  if (tempNum >= 40) {
    warnings.push({
      type: "SEVERE",
      icon: "fa-temperature-high",
      title: "Extreme Heat Warning",
      message: `Temperature is ${tempNum}°C. Stay hydrated and avoid direct midday sun.`,
      value: `${tempNum}°C`,
    });
  }

  if (warnings.length === 0) {
    warnings.push({
      type: "NORMAL",
      icon: "fa-circle-check",
      title: "No Major Weather Warnings",
      message: "Current conditions are within normal parameters.",
      value: "NORMAL",
    });
  }

  return (
    <>
      {/* SYSTEM STATUS BANNER */}
      <div className="system-banner">
        <div>
          <i className="fa-solid fa-satellite-dish" style={{ marginRight: 6 }}></i>
          <span>{systemMode}</span> — Live Open-Meteo telemetry with Gemini & Groq multi-model AI synthesis.
        </div>
      </div>

      {/* STICKY TOP NAVIGATION */}
      <header className="sticky-nav">
        <div className="nav-container">
          <Link href="/" className="brand-group">
            <div className="brand-icon">
              <i className="fa-solid fa-bolt-lightning"></i>
            </div>
            <div className="brand-text">
              <h1>WeatherGPT</h1>
              <p>Conversational Climate & Weather Intelligence</p>
            </div>
          </Link>

          <div className="nav-controls">
            {/* Search City */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-subtle)",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <i className="fa-solid fa-magnifying-glass" style={{ color: "var(--accent-electric)" }}></i>
                <input
                  type="text"
                  placeholder="Search city..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-primary)",
                    fontSize: "0.85rem",
                    outline: "none",
                    width: 160,
                  }}
                />
              </div>

              {searchResults.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 42,
                    left: 0,
                    width: 260,
                    background: "var(--bg-surface-1)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "var(--radius-md)",
                    zIndex: 9999,
                    maxHeight: 220,
                    overflowY: "auto",
                    boxShadow: "var(--shadow-subtle)",
                  }}
                >
                  {searchResults.map((city, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="search-result"
                      onClick={() => selectCity(city)}
                    >
                      <strong>{city.name}</strong>
                      <small>{[city.admin1, city.country].filter(Boolean).join(", ")}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Location Selector Trigger */}
            <div className="location-picker" onClick={() => setIsLocationModalOpen(true)}>
              <i className="fa-solid fa-location-dot"></i>
              <span className="mono">{loc.name}</span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}></i>
            </div>

            {/* Unit Toggle */}
            <div className="unit-toggle">
              <button
                className={`unit-btn ${unit === "C" ? "active" : ""}`}
                onClick={() => setUnit("C")}
              >
                °C
              </button>
              <button
                className={`unit-btn ${unit === "F" ? "active" : ""}`}
                onClick={() => setUnit("F")}
              >
                °F
              </button>
            </div>

            {/* Hindi Switch */}
            <button
              onClick={() => {
                const next = !isHindi;
                setIsHindi(next);
                showToast(next ? "Hindi AI mode active (हिंदी)" : "English AI mode active");
              }}
              style={{
                background: "var(--bg-surface-2)",
                border: isHindi ? "1px solid var(--accent-electric)" : "1px solid var(--border-subtle)",
                color: isHindi ? "var(--accent-electric)" : "var(--text-secondary)",
                padding: "4px 10px",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              हिं
            </button>

            {/* Notification Bell */}
            <div style={{ position: "relative" }}>
              <button
                className="icon-btn"
                title="Notifications"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
              >
                <i className="fa-regular fa-bell"></i>
                {warnings.length > 0 && warnings[0].type !== "NORMAL" && <div className="dot"></div>}
              </button>

              {isNotifOpen && (
                <div className="notification-dropdown active">
                  <div className="label-caps">Active System Alerts</div>
                  {warnings.map((w, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: "0.8rem",
                        borderBottom: i < warnings.length - 1 ? "1px solid var(--border-subtle)" : "none",
                        paddingBottom: 6,
                      }}
                    >
                      <strong
                        style={{
                          color:
                            w.type === "SEVERE"
                              ? "var(--status-severe)"
                              : w.type === "WATCH"
                              ? "var(--status-warning)"
                              : "var(--status-success)",
                        }}
                      >
                        {w.title}
                      </strong>
                      <p style={{ color: "var(--text-secondary)" }}>{w.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Auth / Login Page Link */}
            <Link href="/login" className="icon-btn" title="Login / Account">
              <i className="fa-regular fa-user"></i>
            </Link>

            {/* Refresh Button */}
            <button
              className={`icon-btn ${isLoadingWeather ? "is-loading" : ""}`}
              title="Refresh weather data"
              onClick={() => loadRealWeather(currentLocKey, true)}
            >
              <i className="fa-solid fa-rotate"></i>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTAINER */}
      <main className="dashboard-container">
        {/* 1. HERO WEATHER SECTION */}
        <section className="hero-section">
          <div className="hero-bg-visual"></div>
          <div className="hero-header-top">
            <div className="hero-location">
              <h2>
                <span>{loc.name}</span>{" "}
                <span className="badge badge-ai">
                  <i className="fa-solid fa-shield-halved"></i> LIVE INTELLIGENCE
                </span>
              </h2>
              <p>
                {loc.region} • <span className="mono">{loc.coords[0].toFixed(4)}° N, {loc.coords[1].toFixed(4)}° E</span>
              </p>
            </div>
            <div className="mono" style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
              Updated: {lastUpdatedTime}
            </div>
          </div>

          <div className="hero-temp-block">
            <div className="main-temp">{formatTemp(loc.temp)}</div>
            <div className="weather-status-box">
              <div className="weather-condition">{loc.condition}</div>
              <div className="feels-like">
                Feels like <span>{formatTemp(loc.feels)}</span>
              </div>
            </div>
          </div>

          <div className="hero-secondary-metrics">
            <div className="hero-mini-metric">
              <span className="label-caps">High / Low</span>
              <span className="val">
                {formatTempVal(loc.high)}° / {formatTempVal(loc.low)}°
              </span>
            </div>
            <div className="hero-mini-metric">
              <span className="label-caps">Humidity</span>
              <span className="val">{loc.humidity}%</span>
            </div>
            <div className="hero-mini-metric">
              <span className="label-caps">Wind</span>
              <span className="val">{loc.wind}</span>
            </div>
            <div className="hero-mini-metric">
              <span className="label-caps">Precip. Pop</span>
              <span className="val">{loc.precip}%</span>
            </div>
            <div className="hero-mini-metric">
              <span className="label-caps">Pressure</span>
              <span className="val">{loc.pressure} hPa</span>
            </div>
            <div className="hero-mini-metric">
              <span className="label-caps">UV Index</span>
              <span className="val">{formatUV(loc.uv)}</span>
            </div>
          </div>
        </section>

        {/* 2. AI INSIGHT CARD */}
        <section className="ai-hero-card">
          <div>
            <div className="ai-hero-header">
              <div className="ai-title">
                <i className="fa-solid fa-brain"></i> WeatherGPT Intelligence
              </div>
              <span className="badge badge-ai">96% Confidence</span>
            </div>
            <div className="ai-content">{loc.insight}</div>
          </div>
          <div className="ai-meta">
            <span>
              <i className="fa-solid fa-wave-square" style={{ marginRight: 4 }}></i> Multi-model Synthesis
            </span>
            <span>Signals: ECMWF + GFS + Gemini AI</span>
          </div>
        </section>

        {/* 3. QUICK METRICS GRID */}
        <section className="metrics-section">
          <div className="metric-card">
            <div className="metric-header">
              <span className="label-caps">Temperature</span>
              <i className="fa-solid fa-temperature-half"></i>
            </div>
            <div className="metric-value">{formatTemp(loc.temp)}</div>
            <div className="metric-sub">
              <span>Optimal range</span>
              <span style={{ color: "var(--status-success)" }}>Stable</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="label-caps">Feels Like</span>
              <i className="fa-solid fa-child-reaching"></i>
            </div>
            <div className="metric-value">{formatTemp(loc.feels)}</div>
            <div className="metric-sub">
              <span>Humidex effect</span>
              <span style={{ color: "var(--status-warning)" }}>Elevated</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="label-caps">Humidity</span>
              <i className="fa-solid fa-droplet"></i>
            </div>
            <div className="metric-value">{loc.humidity}%</div>
            <div className="metric-sub">
              <span>Moisture level</span>
              <span>{loc.humidity > 70 ? "High" : "Moderate"}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="label-caps">Wind Speed</span>
              <i className="fa-solid fa-wind"></i>
            </div>
            <div className="metric-value">{loc.wind.split(" ")[0]} km/h</div>
            <div className="metric-sub">
              <span>Direction</span>
              <span>{loc.wind.split(" ")[2] || "Calm"}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="label-caps">Rain Prob</span>
              <i className="fa-solid fa-cloud-showers-heavy"></i>
            </div>
            <div className="metric-value">{loc.precip}%</div>
            <div className="metric-sub">
              <span>Risk status</span>
              <span style={{ color: loc.precip >= 50 ? "var(--status-warning)" : "var(--status-success)" }}>
                {loc.precip >= 50 ? "Likely" : "Low"}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="label-caps">Air Quality</span>
              <i className="fa-solid fa-smog"></i>
            </div>
            <div className="metric-value">{loc.aqi ?? "145"}</div>
            <div className="metric-sub">
              <span>US AQI standard</span>
              <span style={{ color: (loc.aqi || 145) > 150 ? "var(--status-severe)" : "var(--status-warning)" }}>
                {(loc.aqi || 145) > 150 ? "Unhealthy" : "Moderate"}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="label-caps">Visibility</span>
              <i className="fa-solid fa-eye"></i>
            </div>
            <div className="metric-value">{loc.visibility}</div>
            <div className="metric-sub">
              <span>Horizon clarity</span>
              <span>Good</span>
            </div>
          </div>
        </section>

        {/* 4. HOURLY CHART & 24-HR PREDICTIVE FORECAST */}
        <section className="hourly-container card">
          <div className="section-header">
            <div className="section-title">
              <i className="fa-regular fa-clock" style={{ color: "var(--accent-electric)" }}></i> 24-Hour Predictive Forecast
            </div>
            <div className="tabs-nav">
              <button
                className={`tab-btn ${activeHourlyTab === "temp" ? "active" : ""}`}
                onClick={() => setActiveHourlyTab("temp")}
              >
                Temperature
              </button>
              <button
                className={`tab-btn ${activeHourlyTab === "precip" ? "active" : ""}`}
                onClick={() => setActiveHourlyTab("precip")}
              >
                Precipitation
              </button>
            </div>
          </div>
          <div className="chart-box">
            <canvas id="hourlyChart"></canvas>
          </div>
        </section>

        {/* 5. 7-DAY FORECAST */}
        <section className="daily-container card">
          <div className="section-header">
            <div className="section-title">
              <i className="fa-regular fa-calendar-days" style={{ color: "var(--accent-blue)" }}></i> 7-Day Outlook
            </div>
          </div>
          <div className="forecast-list">
            {loc.daily.map((item, index) => (
              <div key={index} className={`forecast-row ${index === 0 ? "today" : ""}`}>
                <div className="forecast-day">{item.day}</div>
                <div className="forecast-icon">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <div style={{ fontSize: "0.8rem", flex: 1, margin: "0 10px", color: "var(--text-secondary)" }}>
                  {item.condition}
                </div>
                <div className="forecast-pop">
                  <i className="fa-solid fa-droplet" style={{ marginRight: 3 }}></i> {item.pop}
                </div>
                <div className="forecast-temps">
                  <span>{formatTempVal(item.high)}°</span>
                  <span className="low">{formatTempVal(item.low)}°</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. LIVE METEOROLOGICAL RADAR & MAP */}
        <section className="radar-section card">
          <div className="section-header">
            <div className="section-title">
              <i className="fa-solid fa-map" style={{ color: "var(--accent-electric)" }}></i> Meteorological Radar & Hazard Zones
            </div>
            <span className="badge badge-ai">LIVE OVERLAY</span>
          </div>
          <div className="map-wrapper">
            <div className="map-layer-controls">
              <button
                className={`map-layer-btn ${activeMapLayer === "rain" ? "active" : ""}`}
                onClick={() => setActiveMapLayer("rain")}
              >
                Rain Radar
              </button>
              <button
                className={`map-layer-btn ${activeMapLayer === "wind" ? "active" : ""}`}
                onClick={() => setActiveMapLayer("wind")}
              >
                Wind Stream
              </button>
              <button
                className={`map-layer-btn ${activeMapLayer === "hazards" ? "active" : ""}`}
                onClick={() => setActiveMapLayer("hazards")}
              >
                Hazard Zones
              </button>
            </div>
            <div id="weatherMap"></div>
          </div>
        </section>

        {/* 7. HAZARD & EARLY WARNING CENTER */}
        <section className="hazard-section">
          <div className="section-title">
            <i className="fa-solid fa-triangle-exclamation" style={{ color: "var(--status-warning)" }}></i> Early Warning Center
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {warnings.map((w, idx) => (
              <div key={idx} className={`warning-card ${w.type.toLowerCase()}`}>
                <div className="warning-icon">
                  <i className={`fa-solid ${w.icon}`}></i>
                </div>
                <div className="warning-content">
                  <div className="warning-title">{w.title}</div>
                  <div className="warning-message">{w.message}</div>
                </div>
                <div className="warning-value">{w.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. SECTOR DECISION SUPPORT */}
        <section className="decision-section">
          <div className="section-header">
            <div className="section-title">
              <i className="fa-solid fa-sliders" style={{ color: "var(--accent-indigo)" }}></i> Sector Decision Support Intelligence
            </div>
          </div>

          <div className="decision-grid">
            <div className="decision-card">
              <div className="decision-header">
                <i className="fa-solid fa-wheat-awn"></i>
                <h4>Agriculture</h4>
              </div>
              <div className="decision-item">
                <span className="label">Irrigation Need</span>
                <span className="val">{irrigation}</span>
              </div>
              <div className="decision-item">
                <span className="label">Pesticide Spray</span>
                <span className="val">{spray}</span>
              </div>
              <div className="decision-item">
                <span className="label">Crop Stress Index</span>
                <span className="val">{cropStress}</span>
              </div>
            </div>

            <div className="decision-card">
              <div className="decision-header">
                <i className="fa-solid fa-building-shield"></i>
                <h4>Disaster Risk</h4>
              </div>
              <div className="decision-item">
                <span className="label">Flood Vulnerability</span>
                <span className="val">{floodRisk}</span>
              </div>
              <div className="decision-item">
                <span className="label">Drainage Load</span>
                <span className="val">{drainage}</span>
              </div>
              <div className="decision-item">
                <span className="label">Emergency Status</span>
                <span className="val">{emergency}</span>
              </div>
            </div>

            <div className="decision-card">
              <div className="decision-header">
                <i className="fa-solid fa-truck-fast"></i>
                <h4>Logistics & Travel</h4>
              </div>
              <div className="decision-item">
                <span className="label">Highway Visibility</span>
                <span className="val">{visibilityRisk}</span>
              </div>
              <div className="decision-item">
                <span className="label">Travel Risk</span>
                <span className="val">{travelRisk}</span>
              </div>
              <div className="decision-item">
                <span className="label">Transit Delay Est.</span>
                <span className="val">{transitDelay}</span>
              </div>
            </div>

            <div className="decision-card">
              <div className="decision-header">
                <i className="fa-solid fa-plane"></i>
                <h4>Aviation & Marine</h4>
              </div>
              <div className="decision-item">
                <span className="label">Wind Velocity</span>
                <span className="val">{windNum} km/h</span>
              </div>
              <div className="decision-item">
                <span className="label">Wind Equivalent</span>
                <span className="val">{windKnots} knots</span>
              </div>
              <div className="decision-item">
                <span className="label">Flight Weather Risk</span>
                <span className="val">{weatherRisk}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 9. AI CONVERSATIONAL ASSISTANT */}
        <section className="assistant-section">
          <div className="chat-container">
            <div className="section-title" style={{ marginBottom: "1rem" }}>
              <i className="fa-solid fa-comments" style={{ color: "var(--accent-electric)" }}></i> WeatherGPT AI Conversational Engine
            </div>

            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`msg ${msg.sender}`}>
                  <div className="msg-avatar">
                    <i className={msg.sender === "assistant" ? "fa-solid fa-robot" : "fa-regular fa-user"}></i>
                  </div>
                  <div className="msg-bubble">{msg.text}</div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                className="chat-input"
                placeholder={
                  isHindi
                    ? "मौसम के बारे में पूछें (उदा: क्या शाम को बारिश होगी?)..."
                    : "Ask about rain, travel safety, agriculture, or severe weather..."
                }
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              />
              <button
                className="chat-btn"
                onClick={startVoice}
                style={{
                  background: isListening ? "var(--status-severe)" : "var(--bg-surface-3)",
                  marginRight: 4,
                }}
                title="Voice input (Speech to text)"
              >
                <i className={isListening ? "fa-solid fa-circle-dot" : "fa-solid fa-microphone"}></i>
              </button>
              <button
                className="chat-btn"
                onClick={() => handleSendChat()}
                disabled={isAiLoading}
                title="Send query"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>

          <div className="suggested-prompts-sidebar">
            <div className="label-caps" style={{ marginBottom: "0.5rem" }}>
              Quick Scenario Prompts
            </div>
            <button
              className="prompt-btn"
              onClick={() => handleSendChat("Will it rain this evening?")}
            >
              "Will it rain this evening?"
            </button>
            <button
              className="prompt-btn"
              onClick={() => handleSendChat("Is it safe for highway driving right now?")}
            >
              "Is it safe for highway driving?"
            </button>
            <button
              className="prompt-btn"
              onClick={() => handleSendChat("Provide an agricultural advisory for tomato and wheat crops.")}
            >
              "Provide agricultural advisory."
            </button>
            <button
              className="prompt-btn"
              onClick={() => handleSendChat("Summarize all active hazards and safety risks.")}
            >
              "Summarize major hazards."
            </button>
          </div>
        </section>
      </main>

      {/* LOCATION SELECTION MODAL */}
      {isLocationModalOpen && (
        <div className="modal-overlay active" onClick={() => setIsLocationModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select Location</h3>
              <button className="icon-btn" onClick={() => setIsLocationModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Choose a saved region, search for any global city, or use your live GPS location.
            </p>
            <button
              className="prompt-btn"
              type="button"
              onClick={useMyLocation}
              style={{ width: "100%", marginTop: "0.75rem" }}
            >
              <i className="fa-solid fa-location-crosshairs" style={{ marginRight: 6 }}></i> Use my current GPS location
            </button>
            <div className="location-list">
              {Object.keys(locations).map((key) => {
                const item = locations[key];
                return (
                  <div
                    key={key}
                    className="location-item"
                    onClick={() => {
                      setCurrentLocKey(key);
                      setIsLocationModalOpen(false);
                      loadRealWeather(key, true);
                    }}
                  >
                    <div>
                      <strong>{item.name}</strong>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.region}</p>
                    </div>
                    <span className="mono" style={{ fontSize: "0.9rem" }}>
                      {formatTemp(item.temp)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TOAST POPUP */}
      <div className={`toast ${toastMessage ? "active" : ""}`} role="status">
        {toastMessage}
      </div>

      {/* FOOTER */}
      <footer>
        <div>
          <strong>WeatherGPT Architecture</strong> — Production Ready AI Weather Intelligence
        </div>
        <div className="footer-status">
          <span>
            Pipeline: <span style={{ color: "var(--status-success)" }}>Active</span>
          </span>
          <span>
            AI Engine: <span style={{ color: "var(--accent-electric)" }}>Gemini 2.5 + Groq Ready</span>
          </span>
          <span>
            Telemetry: <span style={{ color: "var(--status-info)" }}>Open-Meteo Live</span>
          </span>
        </div>
      </footer>
    </>
  );
}

// Helpers
function getCondition(code: number | string): string {
  const c = Number(code);
  if (!Number.isFinite(c)) return "Conditions unavailable";
  if (c === 0) return "Clear Sky";
  if (c <= 3) return "Partly Cloudy";
  if (c <= 48) return "Foggy";
  if (c <= 57) return "Drizzle";
  if (c <= 67) return "Rain";
  if (c <= 77) return "Snow";
  if (c <= 82) return "Rain Showers";
  if (c <= 99) return "Thunderstorm";
  return "Clear";
}

function getWeatherIcon(code: number | string): string {
  const c = Number(code);
  if (!Number.isFinite(c)) return "fa-cloud";
  if (c === 0) return "fa-sun";
  if (c <= 3) return "fa-cloud-sun";
  if (c <= 48) return "fa-smog";
  if (c <= 67) return "fa-cloud-showers-heavy";
  if (c <= 77) return "fa-snowflake";
  if (c <= 82) return "fa-cloud-sun-rain";
  return "fa-cloud-bolt";
}

function findCurrentHourIndex(times: string[], currentTime: string): number {
  if (!Array.isArray(times) || !times.length) return 0;
  const exact = times.indexOf(currentTime);
  if (exact >= 0) return exact;
  const current = new Date(currentTime || Date.now()).getTime();
  let closest = 0;
  times.forEach((time, index) => {
    if (Math.abs(new Date(time).getTime() - current) < Math.abs(new Date(times[closest]).getTime() - current)) {
      closest = index;
    }
  });
  return closest;
}

function roundOr(fallback: number | null, value: any): any {
  if (value === null || value === undefined || value === "") return fallback;
  return Number.isFinite(Number(value)) ? Math.round(Number(value)) : fallback;
}

function degreesToCardinal(degrees: number | string): string {
  if (!Number.isFinite(Number(degrees))) return "";
  return ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(Number(degrees) / 45) % 8];
}

function formatHourLabel(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function buildInsight(data: LocationData): string {
  if (Number(data.precip) >= 60) {
    return `Rain risk is elevated at ${data.precip}%. Plan outdoor activity around the drier windows and keep rain protection ready.`;
  }
  if (Number(data.aqi) >= 150) {
    return `Air quality is the main concern at AQI ${data.aqi}. Sensitive groups should limit prolonged outdoor exertion.`;
  }
  if (Number(data.humidity) >= 80) {
    return `High humidity at ${data.humidity}% may make conditions feel warmer than the thermometer suggests.`;
  }
  return `${data.condition} conditions are currently stable. Atmospheric indicators remain favorable across monitored sectors.`;
}
