import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wind, Volume2, Navigation, MapPin, Leaf, Filter } from "lucide-react";
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
  const [showAQI, setShowAQI] = useState(false);
  const [minAQI, setMinAQI] = useState(50);
  const [showNoise, setShowNoise] = useState(false);
  const [minNoise, setMinNoise] = useState(50);
  const [trafficFilter, setTrafficFilter] = useState<
    "Any" | "Low" | "Medium" | "High"
  >("Any");
  const zoneMarkers = useRef<tt.Marker[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const userMarkerRef = useRef<tt.Marker | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [selectedPointTypes, setSelectedPointTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Zone data with type categorization
  const zones = [
    {
      id: 1,
      name: "High Traffic Zone",
      emoji: "🚗",
      type: "High Traffic Zone",
      status: "Active",
      aqi: 78,
      noise: 72,
      traffic: "High",
      lat: 18.5204,
      lon: 73.8567,
    },
    {
      id: 2,
      name: "Environmental Station",
      emoji: "🌿",
      type: "Environmental Monitoring",
      status: "Active",
      aqi: 35,
      noise: 45,
      traffic: "Low",
      lat: 18.5314,
      lon: 73.8446,
    },
    {
      id: 3,
      name: "Transport Hub",
      emoji: "🚆",
      type: "Transport Hub",
      status: "Active",
      aqi: 65,
      noise: 75,
      traffic: "High",
      lat: 18.5289,
      lon: 73.8744,
    },
    {
      id: 4,
      name: "Smart Infrastructure",
      emoji: "🏢",
      type: "Smart Infrastructure",
      status: "Active",
      aqi: 42,
      noise: 50,
      traffic: "Medium",
      lat: 18.5108,
      lon: 73.9277,
    },
    {
      id: 5,
      name: "Safety Zone",
      emoji: "🛡️",
      type: "Safety Zone",
      status: "Active",
      aqi: 40,
      noise: 48,
      traffic: "Low",
      lat: 18.5679,
      lon: 73.9143,
    },
  ];

  const [ecoRoute, setEcoRoute] = useState({
    distance_km: 0,
    eta_min: 0,
    ecoScore: 0,
    co2_saved: 0,
  });

  // Use your NEW API key
  const TOMTOM_KEY = "7wBtrtirm3avEgWj3L2NWuRfJGSIqrS2";

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
        // NOTE: custom tomtom:// scheme styles may cause browser fetch failures
        // because the Fetch API doesn't support the tomtom:// URL scheme.
        // Omit the `style` option to use the SDK's default style, or provide
        // a full HTTPS style JSON URL (e.g. a custom style JSON endpoint).
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
        selectedPointTypes.length > 0 &&
        !selectedPointTypes.includes(zone.type)
      ) {
        return false;
      }
      if (showAQI && zone.aqi < minAQI) return false;
      if (showNoise && zone.noise < minNoise) return false;
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
                <span>Type:</span>
                <span style="font-weight: 500;">${zone.type}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>AQI:</span>
                <span style="font-weight: 500; color: ${
                  zone.aqi > 70
                    ? "#ef4444"
                    : zone.aqi > 40
                    ? "#f59e0b"
                    : "#10b981"
                }">${zone.aqi}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Noise:</span>
                <span style="font-weight: 500;">${zone.noise} dB</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Traffic:</span>
                <span style="font-weight: 500; color: ${
                  zone.traffic === "High"
                    ? "#ef4444"
                    : zone.traffic === "Medium"
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
      "High Traffic Zone": "#ef4444",
      "Environmental Monitoring": "#10b981",
      "Transport Hub": "#f59e0b",
      "Smart Infrastructure": "#3b82f6",
      "Safety Zone": "#8b5cf6",
    };
    return colors[zone.type] || "#6b7280";
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
    selectedPointTypes,
    showAQI,
    minAQI,
    showNoise,
    minNoise,
    trafficFilter,
    mapLoaded,
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

        const newEcoRoute = {
          distance_km: Math.round((summary.lengthInMeters / 1000) * 10) / 10,
          eta_min: Math.round(summary.travelTimeInSeconds / 60),
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

  const togglePointType = (pointType: string) => {
    setSelectedPointTypes((prev) =>
      prev.includes(pointType)
        ? prev.filter((type) => type !== pointType)
        : [...prev, pointType]
    );
  };

  const selectAllPoints = () => {
    setSelectedPointTypes([]);
  };

  const uniquePointTypes = Array.from(new Set(zones.map((zone) => zone.type)));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 px-4 pb-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Live Map - Citizen Mode</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Filters</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {showFilters ? "Hide" : "Show"}
                  </Button>
                </div>

                {showFilters && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Point Types</h3>
                      <div className="space-y-2">
                        <div
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                          onClick={selectAllPoints}
                        >
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="mr-2"
                              checked={selectedPointTypes.length === 0}
                              onChange={selectAllPoints}
                            />
                            All Points
                          </label>
                          <span className="text-sm text-gray-500">
                            ({zones.length})
                          </span>
                        </div>
                        {uniquePointTypes.map((type) => (
                          <div
                            key={type}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                            onClick={() => togglePointType(type)}
                          >
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedPointTypes.includes(type)}
                                onChange={() => togglePointType(type)}
                              />
                              {type}
                            </label>
                            <span className="text-sm text-gray-500">
                              ({zones.filter((z) => z.type === type).length})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Air Quality (AQI)</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={showAQI}
                            onChange={(e) => setShowAQI(e.target.checked)}
                          />
                          <label>Filter by AQI</label>
                        </div>
                        {showAQI && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Min AQI: {minAQI}</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={minAQI}
                              onChange={(e) =>
                                setMinAQI(Number(e.target.value))
                              }
                              className="w-full"
                            />
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
                          <label>Filter by Noise</label>
                        </div>
                        {showNoise && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Min Noise: {minNoise} dB</span>
                            </div>
                            <input
                              type="range"
                              min="30"
                              max="100"
                              value={minNoise}
                              onChange={(e) =>
                                setMinNoise(Number(e.target.value))
                              }
                              className="w-full"
                            />
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
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="Any">Any Traffic</option>
                        <option value="Low">Low Traffic</option>
                        <option value="Medium">Medium Traffic</option>
                        <option value="High">High Traffic</option>
                      </select>
                    </div>
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Live Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Active Points
                    </div>
                    <div className="text-2xl font-bold">
                      {zones.filter((z) => z.status === "Active").length}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Total Coverage
                    </div>
                    <div className="text-lg font-semibold">City-wide</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Update Frequency
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      Real-time
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  {!isTracking ? (
                    <Button onClick={startTracking} className="w-full">
                      <Navigation className="w-4 h-4 mr-2" />
                      Track my location
                    </Button>
                  ) : (
                    <Button
                      onClick={stopTracking}
                      variant="destructive"
                      className="w-full"
                    >
                      Stop tracking
                    </Button>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Plan Eco-Route</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500 mb-2 block">
                      Starting Point
                    </label>
                    <Input
                      placeholder="Enter location"
                      value={startPoint}
                      onChange={(e) => setStartPoint(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-2 block">
                      Destination
                    </label>
                    <Input
                      placeholder="Enter location"
                      value={endPoint}
                      onChange={(e) => setEndPoint(e.target.value)}
                    />
                  </div>
                  <Button className="w-full gap-2" onClick={handleFindRoute}>
                    <Navigation className="w-4 h-4" />
                    Find Green Route
                  </Button>
                </div>
              </Card>

              {ecoRoute.distance_km > 0 && (
                <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Recommended Eco-Route</h3>
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {ecoRoute.ecoScore}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Distance</span>
                      <span className="font-semibold">
                        {ecoRoute.distance_km} km
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">ETA</span>
                      <span className="font-semibold">
                        {ecoRoute.eta_min} min
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">CO₂ Saved</span>
                      <span className="font-semibold text-green-600">
                        {ecoRoute.co2_saved} kg
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-100 rounded-lg flex items-start gap-2">
                    <Leaf className="w-5 h-5 text-green-600 mt-0.5" />
                    <p className="text-sm text-green-800">
                      This route avoids high pollution zones and saves{" "}
                      {ecoRoute.co2_saved}kg CO₂ vs fastest route
                    </p>
                  </div>
                </Card>
              )}

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Zone Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌿</span>
                    <div>
                      <div className="font-medium text-sm">Calm Zone</div>
                      <div className="text-xs text-gray-500">
                        Low traffic, good air quality
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚗</span>
                    <div>
                      <div className="font-medium text-sm">Busy Zone</div>
                      <div className="text-xs text-gray-500">
                        High traffic, moderate AQI
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">😷</span>
                    <div>
                      <div className="font-medium text-sm">Polluted Zone</div>
                      <div className="text-xs text-gray-500">
                        Poor air quality, high noise
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Map View */}
            <div className="lg:col-span-2">
              <Card className="p-6 h-[600px] relative overflow-hidden">
                {!mapLoaded && !mapError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading map...</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Using new API key: {TOMTOM_KEY.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                )}

                {mapError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="text-center p-4">
                      <div className="text-red-500 text-4xl mb-4">⚠️</div>
                      <p className="text-red-600 font-semibold mb-2">
                        Map Loading Failed
                      </p>
                      <p className="text-gray-600 mb-4">{mapError}</p>
                      <div className="text-sm text-gray-500 p-3 bg-gray-200 rounded">
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
    </div>
  );
};

export default Map;
