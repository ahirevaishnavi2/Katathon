let map;
let trafficMap;
let currentLat = 18.5204;
let currentLon = 73.8567;
let currentMode = "citizen";
let markers = [];
let trafficMapMarkers = [];
let trafficLayer;
let trafficIncidentsLayer;
let currentFilterType = "all";

function showSection(sectionName) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));

  document.getElementById(`${sectionName}-section`).classList.add("active");
  document
    .querySelector(`[data-section="${sectionName}"]`)
    .classList.add("active");

  if (sectionName === "map") {
    // Wait for section to be visible before initializing map
    setTimeout(() => {
      if (!map) {
        initMap();
      }
    }, 200);
  } else if (sectionName === "traffic-map") {
    // Wait a bit for the section to be visible before initializing map
    setTimeout(() => {
      if (!trafficMap) {
        initTrafficMap();
      } else {
        // Map already exists, just reload data
        loadTrafficMapData(currentFilterType);
        loadTrafficMapStats();
        setupTrafficMapFilters();
      }
    }, 200);
  } else if (sectionName === "dashboard") {
    loadDashboard();
  } else if (sectionName === "community") {
    loadCommunityPosts();
    loadLeaderboard();
  }
}

function initMap() {
  console.log(
    "initMap called, map exists:",
    !!map,
    "tt defined:",
    typeof tt !== "undefined"
  );

  if (!map && typeof tt !== "undefined") {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) {
      console.error("Map container not found");
      return;
    }

    // Check if container is visible
    const containerStyle = window.getComputedStyle(mapContainer);
    console.log("Container style:", {
      display: containerStyle.display,
      visibility: containerStyle.visibility,
      width: containerStyle.width,
      height: containerStyle.height,
    });

    if (
      containerStyle.display === "none" ||
      containerStyle.visibility === "hidden"
    ) {
      console.log("Map container not visible yet, will retry...");
      setTimeout(initMap, 200);
      return;
    }

    try {
      console.log(
        "Initializing TomTom map with key:",
        TOMTOM_API_KEY ? "SET" : "NOT SET"
      );
      map = tt.map({
        key: TOMTOM_API_KEY || "demo",
        container: "map",
        center: [currentLon, currentLat],
        zoom: 13,
        style:
          "https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAbmlnaHQtc3R5bGU7MDs0YzFhYTdiYS1mYzc3LTRiNjUtYjRmNy1lNDkzZGRkMTlmMWE.json?key=" +
          (TOMTOM_API_KEY || "demo"),
      });
      console.log("Map initialized successfully");

      trafficLayer = tt.trafficLayer({
        key: TOMTOM_API_KEY || "demo",
        trafficFlow: true,
        trafficIncidents: false,
      });

      trafficIncidentsLayer = tt.trafficLayer({
        key: TOMTOM_API_KEY || "demo",
        trafficFlow: false,
        trafficIncidents: true,
      });

      map.on("load", function () {
        // Resize map to ensure it displays correctly
        map.resize();
        addMapMarkers();
        updateMapMode();
      });

      map.on("error", function (e) {
        console.error("Map error:", e);
      });

      // Also resize after a short delay to ensure container is fully visible
      setTimeout(() => {
        if (map) {
          map.resize();
        }
      }, 500);
    } catch (e) {
      console.error("Error initializing map:", e);
    }
  } else if (typeof tt === "undefined") {
    console.error(
      "TomTom SDK not loaded. Please check if TomTom scripts are included."
    );
    const mapContainer = document.getElementById("map");
    if (mapContainer) {
      mapContainer.innerHTML =
        '<div style="padding: 2rem; text-align: center; color: #666;"><p>⚠️ TomTom SDK not loaded. Please refresh the page.</p></div>';
    }
  } else if (map) {
    // Map already exists, just resize it
    map.resize();
  }
}

function addMapMarkers() {
  if (!map) return;

  markers.forEach((m) => m.remove());
  markers = [];

  const zones = [
    {
      lat: 18.5204,
      lon: 73.8567,
      type: "busy",
      name: "FC Road - High Traffic",
      aqi: 120,
      noise: 75,
    },
    {
      lat: 18.5314,
      lon: 73.8446,
      type: "calm",
      name: "Koregaon Park - Calm Zone",
      aqi: 65,
      noise: 45,
    },
    {
      lat: 18.5074,
      lon: 73.8077,
      type: "pollution",
      name: "Industrial Area - High Pollution",
      aqi: 150,
      noise: 80,
    },
    {
      lat: 18.5362,
      lon: 73.897,
      type: "calm",
      name: "Viman Nagar - Low Traffic",
      aqi: 70,
      noise: 50,
    },
  ];

  zones.forEach((zone) => {
    const icon =
      currentMode === "citizen"
        ? zone.type === "busy"
          ? "🚗"
          : zone.type === "calm"
          ? "🌿"
          : "😷"
        : "📍";

    const el = document.createElement("div");
    el.className = "custom-marker";
    el.innerHTML = `<div style="font-size: 24px; cursor: pointer;">${icon}</div>`;

    const popup = new tt.Popup({ offset: 35 }).setHTML(
      `<div style="padding: 10px;">
                <strong>${zone.name}</strong><br>
                <small>Type: ${zone.type}</small><br>
                ${
                  currentMode === "expert"
                    ? `
                    <small>AQI: ${zone.aqi}</small><br>
                    <small>Noise: ${zone.noise} dB</small>
                `
                    : ""
                }
            </div>`
    );

    const marker = new tt.Marker({ element: el })
      .setLngLat([zone.lon, zone.lat])
      .setPopup(popup)
      .addTo(map);

    markers.push(marker);
  });
}

function updateMapMode() {
  if (!map) return;

  if (currentMode === "citizen") {
    if (trafficLayer.isOnTheMap()) {
      map.removeLayer(trafficLayer);
    }
    if (trafficIncidentsLayer.isOnTheMap()) {
      map.removeLayer(trafficIncidentsLayer);
    }
    addMapMarkers();
  } else {
    const trafficFlowCheckbox = document.querySelector(
      '#expert-legend input[data-layer="traffic-flow"]'
    );
    const trafficIncidentsCheckbox = document.querySelector(
      '#expert-legend input[data-layer="traffic-incidents"]'
    );
    const poiClustersCheckbox = document.querySelector(
      '#expert-legend input[data-layer="poi-clusters"]'
    );

    if (
      trafficFlowCheckbox &&
      trafficFlowCheckbox.checked &&
      !trafficLayer.isOnTheMap()
    ) {
      map.addLayer(trafficLayer);
    } else if (
      trafficFlowCheckbox &&
      !trafficFlowCheckbox.checked &&
      trafficLayer.isOnTheMap()
    ) {
      map.removeLayer(trafficLayer);
    }

    if (
      trafficIncidentsCheckbox &&
      trafficIncidentsCheckbox.checked &&
      !trafficIncidentsLayer.isOnTheMap()
    ) {
      map.addLayer(trafficIncidentsLayer);
    } else if (
      trafficIncidentsCheckbox &&
      !trafficIncidentsCheckbox.checked &&
      trafficIncidentsLayer.isOnTheMap()
    ) {
      map.removeLayer(trafficIncidentsLayer);
    }

    if (poiClustersCheckbox && poiClustersCheckbox.checked) {
      addMapMarkers();
    } else if (poiClustersCheckbox && !poiClustersCheckbox.checked) {
      markers.forEach((m) => m.remove());
      markers = [];
    }
  }
}

document.querySelectorAll(".mode-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll(".mode-btn")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");

    currentMode = this.dataset.mode;

    if (currentMode === "citizen") {
      document.getElementById("citizen-legend").style.display = "block";
      document.getElementById("expert-legend").style.display = "none";
    } else {
      document.getElementById("citizen-legend").style.display = "none";
      document.getElementById("expert-legend").style.display = "block";
    }

    updateMapMode();
  });
});

document
  .querySelectorAll('#expert-legend input[type="checkbox"]')
  .forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      if (!map) return;

      const layerType = this.dataset.layer;

      if (layerType === "traffic-flow") {
        if (this.checked && !trafficLayer.isOnTheMap()) {
          map.addLayer(trafficLayer);
        } else if (!this.checked && trafficLayer.isOnTheMap()) {
          map.removeLayer(trafficLayer);
        }
      } else if (layerType === "traffic-incidents") {
        if (this.checked && !trafficIncidentsLayer.isOnTheMap()) {
          map.addLayer(trafficIncidentsLayer);
        } else if (!this.checked && trafficIncidentsLayer.isOnTheMap()) {
          map.removeLayer(trafficIncidentsLayer);
        }
      } else if (layerType === "poi-clusters") {
        if (this.checked) {
          addMapMarkers();
        } else {
          markers.forEach((m) => m.remove());
          markers = [];
        }
      }
    });
  });

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLat = position.coords.latitude;
        currentLon = position.coords.longitude;
        document.getElementById("location-input").value = `${currentLat.toFixed(
          4
        )}, ${currentLon.toFixed(4)}`;

        if (map) {
          map.setCenter([currentLon, currentLat]);
        }
      },
      (error) => {
        alert("Unable to get your location. Using default location (Pune).");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

async function analyzeLocation() {
  const input = document.getElementById("location-input").value;

  let lat = currentLat;
  let lon = currentLon;

  if (input.includes(",")) {
    const coords = input.split(",");
    lat = parseFloat(coords[0]);
    lon = parseFloat(coords[1]);
  }

  try {
    const response = await fetch("/api/location/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lon, query: input || "points of interest" }),
    });

    const data = await response.json();
    displayAnalysisResults(data);
  } catch (error) {
    console.error("Analysis error:", error);
    alert("Failed to analyze location. Please try again.");
  }
}

function displayAnalysisResults(data) {
  const resultsDiv = document.getElementById("analysis-results");
  const contentDiv = document.getElementById("analysis-content");

  let html = `
        <div class="ai-insight">${data.insight}</div>
        
        <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0;">
            <div class="metric-card" style="background: var(--card-bg); padding: 1rem; border-radius: 10px; text-align: center;">
                <h4>Air Quality Index</h4>
                <p style="font-size: 2rem; font-weight: bold; color: ${
                  data.metrics.aqi < 100
                    ? "var(--primary-color)"
                    : "var(--warning-color)"
                };">${data.metrics.aqi}</p>
            </div>
            <div class="metric-card" style="background: var(--card-bg); padding: 1rem; border-radius: 10px; text-align: center;">
                <h4>Noise Level</h4>
                <p style="font-size: 2rem; font-weight: bold; color: var(--warning-color);">${
                  data.metrics.noise_level
                } dB</p>
            </div>
            <div class="metric-card" style="background: var(--card-bg); padding: 1rem; border-radius: 10px; text-align: center;">
                <h4>Traffic Level</h4>
                <p style="font-size: 2rem; font-weight: bold; color: var(--danger-color);">${
                  data.metrics.traffic_level
                }%</p>
            </div>
        </div>
        
        <h4>Traffic Pattern Analysis (ML-Powered)</h4>
        <p style="margin: 1rem 0;">${data.traffic_pattern.pattern}</p>
        
        <h4 style="margin-top: 2rem;">Points of Interest (TomTom API)</h4>
        <div style="display: grid; gap: 1rem; margin-top: 1rem;">
    `;

  data.locations.forEach((loc) => {
    html += `
            <div style="background: var(--bg-color); padding: 1rem; border-radius: 8px;">
                <strong>${loc.name}</strong><br>
                <small style="color: var(--text-light);">
                    ${loc.category} | Zone Type: ${
      loc.zone_type || "Analyzing..."
    } | 
                    Coordinates: ${loc.lat.toFixed(4)}, ${loc.lon.toFixed(4)}
                </small>
            </div>
        `;
  });

  html += "</div>";

  contentDiv.innerHTML = html;
  resultsDiv.style.display = "block";
}

async function loadDashboard() {
  try {
    const response = await fetch("/api/dashboard");
    const data = await response.json();

    updateGauge("green-score", data.user.green_score, 100);
    updateGauge("aqi", data.metrics.aqi, 200);
    updateGauge("noise", data.metrics.noise, 100);
    updateGauge("traffic", data.metrics.traffic, 100);

    document.getElementById(
      "co2-saved"
    ).textContent = `${data.user.co2_saved} kg`;
    document.getElementById("clean-trips").textContent = data.user.clean_trips;
    document.getElementById("eco-streak").textContent = `${data.streak} days`;
    document.getElementById("eco-points").textContent = data.user.eco_points;

    document.getElementById("main-insight").textContent = data.insight;

    const badgesContainer = document.getElementById("badges-container");
    badgesContainer.innerHTML = data.badges
      .map(
        (badge) => `
            <div class="badge-item">
                <div class="badge-icon">${badge.badge_icon}</div>
                <div>${badge.badge_name}</div>
            </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Dashboard error:", error);
  }
}

function updateGauge(id, value, max) {
  const percentage = (value / max) * 100;
  const offset = 283 - (283 * percentage) / 100;

  const gauge = document.getElementById(`${id}-gauge`);
  const text = document.getElementById(`${id}-text`);

  if (gauge) gauge.style.strokeDashoffset = offset;
  if (text) text.textContent = Math.round(value);
}

function toggleChatbot() {
  const chatbot = document.getElementById("chatbot-window");
  chatbot.style.display = chatbot.style.display === "none" ? "flex" : "none";
}

async function sendChatMessage() {
  const input = document.getElementById("chatbot-input");
  const message = input.value.trim();

  if (!message) return;

  const messagesDiv = document.getElementById("chatbot-messages");

  messagesDiv.innerHTML += `<div class="user-message">${message}</div>`;
  input.value = "";

  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  try {
    const response = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    messagesDiv.innerHTML += `<div class="bot-message">${data.response}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (error) {
    console.error("Chatbot error:", error);
    messagesDiv.innerHTML += `<div class="bot-message">Sorry, I'm having trouble right now. Please try again!</div>`;
  }
}

function showRouteModal() {
  document.getElementById("route-modal").style.display = "block";
}

function closeRouteModal() {
  document.getElementById("route-modal").style.display = "none";
}

async function planRoute() {
  const startLoc = document.getElementById("start-location").value;
  const endLoc = document.getElementById("end-location").value;
  const routeType = document.querySelector(
    'input[name="route-type"]:checked'
  ).value;

  if (!endLoc) {
    alert("Please enter a destination");
    return;
  }

  const startCoords = startLoc
    ? parseCoords(startLoc)
    : { lat: currentLat, lon: currentLon };
  const endCoords = parseCoords(endLoc) || { lat: 18.5362, lon: 73.897 };

  try {
    const response = await fetch("/api/route/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start_lat: startCoords.lat,
        start_lon: startCoords.lon,
        end_lat: endCoords.lat,
        end_lon: endCoords.lon,
        route_type: routeType,
      }),
    });

    const data = await response.json();

    if (data.route && data.route.legs && data.route.legs[0].points) {
      if (map && typeof tt !== "undefined") {
        const coordinates = data.route.legs[0].points.map((p) => [
          p.longitude,
          p.latitude,
        ]);

        if (map.getSource("route")) {
          map.removeLayer("route");
          map.removeSource("route");
        }

        map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: coordinates,
              },
            },
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": routeType === "eco" ? "#10b981" : "#3b82f6",
            "line-width": 5,
          },
        });

        const bounds = new tt.LngLatBounds();
        coordinates.forEach((coord) => bounds.extend(coord));
        map.fitBounds(bounds, { padding: 50 });

        showSection("map");
      }
    }

    document.getElementById("route-results").innerHTML = `
            <div style="background: var(--bg-color); padding: 1.5rem; border-radius: 10px; margin-top: 1rem;">
                <h3>🎉 Route Planned Successfully!</h3>
                <p><strong>Distance:</strong> ${data.distance_km} km</p>
                <p><strong>Travel Time:</strong> ${
                  data.travel_time_min
                } minutes</p>
                <p><strong>Route Type:</strong> ${
                  data.route_type === "eco" ? "Eco-Friendly 🌿" : "Fastest ⚡"
                }</p>
                <p><strong>Eco Points Earned:</strong> +${
                  data.eco_points_earned
                } points</p>
                ${
                  data.co2_saved > 0
                    ? `<p><strong>CO₂ Saved:</strong> ${data.co2_saved} kg 🌍</p>`
                    : ""
                }
                <div style="background: var(--primary-color); color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    🏅 Great choice! You're making a positive impact! The route is now displayed on the map.
                </div>
            </div>
        `;
  } catch (error) {
    console.error("Route planning error:", error);
    alert("Failed to plan route. Please try again.");
  }
}

function parseCoords(input) {
  if (input.includes(",")) {
    const parts = input.split(",");
    return { lat: parseFloat(parts[0]), lon: parseFloat(parts[1]) };
  }
  return null;
}

async function loadCommunityPosts() {
  try {
    const response = await fetch("/api/community/posts");
    const data = await response.json();

    const feedDiv = document.getElementById("community-feed");
    feedDiv.innerHTML = data.posts
      .map(
        (post) => `
            <div class="post-item">
                <div class="post-header">
                    <div class="post-title">${post.title}</div>
                    <span class="post-type-badge">${post.post_type.replace(
                      "_",
                      " "
                    )}</span>
                </div>
                <p>${post.content}</p>
                <div class="post-meta">
                    📍 ${post.location} | 👤 ${post.username} | 
                    ${new Date(post.created_at).toLocaleDateString()}
                </div>
                <button class="upvote-btn" onclick="upvotePost(${post.id})">
                    👍 Upvote (${post.upvotes})
                </button>
            </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error loading posts:", error);
  }
}

async function loadLeaderboard() {
  try {
    const response = await fetch("/api/leaderboard");
    const data = await response.json();

    const leaderboardDiv = document.getElementById("leaderboard-list");
    leaderboardDiv.innerHTML = data.leaderboard
      .map(
        (user, index) => `
            <div class="leaderboard-item">
                <span class="rank">${
                  index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : index + 1
                }</span>
                <div style="flex: 1;">
                    <strong>${user.username}</strong><br>
                    <small>${user.eco_points} points | ${
          user.co2_saved
        } kg CO₂ saved</small>
                </div>
                <div style="text-align: right;">
                    <div>Green Score: ${user.green_score}</div>
                    <small>${user.streak_days} day streak</small>
                </div>
            </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error loading leaderboard:", error);
  }
}

function showPostModal() {
  document.getElementById("post-modal").style.display = "block";
}

function closePostModal() {
  document.getElementById("post-modal").style.display = "none";
}

async function submitPost() {
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;
  const location = document.getElementById("post-location").value;
  const postType = document.getElementById("post-type").value;

  if (!title || !content || !location) {
    alert("Please fill in all fields");
    return;
  }

  try {
    await fetch("/api/community/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, location, post_type: postType }),
    });

    closePostModal();
    loadCommunityPosts();

    document.getElementById("post-title").value = "";
    document.getElementById("post-content").value = "";
    document.getElementById("post-location").value = "";
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Failed to create post. Please try again.");
  }
}

async function upvotePost(postId) {
  try {
    await fetch(`/api/community/upvote/${postId}`, { method: "POST" });
    loadCommunityPosts();
  } catch (error) {
    console.error("Error upvoting:", error);
  }
}

window.onclick = function (event) {
  const routeModal = document.getElementById("route-modal");
  const postModal = document.getElementById("post-modal");
  if (event.target === routeModal) {
    closeRouteModal();
  }
  if (event.target === postModal) {
    closePostModal();
  }
};

function initTrafficMap() {
  if (!trafficMap && typeof tt !== "undefined") {
    const mapContainer = document.getElementById("traffic-map");
    if (!mapContainer) {
      console.error("Traffic map container not found");
      return;
    }

    // Check if container is visible (has dimensions)
    const containerStyle = window.getComputedStyle(mapContainer);
    if (
      containerStyle.display === "none" ||
      containerStyle.visibility === "hidden"
    ) {
      console.log("Map container not visible yet, will retry...");
      return;
    }

    try {
      trafficMap = tt.map({
        key: TOMTOM_API_KEY || "demo",
        container: "traffic-map",
        center: [currentLon, currentLat],
        zoom: 13,
        style:
          "https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAbmlnaHQtc3R5bGU7MDs0YzFhYTdiYS1mYzc3LTRiNjUtYjRmNy1lNDkzZGRkMTlmMWE.json?key=" +
          (TOMTOM_API_KEY || "demo"),
      });

      // Add traffic flow layer
      const trafficFlowLayer = tt.trafficLayer({
        key: TOMTOM_API_KEY || "demo",
        trafficFlow: true,
        trafficIncidents: false,
      });

      trafficMap.on("load", function () {
        try {
          trafficMap.addLayer(trafficFlowLayer);
          // Load data after map is ready
          loadTrafficMapData(currentFilterType);
          loadTrafficMapStats();
          setupTrafficMapFilters();
        } catch (e) {
          console.error("Error adding traffic layer:", e);
        }
      });
    } catch (e) {
      console.error("Error initializing traffic map:", e);
    }
  }
}

async function loadTrafficMapData(filterType = "all") {
  try {
    const response = await fetch(`/api/traffic-map/points?type=${filterType}`);
    const data = await response.json();

    // Update point counts
    Object.keys(data.type_counts).forEach((type) => {
      const countElement = document.getElementById(`count-${type}`);
      if (countElement) {
        countElement.textContent = `(${data.type_counts[type]})`;
      }
    });

    // Clear existing markers
    trafficMapMarkers.forEach((marker) => marker.remove());
    trafficMapMarkers = [];

    if (!trafficMap) return;

    // Add markers for each point
    data.points.forEach((point) => {
      const icon = getPointTypeIcon(point.type);
      const color = getPointTypeColor(point.type);

      const el = document.createElement("div");
      el.className = "traffic-map-marker";
      el.innerHTML = `<div style="font-size: 28px; cursor: pointer; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${icon}</div>`;

      const popup = new tt.Popup({ offset: 35 }).setHTML(
        `<div style="padding: 12px; min-width: 200px;">
                    <strong style="font-size: 16px; color: ${color};">${
          point.name
        }</strong><br>
                    <small style="color: #666;">${
                      point.description
                    }</small><br><br>
                    <div style="margin-top: 8px;">
                        <div style="display: flex; justify-content: space-between; margin: 4px 0;">
                            <span>Traffic Level:</span>
                            <strong style="color: ${
                              point.traffic_level > 70
                                ? "#ef4444"
                                : point.traffic_level > 40
                                ? "#f59e0b"
                                : "#10b981"
                            };">${point.traffic_level}%</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 4px 0;">
                            <span>Air Quality:</span>
                            <strong style="color: ${
                              point.aqi < 100
                                ? "#10b981"
                                : point.aqi < 150
                                ? "#f59e0b"
                                : "#ef4444"
                            };">${point.aqi}</strong>
                        </div>
                    </div>
                </div>`
      );

      const marker = new tt.Marker({ element: el })
        .setLngLat([point.lon, point.lat])
        .setPopup(popup)
        .addTo(trafficMap);

      trafficMapMarkers.push(marker);
    });

    // Fit map to show all markers
    if (data.points.length > 0) {
      const bounds = new tt.LngLatBounds();
      data.points.forEach((point) => {
        bounds.extend([point.lon, point.lat]);
      });
      trafficMap.fitBounds(bounds, { padding: 50 });
    }
  } catch (error) {
    console.error("Error loading traffic map data:", error);
  }
}

function getPointTypeIcon(type) {
  const icons = {
    high_traffic: "🚗",
    environmental_monitoring: "🌿",
    transport_hub: "🚉",
    smart_infrastructure: "⚡",
    safety_zone: "🛡️",
  };
  return icons[type] || "📍";
}

function getPointTypeColor(type) {
  const colors = {
    high_traffic: "#ef4444",
    environmental_monitoring: "#10b981",
    transport_hub: "#3b82f6",
    smart_infrastructure: "#f59e0b",
    safety_zone: "#8b5cf6",
  };
  return colors[type] || "#6b7280";
}

async function loadTrafficMapStats() {
  try {
    const response = await fetch("/api/traffic-map/stats");
    const data = await response.json();

    document.getElementById("stat-active-points").textContent =
      data.active_points;
    document.getElementById("stat-coverage").textContent = data.total_coverage;
    document.getElementById("stat-frequency").textContent =
      data.update_frequency;
  } catch (error) {
    console.error("Error loading traffic map stats:", error);
  }
}

function setupTrafficMapFilters() {
  // Remove existing event listeners by removing and re-adding
  const pointTypeList = document.getElementById("point-type-list");
  if (!pointTypeList) return;

  const pointTypeItems = pointTypeList.querySelectorAll(".point-type-item");
  pointTypeItems.forEach((item) => {
    // Remove any existing click handlers
    const newItem = item.cloneNode(true);
    item.parentNode.replaceChild(newItem, item);

    // Add click event listener
    newItem.addEventListener("click", function () {
      // Remove active class from all items
      pointTypeList
        .querySelectorAll(".point-type-item")
        .forEach((i) => i.classList.remove("active"));
      // Add active class to clicked item
      this.classList.add("active");

      // Get filter type
      currentFilterType = this.dataset.type;

      // Reload map data with filter
      loadTrafficMapData(currentFilterType);
    });
  });
}

// Add event listeners for navigation buttons
document.addEventListener("DOMContentLoaded", function () {
  // Set up navigation button click handlers
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const sectionName = this.getAttribute("data-section");
      if (sectionName) {
        showSection(sectionName);
      }
    });
  });
});

window.onload = function () {
  loadDashboard();

  const insights = [
    "AI-powered urban intelligence at your fingertips 🧠",
    "Making cities greener, one route at a time 🌿",
    "Your personal eco-assistant for sustainable living 🌍",
  ];
  document.getElementById("main-insight").textContent =
    insights[Math.floor(Math.random() * insights.length)];
};


