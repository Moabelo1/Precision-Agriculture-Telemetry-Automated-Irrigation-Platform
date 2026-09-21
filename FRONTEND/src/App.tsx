import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  CloudSun,
  Droplets,
  Eye,
  Filter,
  Gauge,
  Grid2X2,
  Leaf,
  LineChart,
  LockKeyhole,
  LogOut,
  Menu,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sprout,
  Thermometer,
  UserRound,
  Users,
  Wifi,
  X,
  Zap,
} from 'lucide-react';

const fieldImage = 'https://images.pexels.com/photos/34031015/pexels-photo-34031015.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

type View = 'Dashboard' | 'Sensor Telemetry' | 'Crop Monitoring' | 'Irrigation Control' | 'Alerts' | 'Reports' | 'Administration';
type Status = 'Online' | 'Warning' | 'Offline';

const navItems: { label: View; icon: typeof Grid2X2 }[] = [
  { label: 'Dashboard', icon: Grid2X2 },
  { label: 'Sensor Telemetry', icon: Activity },
  { label: 'Crop Monitoring', icon: Sprout },
  { label: 'Irrigation Control', icon: Droplets },
  { label: 'Alerts', icon: Bell },
  { label: 'Reports', icon: LineChart },
  { label: 'Administration', icon: ShieldCheck },
];

const sensors = [
  { id: 'SN-4821', location: 'North Field · Zone A', moisture: '42%', temp: '23.8°', humidity: '68%', battery: '94%', status: 'Online' as Status, updated: '2 min ago', health: 'Excellent' },
  { id: 'SN-4817', location: 'North Field · Zone B', moisture: '38%', temp: '24.1°', humidity: '64%', battery: '87%', status: 'Online' as Status, updated: '4 min ago', health: 'Good' },
  { id: 'SN-4763', location: 'Orchard · Row 04', moisture: '29%', temp: '26.4°', humidity: '58%', battery: '51%', status: 'Warning' as Status, updated: '8 min ago', health: 'Needs attention' },
  { id: 'SN-4759', location: 'South Field · Zone C', moisture: '45%', temp: '22.9°', humidity: '71%', battery: '91%', status: 'Online' as Status, updated: '3 min ago', health: 'Excellent' },
  { id: 'SN-4692', location: 'Greenhouse · Bay 02', moisture: '—', temp: '—', humidity: '—', battery: '12%', status: 'Offline' as Status, updated: '2 hrs ago', health: 'Unavailable' },
];

const alerts = [
  { severity: 'Critical', title: 'Soil moisture below threshold', location: 'Orchard · Row 04', time: '12 min ago', icon: Droplets },
  { severity: 'Warning', title: 'Sensor battery is running low', location: 'Greenhouse · Bay 02', time: '34 min ago', icon: Zap },
  { severity: 'Information', title: 'Irrigation cycle completed', location: 'South Field · Zone C', time: '1 hr ago', icon: CheckMark },
];

function CheckMark({ size = 18 }: { size?: number }) {
  return <span style={{ fontSize: size * 0.8, fontWeight: 700 }}>✓</span>;
}

function App() {
  const [authenticated, setAuthenticated] = useState(true);
  const [view, setView] = useState<View>('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);

  if (!authenticated) {
    return <LoginScreen onLogin={() => { setShowLoginError(true); }} showError={showLoginError} />;
  }

  return (
    <div className="app-shell">
      <Sidebar view={view} setView={setView} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onSignOut={() => setAuthenticated(false)} />
      <main className="main-shell">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <div className="breadcrumb"><span>Operations</span><ChevronRight size={14} /><strong>{view}</strong></div>
          <div className="topbar-actions">
            <div className="system-pill"><span className="pulse-dot" /> All systems operational</div>
            <button className="icon-button" aria-label="Help"><CircleHelp size={19} /></button>
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={19} /><span>3</span></button>
            <div className="user-chip"><div className="avatar">AM</div><div className="user-chip-copy"><strong>Alex Morgan</strong><small>Administrator</small></div><ChevronDown size={15} /></div>
          </div>
        </header>
        <div className="content-area">
          {view === 'Dashboard' && <Dashboard setView={setView} />}
          {view === 'Sensor Telemetry' && <Telemetry />}
          {view === 'Crop Monitoring' && <CropMonitoring />}
          {view === 'Irrigation Control' && <Irrigation />}
          {view === 'Alerts' && <Alerts />}
          {view === 'Reports' && <Reports />}
          {view === 'Administration' && <Administration />}
        </div>
      </main>
    </div>
  );
}

function LoginScreen({ onLogin, showError }: { onLogin: () => void; showError: boolean }) {
  return (
    <div className="login-screen">
      <div className="login-visual" style={{ backgroundImage: `linear-gradient(125deg, rgba(8, 38, 30, .92), rgba(10, 65, 47, .35)), url(${fieldImage})` }}>
        <div className="visual-grid" />
        <div className="brand-mark light"><span><Leaf size={20} /></span><strong>AgriTech <em>Sensing Solutions</em></strong></div>
        <div className="visual-content">
          <div className="eyebrow light-eyebrow"><span /> Precision Agriculture Intelligence</div>
          <h1>Every field has<br /><i>a signal.</i></h1>
          <p>Turn environmental telemetry into confident, sustainable decisions across every acre.</p>
          <div className="visual-stat-row"><div><strong>24.8k</strong><span>acres monitored</span></div><div><strong>98.6%</strong><span>network uptime</span></div><div><strong>31%</strong><span>water conserved</span></div></div>
        </div>
        <div className="visual-caption"><span>Live network overview</span><span className="caption-line" /><span>37.642° N, 97.337° W</span></div>
      </div>
      <div className="login-panel">
        <div className="login-panel-inner">
          <div className="brand-mark dark"><span><Leaf size={19} /></span><strong>AgriTech <em>Sensing Solutions</em></strong></div>
          <div className="login-heading"><div className="eyebrow">Operations console</div><h2>Welcome back</h2><p>Sign in to your operations workspace.</p></div>
          <form className="login-form" onSubmit={(event) => { event.preventDefault(); onLogin(); }}>
            <label>Work email<input type="email" placeholder="you@agritech.com" required /></label>
            <label>Password<div className="password-wrap"><input type="password" placeholder="Enter your password" required /><Eye size={18} /></div></label>
            <div className="form-meta"><label className="checkbox-label"><input type="checkbox" defaultChecked /><span>Remember me</span></label><button type="button" className="text-button">Forgot password?</button></div>
            {showError && <div className="form-error"><AlertTriangle size={16} /> Authentication service is not connected. Configure the API Gateway to continue.</div>}
            <button className="primary-button login-button" type="submit">Sign in to workspace <ArrowUpRight size={17} /></button>
          </form>
          <div className="login-security"><LockKeyhole size={15} /><span>Protected by enterprise-grade security</span></div>
          <footer className="login-footer"><span>© 2026 AgriTech Sensing Solutions</span><span>Privacy · Security</span></footer>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ view, setView, open, onClose, onSignOut }: { view: View; setView: (view: View) => void; open: boolean; onClose: () => void; onSignOut: () => void }) {
  return <>
    {open && <button className="drawer-backdrop" onClick={onClose} aria-label="Close navigation" />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand"><div className="brand-symbol"><Leaf size={19} /></div><div><strong>AgriTech</strong><span>Sensing Solutions</span></div><button className="icon-button close-sidebar" onClick={onClose} aria-label="Close navigation"><X size={18} /></button></div>
      <div className="workspace-select"><div className="farm-icon"><Sprout size={17} /></div><div><small>Active workspace</small><strong>Willow Creek Farms</strong></div><ChevronDown size={15} /></div>
      <nav className="side-nav"><small className="nav-label">Workspace</small>{navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${view === label ? 'active' : ''}`} onClick={() => { setView(label); onClose(); }}><Icon size={18} /><span>{label}</span>{label === 'Alerts' && <b>3</b>}</button>)}</nav>
      <div className="sidebar-footer"><div className="nav-label">Workspace settings</div><button className="nav-item"><Settings size={18} /><span>Settings</span></button><div className="profile-card"><div className="avatar">AM</div><div><strong>Alex Morgan</strong><small>Administrator</small></div><button className="icon-button" onClick={onSignOut} aria-label="Sign out"><LogOut size={17} /></button></div></div>
    </aside>
  </>;
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function Dashboard({ setView }: { setView: (view: View) => void }) {
  return <>
    <PageHeader eyebrow="Tuesday, September 20, 2026" title="Farm Operations Overview" description="A clear view of your fields, sensors, and water utilization." action={<div className="header-actions"><button className="secondary-button"><CalendarDays size={16} /> Last 7 days <ChevronDown size={15} /></button><button className="icon-button bordered"><MoreHorizontal size={19} /></button></div>} />
    <div className="metric-grid">
      <MetricCard label="Active sensors" value="142" detail="of 148 deployed" trend="4.2%" positive icon={<Wifi />} color="green" />
      <MetricCard label="Soil moisture" value="38.4%" detail="Across all zones" trend="2.8%" positive icon={<Droplets />} color="blue" />
      <MetricCard label="Crop health" value="87.6" suffix="/ 100" detail="+3.4 this week" trend="3.4%" positive icon={<Leaf />} color="lime" />
      <MetricCard label="Water utilization" value="12.8k" suffix=" gal" detail="This week" trend="8.1%" positive icon={<Gauge />} color="amber" />
    </div>
    <div className="dashboard-grid top-charts"><ChartCard title="Soil moisture trend" meta="Average across monitored zones" action="7 days"><AreaChart /></ChartCard><ChartCard title="Crop health index" meta="Field performance overview" action="View details"><HealthChart /></ChartCard></div>
    <div className="dashboard-grid bottom-charts"><ChartCard title="Water utilization" meta="Weekly consumption vs. target" action="This week"><BarChart /></ChartCard><div className="panel alert-panel"><div className="panel-heading"><div><h3>System alerts</h3><p>Requires your attention</p></div><button className="text-button" onClick={() => setView('Alerts')}>View all <ArrowUpRight size={15} /></button></div><div className="alert-list">{alerts.map((alert) => <AlertRow key={alert.title} {...alert} />)}</div></div></div>
    <div className="panel zones-panel"><div className="panel-heading"><div><h3>Monitored zones</h3><p>Live field conditions across Willow Creek Farms</p></div><button className="secondary-button small" onClick={() => setView('Crop Monitoring')}>Open field map <ArrowUpRight size={15} /></button></div><div className="zone-layout"><div className="field-map"><div className="map-overlay"><span className="map-label">NORTH FIELD</span><span className="map-label map-label-2">ORCHARD</span><span className="map-label map-label-3">SOUTH FIELD</span><div className="map-node node-1" /><div className="map-node node-2" /><div className="map-node node-3" /><div className="map-node node-4" /></div></div><div className="zone-list"><ZoneRow name="North Field" detail="Zones A & B · 82 acres" value="41%" status="Within range" /><ZoneRow name="Orchard" detail="Rows 01–12 · 36 acres" value="29%" status="Needs attention" warning /><ZoneRow name="South Field" detail="Zone C · 64 acres" value="45%" status="Within range" /></div></div></div>
  </>;
}

function MetricCard({ label, value, suffix, detail, trend, positive, icon, color }: { label: string; value: string; suffix?: string; detail: string; trend: string; positive: boolean; icon: React.ReactNode; color: string }) { return <div className="metric-card"><div className={`metric-icon ${color}`}>{icon}</div><div className="metric-label">{label}</div><div className="metric-value">{value}<small>{suffix}</small></div><div className="metric-foot"><span>{detail}</span><span className={`trend ${positive ? 'positive' : 'negative'}`}>{positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{trend}</span></div></div>; }
function ChartCard({ title, meta, action, children }: { title: string; meta: string; action: string; children: React.ReactNode }) { return <div className="panel chart-card"><div className="panel-heading"><div><h3>{title}</h3><p>{meta}</p></div><button className="chart-action">{action}<ChevronDown size={14} /></button></div>{children}</div>; }
function AreaChart() { return <div className="chart-wrap"><div className="chart-legend"><span><i className="legend-dot blue-dot" /> Moisture level</span><strong>38.4% <small>avg.</small></strong></div><svg className="line-chart" viewBox="0 0 640 190" preserveAspectRatio="none"><defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#73a99a" stopOpacity=".24" /><stop offset="1" stopColor="#73a99a" stopOpacity="0" /></linearGradient></defs><path d="M0 135 C40 128 50 116 88 124 S138 142 166 116 S220 91 250 102 S298 118 328 87 S380 80 415 94 S454 113 488 74 S548 54 580 69 S622 54 640 42 V190 H0Z" fill="url(#areaFill)" /><path d="M0 135 C40 128 50 116 88 124 S138 142 166 116 S220 91 250 102 S298 118 328 87 S380 80 415 94 S454 113 488 74 S548 54 580 69 S622 54 640 42" fill="none" stroke="#3e897a" strokeWidth="3" /></svg><ChartAxis /></div>; }
function HealthChart() { return <div className="health-chart"><div className="health-score"><div className="ring"><strong>87.6</strong><span>/ 100</span></div><div><strong>Healthy fields</strong><p>4 of 5 zones are in optimal condition</p></div></div><div className="health-bars"><HealthBar label="North Field" value={92} /><HealthBar label="South Field" value={88} /><HealthBar label="Orchard" value={73} /><HealthBar label="Greenhouse" value={96} /></div></div>; }
function HealthBar({ label, value }: { label: string; value: number }) { return <div className="health-bar"><div><span>{label}</span><strong>{value}</strong></div><div className="bar-track"><span style={{ width: `${value}%` }} /></div></div>; }
function BarChart() { return <div className="bar-chart"><div className="chart-legend"><span><i className="legend-dot green-dot" /> Actual</span><span><i className="legend-dot gray-dot" /> Target</span><strong>12.8k <small>gal</small></strong></div><div className="bars">{[61, 78, 56, 83, 68, 91, 74].map((height, index) => <div className="bar-group" key={index}><div className="bar-columns"><span style={{ height: `${height}%` }} /><i style={{ height: `${Math.min(height + 12, 100)}%` }} /></div><small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</small></div>)}</div></div>; }
function ChartAxis() { return <div className="chart-axis"><span>Sep 14</span><span>Sep 16</span><span>Sep 18</span><span>Sep 20</span></div>; }
function AlertRow({ severity, title, location, time, icon: Icon }: typeof alerts[number]) { return <div className="alert-row"><div className={`alert-icon ${severity.toLowerCase()}`}><Icon size={16} /></div><div><strong>{title}</strong><span>{location} · {time}</span></div><ChevronRight size={16} /></div>; }
function ZoneRow({ name, detail, value, status, warning }: { name: string; detail: string; value: string; status: string; warning?: boolean }) { return <div className="zone-row"><div className="zone-avatar"><Sprout size={16} /></div><div className="zone-info"><strong>{name}</strong><span>{detail}</span></div><div className="zone-moisture"><strong>{value}</strong><span>moisture</span></div><span className={`status-text ${warning ? 'warning-text' : ''}`}><i />{status}</span></div>; }

function Telemetry() { const [query, setQuery] = useState(''); const filtered = useMemo(() => sensors.filter((sensor) => `${sensor.id} ${sensor.location}`.toLowerCase().includes(query.toLowerCase())), [query]); return <><PageHeader eyebrow="Field monitoring" title="Sensor Telemetry" description="Real-time environmental readings from your connected sensor network." action={<button className="secondary-button"><Filter size={16} /> Filters <span className="filter-count">2</span></button>} /><div className="telemetry-stats"><MiniStat icon={<Wifi />} label="Network health" value="96.4%" detail="+1.2% vs last week" /><MiniStat icon={<Activity />} label="Readings today" value="18,492" detail="All systems reporting" /><MiniStat icon={<AlertTriangle />} label="Needs attention" value="6" detail="4 warning · 2 offline" /></div><div className="panel table-panel"><div className="table-toolbar"><div className="search-field"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sensors or locations" /></div><div className="toolbar-actions"><button className="secondary-button small"><SlidersHorizontal size={15} /> Status: All <ChevronDown size={14} /></button><button className="icon-button bordered"><MoreHorizontal size={18} /></button></div></div><div className="table-scroll"><table><thead><tr><th>Sensor</th><th>Location</th><th>Soil moisture</th><th>Temperature</th><th>Humidity</th><th>Battery</th><th>Status</th><th>Last updated</th><th /></tr></thead><tbody>{filtered.map((sensor) => <tr key={sensor.id}><td><strong className="sensor-id">{sensor.id}</strong><small>{sensor.health}</small></td><td>{sensor.location}</td><td><strong>{sensor.moisture}</strong><div className="table-meter"><span style={{ width: sensor.moisture === '—' ? 0 : sensor.moisture }} /></div></td><td>{sensor.temp}</td><td>{sensor.humidity}</td><td><span className={sensor.battery === '12%' ? 'battery-low' : ''}>{sensor.battery}</span></td><td><StatusBadge status={sensor.status} /></td><td className="muted-cell">{sensor.updated}</td><td><button className="icon-button"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div>{filtered.length === 0 && <EmptyState title="No sensors found" description="Try adjusting your search or filters." />}<div className="table-footer"><span>Showing 1–{filtered.length} of 148 sensors</span><div><button className="icon-button bordered"><ChevronLeft size={17} /></button><button className="pagination-current">1</button><button className="icon-button bordered"><ChevronRight size={17} /></button></div></div></div></>; }
function MiniStat({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) { return <div className="mini-stat"><div className="mini-stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></div>; }
function StatusBadge({ status }: { status: Status }) { return <span className={`status-badge ${status.toLowerCase()}`}><i />{status}</span>; }

function CropMonitoring() { return <><PageHeader eyebrow="Field intelligence" title="Crop Monitoring" description="Understand crop performance and environmental conditions across every zone." action={<button className="primary-button"><Plus size={17} /> Add monitored zone</button>} /><div className="crop-summary"><div className="crop-summary-copy"><div className="eyebrow">Field health index</div><strong>87.6 <small>/ 100</small></strong><p>Overall crop health is trending positively across Willow Creek Farms.</p></div><div className="summary-orbit"><div className="orbit-center"><Leaf size={25} /></div><span className="orbit-dot dot-a" /><span className="orbit-dot dot-b" /><span className="orbit-dot dot-c" /></div><div className="crop-summary-metrics"><div><span>Optimal</span><strong>4</strong><small>zones</small></div><div><span>Monitoring</span><strong>148</strong><small>sensors</small></div><div><span>Last inspection</span><strong>Today</strong><small>08:42 AM</small></div></div></div><div className="section-title-row"><div><h2>Monitored crops</h2><p>Current growth and environmental signals by zone</p></div><button className="secondary-button small"><Filter size={15} /> Filter crops</button></div><div className="crop-grid"><CropCard crop="Winter wheat" field="North Field · Zones A & B" stage="Grain filling" health="92" color="green" moisture="41%" temp="23.8°" updated="12 min ago" /><CropCard crop="Almond orchard" field="Orchard · Rows 01–12" stage="Nut development" health="73" color="amber" moisture="29%" temp="26.4°" updated="18 min ago" warning /><CropCard crop="Soybean" field="South Field · Zone C" stage="Pod development" health="88" color="blue" moisture="45%" temp="22.9°" updated="9 min ago" /></div></>; }
function CropCard({ crop, field, stage, health, color, moisture, temp, updated, warning }: { crop: string; field: string; stage: string; health: string; color: string; moisture: string; temp: string; updated: string; warning?: boolean }) { return <div className="crop-card"><div className={`crop-card-art ${color}`}><div className="crop-art-pattern" /><span>{stage}</span><button className="icon-button"><MoreHorizontal size={18} /></button></div><div className="crop-card-body"><div className="crop-title"><div><h3>{crop}</h3><p>{field}</p></div><div className={`health-circle ${color}`}>{health}</div></div><div className="crop-metrics"><div><Droplets size={15} /><span>Moisture</span><strong>{moisture}</strong></div><div><Thermometer size={15} /><span>Temperature</span><strong>{temp}</strong></div></div><div className={`crop-card-foot ${warning ? 'warning-text' : ''}`}><span><i />{warning ? 'Needs attention' : 'Healthy conditions'}</span><small>Updated {updated}</small></div></div></div>; }

function Irrigation() { const [running, setRunning] = useState(false); return <><PageHeader eyebrow="Water operations" title="Irrigation Control" description="Monitor flow, manage zones, and keep every irrigation cycle on schedule." action={<button className="secondary-button"><CalendarDays size={16} /> Schedule calendar</button>} /><div className="irrigation-hero"><div><div className="eyebrow light-eyebrow"><span /> Live irrigation status</div><h2>{running ? 'Irrigation cycle in progress' : 'Water systems are ready'}</h2><p>{running ? 'North Field · Zone A is currently receiving water.' : 'No active cycles. All valves are available for operation.'}</p><button className={`control-button ${running ? 'stop' : ''}`} onClick={() => setRunning(!running)}>{running ? <><Pause size={16} /> Stop current cycle</> : <><Play size={16} /> Start irrigation</>}</button></div><div className="water-ring"><Droplets size={27} /><strong>{running ? '68%' : '100%'}</strong><span>system capacity</span></div></div><div className="section-title-row"><div><h2>Irrigation zones</h2><p>Valve status and recent activity</p></div><button className="secondary-button small"><Filter size={15} /> Filter zones</button></div><div className="irrigation-grid"><IrrigationCard name="North Field · Zone A" status="Ready" moisture="42%" usage="1,240 gal" time="Today, 06:00 AM" active={running} /><IrrigationCard name="North Field · Zone B" status="Scheduled" moisture="38%" usage="980 gal" time="Tomorrow, 05:30 AM" /><IrrigationCard name="Orchard · Row 04" status="Attention" moisture="29%" usage="—" time="No schedule" warning /><IrrigationCard name="South Field · Zone C" status="Ready" moisture="45%" usage="1,860 gal" time="Today, 05:45 AM" /></div></>; }
function IrrigationCard({ name, status, moisture, usage, time, active, warning }: { name: string; status: string; moisture: string; usage: string; time: string; active?: boolean; warning?: boolean }) { return <div className="panel irrigation-card"><div className="irrigation-card-head"><div className={`valve-icon ${active ? 'active' : ''}`}><Droplets size={18} /></div><div><h3>{name}</h3><span className={`status-text ${warning ? 'warning-text' : ''}`}><i />{status}</span></div><button className="icon-button"><MoreHorizontal size={18} /></button></div><div className="irrigation-readings"><div><span>Soil moisture</span><strong>{moisture}</strong></div><div><span>Water usage</span><strong>{usage}</strong></div></div><div className="irrigation-schedule"><CalendarDays size={15} /><span>{time}</span></div></div>; }

function Alerts() { return <><PageHeader eyebrow="System awareness" title="Alerts" description="Stay ahead of conditions that need attention across your operation." action={<button className="secondary-button"><SlidersHorizontal size={16} /> Alert preferences</button>} /><div className="alert-summary"><div><strong>3</strong><span>Open alerts</span></div><div><strong className="critical-number">1</strong><span>Critical</span></div><div><strong className="warning-number">1</strong><span>Warning</span></div><div><strong className="info-number">1</strong><span>Information</span></div><div className="alert-summary-progress"><span>Response rate</span><strong>94%</strong><div><i /></div></div></div><div className="panel full-alert-panel"><div className="alert-tabs"><button className="active">All <b>3</b></button><button>Critical <b>1</b></button><button>Warning <b>1</b></button><button>Information <b>1</b></button><button>Resolved</button></div><div className="full-alert-list">{alerts.map((alert) => <div className="full-alert-row" key={alert.title}><div className={`alert-icon ${alert.severity.toLowerCase()}`}><alert.icon size={18} /></div><div className="full-alert-copy"><div><span className={`severity-label ${alert.severity.toLowerCase()}`}>{alert.severity}</span><small>{alert.time}</small></div><h3>{alert.title}</h3><p>{alert.location} · Sensor telemetry network</p></div><button className="secondary-button small">Review alert <ArrowUpRight size={14} /></button></div>)}</div></div></>; }

function Reports() { return <><PageHeader eyebrow="Performance analytics" title="Reports" description="Turn field history into clear operational decisions." action={<button className="primary-button"><ArrowUpRight size={16} /> Export report</button>} /><div className="report-toolbar"><button className="secondary-button"><CalendarDays size={16} /> Sep 14 – Sep 20, 2026 <ChevronDown size={15} /></button><div className="report-tabs"><button className="active">Overview</button><button>Water</button><button>Crop health</button><button>Sensor performance</button></div></div><div className="report-metrics"><MetricCard label="Water saved" value="4,920" suffix=" gal" detail="vs. previous period" trend="12.4%" positive icon={<Droplets />} color="blue" /><MetricCard label="Average moisture" value="38.4%" detail="Target: 35–45%" trend="2.8%" positive icon={<Activity />} color="green" /><MetricCard label="Healthy zones" value="4" suffix=" / 5" detail="One zone needs attention" trend="1" positive icon={<Leaf />} color="lime" /></div><div className="dashboard-grid report-charts"><ChartCard title="Water utilization over time" meta="Actual consumption compared to target" action="Daily"><BarChart /></ChartCard><ChartCard title="Soil moisture by zone" meta="Average moisture percentage" action="By zone"><HealthBar label="North Field" value={41} /><HealthBar label="South Field" value={45} /><HealthBar label="Orchard" value={29} /><HealthBar label="Greenhouse" value={52} /></ChartCard></div></>; }

function Administration() { return <><PageHeader eyebrow="Workspace governance" title="Administration" description="Manage access, field structure, and connected infrastructure." action={<button className="primary-button"><Plus size={17} /> Invite user</button>} /><div className="admin-tabs"><button className="active"><Users size={16} /> User management</button><button><SlidersHorizontal size={16} /> Roles & permissions</button><button><Wifi size={16} /> Sensor management</button><button><Sprout size={16} /> Farms & zones</button></div><div className="panel table-panel admin-table"><div className="table-toolbar"><div><h3>Workspace users</h3><p>People with access to Willow Creek Farms</p></div><div className="search-field"><Search size={17} /><input placeholder="Search users" /></div></div><div className="table-scroll"><table><thead><tr><th>User</th><th>Role</th><th>Account status</th><th>Last activity</th><th /></tr></thead><tbody><tr><td><div className="table-user"><div className="avatar">AM</div><div><strong>Alex Morgan</strong><small>alex.morgan@agritech.com</small></div></div></td><td>Administrator</td><td><StatusBadge status="Online" /></td><td>Just now</td><td><MoreHorizontal size={17} /></td></tr><tr><td><div className="table-user"><div className="avatar avatar-sage">JM</div><div><strong>Jordan Miller</strong><small>jordan.miller@agritech.com</small></div></div></td><td>Farm Manager</td><td><StatusBadge status="Online" /></td><td>24 min ago</td><td><MoreHorizontal size={17} /></td></tr><tr><td><div className="table-user"><div className="avatar avatar-sand">RK</div><div><strong>Riley Kim</strong><small>riley.kim@agritech.com</small></div></div></td><td>Agronomist</td><td><StatusBadge status="Offline" /></td><td>Yesterday</td><td><MoreHorizontal size={17} /></td></tr></tbody></table></div></div></>; }
function EmptyState({ title, description }: { title: string; description: string }) { return <div className="empty-state"><Search size={24} /><strong>{title}</strong><p>{description}</p></div>; }

export default App;
