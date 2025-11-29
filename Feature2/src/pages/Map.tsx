import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Wind,
  Volume2,
  Navigation,
  MapPin,
  Leaf,
  Filter,
  Clock,
} from "lucide-react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "../styles/map.css";

const Map = () => {
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<tt.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [showAirQuality, setShowAirQuality] = useState(false);
  const [minAirQuality, setMinAirQuality] = useState(50);
  const [showNoise, setShowNoise] = useState(false);
  const [maxNoise, setMaxNoise] = useState(50);
  const [trafficFilter, setTrafficFilter] = useState<
    "Any" | "Low Traffic" | "Moderate Traffic" | "High Traffic"
  >("Any");
  const zoneMarkers = useRef<tt.Marker[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const userMarkerRef = useRef<tt.Marker | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [selectedZoneTypes, setSelectedZoneTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Enhanced zone data with realistic categories and dynamic data
  const [zones, setZones] = useState([
    {
      id: 1,
      name: "City Center Traffic",
      emoji: "🚗",
      type: "High Traffic Zone",
      status: "Active",
      airQuality: 78,
      noiseLevel: 72,
      traffic: "High Traffic",
      lat: 18.5204,
      lon: 73.8567,
    },
    {
      id: 2,
      name: "Green Park Area",
      emoji: "🌿",
      type: "Low Pollution Zone",
      status: "Active",
      airQuality: 35,
      noiseLevel: 45,
      traffic: "Low Traffic",
      lat: 18.5314,
      lon: 73.8446,
    },
    {
      id: 3,
      name: "Central Station",
      emoji: "🚆",
      type: "Transport Hub",
      status: "Active",
      airQuality: 65,
      noiseLevel: 75,
      traffic: "High Traffic",
      lat: 18.5289,
      lon: 73.8744,
    },
    {
      id: 4,
      name: "Tech Park",
      emoji: "🏢",
      type: "Smart Infrastructure",
      status: "Active",
      airQuality: 42,
      noiseLevel: 50,
      traffic: "Moderate Traffic",
      lat: 18.5108,
      lon: 73.9277,
    },
    {
      id: 5,
      name: "Residential Area",
      emoji: "🛡️",
      type: "Safety Zone",
      status: "Active",
      airQuality: 40,
      noiseLevel: 48,
      traffic: "Low Traffic",
      lat: 18.5679,
      lon: 73.9143,
    },
    {
      id: 6,
      name: "Quiet Neighborhood",
      emoji: "🔇",
      type: "Peaceful Zone",
      status: "Active",
      airQuality: 38,
      noiseLevel: 42,
      traffic: "Low Traffic",
      lat: 18.5521,
      lon: 73.8912,
    },
    {
      id: 7,
      name: "Industrial Area",
      emoji: "🏭",
      type: "High Pollution Zone",
      status: "Active",
      airQuality: 85,
      noiseLevel: 68,
      traffic: "Moderate Traffic",
      lat: 18.5034,
      lon: 73.8523,
    },
    {
      id: 8,
      name: "University Campus",
      emoji: "🎓",
      type: "Environmental Zone",
      status: "Active",
      airQuality: 45,
      noiseLevel: 52,
      traffic: "Low Traffic",
      lat: 18.5478,
      lon: 73.8219,
    },
  ]);

  const [ecoRoute, setEcoRoute] = useState({
    distance_km: 0,
    travel_time: 0,
    ecoScore: 0,
    co2_saved: 0,
  });

  // Use your NEW API key
  const TOMTOM_KEY = "7wBtrtirm3avEgWj3L2NWuRfJGSIqrS2";

  // Function to generate realistic hotspots based on user location
  const generateRealisticHotspots = (userLat: number, userLon: number) => {
    const newZones = [...zones];

    // Update zones with more realistic data based on proximity to user
    newZones.forEach((zone) => {
      // Calculate distance from user (simplified)
      const distance = Math.sqrt(
        Math.pow(zone.lat - userLat, 2) + Math.pow(zone.lon - userLon, 2)
      );

      // Adjust values based on distance and time of day (simulated)
      const timeOfDay = new Date().getHours();
      const isDaytime = timeOfDay > 6 && timeOfDay < 20;

      if (zone.type === "High Traffic Zone") {
        zone.traffic = isDaytime ? "High Traffic" : "Moderate Traffic";
        zone.airQuality = Math.min(100, Math.max(30, 60 + Math.random() * 40));
        zone.noiseLevel = Math.min(100, Math.max(40, 60 + Math.random() * 30));
      } else if (zone.type === "Low Pollution Zone") {
        zone.airQuality = Math.min(100, Math.max(20, 20 + Math.random() * 30));
        zone.noiseLevel = Math.min(100, Math.max(30, 30 + Math.random() * 20));
      } else if (zone.type === "Peaceful Zone") {
        zone.noiseLevel = Math.min(100, Math.max(25, 25 + Math.random() * 25));
        zone.airQuality = Math.min(100, Math.max(25, 25 + Math.random() * 30));
      }
    });

    setZones(newZones);
  };

  useEffect(() => {
    if (!mapContainer.current) {
      console.log("Map container not found");
      return;
    }

    if (mapRef.current) {
      console.log("Map already initialized");
      return;
    }

    console.log("Initializing map with new key");

    try {
      mapRef.current = tt.map({
        key: TOMTOM_KEY,
        container: mapContainer.current,
        center: [73.8567, 18.5204],
        zoom: 13,
        language: "en-GB",
      });

      mapRef.current.on("load", () => {
        console.log("Map loaded successfully");
        setMapLoaded(true);
        setMapError(null);
        renderZones();
      });

      mapRef.current.on("error", (e: any) => {
        console.error("Map error:", e);
        setMapError(
          "Failed to load map. Please check your API key and internet connection."
        );
        setMapLoaded(false);
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError(
        "Error initializing map. Please check the console for details."
      );
      setMapLoaded(false);
    }

    return () => {
      if (mapRef.current) {
        console.log("Cleaning up map");
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const renderZones = () => {
    const map = mapRef.current;
    if (!map) {
      console.log("Map not available for rendering zones");
      return;
    }

    console.log("Rendering zones...");

    // Clear existing markers
    if (zoneMarkers.current.length > 0) {
      zoneMarkers.current.forEach((marker) => {
        try {
          marker.remove();
        } catch (e) {
          // Ignore removal errors
        }
      });
      zoneMarkers.current = [];
    }

    const visibleZones = zones.filter((zone) => {
      if (
        selectedZoneTypes.length > 0 &&
        !selectedZoneTypes.includes(zone.type)
      ) {
        return false;
      }
      if (showAirQuality && zone.airQuality < minAirQuality) return false;
      if (showNoise && zone.noiseLevel > maxNoise) return false;
      if (trafficFilter !== "Any" && zone.traffic !== trafficFilter)
        return false;
      return true;
    });

    console.log(`Showing ${visibleZones.length} zones`);

    visibleZones.forEach((zone) => {
      try {
        const markerElement = document.createElement("div");
        markerElement.className = "zone-marker";
        markerElement.style.cssText = `
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: white;
          border: 3px solid ${getZoneColor(zone)};
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 20px;
        `;
        markerElement.textContent = zone.emoji;

        const marker = new tt.Marker({
          element: markerElement,
          anchor: "center",
        })
          .setLngLat([zone.lon, zone.lat])
          .addTo(map);

        const popup = new tt.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 12px; min-width: 200px;">
            <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">${
              zone.name
            }</h3>
            <div style="display: flex; flex-direction: column; gap: 4px; font-size: 14px;">
              <div style="display: flex; justify-content: space-between;">
                <span>Zone Type:</span>
                <span style="font-weight: 500;">${zone.type}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Air Quality:</span>
                <span style="font-weight: 500; color: ${
                  zone.airQuality > 70
                    ? "#ef4444"
                    : zone.airQuality > 40
                    ? "#f59e0b"
                    : "#10b981"
                }">${getAirQualityDescription(zone.airQuality)} (${
          zone.airQuality
        })</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Noise Level:</span>
                <span style="font-weight: 500;">${getNoiseLevelDescription(
                  zone.noiseLevel
                )} (${zone.noiseLevel} dB)</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Traffic:</span>
                <span style="font-weight: 500; color: ${
                  zone.traffic === "High Traffic"
                    ? "#ef4444"
                    : zone.traffic === "Moderate Traffic"
                    ? "#f59e0b"
                    : "#10b981"
                }">${zone.traffic}</span>
              </div>
            </div>
          </div>
        `);

        marker.setPopup(popup);
        zoneMarkers.current.push(marker);
      } catch (error) {
        console.error("Error creating marker:", error);
      }
    });
  };

  const getZoneColor = (zone: any) => {
    const colors: { [key: string]: string } = {
      "Low Traffic Zone": "#ef4444",
      "Low Pollution Zone": "#10b981",
      "Transport Hub": "#f59e0b",
      "Smart Infrastructure": "#3b82f6",
      "Safety Zone": "#8b5cf6",
      "Peaceful Zone": "#06b6d4",
      "High Pollution Zone": "#dc2626",
      "Environmental Zone": "#22c55e",
    };
    return colors[zone.type] || "#6b7280";
  };

  const getAirQualityDescription = (aqi: number) => {
    if (aqi <= 30) return "Excellent";
    if (aqi <= 50) return "Good";
    if (aqi <= 70) return "Moderate";
    if (aqi <= 90) return "Poor";
    return "Very Poor";
  };

  const getNoiseLevelDescription = (noise: number) => {
    if (noise <= 40) return "Very Quiet";
    if (noise <= 55) return "Quiet";
    if (noise <= 70) return "Moderate";
    if (noise <= 85) return "Noisy";
    return "Very Noisy";
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    stopTracking();

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log("User location:", { latitude, longitude, accuracy });
        setUserLocation({ lat: latitude, lon: longitude });

        // Generate realistic hotspots based on user location
        generateRealisticHotspots(latitude, longitude);

        const map = mapRef.current;
        if (map) {
          map.setCenter([longitude, latitude]);
          map.setZoom(16);

          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }

          const userMarkerElement = document.createElement("div");
          userMarkerElement.className = "user-location-marker";
          userMarkerElement.innerHTML = `
            <div class="user-pulse-ring"></div>
            <div class="user-location-dot"></div>
          `;

          userMarkerRef.current = new tt.Marker({
            element: userMarkerElement,
            anchor: "center",
          })
            .setLngLat([longitude, latitude])
            .addTo(map);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        handleLocationError(error);
      },
      options
    );

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });

        const map = mapRef.current;
        if (map && userMarkerRef.current) {
          userMarkerRef.current.setLngLat([longitude, latitude]);
          map.easeTo({
            center: [longitude, latitude],
            duration: 1000,
          });
        }
      },
      (error) => {
        console.error("Error watching location:", error);
      },
      options
    );

    watchIdRef.current = watchId;
    setIsTracking(true);
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    setIsTracking(false);
  };

  const handleLocationError = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert(
          "Location access denied. Please enable location permissions in your browser settings."
        );
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("Location request timed out.");
        break;
      default:
        alert("An unknown error occurred while getting location.");
        break;
    }
  };

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      renderZones();
    }
  }, [
    selectedZoneTypes,
    showAirQuality,
    minAirQuality,
    showNoise,
    maxNoise,
    trafficFilter,
    mapLoaded,
    zones,
  ]);

  const geocode = async (query: string) => {
    try {
      const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
        query
      )}.json?key=${TOMTOM_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const position = data.results[0].position;
        return { lat: position.lat, lon: position.lon };
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
    return null;
  };

  const handleFindRoute = async () => {
    if (!startPoint || !endPoint) {
      alert("Please enter both starting point and destination");
      return;
    }

    try {
      const start = await geocode(startPoint);
      const end = await geocode(endPoint);

      if (!start || !end) {
        alert(
          "Could not find one or both locations. Please try different addresses."
        );
        return;
      }

      const map = mapRef.current;
      if (!map) return;

      // Clear existing route
      if (map.getLayer("route")) map.removeLayer("route");
      if (map.getSource("route")) map.removeSource("route");

      const routeUrl = `https://api.tomtom.com/routing/1/calculateRoute/${start.lat},${start.lon}:${end.lat},${end.lon}/json?key=${TOMTOM_KEY}&routeType=eco&traffic=true&travelMode=car`;

      const response = await fetch(routeUrl);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const summary = route.summary;

        const travelTimeMinutes = Math.round(summary.travelTimeInSeconds / 60);
        const travelTimeHours = Math.floor(travelTimeMinutes / 60);
        const remainingMinutes = travelTimeMinutes % 60;
        const travelTimeDisplay =
          travelTimeHours > 0
            ? `${travelTimeHours}h ${remainingMinutes}m`
            : `${travelTimeMinutes} minutes`;

        const newEcoRoute = {
          distance_km: Math.round((summary.lengthInMeters / 1000) * 10) / 10,
          travel_time: travelTimeDisplay,
          ecoScore: Math.max(
            50,
            Math.round(
              100 -
                (summary.trafficDelayInSeconds / summary.travelTimeInSeconds) *
                  100
            )
          ),
          co2_saved:
            Math.round((summary.lengthInMeters / 1000) * 0.12 * 10) / 10,
        };

        setEcoRoute(newEcoRoute);

        // Draw route on map
        if (route.legs && route.legs[0].points) {
          const routeCoordinates = route.legs[0].points.map((point: any) => [
            point.longitude,
            point.latitude,
          ]);

          const routeGeoJSON = {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: routeCoordinates,
            },
          };

          map.addSource("route", {
            type: "geojson",
            data: routeGeoJSON as any,
          });

          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#10b981",
              "line-width": 6,
              "line-opacity": 0.8,
            },
          });

          // Fit map to route bounds
          const bounds = new tt.LngLatBounds();
          routeCoordinates.forEach((coord: [number, number]) => {
            bounds.extend(coord);
          });

          map.fitBounds(bounds, { padding: 50 });
        }
      }
    } catch (error) {
      console.error("Route calculation error:", error);
      alert("Error calculating route. Please try again.");
    }
  };

  const toggleZoneType = (zoneType: string) => {
    setSelectedZoneTypes((prev) =>
      prev.includes(zoneType)
        ? prev.filter((type) => type !== zoneType)
        : [...prev, zoneType]
    );
  };

  const selectAllZones = () => {
    setSelectedZoneTypes([]);
  };

  const toggleMode = () => {
    setDarkMode(!darkMode);
  };

  const uniqueZoneTypes = Array.from(new Set(zones.map((zone) => zone.type)));

  // Animated Background Component
  const AnimatedBackground = () => (
    <div className="animated-bg fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      <div className="bg-circle circle-1"></div>
      <div className="bg-circle circle-2"></div>
      <div className="bg-circle circle-3"></div>
      <div className="bg-circle circle-4"></div>
    </div>
  );

  // Custom header component matching the original design
  const Header = () => (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-400 ${
        darkMode
          ? "bg-gray-900/90 backdrop-blur-md"
          : "bg-white/90 backdrop-blur-md"
      } shadow-lg`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              GYATAH
            </div>
          </div>

          <nav className="hidden md:flex gap-8">
            <a
              href="#"
              className={`font-medium relative transition-colors duration-400 ${
                darkMode
                  ? "text-gray-200 hover:text-green-400"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Home
            </a>
            <a
              href="#"
              className={`font-medium relative transition-colors duration-400 ${
                darkMode
                  ? "text-gray-200 hover:text-green-400"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Features
            </a>
            <a
              href="#"
              className={`font-medium relative transition-colors duration-400 ${
                darkMode
                  ? "text-gray-200 hover:text-green-400"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              How It Works
            </a>
            <a
              href="#"
              className={`font-medium relative transition-colors duration-400 ${
                darkMode
                  ? "text-gray-200 hover:text-green-400"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Testimonials
            </a>
            <a
              href="#"
              className={`font-medium relative transition-colors duration-400 ${
                darkMode
                  ? "text-gray-200 hover:text-green-400"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Contact
            </a>
          </nav>

          <div
            className={`flex items-center gap-4 px-5 py-3 rounded-full cursor-pointer transition-all duration-400 ${
              darkMode ? "bg-gray-800 shadow-lg" : "bg-white shadow-md"
            }`}
            onClick={toggleMode}
          >
            <span
              className={`font-semibold text-sm ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Citizen
            </span>
            <div className="relative w-14 h-7">
              <input
                type="checkbox"
                className="sr-only"
                checked={darkMode}
                onChange={toggleMode}
              />
              <div
                className={`w-full h-full rounded-full transition-colors duration-400 ${
                  darkMode ? "bg-blue-600" : "bg-green-600"
                }`}
              ></div>
              <div
                className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-400 ${
                  darkMode ? "transform translate-x-7" : ""
                }`}
              ></div>
            </div>
            <span
              className={`font-semibold text-sm ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Expert
            </span>
          </div>
        </div>
      </div>
    </header>
  );

  // Custom footer component matching the original design
  const Footer = () => (
    <footer
      className={`mt-12 py-12 border-t ${
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3
              className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              About Gyatah
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              } mb-4`}
            >
              Gyatah is an innovative platform that combines sustainability with
              technology to help users make eco-friendly travel decisions.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  darkMode
                    ? "bg-green-700 hover:bg-green-600"
                    : "bg-green-600 hover:bg-green-700"
                } text-white transition-colors duration-300`}
              >
                <i className="fab fa-facebook-f text-sm"></i>
              </a>
              <a
                href="#"
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  darkMode
                    ? "bg-green-700 hover:bg-green-600"
                    : "bg-green-600 hover:bg-green-700"
                } text-white transition-colors duration-300`}
              >
                <i className="fab fa-twitter text-sm"></i>
              </a>
              <a
                href="#"
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  darkMode
                    ? "bg-green-700 hover:bg-green-600"
                    : "bg-green-600 hover:bg-green-700"
                } text-white transition-colors duration-300`}
              >
                <i className="fab fa-instagram text-sm"></i>
              </a>
              <a
                href="#"
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  darkMode
                    ? "bg-green-700 hover:bg-green-600"
                    : "bg-green-600 hover:bg-green-700"
                } text-white transition-colors duration-300`}
              >
                <i className="fab fa-linkedin-in text-sm"></i>
              </a>
            </div>
          </div>

          <div>
            <h3
              className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              Quick Links
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                Home
              </a>
              <a
                href="#"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                Features
              </a>
              <a
                href="#"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                How It Works
              </a>
              <a
                href="#"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                Testimonials
              </a>
              <a
                href="#"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                Contact
              </a>
            </div>
          </div>

          <div>
            <h3
              className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              Features
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="http://localhost:8080/map"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                Eco-Route Finder
              </a>
              <a
                href="http://127.0.0.1:5000/"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                Live Dashboard
              </a>
              <a
                href="personal-dashboard.html"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                Personal Dashboard
              </a>
              <a
                href="gamification.html"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                Gamification
              </a>
              <a
                href="chatbot.html"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                AI Chatbot
              </a>
              <a
                href="community.html"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                Community Hub
              </a>
            </div>
          </div>

          <div>
            <h3
              className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              Contact Us
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:info@gyatah.com"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                info@gyatah.com
              </a>
              <a
                href="tel:+1234567890"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                +1 (234) 567-890
              </a>
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                123 Green Street, Eco City
              </span>
            </div>
          </div>
        </div>

        <div
          className={`pt-6 border-t text-center ${
            darkMode
              ? "border-gray-800 text-gray-400"
              : "border-gray-200 text-gray-600"
          }`}
        >
          <p className="text-sm">
            &copy; 2023 Gyatah. All rights reserved. Making the world greener,
            one route at a time.
          </p>
        </div>
      </div>
    </footer>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-400 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <AnimatedBackground />
      <Header />
      <div className="pt-24 px-4 pb-8">
        <div className="container mx-auto">
          <h1
            className={`text-3xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Live Map - {darkMode ? "Expert" : "Citizen"} Mode
          </h1>
          <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
            Navigate your world sustainably with Gyatah's eco-friendly routing
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Reduced width */}
            <div className="space-y-6 lg:col-span-1">
              <Card
                className={`p-6 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Zone Filters</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className={
                      darkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : ""
                    }
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {showFilters ? "Hide" : "Show"}
                  </Button>
                </div>

                {showFilters && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Zone Types</h3>
                      <div className="space-y-2">
                        <div
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                          }`}
                          onClick={selectAllZones}
                        >
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="mr-2"
                              checked={selectedZoneTypes.length === 0}
                              onChange={selectAllZones}
                            />
                            All Zones
                          </label>
                          <span
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            ({zones.length})
                          </span>
                        </div>
                        {uniqueZoneTypes.map((type) => (
                          <div
                            key={type}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                              darkMode
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => toggleZoneType(type)}
                          >
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedZoneTypes.includes(type)}
                                onChange={() => toggleZoneType(type)}
                              />
                              {type}
                            </label>
                            <span
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              ({zones.filter((z) => z.type === type).length})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Air Quality</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={showAirQuality}
                            onChange={(e) =>
                              setShowAirQuality(e.target.checked)
                            }
                          />
                          <label>Show only good air quality zones</label>
                        </div>
                        {showAirQuality && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>
                                Minimum Air Quality:{" "}
                                {getAirQualityDescription(minAirQuality)} (
                                {minAirQuality})
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={minAirQuality}
                              onChange={(e) =>
                                setMinAirQuality(Number(e.target.value))
                              }
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Poor</span>
                              <span>Excellent</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Noise Level</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={showNoise}
                            onChange={(e) => setShowNoise(e.target.checked)}
                          />
                          <label>Show only quiet zones</label>
                        </div>
                        {showNoise && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>
                                Maximum Noise:{" "}
                                {getNoiseLevelDescription(maxNoise)} ({maxNoise}{" "}
                                dB)
                              </span>
                            </div>
                            <input
                              type="range"
                              min="30"
                              max="100"
                              value={maxNoise}
                              onChange={(e) =>
                                setMaxNoise(Number(e.target.value))
                              }
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Quiet</span>
                              <span>Noisy</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Traffic Level</h3>
                      <select
                        value={trafficFilter}
                        onChange={(e) =>
                          setTrafficFilter(e.target.value as any)
                        }
                        className={`w-full p-2 border rounded-lg ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="Any">Any Traffic Level</option>
                        <option value="Low Traffic">Low Traffic Only</option>
                        <option value="Moderate Traffic">
                          Moderate Traffic
                        </option>
                        <option value="High Traffic">High Traffic Areas</option>
                      </select>
                    </div>
                  </div>
                )}
              </Card>

              <Card
                className={`p-6 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                <h3 className="font-semibold mb-4">Live Zone Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div
                      className={`text-sm mb-1 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Active Zones
                    </div>
                    <div className="text-2xl font-bold">
                      {zones.filter((z) => z.status === "Active").length}
                    </div>
                  </div>
                  <div>
                    <div
                      className={`text-sm mb-1 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      City Coverage
                    </div>
                    <div className="text-lg font-semibold">Pune Area</div>
                  </div>
                  <div>
                    <div
                      className={`text-sm mb-1 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Data Updates
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      Live Updates
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  {!isTracking ? (
                    <Button
                      onClick={startTracking}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Start Live Tracking
                    </Button>
                  ) : (
                    <Button
                      onClick={stopTracking}
                      variant="destructive"
                      className="w-full"
                    >
                      Stop Tracking
                    </Button>
                  )}
                </div>
              </Card>

              <Card
                className={`p-6 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                <h3 className="font-semibold mb-4">Find Eco-Friendly Route</h3>
                <div className="space-y-4">
                  <div>
                    <label
                      className={`text-sm mb-2 block ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Start From
                    </label>
                    <Input
                      placeholder="Enter your location"
                      value={startPoint}
                      onChange={(e) => setStartPoint(e.target.value)}
                      className={
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white text-gray-900"
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={`text-sm mb-2 block ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Destination
                    </label>
                    <Input
                      placeholder="Where do you want to go?"
                      value={endPoint}
                      onChange={(e) => setEndPoint(e.target.value)}
                      className={
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white text-gray-900"
                      }
                    />
                  </div>
                  <Button
                    className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleFindRoute}
                  >
                    <Navigation className="w-4 h-4" />
                    Find Green Route
                  </Button>
                </div>
              </Card>

              {ecoRoute.distance_km > 0 && (
                <Card
                  className={`p-6 bg-gradient-to-br border-green-200 ${
                    darkMode
                      ? "from-green-900/20 to-blue-900/20 border-green-800 text-white"
                      : "from-green-50 to-blue-50 text-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Recommended Eco-Route</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {ecoRoute.ecoScore}
                        </span>
                      </div>
                      <span className="text-sm font-medium">Eco Score</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span
                        className={darkMode ? "text-gray-300" : "text-gray-500"}
                      >
                        Distance
                      </span>
                      <span className="font-semibold text-lg">
                        {ecoRoute.distance_km} km
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span
                          className={
                            darkMode ? "text-gray-300" : "text-gray-500"
                          }
                        >
                          Travel Time
                        </span>
                      </div>
                      <span className="font-semibold text-lg">
                        {ecoRoute.travel_time}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={darkMode ? "text-gray-300" : "text-gray-500"}
                      >
                        CO₂ Savings
                      </span>
                      <span className="font-semibold text-lg text-green-600">
                        {ecoRoute.co2_saved} kg
                      </span>
                    </div>
                  </div>
                  <div
                    className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${
                      darkMode
                        ? "bg-green-900/30 text-green-300"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    <Leaf className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      This eco-friendly route avoids high pollution areas and
                      saves <strong>{ecoRoute.co2_saved}kg</strong> of CO₂
                      compared to the fastest route.
                    </p>
                  </div>
                </Card>
              )}

              <Card
                className={`p-6 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                <h3 className="font-semibold mb-4">Zone Guide</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌿</span>
                    <div>
                      <div className="font-medium text-sm">Clean Air Zone</div>
                      <div
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Excellent air quality, low pollution
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚗</span>
                    <div>
                      <div className="font-medium text-sm">
                        High Traffic Area
                      </div>
                      <div
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Heavy traffic, moderate air quality
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">😷</span>
                    <div>
                      <div className="font-medium text-sm">Polluted Zone</div>
                      <div
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Poor air quality, avoid if possible
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔇</span>
                    <div>
                      <div className="font-medium text-sm">Quiet Zone</div>
                      <div
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Low noise, peaceful area
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Map View - Increased size */}
            <div className="lg:col-span-3">
              <Card
                className={`p-6 h-[700px] relative overflow-hidden ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {!mapLoaded && !mapError && (
                  <div
                    className={`absolute inset-0 flex items-center justify-center z-10 ${
                      darkMode ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-600"}
                      >
                        Loading map...
                      </p>
                      <p
                        className={`text-sm mt-2 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Using API key: {TOMTOM_KEY.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                )}

                {mapError && (
                  <div
                    className={`absolute inset-0 flex items-center justify-center z-10 ${
                      darkMode ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <div className="text-center p-4">
                      <div className="text-red-500 text-4xl mb-4">⚠️</div>
                      <p className="text-red-600 font-semibold mb-2">
                        Map Loading Failed
                      </p>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-600"}
                      >
                        {mapError}
                      </p>
                      <div
                        className={`text-sm p-3 rounded mt-4 ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        <p>API Key: {TOMTOM_KEY}</p>
                        <p>Please check:</p>
                        <ul className="text-left mt-2">
                          <li>• API key is valid and active</li>
                          <li>• "Map Display API" is enabled</li>
                          <li>• Allowed domains are set or set to "*"</li>
                          <li>• Internet connection is working</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  ref={mapContainer}
                  className="map-container"
                  style={{ width: "100%", height: "100%" }}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Add CSS for animated background */}
      <style jsx>{`
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, #4caf50, #42a5f5);
          opacity: 0.1;
          animation: float 20s infinite linear;
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          left: 5%;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 200px;
          height: 200px;
          top: 60%;
          left: 80%;
          animation-delay: 5s;
        }

        .circle-3 {
          width: 400px;
          height: 400px;
          top: 40%;
          left: 40%;
          animation-delay: 10s;
        }

        .circle-4 {
          width: 150px;
          height: 150px;
          top: 80%;
          left: 10%;
          animation-delay: 15s;
        }

        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -50px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }

        .map-container {
          border-radius: 12px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Map;
