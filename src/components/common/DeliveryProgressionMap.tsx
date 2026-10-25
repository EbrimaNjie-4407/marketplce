import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  CheckCircle2,
  Clock,
  Radio,
  Layers,
  Maximize2,
  Compass,
  Store,
  Wrench,
  AlertCircle,
  Eye,
} from 'lucide-react';

export interface RouteWaypoint {
  id: string;
  label: string;
  subLabel: string;
  x: number;
  y: number;
  kmFromOrigin: number;
  estimatedMinutesFromStart: number;
  roadName: string;
}

export const ROUTE_WAYPOINTS: RouteWaypoint[] = [
  {
    id: 'origin',
    label: 'Dealer Hub',
    subLabel: 'BURGI Auto Parts, Jeshwang Hub',
    x: 130,
    y: 370,
    kmFromOrigin: 0.0,
    estimatedMinutesFromStart: 0,
    roadName: 'Jeshwang Spare Parts Commercial Street',
  },
  {
    id: 'dispatch_exit',
    label: 'Market Dispatch Gate',
    subLabel: 'Package sealed & dispatched',
    x: 250,
    y: 320,
    kmFromOrigin: 0.8,
    estimatedMinutesFromStart: 3,
    roadName: 'Jeshwang - Old Jeshwang Link Rd',
  },
  {
    id: 'jimpex_junction',
    label: 'Jimpex Junction',
    subLabel: 'Banjul-Serrekunda Highway Corridor',
    x: 410,
    y: 260,
    kmFromOrigin: 2.1,
    estimatedMinutesFromStart: 8,
    roadName: 'Banjul-Serrekunda Highway',
  },
  {
    id: 'westfield_interchange',
    label: 'Westfield Interchange',
    subLabel: 'Passing Tipper Garage & Kairaba Ave',
    x: 580,
    y: 205,
    kmFromOrigin: 3.4,
    estimatedMinutesFromStart: 14,
    roadName: 'Westfield Roundabout Arterial',
  },
  {
    id: 'workshop_approach',
    label: 'Sayerr Jobe Approach',
    subLabel: '0.5 km to destination gate',
    x: 715,
    y: 155,
    kmFromOrigin: 4.3,
    estimatedMinutesFromStart: 18,
    roadName: 'Sayerr Jobe Avenue',
  },
  {
    id: 'destination',
    label: 'Mechanic Workshop',
    subLabel: 'Mensah Auto Works, Bay 3',
    x: 820,
    y: 115,
    kmFromOrigin: 4.8,
    estimatedMinutesFromStart: 22,
    roadName: 'Workshop Service Lane, Westfield',
  },
];

interface DeliveryProgressionMapProps {
  progressPercent: number; // 0 to 100
  dealerName: string;
  dealerLocation: string;
  mechanicName: string;
  mechanicWorkshop: string;
  courierName: string;
  courierVehicle: string;
  courierSpeedKmH: number;
  etaMinutes: number;
  isDelivered: boolean;
  onSelectWaypoint?: (wp: RouteWaypoint) => void;
}

export function DeliveryProgressionMap({
  progressPercent,
  dealerName,
  dealerLocation,
  mechanicName,
  mechanicWorkshop,
  courierName,
  courierVehicle,
  courierSpeedKmH,
  etaMinutes,
  isDelivered,
  onSelectWaypoint,
}: DeliveryProgressionMapProps) {
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'dark'>('streets');
  const [showTraffic, setShowTraffic] = useState(true);
  const [viewFocus, setViewFocus] = useState<'full' | 'courier' | 'destination'>('full');
  const [selectedWp, setSelectedWp] = useState<RouteWaypoint | null>(null);

  // Total distance
  const totalKm = ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1].kmFromOrigin;
  const currentKm = Math.min(totalKm, (progressPercent / 100) * totalKm);
  const remainingKm = Math.max(0, totalKm - currentKm);

  // Compute courier position along the piecewise linear waypoint segments
  const getCourierPosition = (pct: number) => {
    const clamped = Math.max(0, Math.min(100, pct));
    const targetDist = (clamped / 100) * totalKm;

    for (let i = 0; i < ROUTE_WAYPOINTS.length - 1; i++) {
      const p1 = ROUTE_WAYPOINTS[i];
      const p2 = ROUTE_WAYPOINTS[i + 1];

      if (targetDist <= p2.kmFromOrigin || i === ROUTE_WAYPOINTS.length - 2) {
        const segLen = p2.kmFromOrigin - p1.kmFromOrigin;
        const segFraction = segLen > 0 ? (targetDist - p1.kmFromOrigin) / segLen : 0;
        const clampedFraction = Math.max(0, Math.min(1, segFraction));

        const x = p1.x + (p2.x - p1.x) * clampedFraction;
        const y = p1.y + (p2.y - p1.y) * clampedFraction;

        // Angle in degrees
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

        return {
          x,
          y,
          angle,
          currentRoad: clampedFraction > 0.5 ? p2.roadName : p1.roadName,
          nextWaypoint: p2,
          activeSegmentIndex: i,
        };
      }
    }

    const last = ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1];
    return {
      x: last.x,
      y: last.y,
      angle: -20,
      currentRoad: last.roadName,
      nextWaypoint: last,
      activeSegmentIndex: ROUTE_WAYPOINTS.length - 1,
    };
  };

  const courierPos = getCourierPosition(progressPercent);

  // Build SVG path data for the route
  const routePathD = ROUTE_WAYPOINTS.reduce((acc, wp, idx) => {
    if (idx === 0) return `M ${wp.x} ${wp.y}`;
    return `${acc} L ${wp.x} ${wp.y}`;
  }, '');

  // Active traveled path
  const traveledPathD = (() => {
    let d = `M ${ROUTE_WAYPOINTS[0].x} ${ROUTE_WAYPOINTS[0].y}`;
    for (let i = 0; i < courierPos.activeSegmentIndex; i++) {
      d += ` L ${ROUTE_WAYPOINTS[i + 1].x} ${ROUTE_WAYPOINTS[i + 1].y}`;
    }
    d += ` L ${courierPos.x} ${courierPos.y}`;
    return d;
  })();

  const isDark = mapStyle === 'dark';
  const isSat = mapStyle === 'satellite';

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-900 select-none">
      {/* Top Map Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Live GPS Status Pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/10 text-white text-xs shadow-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isDelivered ? 'bg-emerald-400' : 'bg-blue-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isDelivered ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
            />
          </span>
          <span className="font-bold tracking-tight">
            {isDelivered ? 'Delivered at Workshop' : 'Live Transit Telemetry'}
          </span>
          <span className="text-[10px] text-slate-300 font-mono pl-1 border-l border-white/15">
            GPS 4G · 99.4% precision
          </span>
        </div>

        {/* Map View & Layer Controls */}
        <div className="flex items-center gap-2">
          {/* Traffic toggle */}
          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all backdrop-blur-md border flex items-center gap-1.5 shadow-sm ${
              showTraffic
                ? 'bg-emerald-600/90 text-white border-emerald-400/40'
                : 'bg-slate-900/80 text-slate-300 border-white/10 hover:text-white'
            }`}
            title="Toggle Live Traffic Layer"
          >
            <Radio className="w-3 h-3" />
            <span>Traffic {showTraffic ? 'ON' : 'OFF'}</span>
          </button>

          {/* Map style switch */}
          <div className="p-0.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/10 flex items-center text-[11px] font-medium text-slate-300">
            <button
              onClick={() => setMapStyle('streets')}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                mapStyle === 'streets' ? 'bg-blue-600 text-white font-bold' : 'hover:text-white'
              }`}
            >
              Streets
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                mapStyle === 'satellite' ? 'bg-blue-600 text-white font-bold' : 'hover:text-white'
              }`}
            >
              Terrain
            </button>
            <button
              onClick={() => setMapStyle('dark')}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                mapStyle === 'dark' ? 'bg-blue-600 text-white font-bold' : 'hover:text-white'
              }`}
            >
              Night
            </button>
          </div>

          {/* Recenter / Focus Controls */}
          <div className="p-0.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/10 flex items-center">
            <button
              onClick={() => setViewFocus('full')}
              className={`p-1.5 rounded-full transition-colors ${
                viewFocus === 'full' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Overview Entire Route"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewFocus('courier')}
              className={`p-1.5 rounded-full transition-colors ${
                viewFocus === 'courier' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Focus on Moving Courier"
            >
              <Navigation className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main SVG Vector Canvas */}
      <div className="w-full aspect-[16/9] min-h-[380px] max-h-[560px] overflow-hidden relative">
        <svg
          viewBox="0 0 950 500"
          className="w-full h-full object-cover transition-all duration-700"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Background Map Gradient */}
            <linearGradient id="bgGradStreets" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="bgGradSatellite" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1c2826" />
              <stop offset="50%" stopColor="#283618" />
              <stop offset="100%" stopColor="#1e2716" />
            </linearGradient>

            {/* River & Mangrove Coast Accent */}
            <linearGradient id="waterGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0369a1" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
            </linearGradient>

            {/* Active Route Gradient */}
            <linearGradient id="activeRouteGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Courier Marker Glow */}
            <filter id="courierGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Map Base Canvas Fill */}
          <rect
            x="0"
            y="0"
            width="950"
            height="500"
            fill={isSat ? 'url(#bgGradSatellite)' : isDark ? '#090d16' : 'url(#bgGradStreets)'}
          />

          {/* Coastline / River Estuary (Greater Banjul Creek Waterbody) */}
          <path
            d="M 0 440 Q 180 400 320 450 T 600 480 L 950 500 L 950 460 Q 750 420 540 450 T 150 410 Z"
            fill="url(#waterGrad)"
          />
          <text
            x="380"
            y="470"
            fill="#38bdf8"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="2"
            opacity="0.4"
          >
            OYSTER CREEK / GAMBIA RIVER ESTUARY
          </text>

          {/* Secondary Arterial Grid / Minor Streets */}
          <g stroke="#334155" strokeWidth="1.5" strokeOpacity="0.35" fill="none">
            {/* North-South avenues */}
            <line x1="80" y1="0" x2="160" y2="500" />
            <line x1="220" y1="0" x2="280" y2="500" />
            <line x1="380" y1="0" x2="430" y2="500" />
            <line x1="530" y1="0" x2="560" y2="500" />
            <line x1="680" y1="0" x2="710" y2="500" />
            <line x1="830" y1="0" x2="850" y2="500" />

            {/* East-West connectors */}
            <line x1="0" y1="90" x2="950" y2="120" />
            <line x1="0" y1="180" x2="950" y2="210" />
            <line x1="0" y1="280" x2="950" y2="300" />
            <line x1="0" y1="390" x2="950" y2="400" />

            {/* Curving Bertil Harding connector */}
            <path d="M 50 150 Q 300 120 600 80 T 900 40" strokeWidth="2.5" strokeOpacity="0.3" />
          </g>

          {/* Major Trunk Roads (Banjul-Serrekunda Highway & Kairaba Ave) */}
          <g fill="none">
            {/* Wide road casing */}
            <path
              d="M 50 420 Q 250 360 480 280 T 900 150"
              stroke="#1e293b"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Road surface */}
            <path
              d="M 50 420 Q 250 360 480 280 T 900 150"
              stroke="#475569"
              strokeWidth="9"
              strokeLinecap="round"
              strokeOpacity="0.6"
            />
            {/* Center dashed line */}
            <path
              d="M 50 420 Q 250 360 480 280 T 900 150"
              stroke="#f8fafc"
              strokeWidth="1.2"
              strokeDasharray="6 8"
              strokeOpacity="0.4"
            />

            {/* Kairaba Avenue Cross Arterial */}
            <path
              d="M 520 40 L 620 480"
              stroke="#475569"
              strokeWidth="7"
              strokeOpacity="0.6"
            />
            <path
              d="M 520 40 L 620 480"
              stroke="#f8fafc"
              strokeWidth="1"
              strokeDasharray="4 6"
              strokeOpacity="0.3"
            />
          </g>

          {/* Traffic conditions overlay if enabled */}
          {showTraffic && (
            <g fill="none" strokeWidth="3" strokeOpacity="0.75" strokeLinecap="round">
              {/* Moderate flow near Westfield */}
              <line x1="530" y1="225" x2="620" y2="195" stroke="#f59e0b" />
              {/* Free flow on highway */}
              <path d="M 280 310 L 400 265" stroke="#10b981" />
              {/* Free flow in Jeshwang */}
              <path d="M 140 365 L 240 325" stroke="#10b981" />
            </g>
          )}

          {/* Area Landmark Labels */}
          <g fontSize="10" fontWeight="bold" fill="#64748b" opacity="0.65" letterSpacing="1">
            <text x="110" y="420">JESHWANG INDUSTRIAL HUB</text>
            <text x="360" y="325">JIMPEX WHOLESALE STRIP</text>
            <text x="540" y="270">WESTFIELD ROUNDABOUT</text>
            <text x="730" y="80">SERREKUNDA / KOTU SECTOR</text>
            <text x="535" y="65">KAIRABA AVENUE</text>
          </g>

          {/* The Actual Delivery Progression Route (Base uncompleted path) */}
          <path
            d={routePathD}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.25"
          />

          {/* Completed/Traveled Section with Glow */}
          <path
            d={traveledPathD}
            fill="none"
            stroke="url(#activeRouteGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#routeGlow)"
          />

          {/* Animated Flow Pulse dashes */}
          {!isDelivered && (
            <path
              d={routePathD}
              fill="none"
              stroke="#93c5fd"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="8 12"
              className="animate-pulse"
              strokeOpacity="0.7"
            />
          )}

          {/* Route Checkpoints & Milestones along the path */}
          {ROUTE_WAYPOINTS.map((wp, index) => {
            const isOrigin = index === 0;
            const isDest = index === ROUTE_WAYPOINTS.length - 1;
            const isPassed = currentKm >= wp.kmFromOrigin;
            const isCurrent =
              !isDelivered &&
              courierPos.nextWaypoint.id === wp.id &&
              !isOrigin;

            return (
              <g
                key={wp.id}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => {
                  setSelectedWp(wp);
                  if (onSelectWaypoint) onSelectWaypoint(wp);
                }}
              >
                {/* Outer Ring */}
                <circle
                  cx={wp.x}
                  cy={wp.y}
                  r={isOrigin || isDest ? 16 : 10}
                  fill={
                    isDest
                      ? isDelivered
                        ? '#059669'
                        : '#1e293b'
                      : isOrigin
                      ? '#1e3a8a'
                      : isPassed
                      ? '#065f46'
                      : '#1e293b'
                  }
                  stroke={
                    isDest
                      ? '#10b981'
                      : isOrigin
                      ? '#3b82f6'
                      : isPassed
                      ? '#34d399'
                      : '#64748b'
                  }
                  strokeWidth={isOrigin || isDest ? 3 : 2}
                />

                {/* Inner Icon or Checkmark */}
                {isPassed && !isOrigin && !isDest ? (
                  <circle cx={wp.x} cy={wp.y} r={4.5} fill="#10b981" />
                ) : (
                  <circle
                    cx={wp.x}
                    cy={wp.y}
                    r={isOrigin || isDest ? 6 : 3}
                    fill="#ffffff"
                  />
                )}

                {/* Waypoint Label Badge */}
                <g transform={`translate(${wp.x}, ${wp.y + (index % 2 === 0 ? 30 : -22)})`}>
                  <rect
                    x="-65"
                    y="-12"
                    width="130"
                    height="24"
                    rx="12"
                    fill="#0f172ae6"
                    stroke={isCurrent ? '#38bdf8' : '#334155'}
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="4"
                    fill={isCurrent ? '#38bdf8' : '#f1f5f9'}
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {wp.label}
                  </text>
                </g>

                {/* Additional badge for Origin (Dealer) */}
                {isOrigin && (
                  <g transform={`translate(${wp.x - 70}, ${wp.y - 45})`}>
                    <rect
                      x="0"
                      y="0"
                      width="140"
                      height="34"
                      rx="8"
                      fill="#1e3a8af0"
                      stroke="#60a5fa"
                      strokeWidth="1.5"
                    />
                    <text x="10" y="15" fill="#93c5fd" fontSize="8.5" fontWeight="black" letterSpacing="0.5">
                      ORIGIN · DEALER
                    </text>
                    <text x="10" y="28" fill="#ffffff" fontSize="10" fontWeight="bold">
                      {dealerName}
                    </text>
                  </g>
                )}

                {/* Additional badge for Destination (Workshop) */}
                {isDest && (
                  <g transform={`translate(${wp.x - 75}, ${wp.y - 45})`}>
                    <rect
                      x="0"
                      y="0"
                      width="150"
                      height="34"
                      rx="8"
                      fill={isDelivered ? '#065f46f0' : '#1e293bf0'}
                      stroke={isDelivered ? '#34d399' : '#10b981'}
                      strokeWidth="1.5"
                    />
                    <text x="10" y="15" fill={isDelivered ? '#6ee7b7' : '#a7f3d0'} fontSize="8.5" fontWeight="black" letterSpacing="0.5">
                      {isDelivered ? 'DESTINATION ARRIVED' : 'WORKSHOP DESTINATION'}
                    </text>
                    <text x="10" y="28" fill="#ffffff" fontSize="10" fontWeight="bold">
                      {mechanicWorkshop}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* LIVE MOVING COURIER MARKER */}
          <g
            transform={`translate(${courierPos.x}, ${courierPos.y})`}
            filter="url(#courierGlow)"
            className="transition-transform duration-300"
          >
            {/* Radar Wave Pulse */}
            {!isDelivered && (
              <circle
                r="26"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                opacity="0.6"
                className="animate-ping"
              />
            )}

            {/* Courier Background Disc */}
            <circle
              r="17"
              fill={isDelivered ? '#10b981' : '#2563eb'}
              stroke="#ffffff"
              strokeWidth="2.5"
              className="shadow-2xl"
            />

            {/* Direction Arrow oriented by heading angle */}
            <g transform={`rotate(${courierPos.angle})`}>
              <polygon points="0,-10 6,8 0,4 -6,8" fill="#ffffff" />
            </g>

            {/* Floating Live Telemetry Tooltip above vehicle */}
            <g transform="translate(0, -32)">
              <rect
                x="-75"
                y="-22"
                width="150"
                height="22"
                rx="11"
                fill="#0284c7"
                stroke="#bae6fd"
                strokeWidth="1.5"
                className="shadow-xl"
              />
              <text
                x="0"
                y="-8"
                fill="#ffffff"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                {isDelivered
                  ? '✓ Arrived at Garage'
                  : `🛵 ${courierName.split(' ')[0]} · ${courierSpeedKmH} km/h`}
              </text>
            </g>
          </g>
        </svg>

        {/* Floating Telemetry HUD at bottom of map */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Street & Landmark HUD */}
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2.5 text-white shadow-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-400">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
                <span>Active Street Segment</span>
                <span>·</span>
                <span className="text-blue-400 font-mono">
                  {currentKm.toFixed(1)} km / {totalKm.toFixed(1)} km
                </span>
              </div>
              <p className="text-xs font-bold text-white line-clamp-1">
                {courierPos.currentRoad}
              </p>
            </div>
          </div>

          {/* Dynamic ETA / Distance Remaining HUD */}
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2.5 text-white shadow-xl flex items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Estimated Arrival
              </span>
              <p className="text-sm font-black text-emerald-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {isDelivered ? 'Arrived' : `~${etaMinutes} mins`}
              </p>
            </div>

            <div className="pl-3 border-l border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Distance Left
              </span>
              <p className="text-sm font-black text-white font-mono">
                {isDelivered ? '0.0 km' : `${remainingKm.toFixed(1)} km`}
              </p>
            </div>

            <div className="pl-3 border-l border-white/10 hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Vehicle Speed
              </span>
              <p className="text-sm font-black text-blue-400 font-mono">
                {isDelivered ? '0 km/h' : `${courierSpeedKmH} km/h`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Waypoint Detail Modal / Drawer if user taps a waypoint */}
      {selectedWp && (
        <div className="p-4 bg-slate-800/95 border-t border-slate-700/80 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                KM {selectedWp.kmFromOrigin.toFixed(1)}
              </span>
              <h4 className="text-xs font-bold text-white">{selectedWp.label}</h4>
            </div>
            <p className="text-[11px] text-slate-300">{selectedWp.subLabel}</p>
            <p className="text-[10px] text-slate-400 font-mono">{selectedWp.roadName}</p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[11px] text-slate-400">
              Approx. +{selectedWp.estimatedMinutesFromStart}m from dispatch
            </span>
            <button
              onClick={() => setSelectedWp(null)}
              className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold text-slate-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
