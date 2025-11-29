import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Download,
  TrendingUp,
  AlertTriangle,
  Activity,
  Zap,
  Leaf,
} from "lucide-react";

const ExpertDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  // ML-based traffic prediction data
  const trafficPrediction = [
    { hour: "00:00", actual: 45, predicted: 48, congestion: 35 },
    { hour: "04:00", actual: 28, predicted: 25, congestion: 20 },
    { hour: "08:00", actual: 185, predicted: 190, congestion: 95 },
    { hour: "12:00", actual: 156, predicted: 152, congestion: 80 },
    { hour: "16:00", actual: 198, predicted: 195, congestion: 98 },
    { hour: "20:00", actual: 142, predicted: 145, congestion: 75 },
  ];

  // Air quality correlation data
  const aqiTrafficCorrelation = [
    { zone: "Downtown", aqi: 78, traffic: 185, emissions: 45 },
    { zone: "Industrial", aqi: 152, traffic: 98, emissions: 78 },
    { zone: "Residential", aqi: 42, traffic: 45, emissions: 18 },
    { zone: "Commercial", aqi: 85, traffic: 165, emissions: 52 },
    { zone: "Suburban", aqi: 38, traffic: 35, emissions: 15 },
  ];

  // Noise level heatmap data
  const noiseLevels = [
    {
      time: "6 AM",
      Mon: 55,
      Tue: 52,
      Wed: 58,
      Thu: 56,
      Fri: 60,
      Sat: 45,
      Sun: 42,
    },
    {
      time: "9 AM",
      Mon: 72,
      Tue: 75,
      Wed: 73,
      Thu: 74,
      Fri: 78,
      Sat: 58,
      Sun: 52,
    },
    {
      time: "12 PM",
      Mon: 68,
      Tue: 70,
      Wed: 69,
      Thu: 71,
      Fri: 72,
      Sat: 65,
      Sun: 60,
    },
    {
      time: "3 PM",
      Mon: 75,
      Tue: 73,
      Wed: 76,
      Thu: 74,
      Fri: 77,
      Sat: 68,
      Sun: 62,
    },
    {
      time: "6 PM",
      Mon: 82,
      Tue: 85,
      Wed: 83,
      Thu: 84,
      Fri: 88,
      Sat: 72,
      Sun: 65,
    },
    {
      time: "9 PM",
      Mon: 62,
      Tue: 60,
      Wed: 63,
      Thu: 61,
      Fri: 68,
      Sat: 70,
      Sun: 65,
    },
  ];

  // Environmental impact radar
  const environmentalImpact = [
    { metric: "Air Quality", value: 68, fullMark: 100 },
    { metric: "Noise", value: 45, fullMark: 100 },
    { metric: "Congestion", value: 78, fullMark: 100 },
    { metric: "Emissions", value: 62, fullMark: 100 },
    { metric: "Green Coverage", value: 55, fullMark: 100 },
  ];

  // Peak hour analysis
  const peakHourData = [
    { day: "Mon", morning: 185, evening: 198 },
    { day: "Tue", morning: 192, evening: 205 },
    { day: "Wed", morning: 188, evening: 195 },
    { day: "Thu", morning: 195, evening: 208 },
    { day: "Fri", morning: 210, evening: 225 },
    { day: "Sat", morning: 95, evening: 135 },
    { day: "Sun", morning: 68, evening: 98 },
  ];

  const toggleMode = () => {
    setDarkMode(!darkMode);
  };

  // Custom header component matching the Gyatah design
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
              Light
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
              Dark
            </span>
          </div>
        </div>
      </div>
    </header>
  );

  // Custom footer component matching the Gyatah design
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
                <span className="text-sm">f</span>
              </a>
              <a
                href="#"
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  darkMode
                    ? "bg-green-700 hover:bg-green-600"
                    : "bg-green-600 hover:bg-green-700"
                } text-white transition-colors duration-300`}
              >
                <span className="text-sm">t</span>
              </a>
              <a
                href="#"
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  darkMode
                    ? "bg-green-700 hover:bg-green-600"
                    : "bg-green-600 hover:bg-green-700"
                } text-white transition-colors duration-300`}
              >
                <span className="text-sm">in</span>
              </a>
              <a
                href="#"
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  darkMode
                    ? "bg-green-700 hover:bg-green-600"
                    : "bg-green-600 hover:bg-green-700"
                } text-white transition-colors duration-300`}
              >
                <span className="text-sm">ig</span>
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
                href="/map"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                Eco-Route Finder
              </a>
              <a
                href="/dashboard"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                Live Dashboard
              </a>
              <a
                href="/personal"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                Personal Dashboard
              </a>
              <a
                href="/gamification"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                Gamification
              </a>
              <a
                href="/chatbot"
                className={`text-sm transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-green-400 hover:pl-2"
                    : "text-gray-600 hover:text-green-600 hover:pl-2"
                }`}
              >
                AI Chatbot
              </a>
              <a
                href="/community"
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

  // Animated Background Component
  const AnimatedBackground = () => (
    <div className="animated-bg fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      <div className="bg-circle circle-1"></div>
      <div className="bg-circle circle-2"></div>
      <div className="bg-circle circle-3"></div>
      <div className="bg-circle circle-4"></div>
    </div>
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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className={`text-3xl font-bold mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Gyatah Expert Analytics Dashboard
              </h1>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                ML-powered insights and predictive analytics for urban
                sustainability
              </p>
            </div>
            <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card
              className={`p-6 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    darkMode ? "bg-green-700" : "bg-green-600"
                  }`}
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span
                  className={`text-xs font-medium ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  +12%
                </span>
              </div>
              <div
                className={`text-2xl font-bold mb-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                1,256
              </div>
              <div
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Active Sensors
              </div>
            </Card>

            <Card
              className={`p-6 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    darkMode ? "bg-yellow-600" : "bg-yellow-500"
                  }`}
                >
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <span
                  className={`text-xs font-medium ${
                    darkMode ? "text-yellow-400" : "text-yellow-600"
                  }`}
                >
                  ↑ 23
                </span>
              </div>
              <div
                className={`text-2xl font-bold mb-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                156
              </div>
              <div
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Congestion Alerts
              </div>
            </Card>

            <Card
              className={`p-6 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    darkMode ? "bg-blue-600" : "bg-blue-500"
                  }`}
                >
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span
                  className={`text-xs font-medium ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  +8.2%
                </span>
              </div>
              <div
                className={`text-2xl font-bold mb-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                89.4%
              </div>
              <div
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Model Accuracy
              </div>
            </Card>

            <Card
              className={`p-6 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    darkMode ? "bg-purple-600" : "bg-purple-500"
                  }`}
                >
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Real-time
                </span>
              </div>
              <div
                className={`text-2xl font-bold mb-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                2.3M
              </div>
              <div
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Data Points/Day
              </div>
            </Card>
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* ML Traffic Prediction */}
            <Card
              className={`p-6 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } transition-all duration-300 hover:shadow-lg`}
            >
              <h3
                className={`font-semibold mb-4 flex items-center gap-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <TrendingUp className="w-5 h-5 text-green-500" />
                ML Traffic Prediction vs Actual
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trafficPrediction}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#4B5563" : "#E5E7EB"}
                  />
                  <XAxis
                    dataKey="hour"
                    stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                    fontSize={12}
                  />
                  <YAxis
                    stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
                      borderColor: darkMode ? "#374151" : "#E5E7EB",
                      color: darkMode ? "#F9FAFB" : "#111827",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Predicted"
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stackId="2"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Actual"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div
                className={`mt-4 p-3 rounded-lg ${
                  darkMode ? "bg-green-900/30" : "bg-green-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    darkMode ? "text-green-300" : "text-green-800"
                  }`}
                >
                  <span className="font-semibold">Gyatah Insight:</span> Peak
                  congestion predicted at 16:00-17:00 with 95% confidence
                </p>
              </div>
            </Card>

            {/* AQI-Traffic Correlation */}
            <Card
              className={`p-6 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } transition-all duration-300 hover:shadow-lg`}
            >
              <h3
                className={`font-semibold mb-4 flex items-center gap-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <Activity className="w-5 h-5 text-green-500" />
                Air Quality vs Traffic Correlation
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aqiTrafficCorrelation}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#4B5563" : "#E5E7EB"}
                  />
                  <XAxis
                    dataKey="zone"
                    stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                    fontSize={12}
                  />
                  <YAxis
                    stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
                      borderColor: darkMode ? "#374151" : "#E5E7EB",
                      color: darkMode ? "#F9FAFB" : "#111827",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="aqi"
                    fill="#f59e0b"
                    name="AQI Level"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="traffic"
                    fill="#10b981"
                    name="Traffic Index"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="emissions"
                    fill="#ef4444"
                    name="Emissions (kg)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div
                className={`mt-4 p-3 rounded-lg ${
                  darkMode ? "bg-yellow-900/30" : "bg-yellow-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    darkMode ? "text-yellow-300" : "text-yellow-800"
                  }`}
                >
                  <span className="font-semibold">Gyatah Correlation:</span>{" "}
                  0.87 between traffic volume and air quality degradation
                </p>
              </div>
            </Card>
          </div>

          {/* Second Row Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Peak Hour Analysis */}
            <Card
              className={`p-6 lg:col-span-2 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } transition-all duration-300 hover:shadow-lg`}
            >
              <h3
                className={`font-semibold mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Weekly Peak Hour Analysis
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={peakHourData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#4B5563" : "#E5E7EB"}
                  />
                  <XAxis
                    dataKey="day"
                    stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                    fontSize={12}
                  />
                  <YAxis
                    stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
                      borderColor: darkMode ? "#374151" : "#E5E7EB",
                      color: darkMode ? "#F9FAFB" : "#111827",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="morning"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Morning Rush"
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="evening"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="Evening Rush"
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    darkMode ? "bg-blue-900/30" : "bg-blue-50"
                  }`}
                >
                  <div
                    className={`text-sm ${
                      darkMode ? "text-blue-300" : "text-blue-600"
                    }`}
                  >
                    Average Morning Peak
                  </div>
                  <div
                    className={`text-xl font-bold ${
                      darkMode ? "text-blue-400" : "text-blue-700"
                    }`}
                  >
                    8:15 - 9:30 AM
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    darkMode ? "bg-red-900/30" : "bg-red-50"
                  }`}
                >
                  <div
                    className={`text-sm ${
                      darkMode ? "text-red-300" : "text-red-600"
                    }`}
                  >
                    Average Evening Peak
                  </div>
                  <div
                    className={`text-xl font-bold ${
                      darkMode ? "text-red-400" : "text-red-700"
                    }`}
                  >
                    5:45 - 7:15 PM
                  </div>
                </div>
              </div>
            </Card>

            {/* Environmental Impact Radar */}
            <Card
              className={`p-6 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } transition-all duration-300 hover:shadow-lg`}
            >
              <h3
                className={`font-semibold mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Environmental Impact
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={environmentalImpact}>
                  <PolarGrid stroke={darkMode ? "#4B5563" : "#E5E7EB"} />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{
                      fill: darkMode ? "#9CA3AF" : "#6B7280",
                      fontSize: 11,
                    }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{
                      fill: darkMode ? "#9CA3AF" : "#6B7280",
                      fontSize: 10,
                    }}
                  />
                  <Radar
                    name="Impact Score"
                    dataKey="value"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.5}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
                      borderColor: darkMode ? "#374151" : "#E5E7EB",
                      color: darkMode ? "#F9FAFB" : "#111827",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div
                className={`mt-4 p-3 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Gyatah weighted score based on WHO standards and local
                  regulations
                </p>
              </div>
            </Card>
          </div>

          {/* Heatmap Section */}
          <Card
            className={`p-6 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } transition-all duration-300 hover:shadow-lg`}
          >
            <h3
              className={`font-semibold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Noise Level Heatmap (dB) - Weekly Pattern
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th
                      className={`text-left p-2 text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Time
                    </th>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <th
                          key={day}
                          className={`text-center p-2 text-sm font-medium ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {day}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {noiseLevels.map((row) => (
                    <tr key={row.time}>
                      <td
                        className={`p-2 text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {row.time}
                      </td>
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => {
                          const value = row[day as keyof typeof row] as number;
                          const intensity =
                            value < 50
                              ? darkMode
                                ? "bg-green-900/40"
                                : "bg-green-100"
                              : value < 70
                              ? darkMode
                                ? "bg-yellow-900/40"
                                : "bg-yellow-100"
                              : darkMode
                              ? "bg-red-900/40"
                              : "bg-red-100";
                          return (
                            <td
                              key={day}
                              className={`p-2 text-center ${intensity} text-sm font-semibold ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {value}
                            </td>
                          );
                        }
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded ${
                    darkMode ? "bg-green-900/40" : "bg-green-100"
                  }`}
                ></div>
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  &lt; 50 dB (Quiet)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded ${
                    darkMode ? "bg-yellow-900/40" : "bg-yellow-100"
                  }`}
                ></div>
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  50-70 dB (Moderate)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded ${
                    darkMode ? "bg-red-900/40" : "bg-red-100"
                  }`}
                ></div>
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  &gt; 70 dB (Loud)
                </span>
              </div>
            </div>
          </Card>
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
      `}</style>
    </div>
  );
};

export default ExpertDashboard;
