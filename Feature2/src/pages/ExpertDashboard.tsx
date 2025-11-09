import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Download, TrendingUp, AlertTriangle, Activity, Zap } from "lucide-react";

const ExpertDashboard = () => {
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
    { time: "6 AM", Mon: 55, Tue: 52, Wed: 58, Thu: 56, Fri: 60, Sat: 45, Sun: 42 },
    { time: "9 AM", Mon: 72, Tue: 75, Wed: 73, Thu: 74, Fri: 78, Sat: 58, Sun: 52 },
    { time: "12 PM", Mon: 68, Tue: 70, Wed: 69, Thu: 71, Fri: 72, Sat: 65, Sun: 60 },
    { time: "3 PM", Mon: 75, Tue: 73, Wed: 76, Thu: 74, Fri: 77, Sat: 68, Sun: 62 },
    { time: "6 PM", Mon: 82, Tue: 85, Wed: 83, Thu: 84, Fri: 88, Sat: 72, Sun: 65 },
    { time: "9 PM", Mon: 62, Tue: 60, Wed: 63, Thu: 61, Fri: 68, Sat: 70, Sun: 65 },
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 px-4 pb-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Expert Analytics Dashboard</h1>
              <p className="text-muted-foreground">ML-powered insights and predictive analytics</p>
            </div>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="p-6 bg-gradient-card border-primary/20">
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-eco flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-success font-medium">+12%</span>
              </div>
              <div className="text-2xl font-bold">1,256</div>
              <div className="text-sm text-muted-foreground">Active Sensors</div>
            </Card>

            <Card className="p-6 bg-gradient-card border-warning/20">
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning to-destructive flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-warning font-medium">↑ 23</span>
              </div>
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm text-muted-foreground">Congestion Alerts</div>
            </Card>

            <Card className="p-6 bg-gradient-card border-secondary/20">
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-success font-medium">+8.2%</span>
              </div>
              <div className="text-2xl font-bold">89.4%</div>
              <div className="text-sm text-muted-foreground">Model Accuracy</div>
            </Card>

            <Card className="p-6 bg-gradient-card border-primary/20">
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-eco flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-muted-foreground">Real-time</span>
              </div>
              <div className="text-2xl font-bold">2.3M</div>
              <div className="text-sm text-muted-foreground">Data Points/Day</div>
            </Card>
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* ML Traffic Prediction */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                ML Traffic Prediction vs Actual
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trafficPrediction}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="hour" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="predicted" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Predicted" />
                  <Area type="monotone" dataKey="actual" stackId="2" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.6} name="Actual" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Model Insight:</span> Peak congestion predicted at 16:00-17:00 with 95% confidence
                </p>
              </div>
            </Card>

            {/* AQI-Traffic Correlation */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-success" />
                AQI vs Traffic Correlation
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aqiTrafficCorrelation}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="zone" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="aqi" fill="hsl(var(--warning))" name="AQI Level" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="traffic" fill="hsl(var(--primary))" name="Traffic Index" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="emissions" fill="hsl(var(--destructive))" name="Emissions (kg)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-warning/10 rounded-lg">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Correlation:</span> 0.87 between traffic volume and AQI degradation
                </p>
              </div>
            </Card>
          </div>

          {/* Second Row Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Peak Hour Analysis */}
            <Card className="p-6 lg:col-span-2">
              <h3 className="font-semibold mb-4">Weekly Peak Hour Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={peakHourData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="day" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="morning" stroke="hsl(var(--secondary))" strokeWidth={3} name="Morning Rush" dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="evening" stroke="hsl(var(--destructive))" strokeWidth={3} name="Evening Rush" dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <div className="text-sm text-muted-foreground">Average Morning Peak</div>
                  <div className="text-xl font-bold text-secondary">8:15 - 9:30 AM</div>
                </div>
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <div className="text-sm text-muted-foreground">Average Evening Peak</div>
                  <div className="text-xl font-bold text-destructive">5:45 - 7:15 PM</div>
                </div>
              </div>
            </Card>

            {/* Environmental Impact Radar */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Environmental Impact</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={environmentalImpact}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="metric" style={{ fontSize: '11px' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} style={{ fontSize: '10px' }} />
                  <Radar name="Impact Score" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Weighted score based on WHO standards and local regulations
                </p>
              </div>
            </Card>
          </div>

          {/* Heatmap Section */}
          <Card className="p-6 mt-6">
            <h3 className="font-semibold mb-4">Noise Level Heatmap (dB) - Weekly Pattern</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2 text-sm font-medium text-muted-foreground">Time</th>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <th key={day} className="text-center p-2 text-sm font-medium text-muted-foreground">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {noiseLevels.map((row) => (
                    <tr key={row.time}>
                      <td className="p-2 text-sm font-medium">{row.time}</td>
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                        const value = row[day as keyof typeof row] as number;
                        const intensity = value < 50 ? "bg-success/20" : value < 70 ? "bg-warning/30" : "bg-destructive/40";
                        return (
                          <td key={day} className={`p-2 text-center ${intensity} text-sm font-semibold`}>
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-success/20"></div>
                <span className="text-xs text-muted-foreground">&lt; 50 dB (Quiet)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-warning/30"></div>
                <span className="text-xs text-muted-foreground">50-70 dB (Moderate)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-destructive/40"></div>
                <span className="text-xs text-muted-foreground">&gt; 70 dB (Loud)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboard;
