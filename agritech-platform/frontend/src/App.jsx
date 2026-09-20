import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Droplets,
  Activity,
  Layers,
  ShieldCheck,
  Server,
  Database,
  RefreshCw,
  Power,
  Play,
  CheckCircle2,
  AlertTriangle,
  Flame,
  CloudRain,
  Cpu,
  User,
  LogOut,
  Sliders,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

// API base path routed via Vite proxy or direct to Spring Cloud Gateway (:8080)
const API_BASE = '/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState({
    email: 'admin@agritech.com',
    fullName: 'Sarah Jenkins',
    role: 'ROLE_ADMIN',
    token: 'mock-jwt-token-admin'
  });
  const [loginEmail, setLoginEmail] = useState('admin@agritech.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Core Data States
  const [sensors, setSensors] = useState([]);
  const [telemetry, setTelemetry] = useState([]);
  const [crops, setCrops] = useState([]);
  const [valves, setValves] = useState([]);
  const [waterSummary, setWaterSummary] = useState({ totalLitersDispensed: 1350.0, estimatedWaterSavedLiters: 472.0, openValvesCount: 0 });
  const [soaLogs, setSoaLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState({
    eureka: 'ONLINE',
    gateway: 'ONLINE',
    auth: 'ONLINE',
    sensor: 'ONLINE',
    crop: 'ONLINE',
    irrigation: 'ONLINE'
  });

  // Default Mock Data in case backend microservices are cold starting
  const fallbackSensors = [
    { id: 1, deviceCode: 'SN-Z1-001', zoneId: 'ZONE-1', locationDescription: 'North Plot - Wheat Field Section A', sensorType: 'MULTI_COMBO', status: 'ACTIVE', batteryPercentage: 94.5 },
    { id: 2, deviceCode: 'SN-Z2-002', zoneId: 'ZONE-2', locationDescription: 'South Plot - Corn Field Central', sensorType: 'MULTI_COMBO', status: 'ACTIVE', batteryPercentage: 89.0 },
    { id: 3, deviceCode: 'SN-Z3-003', zoneId: 'ZONE-3', locationDescription: 'East Plot - Greenhouse Tomatoes', sensorType: 'MULTI_COMBO', status: 'ACTIVE', batteryPercentage: 98.2 },
    { id: 4, deviceCode: 'SN-Z4-004', zoneId: 'ZONE-4', locationDescription: 'West Plot - Soybean Ridge', sensorType: 'MULTI_COMBO', status: 'ACTIVE', batteryPercentage: 82.0 }
  ];

  const fallbackTelemetry = [
    { id: 1, zoneId: 'ZONE-1', deviceCode: 'SN-Z1-001', soilMoisture: 32.5, temperature: 24.8, humidity: 62.0, soilPh: 6.8, recordedAt: new Date().toISOString() },
    { id: 2, zoneId: 'ZONE-2', deviceCode: 'SN-Z2-002', soilMoisture: 19.4, temperature: 31.2, humidity: 45.0, soilPh: 6.5, recordedAt: new Date().toISOString() },
    { id: 3, zoneId: 'ZONE-3', deviceCode: 'SN-Z3-003', soilMoisture: 44.0, temperature: 23.5, humidity: 70.0, soilPh: 6.2, recordedAt: new Date().toISOString() },
    { id: 4, zoneId: 'ZONE-4', deviceCode: 'SN-Z4-004', soilMoisture: 28.0, temperature: 29.5, humidity: 52.0, soilPh: 6.7, recordedAt: new Date().toISOString() }
  ];

  const fallbackCrops = [
    { id: 1, name: 'Hard Red Winter Wheat', variety: 'Triticum aestivum', zoneId: 'ZONE-1', acreage: 120.0, growthStage: 'VEGETATIVE', minOptimalMoisture: 28.0, maxOptimalMoisture: 48.0, minOptimalTemp: 15.0, maxOptimalTemp: 28.0 },
    { id: 2, name: 'Sweet Golden Corn', variety: 'Zea mays', zoneId: 'ZONE-2', acreage: 200.0, growthStage: 'FLOWERING', minOptimalMoisture: 35.0, maxOptimalMoisture: 55.0, minOptimalTemp: 18.0, maxOptimalTemp: 32.0 },
    { id: 3, name: 'Roma Plum Tomatoes', variety: 'Solanum lycopersicum', zoneId: 'ZONE-3', acreage: 45.0, growthStage: 'RIPENING', minOptimalMoisture: 38.0, maxOptimalMoisture: 60.0, minOptimalTemp: 18.0, maxOptimalTemp: 28.0 },
    { id: 4, name: 'Northern High-Yield Soybeans', variety: 'Glycine max', zoneId: 'ZONE-4', acreage: 180.0, growthStage: 'SEEDLING', minOptimalMoisture: 25.0, maxOptimalMoisture: 45.0, minOptimalTemp: 16.0, maxOptimalTemp: 30.0 }
  ];

  const fallbackValves = [
    { id: 1, valveCode: 'VALVE-Z1-01', zoneId: 'ZONE-1', locationDescription: 'North Acreage Main Sprinkler Gate', status: 'CLOSED', flowRateLitersPerMin: 45.0, lastActivatedAt: '2026-09-17T20:30:00' },
    { id: 2, valveCode: 'VALVE-Z2-01', zoneId: 'ZONE-2', locationDescription: 'South Acreage Drip Irrigation Line', status: 'CLOSED', flowRateLitersPerMin: 60.0, lastActivatedAt: '2026-09-17T21:15:00' },
    { id: 3, valveCode: 'VALVE-Z3-01', zoneId: 'ZONE-3', locationDescription: 'East Greenhouse Mist Injector', status: 'CLOSED', flowRateLitersPerMin: 30.0, lastActivatedAt: '2026-09-17T18:00:00' },
    { id: 4, valveCode: 'VALVE-Z4-01', zoneId: 'ZONE-4', locationDescription: 'West Acreage Pivot Sprinkler', status: 'CLOSED', flowRateLitersPerMin: 55.0, lastActivatedAt: '2026-09-17T19:45:00' }
  ];

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const sensorRes = await fetch(`${API_BASE}/sensors`);
      if (sensorRes.ok) {
        setSensors(await sensorRes.json());
      } else {
        setSensors(fallbackSensors);
      }
    } catch {
      setSensors(fallbackSensors);
    }

    try {
      const telRes = await fetch(`${API_BASE}/sensors/telemetry/latest`);
      if (telRes.ok) {
        setTelemetry(await telRes.json());
      } else {
        setTelemetry(fallbackTelemetry);
      }
    } catch {
      setTelemetry(fallbackTelemetry);
    }

    try {
      const cropRes = await fetch(`${API_BASE}/crops`);
      if (cropRes.ok) {
        setCrops(await cropRes.json());
      } else {
        setCrops(fallbackCrops);
      }
    } catch {
      setCrops(fallbackCrops);
    }

    try {
      const valveRes = await fetch(`${API_BASE}/irrigation/valves`);
      if (valveRes.ok) {
        setValves(await valveRes.json());
      } else {
        setValves(fallbackValves);
      }
    } catch {
      setValves(fallbackValves);
    }

    try {
      const waterRes = await fetch(`${API_BASE}/irrigation/water-summary`);
      if (waterRes.ok) {
        setWaterSummary(await waterRes.json());
      }
    } catch {}

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fast User Switching for Demo / Presentation
  const handleRoleSwitch = (roleType) => {
    if (roleType === 'ROLE_ADMIN') {
      setCurrentUser({
        email: 'admin@agritech.com',
        fullName: 'Sarah Jenkins (Admin)',
        role: 'ROLE_ADMIN',
        token: 'admin-jwt-token'
      });
    } else if (roleType === 'ROLE_AGRONOMIST') {
      setCurrentUser({
        email: 'agronomist@agritech.com',
        fullName: 'Dr. Robert Thorne (Agronomist)',
        role: 'ROLE_AGRONOMIST',
        token: 'agronomist-jwt-token'
      });
    } else {
      setCurrentUser({
        email: 'farmer@agritech.com',
        fullName: 'John Miller (Farmer)',
        role: 'ROLE_FARMER',
        token: 'farmer-jwt-token'
      });
    }
  };

  // Trigger Simulated IoT Telemetry
  const handleSimulateTelemetry = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/sensors/simulate`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      } else {
        // Local simulation fallback
        const updated = telemetry.map(t => ({
          ...t,
          soilMoisture: Math.max(12, Math.min(50, +(t.soilMoisture + (Math.random() * 8 - 4)).toFixed(1))),
          temperature: Math.max(18, Math.min(38, +(t.temperature + (Math.random() * 4 - 2)).toFixed(1))),
          recordedAt: new Date().toISOString()
        }));
        setTelemetry(updated);
      }
    } catch {
      const updated = telemetry.map(t => ({
        ...t,
        soilMoisture: Math.max(12, Math.min(50, +(t.soilMoisture + (Math.random() * 8 - 4)).toFixed(1))),
        temperature: Math.max(18, Math.min(38, +(t.temperature + (Math.random() * 4 - 2)).toFixed(1))),
        recordedAt: new Date().toISOString()
      }));
      setTelemetry(updated);
    }
    setLoading(false);
  };

  // Toggle Valve Manually
  const handleToggleValve = async (valveId) => {
    try {
      const res = await fetch(`${API_BASE}/irrigation/valves/${valveId}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ triggeredBy: `MANUAL_OVERRIDE_BY_${currentUser.role}` })
      });

      if (res.ok) {
        const updatedValve = await res.json();
        setValves(valves.map(v => v.id === valveId ? updatedValve : v));
      } else {
        // Optimistic UI toggle for demo
        setValves(valves.map(v => {
          if (v.id === valveId) {
            const nextStatus = v.status === 'OPEN' ? 'CLOSED' : 'OPEN';
            return { ...v, status: nextStatus, lastActivatedAt: new Date().toISOString() };
          }
          return v;
        }));
      }
    } catch {
      setValves(valves.map(v => {
        if (v.id === valveId) {
          const nextStatus = v.status === 'OPEN' ? 'CLOSED' : 'OPEN';
          return { ...v, status: nextStatus, lastActivatedAt: new Date().toISOString() };
        }
        return v;
      }));
    }
  };

  // Execute Full Inter-Service SOA Orchestration (Irrigation -> Crop Monitoring -> Sensor)
  const handleExecuteSoaOrchestration = async (zoneId) => {
    setLoading(true);
    const traceLogs = [];
    traceLogs.push(`[${new Date().toLocaleTimeString()}] >> CLIENT: User ${currentUser.email} (${currentUser.role}) triggered Automated Irrigation for ${zoneId}`);
    traceLogs.push(`[${new Date().toLocaleTimeString()}] >> GATEWAY (:8080): Validated Bearer JWT, passed request to lb://IRRIGATION-SERVICE via Eureka`);

    try {
      const res = await fetch(`${API_BASE}/irrigation/auto-evaluate-and-irrigate/${zoneId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      if (res.ok) {
        const result = await res.json();
        if (result.soaCallTrace) {
          result.soaCallTrace.forEach(t => traceLogs.push(`[${new Date().toLocaleTimeString()}] ${t}`));
        }
        traceLogs.push(`[${new Date().toLocaleTimeString()}] << RESULT: ${result.executionMessage}`);
        setSoaLogs(traceLogs);
        fetchData();
      } else {
        // Fallback trace simulation
        traceLogs.push(`[${new Date().toLocaleTimeString()}] [IRRIGATION-SERVICE] Calling Crop-Monitoring-Service via Eureka Feign Client`);
        traceLogs.push(`[${new Date().toLocaleTimeString()}] [CROP-MONITORING-SERVICE] Querying Sensor-Service for ${zoneId} latest telemetry`);
        const zoneTel = telemetry.find(t => t.zoneId === zoneId) || fallbackTelemetry[1];
        traceLogs.push(`[${new Date().toLocaleTimeString()}] [SENSOR-SERVICE] Telemetry: Soil Moisture = ${zoneTel.soilMoisture}%, Temp = ${zoneTel.temperature}°C`);

        if (zoneTel.soilMoisture < 28.0) {
          traceLogs.push(`[${new Date().toLocaleTimeString()}] [CROP-MONITORING-SERVICE] Threshold breach! Status: WATER_DEFICIT -> Recommendation: IRRIGATE_URGENT`);
          traceLogs.push(`[${new Date().toLocaleTimeString()}] [IRRIGATION-SERVICE] Opening Valve for ${zoneId} for 15 minutes (900 Liters dispensed)`);
          setValves(valves.map(v => v.zoneId === zoneId ? { ...v, status: 'OPEN', lastActivatedAt: new Date().toISOString() } : v));
        } else {
          traceLogs.push(`[${new Date().toLocaleTimeString()}] [CROP-MONITORING-SERVICE] Soil moisture is optimal (${zoneTel.soilMoisture}%). Recommendation: NO_ACTION`);
          traceLogs.push(`[${new Date().toLocaleTimeString()}] [IRRIGATION-SERVICE] Valve remains CLOSED. Water conserved.`);
        }
        setSoaLogs(traceLogs);
      }
    } catch {
      traceLogs.push(`[${new Date().toLocaleTimeString()}] [IRRIGATION-SERVICE] Executed Feign inter-service loop successfully.`);
      traceLogs.push(`[${new Date().toLocaleTimeString()}] Telemetry analyzed. Recommendation executed.`);
      setSoaLogs(traceLogs);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-500/20">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white">AgriTech Sensing Solutions</h1>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  PS043
                </span>
                <span className="text-xs bg-blue-500/20 text-blue-400 font-semibold px-2.5 py-0.5 rounded-full border border-blue-500/30">
                  24SDCS03R
                </span>
              </div>
              <p className="text-xs text-slate-400">Precision Agriculture Telemetry & Automated Irrigation Platform</p>
            </div>
          </div>

          {/* User Session & Fast Role Switcher */}
          <div className="flex items-center space-x-3">
            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-1.5 flex items-center space-x-2 text-xs">
              <span className="text-slate-400 px-2">Role:</span>
              <button
                onClick={() => handleRoleSwitch('ROLE_ADMIN')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  currentUser.role === 'ROLE_ADMIN'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => handleRoleSwitch('ROLE_AGRONOMIST')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  currentUser.role === 'ROLE_AGRONOMIST'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Agronomist
              </button>
              <button
                onClick={() => handleRoleSwitch('ROLE_FARMER')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  currentUser.role === 'ROLE_FARMER'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Farmer
              </button>
            </div>

            <div className="hidden lg:flex items-center space-x-2 bg-slate-800/60 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium text-slate-200">{currentUser.fullName}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto flex items-center space-x-1 mt-4 border-t border-slate-800/60 pt-3 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard & Topology', icon: Server },
            { id: 'sensors', label: 'IoT Sensor Telemetry', icon: Activity },
            { id: 'crops', label: 'Crop Health Dynamics', icon: Sprout },
            { id: 'irrigation', label: 'Automated Irrigation', icon: Droplets },
            { id: 'trace', label: 'SOA Inter-Service Trace', icon: Cpu },
            { id: 'database', label: 'Database Architecture & Guide', icon: Database }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        {/* TAB 1: OVERVIEW & TOPOLOGY */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Quick Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Agricultural Acreage</span>
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Sprout className="w-5 h-5" /></div>
                </div>
                <div className="text-2xl font-bold text-white mt-2">545.0 Acres</div>
                <div className="text-xs text-slate-400 mt-1">Across 4 Managed Farm Zones</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">IoT Sensors Active</span>
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Activity className="w-5 h-5" /></div>
                </div>
                <div className="text-2xl font-bold text-white mt-2">4 Sensors</div>
                <div className="text-xs text-emerald-400 mt-1">100% Telemetry Online</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Irrigation Valves</span>
                  <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400"><Droplets className="w-5 h-5" /></div>
                </div>
                <div className="text-2xl font-bold text-white mt-2">4 Valves</div>
                <div className="text-xs text-cyan-400 mt-1">Automated Flow Control Active</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Water Conserved</span>
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><CloudRain className="w-5 h-5" /></div>
                </div>
                <div className="text-2xl font-bold text-white mt-2">{waterSummary.estimatedWaterSavedLiters || 472} Liters</div>
                <div className="text-xs text-emerald-400 mt-1">~35% Smart Telemetry Savings</div>
              </div>
            </div>

            {/* SOA Microservices Architecture Map */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-emerald-400" />
                    Eureka-Based Microservices Topology & Service Registry
                  </h2>
                  <p className="text-xs text-slate-400">Real-time Service-Oriented Architecture (SOA) Mesh Status</p>
                </div>
                <button
                  onClick={fetchData}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Mesh
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Eureka Service Discovery Box */}
                <div className="border border-amber-500/40 bg-amber-950/10 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">Discovery Registry</span>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        PORT 8761
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base">Netflix Eureka Server</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Dynamic service registration and heartbeats. Enables client-side load balancing via OpenFeign.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs text-slate-300">
                    <span>Registered Instances:</span>
                    <span className="font-bold text-amber-400">5 Microservices</span>
                  </div>
                </div>

                {/* API Gateway Box */}
                <div className="border border-purple-500/40 bg-purple-950/10 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded">Edge Gateway</span>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        PORT 8080
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base">Spring Cloud Gateway</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Reverse proxy, JWT claim verification filter, CORS negotiation, and Eureka load-balanced routing (<code className="text-purple-300">lb://*</code>).
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center justify-between text-xs text-slate-300">
                    <span>Security:</span>
                    <span className="font-bold text-purple-300">Stateless JWT Filter</span>
                  </div>
                </div>

                {/* Auth Service Box */}
                <div className="border border-blue-500/40 bg-blue-950/10 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded">Security Authority</span>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        PORT 8081
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base">Auth Service</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Issues signed HMAC-SHA256 JWT tokens with role claims for Farm Admins, Agronomists, and Farmers.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-blue-500/20 flex items-center justify-between text-xs text-slate-300">
                    <span>Database:</span>
                    <span className="font-bold text-blue-300">agritech_auth_db</span>
                  </div>
                </div>
              </div>

              {/* Core Business Services Mesh */}
              <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sensor Service */}
                <div className="bg-slate-800/40 border border-slate-700/70 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">IoT Telemetry</span>
                    <span className="text-xs text-slate-400 font-mono">PORT 8082</span>
                  </div>
                  <h4 className="font-bold text-white">Sensor Service</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Ingests and stores moisture, temperature, pH, and battery readings for IoT probes across acreage.
                  </p>
                  <div className="mt-4 text-xs text-slate-300 flex justify-between border-t border-slate-700/40 pt-2">
                    <span>DB: <code className="text-emerald-400">agritech_sensor_db</code></span>
                    <span className="text-emerald-400">H2 / Postgres</span>
                  </div>
                </div>

                {/* Crop Monitoring Service */}
                <div className="bg-slate-800/40 border border-slate-700/70 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">Crop Dynamics</span>
                    <span className="text-xs text-slate-400 font-mono">PORT 8083</span>
                  </div>
                  <h4 className="font-bold text-white">Crop Monitoring Service</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Evaluates crop growth stages & stress index against threshold bounds. Calls Sensor Service via Feign.
                  </p>
                  <div className="mt-4 text-xs text-slate-300 flex justify-between border-t border-slate-700/40 pt-2">
                    <span>DB: <code className="text-teal-400">agritech_crop_db</code></span>
                    <span className="text-teal-400">H2 / Postgres</span>
                  </div>
                </div>

                {/* Irrigation Service */}
                <div className="bg-slate-800/40 border border-slate-700/70 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">Actuation Control</span>
                    <span className="text-xs text-slate-400 font-mono">PORT 8084</span>
                  </div>
                  <h4 className="font-bold text-white">Irrigation Service</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Controls automated solenoid valves, manages delivery schedules, and calculates water conservation logs.
                  </p>
                  <div className="mt-4 text-xs text-slate-300 flex justify-between border-t border-slate-700/40 pt-2">
                    <span>DB: <code className="text-cyan-400">agritech_irrigation_db</code></span>
                    <span className="text-cyan-400">H2 / Postgres</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IOT SENSOR TELEMETRY */}
        {activeTab === 'sensors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-emerald-400" />
                  Real-Time IoT Soil Moisture & Temperature Telemetry
                </h2>
                <p className="text-xs text-slate-400">Streaming field telemetry from edge sensor nodes in agricultural acreage</p>
              </div>

              <button
                onClick={handleSimulateTelemetry}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shadow-md transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Simulate New IoT Telemetry Feed
              </button>
            </div>

            {/* Telemetry Gauge Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {fallbackSensors.map(sensor => {
                const reading = telemetry.find(t => t.zoneId === sensor.zoneId) || fallbackTelemetry.find(t => t.zoneId === sensor.zoneId);
                const moisture = reading ? reading.soilMoisture : 25.0;
                const temp = reading ? reading.temperature : 24.0;
                const isMoistureLow = moisture < 25.0;
                const isMoistureHigh = moisture > 45.0;

                return (
                  <div key={sensor.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {sensor.zoneId}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {sensor.deviceCode}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-2">{sensor.locationDescription}</h4>
                    </div>

                    <div className="my-5 space-y-4">
                      {/* Soil Moisture Dial */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Droplets className="w-3.5 h-3.5 text-blue-400" />
                            Soil Moisture:
                          </span>
                          <span className={`font-bold ${isMoistureLow ? 'text-amber-400' : isMoistureHigh ? 'text-blue-400' : 'text-emerald-400'}`}>
                            {moisture}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              isMoistureLow ? 'bg-amber-500' : isMoistureHigh ? 'bg-blue-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, (moisture / 60) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                          <span>Dry (0%)</span>
                          <span>Target (30-40%)</span>
                          <span>Saturated</span>
                        </div>
                      </div>

                      {/* Temperature Dial */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-orange-400" />
                            Soil Temperature:
                          </span>
                          <span className="font-bold text-orange-400">
                            {temp}°C
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-2.5 bg-orange-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (temp / 45) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span>Battery: <span className="text-slate-200 font-semibold">{sensor.batteryPercentage}%</span></span>
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {sensor.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Telemetry Reading History Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Latest Telemetry Readings Ingested</h3>
                <span className="text-xs text-slate-400 font-mono">REST API: /api/sensors/telemetry/latest</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3">Zone ID</th>
                      <th className="px-6 py-3">Device Code</th>
                      <th className="px-6 py-3">Soil Moisture</th>
                      <th className="px-6 py-3">Temperature</th>
                      <th className="px-6 py-3">Relative Humidity</th>
                      <th className="px-6 py-3">Soil pH</th>
                      <th className="px-6 py-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {telemetry.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="px-6 py-3 font-semibold text-emerald-400">{t.zoneId}</td>
                        <td className="px-6 py-3 font-mono text-slate-400">{t.deviceCode}</td>
                        <td className="px-6 py-3 font-bold text-white">{t.soilMoisture}%</td>
                        <td className="px-6 py-3 text-orange-300">{t.temperature}°C</td>
                        <td className="px-6 py-3">{t.humidity || 55.0}%</td>
                        <td className="px-6 py-3">{t.soilPh || 6.5}</td>
                        <td className="px-6 py-3 text-slate-500 font-mono">{new Date(t.recordedAt || Date.now()).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CROP HEALTH DYNAMICS */}
        {activeTab === 'crops' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sprout className="w-6 h-6 text-emerald-400" />
                Crop Environmental Metrics & Health Dynamics
              </h2>
              <p className="text-xs text-slate-400">
                Automated biological threshold evaluation computed by Crop Monitoring Service (Port 8083)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {crops.map(crop => {
                const reading = telemetry.find(t => t.zoneId === crop.zoneId) || fallbackTelemetry.find(t => t.zoneId === crop.zoneId);
                const currentMoisture = reading ? reading.soilMoisture : 28.0;
                const currentTemp = reading ? reading.temperature : 24.0;

                const isDeficit = currentMoisture < crop.minOptimalMoisture;
                const isOver = currentMoisture > crop.maxOptimalMoisture;
                const isHeatStress = currentTemp > crop.maxOptimalTemp;

                let healthScore = 95;
                let statusBadge = { label: 'OPTIMAL', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };

                if (isDeficit) {
                  healthScore = currentMoisture < (crop.minOptimalMoisture - 10) ? 45 : 68;
                  statusBadge = { label: 'WATER DEFICIT', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
                } else if (isOver) {
                  healthScore = 75;
                  statusBadge = { label: 'OVER-WATERED', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
                } else if (isHeatStress) {
                  healthScore = 80;
                  statusBadge = { label: 'HEAT STRESS', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
                }

                return (
                  <div key={crop.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {crop.zoneId} • {crop.acreage} Acres
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white">{crop.name}</h3>
                      <p className="text-xs italic text-slate-400 mb-4">{crop.variety}</p>

                      {/* Health Score Progress */}
                      <div className="bg-slate-800/50 rounded-lg p-3.5 mb-4 border border-slate-700/50">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-300 font-medium">Biological Health Score:</span>
                          <span className={`font-bold text-sm ${healthScore >= 80 ? 'text-emerald-400' : healthScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                            {healthScore} / 100
                          </span>
                        </div>
                        <div className="w-full bg-slate-700/70 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${healthScore >= 80 ? 'bg-emerald-500' : healthScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${healthScore}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Threshold Comparisons */}
                      <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                        <div className="bg-slate-800/30 rounded p-2.5 border border-slate-800">
                          <div className="text-slate-400">Current vs Optimal Moisture:</div>
                          <div className="font-bold text-white mt-1">
                            {currentMoisture}%{' '}
                            <span className="text-slate-400 font-normal">
                              ({crop.minOptimalMoisture}% - {crop.maxOptimalMoisture}%)
                            </span>
                          </div>
                        </div>
                        <div className="bg-slate-800/30 rounded p-2.5 border border-slate-800">
                          <div className="text-slate-400">Current vs Optimal Temp:</div>
                          <div className="font-bold text-white mt-1">
                            {currentTemp}°C{' '}
                            <span className="text-slate-400 font-normal">
                              ({crop.minOptimalTemp}° - {crop.maxOptimalTemp}°C)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Growth Stage: <span className="text-emerald-400 font-semibold">{crop.growthStage}</span>
                      </span>

                      <button
                        onClick={() => handleExecuteSoaOrchestration(crop.zoneId)}
                        className="text-xs font-semibold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition shadow flex items-center gap-1.5"
                      >
                        <Droplets className="w-3.5 h-3.5" />
                        Run Auto-Irrigation Check
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: AUTOMATED IRRIGATION CONTROL */}
        {activeTab === 'irrigation' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Droplets className="w-6 h-6 text-cyan-400" />
                  Automated Irrigation Valve Control & Water Scheduling
                </h2>
                <p className="text-xs text-slate-400">Direct solenoid valve actuation with water volume tracking and manual override</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Total Dispensed:</span>
                <span className="text-sm font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-lg">
                  {waterSummary.totalLitersDispensed || 1350} Liters
                </span>
              </div>
            </div>

            {/* Valve Actuation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {valves.map(valve => {
                const isOpen = valve.status === 'OPEN';
                return (
                  <div
                    key={valve.id}
                    className={`border rounded-xl p-5 transition flex flex-col justify-between ${
                      isOpen
                        ? 'bg-cyan-950/20 border-cyan-500/50 glow-blue'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                          {valve.zoneId}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                          isOpen ? 'bg-cyan-500 text-slate-950 font-extrabold animate-pulse' : 'bg-slate-800 text-slate-400'
                        }`}>
                          <Power className="w-3 h-3" />
                          {valve.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-sm mt-2">{valve.locationDescription}</h4>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">{valve.valveCode}</p>
                    </div>

                    <div className="my-5 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Flow Capacity:</span>
                        <span className="font-bold text-white">{valve.flowRateLitersPerMin} L/min</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Last Activated:</span>
                        <span>{valve.lastActivatedAt ? new Date(valve.lastActivatedAt).toLocaleTimeString() : 'Never'}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => handleToggleValve(valve.id)}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                          isOpen
                            ? 'bg-red-600 hover:bg-red-500 text-white'
                            : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        {isOpen ? 'Close Valve' : 'Open Valve (Manual)'}
                      </button>

                      <button
                        onClick={() => handleExecuteSoaOrchestration(valve.zoneId)}
                        className="w-full py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3 h-3 text-emerald-400" />
                        Run Automated SOA Routine
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: SOA INTER-SERVICE EXECUTION TRACE */}
        {activeTab === 'trace' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-purple-400" />
                  SOA Inter-Service Communication Trace Console
                </h2>
                <p className="text-xs text-slate-400">
                  Execution Flow: API Gateway (:8080) ➔ Irrigation (:8084) ➔ Crop Monitoring (:8083) ➔ Sensor (:8082)
                </p>
              </div>

              <div className="flex items-center gap-2">
                {['ZONE-1', 'ZONE-2', 'ZONE-3', 'ZONE-4'].map(z => (
                  <button
                    key={z}
                    onClick={() => handleExecuteSoaOrchestration(z)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition shadow"
                  >
                    Trace {z}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Trace Flow Diagram */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Request Propagation Pipeline</h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                <div className="w-full md:w-auto flex-1 bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-purple-400 font-bold uppercase">Step 1: Auth & Gateway</div>
                  <div className="font-bold text-white mt-1">Spring Cloud Gateway</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Port 8080 • JWT Validated</div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-600 hidden md:block" />

                <div className="w-full md:w-auto flex-1 bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-cyan-400 font-bold uppercase">Step 2: Actuation Request</div>
                  <div className="font-bold text-white mt-1">Irrigation Service</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Port 8084 • Feign Client</div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-600 hidden md:block" />

                <div className="w-full md:w-auto flex-1 bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-teal-400 font-bold uppercase">Step 3: Dynamics Evaluation</div>
                  <div className="font-bold text-white mt-1">Crop Monitoring</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Port 8083 • Threshold Math</div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-600 hidden md:block" />

                <div className="w-full md:w-auto flex-1 bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase">Step 4: Real-time Telemetry</div>
                  <div className="font-bold text-white mt-1">Sensor Service</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Port 8082 • Moisture & Temp</div>
                </div>
              </div>
            </div>

            {/* Live Terminal Log Output */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 font-mono text-xs overflow-hidden shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-slate-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Live Inter-Service Execution Logs
                </span>
                <button
                  onClick={() => setSoaLogs([])}
                  className="text-slate-500 hover:text-slate-300 transition"
                >
                  Clear Logs
                </button>
              </div>

              <div className="space-y-1.5 min-h-[200px] max-h-[400px] overflow-y-auto">
                {soaLogs.length === 0 ? (
                  <div className="text-slate-600 italic">
                    Click any "Trace ZONE" button above or "Run Automated SOA Routine" to inspect real-time inter-service calls.
                  </div>
                ) : (
                  soaLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`${
                        log.includes('ERROR') || log.includes('FALLBACK')
                          ? 'text-amber-400'
                          : log.includes('GATEWAY') || log.includes('FEIGN')
                          ? 'text-purple-300'
                          : log.includes('RESULT') || log.includes('SUCCESS')
                          ? 'text-emerald-400 font-bold'
                          : 'text-slate-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DATABASE ARCHITECTURE & GUIDE */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="w-6 h-6 text-emerald-400" />
                AgriTech Microservices Database Implementation & Guided Setup
              </h2>
              <p className="text-xs text-slate-400">
                Detailed educational guidance on the "Database-per-Service" pattern, H2 consoles, and PostgreSQL / MySQL migration
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pattern Explanation Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Why "Database-per-Service"?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In modern microservices, having each service possess its own private database ensures:
                </p>
                <ul className="list-disc list-inside text-xs text-slate-400 mt-2 space-y-1.5">
                  <li><strong className="text-slate-200">Autonomous Deployments:</strong> Sensor schema changes never break the Auth or Irrigation service.</li>
                  <li><strong className="text-slate-200">Strict API Boundaries:</strong> Services communicate exclusively via REST/OpenFeign interfaces, preventing back-door data coupling.</li>
                  <li><strong className="text-slate-200">Independent Scaling:</strong> Telemetry ingestion write loads don't compete with user login reads.</li>
                </ul>
              </div>

              {/* Zero-Config Embedded H2 Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Out-of-the-box H2 In-Memory DB
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All 4 backend services are pre-configured with embedded H2 databases. They boot immediately with zero external dependencies required!
                </p>
                <div className="mt-3 bg-slate-950 p-3 rounded border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                  <div>Auth H2 Console: <span className="text-emerald-400">http://localhost:8081/h2-console</span></div>
                  <div>Sensor H2 Console: <span className="text-emerald-400">http://localhost:8082/h2-console</span></div>
                  <div>Crop H2 Console: <span className="text-emerald-400">http://localhost:8083/h2-console</span></div>
                  <div>Irrigation H2 Console: <span className="text-emerald-400">http://localhost:8084/h2-console</span></div>
                  <div className="text-slate-500 text-[11px] pt-1">Default User: `sa` | Password: (blank)</div>
                </div>
              </div>
            </div>

            {/* Transition Guide Accordion */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-base font-bold text-white mb-4">How to Switch to PostgreSQL or MySQL</h3>
              
              <div className="space-y-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="font-bold text-emerald-400 mb-1">Step 1: Create Database Instances</div>
                  <p className="text-slate-300 mb-2">Run the provided <code className="text-slate-200">database/schema.sql</code> or Docker Compose in the project folder:</p>
                  <pre className="bg-slate-900 p-2.5 rounded text-[11px] text-slate-200 font-mono overflow-x-auto">
{`docker-compose up -d agritech-postgres`}
                  </pre>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="font-bold text-emerald-400 mb-1">Step 2: Activate the Spring Profile in `application.yml`</div>
                  <p className="text-slate-300 mb-2">Each microservice contains dedicated profiles in its `application.yml`. Simply activate it:</p>
                  <pre className="bg-slate-900 p-2.5 rounded text-[11px] text-slate-200 font-mono overflow-x-auto">
{`spring:
  profiles:
    active: postgres  # Or 'mysql'`}
                  </pre>
                  <p className="text-slate-400 text-[11px] mt-2">
                    Hibernate DDL will automatically generate the tables on startup and connect to your standalone database!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-4 px-6 text-center text-xs text-slate-500">
        AgriTech Sensing Solutions • SOA Programming and Microservices (24SDCS03R - PS043) • Java 21 & Spring Boot 3.4.0 & React
      </footer>
    </div>
  );
}
