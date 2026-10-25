import React, { useState, useEffect, useRef } from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Store,
  ArrowRight,
  ShieldCheck,
  Check,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Navigation,
  Package,
  FileText,
  AlertTriangle,
  Copy,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Wrench,
  Sparkles,
  ArrowLeft,
  X,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';
import { Order, OrderStatus } from '../../types';
import { DeliveryProgressionMap, ROUTE_WAYPOINTS } from './DeliveryProgressionMap';
import alternatorImg from '../../assets/images/alternator_assembly_1791849520193.jpg';

interface DeliveriesViewProps {
  initialOrderId?: string;
  onBack?: () => void;
}

export function DeliveriesView({ initialOrderId, onBack }: DeliveriesViewProps) {
  const store = useStore();
  const role = store.currentRole;

  // Filter orders
  const orders = store.orders.filter((ord) => {
    if (role === 'mechanic') return ord.mechanicId === store.currentUser.id || true;
    if (role === 'dealer') return ord.dealerId === 'dealer_burgi' || true;
    return true;
  });

  // Selected Order
  const [selectedOrder, setSelectedOrder] = useState<Order>(() => {
    if (initialOrderId) {
      const found = store.orders.find((o) => o.id === initialOrderId);
      if (found) return found;
    }
    return orders[0] || store.orders[0];
  });

  // If initialOrderId changes, sync selectedOrder
  useEffect(() => {
    if (initialOrderId) {
      const found = store.orders.find((o) => o.id === initialOrderId);
      if (found) setSelectedOrder(found);
    }
  }, [initialOrderId, store.orders]);

  // Real-time tracking progress simulation state (0 to 100)
  const [progressPercent, setProgressPercent] = useState<number>(() => {
    if (selectedOrder?.status === 'collected' || selectedOrder?.status === 'delivered') return 100;
    if (selectedOrder?.status === 'in_transit') return 55;
    if (selectedOrder?.status === 'ready_for_pickup') return 25;
    return 12;
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x, 2x, 5x
  const [courierSpeed, setCourierSpeed] = useState<number>(38);
  const [copiedPin, setCopiedPin] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inspection modal state
  const [showInspectionModal, setShowInspectionModal] = useState<boolean>(false);
  const [inspectionChecks, setInspectionChecks] = useState({
    partNumberMatch: true,
    noTransitDamage: true,
    connectorsIntact: true,
  });

  // Calculate ETA minutes based on remaining progress
  const etaMinutes = Math.max(1, Math.round(((100 - progressPercent) / 100) * 22));

  // Simulation timer effect
  useEffect(() => {
    if (!isPlaying) return;
    if (progressPercent >= 100) {
      setIsPlaying(false);
      return;
    }

    const intervalTime = 700 / simSpeed;
    const timer = setInterval(() => {
      setProgressPercent((prev) => {
        const increment = 0.6 * simSpeed;
        const next = Math.min(100, prev + increment);

        // Fluctuate speed realistically
        if (next < 20) {
          setCourierSpeed(Math.floor(20 + Math.random() * 10));
        } else if (next >= 20 && next < 65) {
          setCourierSpeed(Math.floor(40 + Math.random() * 12)); // highway speed
        } else if (next >= 65 && next < 85) {
          setCourierSpeed(Math.floor(25 + Math.random() * 8)); // westfield traffic
        } else if (next >= 85 && next < 99) {
          setCourierSpeed(Math.floor(18 + Math.random() * 6)); // approaching garage
        } else {
          setCourierSpeed(0);
        }

        // If hits 100%, update order status in store if not already delivered
        if (next >= 100) {
          setIsPlaying(false);
          setToastMessage('📦 Spare part has arrived at the workshop! Ready for inspection.');
        }

        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, progressPercent, simSpeed]);

  // When order changes, reset progress baseline
  const handleSelectOrder = (ord: Order) => {
    setSelectedOrder(ord);
    if (ord.status === 'collected' || ord.status === 'delivered') {
      setProgressPercent(100);
      setIsPlaying(false);
      setCourierSpeed(0);
    } else if (ord.status === 'in_transit') {
      setProgressPercent(55);
      setIsPlaying(true);
      setCourierSpeed(42);
    } else if (ord.status === 'ready_for_pickup') {
      setProgressPercent(25);
      setIsPlaying(true);
      setCourierSpeed(24);
    } else {
      setProgressPercent(10);
      setIsPlaying(true);
      setCourierSpeed(18);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyPin = (pin: string) => {
    navigator.clipboard?.writeText(pin);
    setCopiedPin(true);
    showToast(`Verification code ${pin} copied to clipboard!`);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleManualStatusAdvance = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    marketplaceStore.updateOrderStatus(selectedOrder.id, newStatus);
    const updated = store.orders.find((o) => o.id === selectedOrder.id);
    if (updated) setSelectedOrder({ ...updated });

    if (newStatus === 'in_transit') {
      setProgressPercent(55);
      setIsPlaying(true);
    } else if (newStatus === 'collected' || newStatus === 'delivered') {
      setProgressPercent(100);
      setIsPlaying(false);
      setCourierSpeed(0);
    }
    showToast(`Status updated to: ${newStatus.replace(/_/g, ' ')}`);
  };

  const handleConfirmInspection = () => {
    if (!selectedOrder) return;
    marketplaceStore.updateOrderStatus(selectedOrder.id, 'delivered');
    const updated = store.orders.find((o) => o.id === selectedOrder.id);
    if (updated) setSelectedOrder({ ...updated });
    setShowInspectionModal(false);
    setProgressPercent(100);
    setIsPlaying(false);
    setCourierSpeed(0);
    showToast('✓ Handover confirmed! Part inspected, accepted, and recorded.');
  };

  const isDelivered =
    progressPercent >= 100 ||
    selectedOrder?.status === 'collected' ||
    selectedOrder?.status === 'delivered';

  // Associated Part Request
  const associatedRequest = store.requests.find((r) => r.id === selectedOrder?.requestId);

  // Verification PIN
  const handoverPIN = selectedOrder?.id ? `8429` : '7193';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-blue-500/30 flex items-center gap-3 animate-slideDown">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Breadcrumb & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Real-Time Delivery & Handover Tracking
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual map tracking the spare part progression from dealer shop to mechanic workshop in
            real time.
          </p>
        </div>

        {/* Quick Order Switcher if multiple orders */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider">
            Order:
          </span>
          {orders.map((ord) => (
            <button
              key={ord.id}
              onClick={() => handleSelectOrder(ord)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedOrder?.id === ord.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {ord.id}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Interactive Map Section */}
      <div className="space-y-3">
        <DeliveryProgressionMap
          progressPercent={progressPercent}
          dealerName={selectedOrder?.dealerName || 'BURGI SPARE PARTS'}
          dealerLocation={selectedOrder?.dealerLocation || 'Shop 18, Jeshwang Spare Parts Hub'}
          mechanicName={selectedOrder?.mechanicName || 'Kwame Mensah'}
          mechanicWorkshop={
            associatedRequest?.workshopName || 'Mensah Auto Works, Westfield Junction'
          }
          courierName="Lamin Touray"
          courierVehicle="Honda CG125 Cargo (BJL 8421 X)"
          courierSpeedKmH={courierSpeed}
          etaMinutes={etaMinutes}
          isDelivered={isDelivered}
        />

        {/* Live Simulation Control Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
          {/* Play/Pause & Real-time Scrubber Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Simulation' : 'Resume Live Tracking'}</span>
            </button>

            {/* Step Speed multiplier */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
              <span className="text-[10px] text-slate-400 uppercase px-2 font-mono">Speed:</span>
              {[1, 2, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSimSpeed(s)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    simSpeed === s ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setProgressPercent(0);
                setIsPlaying(true);
                showToast('Progression reset to Dealer Shop origin');
              }}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
              title="Reset Route Progression"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Stage Jump Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Jump to Stage:
            </span>
            <button
              onClick={() => {
                setProgressPercent(0);
                setIsPlaying(false);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              1. Dealer Origin
            </button>
            <button
              onClick={() => {
                setProgressPercent(25);
                setIsPlaying(true);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              2. Dispatched
            </button>
            <button
              onClick={() => {
                setProgressPercent(55);
                setIsPlaying(true);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              3. Highway Transit
            </button>
            <button
              onClick={() => {
                setProgressPercent(85);
                setIsPlaying(true);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              4. Workshop Approach
            </button>
            <button
              onClick={() => {
                setProgressPercent(100);
                setIsPlaying(false);
                setCourierSpeed(0);
                setShowInspectionModal(true);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
            >
              5. Arrived (Inspect)
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Order & Part Details (Left) + Timeline & Handover Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): Part & Courier Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Part Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Dispatched Spare Part
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedOrder.partName}</h3>
                <p className="text-xs text-blue-600 font-mono font-semibold">
                  OEM: {selectedOrder.partNumber || '27060-0T140'}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                  isDelivered
                    ? 'bg-emerald-100 text-emerald-800'
                    : progressPercent > 20
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isDelivered ? 'Delivered' : progressPercent > 20 ? 'In Transit' : 'Preparing'}
              </span>
            </div>

            {/* Part Preview */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                <img
                  src={alternatorImg}
                  alt={selectedOrder.partName}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-slate-900">
                  {associatedRequest?.vehicleMake || 'Toyota'}{' '}
                  {associatedRequest?.vehicleModel || 'Corolla'} ·{' '}
                  {associatedRequest?.vehicleYear || '2014'}
                </p>
                <p className="text-slate-500 text-[11px]">
                  Condition: Tested & verified working 14.2V charging output
                </p>
                <p className="font-mono font-bold text-slate-800">
                  Price: D{selectedOrder.priceGMD.toLocaleString()} GMD
                  {selectedOrder.deliveryFeeGMD ? ` (+D${selectedOrder.deliveryFeeGMD} dispatch)` : ''}
                </p>
              </div>
            </div>

            {/* Courier Dispatch Profile Card */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">
                  Assigned Auto Courier
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  ★ 4.9 (340 deliveries)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
                  LT
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-900">Lamin Touray</h4>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Honda CG125 Cargo · Reg: BJL 8421 X</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-blue-200/50">
                <a
                  href="tel:+2207123456"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Lamin</span>
                </a>
                <button
                  onClick={() => showToast('Messaging channel open with courier Lamin')}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>Chat</span>
                </button>
              </div>
            </div>

            {/* Handover Security PIN Code */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Handover Verification PIN
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Secure Exchange
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-black font-mono tracking-widest text-emerald-400">
                    {handoverPIN}
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Share with courier only after checking the physical part
                  </p>
                </div>
                <button
                  onClick={() => handleCopyPin(handoverPIN)}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 border border-slate-700"
                  title="Copy PIN"
                >
                  {copiedPin ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Dealer & Workshop Location Summary */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                  <Store className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Dealer Dispatch Counter
                  </span>
                  <p className="font-bold text-slate-900">{selectedOrder.dealerName}</p>
                  <p className="text-slate-500">{selectedOrder.dealerLocation}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                  <Wrench className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Workshop Receiving Bay
                  </span>
                  <p className="font-bold text-slate-900">
                    {associatedRequest?.workshopName || 'Mensah Auto Works'} (Kwame Mensah)
                  </p>
                  <p className="text-slate-500">
                    {selectedOrder.deliveryAddress || 'Westfield Junction, Serrekunda'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Progression Milestones Timeline & Inspection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Progression Milestones Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delivery Progression Route</h3>
                <p className="text-xs text-slate-500">
                  Step-by-step verified telemetry from Jeshwang hub to workshop
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-blue-600 text-sm">
                  {Math.round(progressPercent)}%
                </span>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Progress</p>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {ROUTE_WAYPOINTS.map((wp, idx) => {
                const totalKm = ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1].kmFromOrigin;
                const wpPct = (wp.kmFromOrigin / totalKm) * 100;
                const isCompleted = progressPercent >= wpPct || (idx === 0 && progressPercent >= 0);
                const isCurrent =
                  !isDelivered &&
                  progressPercent >= wpPct - 15 &&
                  progressPercent < wpPct + 15;

                return (
                  <div key={wp.id} className="relative flex items-start gap-4">
                    {/* Circle Node */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-blue-600 text-white animate-pulse'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-xs font-mono font-bold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4
                          className={`text-xs font-bold ${
                            isCompleted
                              ? 'text-slate-900'
                              : isCurrent
                              ? 'text-blue-600'
                              : 'text-slate-500'
                          }`}
                        >
                          {wp.label}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {isCompleted
                            ? `✓ Done · ${wp.kmFromOrigin.toFixed(1)} km`
                            : `+${wp.estimatedMinutesFromStart}m · ${wp.kmFromOrigin.toFixed(1)} km`}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">{wp.subLabel}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{wp.roadName}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Handover Completion / Mechanic Inspection Action */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              {isDelivered ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Part Received & Accepted at Workshop</span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    The {selectedOrder.partName} has completed physical inspection, connector fit
                    verification, and has been signed off. Order completed.
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => setShowInspectionModal(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      View Inspection Certificate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">
                      Package Handover Inspection
                    </h4>
                    <p className="text-xs text-slate-500">
                      When the dispatch courier arrives at the workshop, verify the part number and
                      condition before signing off.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowInspectionModal(true)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Inspect & Accept Part</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mechanic Part Inspection & Handover Acceptance Modal */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider block">
                  Quality & Handover Checklist
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">Inspect & Accept Part</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Order {selectedOrder.id} · {selectedOrder.partName}
                </p>
              </div>
              <button
                onClick={() => setShowInspectionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={inspectionChecks.partNumberMatch}
                  onChange={(e) =>
                    setInspectionChecks({
                      ...inspectionChecks,
                      partNumberMatch: e.target.checked,
                    })
                  }
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded-sm"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">
                    1. Part number matches vehicle requirement
                  </span>
                  <span className="text-slate-500 font-mono">
                    Stamped: {selectedOrder.partNumber || '27060-0T140'}
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={inspectionChecks.noTransitDamage}
                  onChange={(e) =>
                    setInspectionChecks({
                      ...inspectionChecks,
                      noTransitDamage: e.target.checked,
                    })
                  }
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded-sm"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">
                    2. Physical housing free of transit cracks / leaks
                  </span>
                  <span className="text-slate-500">
                    Casting inspected, mounting brackets undamaged
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={inspectionChecks.connectorsIntact}
                  onChange={(e) =>
                    setInspectionChecks({
                      ...inspectionChecks,
                      connectorsIntact: e.target.checked,
                    })
                  }
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded-sm"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">
                    3. Electrical connectors & pully rotation verified
                  </span>
                  <span className="text-slate-500">
                    Plug pins align with vehicle harness
                  </span>
                </div>
              </label>
            </div>

            {/* Handover PIN verification */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Handover Verification PIN
              </span>
              <p className="text-xs text-slate-700">
                Share this PIN with Courier Lamin Touray to release the package in the dispatcher app:
              </p>
              <div className="pt-1 font-mono text-xl font-black text-emerald-600 tracking-wider">
                {handoverPIN}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowInspectionModal(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleConfirmInspection}
                disabled={
                  !inspectionChecks.partNumberMatch ||
                  !inspectionChecks.noTransitDamage ||
                  !inspectionChecks.connectorsIntact
                }
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Part Inspected & Accepted</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
