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
  Star,
  Radio,
  Send,
  UserCheck,
  RefreshCw,
  Search,
  AlertCircle,
  Zap,
  Filter,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';
import { Order, OrderStatus, DeliveryRiderProfile } from '../../types';
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

  // Delivery Rider Selection & Availability Filter state
  const [riderFilter, setRiderFilter] = useState<
    'all' | 'available' | 'busy' | 'offline' | 'jeshwang' | 'kanifing' | 'motorcycle'
  >('all');
  const [riderSearchQuery, setRiderSearchQuery] = useState<string>('');

  // Real-time system availability detection engine for every Gambian courier
  const getRiderSystemStatus = (rider: DeliveryRiderProfile) => {
    const isAssignedToThisOrder =
      selectedOrder?.assignedRiderId === rider.id ||
      selectedOrder?.courierName === rider.name;

    const activeJob = store.deliveryJobs.find(
      (j) => j.assignedRiderId === rider.id && (j.status === 'in_transit' || j.status === 'accepted')
    );

    if (isAssignedToThisOrder) {
      return {
        type: 'assigned_this_order' as const,
        isAvailable: false,
        badgeText: 'Assigned to This Order',
        badgeClass: 'bg-blue-600 text-white shadow-xs',
        dotClass: 'bg-emerald-400 animate-pulse',
        statusText: `Dispatched & in transit from ${selectedOrder.dealerName} to workshop bay`,
        activeJob,
        pickupEta: '~2-4 min arrival',
      };
    }

    if (!rider.isOnline) {
      return {
        type: 'offline' as const,
        isAvailable: false,
        badgeText: 'Offline · Off Duty',
        badgeClass: 'bg-slate-100 text-slate-500 border border-slate-200',
        dotClass: 'bg-slate-400',
        statusText: 'Rider is logged off and not accepting dispatches right now',
        activeJob: undefined,
        pickupEta: 'Off shift',
      };
    }

    if (activeJob) {
      return {
        type: 'busy' as const,
        isAvailable: false,
        badgeText: 'Busy · On Active Run',
        badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300',
        dotClass: 'bg-amber-500 animate-ping',
        statusText: `Delivering ${activeJob.partName.slice(0, 26)}... (Job #${activeJob.id}) to ${activeJob.dropoffWorkshop}`,
        activeJob,
        pickupEta: `Est. free in ~${activeJob.estimatedMinutes || 15} mins`,
      };
    }

    return {
      type: 'available' as const,
      isAvailable: true,
      badgeText: 'Available & Ready for Pickup',
      badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold shadow-2xs',
      dotClass: 'bg-emerald-500 animate-ping',
      statusText: `Idle at ${rider.primaryZone} · Verified ready for instant dispatch`,
      activeJob: undefined,
      pickupEta: rider.vehicleType === 'Motorcycle' ? '~3-6 mins' : '~6-10 mins',
    };
  };

  // Fleet System Telemetry Summary
  const fleetSummary = {
    total: store.deliveryRiders.length,
    available: store.deliveryRiders.filter((r) => getRiderSystemStatus(r).type === 'available').length,
    assigned: store.deliveryRiders.filter((r) => getRiderSystemStatus(r).type === 'assigned_this_order').length,
    busy: store.deliveryRiders.filter((r) => getRiderSystemStatus(r).type === 'busy').length,
    offline: store.deliveryRiders.filter((r) => getRiderSystemStatus(r).type === 'offline').length,
  };

  // Filtered and Sorted Rider list
  const filteredRiders = store.deliveryRiders
    .filter((r) => {
      const statusInfo = getRiderSystemStatus(r);

      // Search query filter
      if (riderSearchQuery.trim()) {
        const q = riderSearchQuery.toLowerCase();
        const matchName = r.name.toLowerCase().includes(q);
        const matchZone = r.primaryZone.toLowerCase().includes(q);
        const matchVeh =
          r.vehicleType.toLowerCase().includes(q) || r.plateNumber.toLowerCase().includes(q);
        if (!matchName && !matchZone && !matchVeh) return false;
      }

      // Filter tabs
      if (riderFilter === 'available') {
        return statusInfo.type === 'available';
      }
      if (riderFilter === 'busy') {
        return statusInfo.type === 'busy' || statusInfo.type === 'assigned_this_order';
      }
      if (riderFilter === 'offline') {
        return statusInfo.type === 'offline';
      }
      if (riderFilter === 'jeshwang') {
        return (
          r.primaryZone.toLowerCase().includes('jeshwang') ||
          r.primaryZone.toLowerCase().includes('sukuta') ||
          r.primaryZone.toLowerCase().includes('westfield')
        );
      }
      if (riderFilter === 'kanifing') {
        return (
          r.primaryZone.toLowerCase().includes('kanifing') ||
          r.primaryZone.toLowerCase().includes('banjul') ||
          r.primaryZone.toLowerCase().includes('bakau')
        );
      }
      if (riderFilter === 'motorcycle') {
        return (
          r.vehicleType.toLowerCase().includes('motorcycle') ||
          r.vehicleType.toLowerCase().includes('scooter')
        );
      }
      return true;
    })
    .sort((a, b) => {
      const orderMap: Record<string, number> = {
        assigned_this_order: 0,
        available: 1,
        busy: 2,
        offline: 3,
      };
      const statusA = getRiderSystemStatus(a).type;
      const statusB = getRiderSystemStatus(b).type;
      return (orderMap[statusA] ?? 99) - (orderMap[statusB] ?? 99);
    });

  // Currently assigned rider for this order
  const assignedRider =
    store.deliveryRiders.find((r) => r.id === selectedOrder?.assignedRiderId) ||
    store.deliveryRiders.find((r) => r.name === selectedOrder?.courierName) ||
    store.deliveryRiders[0];

  const handleSelectAndDispatchRider = (rider: DeliveryRiderProfile) => {
    if (!selectedOrder) return;
    const res = marketplaceStore.assignRiderToOrder(selectedOrder.id, rider.id);
    setSelectedOrder({ ...res.order });
    setProgressPercent(20);
    setIsPlaying(true);
    setCourierSpeed(38);
    showToast(
      `🚀 ${rider.name} selected & notified! They are en route to collect ${selectedOrder.partName} from ${selectedOrder.dealerName}.`
    );
  };

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

  const handleConfirmBuyerInspection = () => {
    if (!selectedOrder) return;
    const res = marketplaceStore.confirmBuyerInspection(selectedOrder.id, inspectionChecks);
    const updated = store.orders.find((o) => o.id === selectedOrder.id);
    if (updated) setSelectedOrder({ ...updated });
    setShowInspectionModal(false);

    if (res.bothConfirmed) {
      setProgressPercent(100);
      setIsPlaying(false);
      setCourierSpeed(0);
      showToast(
        `🎉 Dual Confirmation Verified! Escrow released: D${(selectedOrder.dealerPayoutGMD || selectedOrder.priceGMD).toLocaleString()} GMD sent to ${selectedOrder.dealerName} and D${selectedOrder.riderPayoutGMD || selectedOrder.deliveryFeeGMD || 120} GMD sent to courier.`
      );
    } else {
      showToast(
        `✓ You confirmed the product matches & is in good condition! Escrow will release once Courier ${selectedOrder.courierName || 'Rider'} confirms handover.`
      );
    }
  };

  const handleSimulateCourierConfirmation = () => {
    if (!selectedOrder) return;
    const res = marketplaceStore.simulateCourierConditionConfirmation(selectedOrder.id);
    const updated = store.orders.find((o) => o.id === selectedOrder.id);
    if (updated) setSelectedOrder({ ...updated });

    if (res.bothConfirmed) {
      setProgressPercent(100);
      setIsPlaying(false);
      setCourierSpeed(0);
      showToast(
        `🎉 Dual Confirmation Verified! Escrow released: D${(selectedOrder.dealerPayoutGMD || selectedOrder.priceGMD).toLocaleString()} GMD sent to ${selectedOrder.dealerName} and D${selectedOrder.riderPayoutGMD || selectedOrder.deliveryFeeGMD || 120} GMD sent to courier.`
      );
    } else {
      showToast(
        `✓ Courier confirmed package handover & verified condition! Customer condition sign-off will release escrow payout.`
      );
    }
  };

  const isDelivered = Boolean(
    selectedOrder?.escrowStatus === 'released' ||
    selectedOrder?.status === 'delivered' ||
    (progressPercent >= 100 && selectedOrder?.buyerConfirmedCondition && selectedOrder?.riderConfirmedCondition)
  );

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
          courierName={selectedOrder?.courierName || assignedRider?.name || 'Modou Lamin Ceesay'}
          courierVehicle={
            selectedOrder?.courierVehicle ||
            `${assignedRider?.vehicleType || 'Motorcycle'} (${assignedRider?.plateNumber || 'BJL-4821-B'})`
          }
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
                <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Assigned Auto Courier</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                  {assignedRider ? assignedRider.rating.toFixed(1) : '4.9'} ({assignedRider ? assignedRider.completedDeliveries : 38} trips)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold flex items-center justify-center text-base shadow-sm shrink-0">
                  {assignedRider ? assignedRider.name.split(' ').map((n) => n[0]).slice(0, 2).join('') : 'MC'}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {assignedRider ? assignedRider.name : 'Modou Lamin Ceesay'}
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Dispatched
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 flex items-center gap-1 truncate">
                    <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{assignedRider ? assignedRider.vehicleType : 'Motorcycle'} · Reg: {assignedRider ? assignedRider.plateNumber : 'BJL-4821-B'}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span>{assignedRider ? assignedRider.primaryZone : 'Jeshwang & Westfield'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-blue-200/50">
                <a
                  href={`tel:${assignedRider ? assignedRider.phone : '+2207334921'}`}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {assignedRider ? assignedRider.name.split(' ')[0] : 'Courier'}</span>
                </a>
                <button
                  onClick={() => showToast(`Messaging channel open with courier ${assignedRider ? assignedRider.name : 'Modou'}`)}
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

            {/* Escrow Trust Vault Protection Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-3 border border-indigo-500/30 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Escrow Trust Vault</span>
                </span>
                <span className="text-[11px] font-mono font-extrabold text-white">
                  D{(selectedOrder.escrowAmountGMD || (selectedOrder.priceGMD + (selectedOrder.deliveryFeeGMD || 120))).toLocaleString()} GMD
                </span>
              </div>

              {/* Dual Confirmation Status Pills */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/70">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>1. Buyer Condition Check:</span>
                  </span>
                  {selectedOrder.buyerConfirmedCondition ? (
                    <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Confirmed
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-300 font-semibold">
                      ⏳ Pending Inspection
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/70">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>2. Rider Handover Check:</span>
                  </span>
                  {selectedOrder.riderConfirmedCondition ? (
                    <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Confirmed
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-300 font-semibold">
                      ⏳ Pending Handover
                    </span>
                  )}
                </div>
              </div>

              {/* Payout Distribution details */}
              <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Dealer ({selectedOrder.dealerName.slice(0, 16)}):</span>
                  <span className="font-mono font-bold text-white">
                    D{(selectedOrder.dealerPayoutGMD || selectedOrder.priceGMD).toLocaleString()} GMD ·{' '}
                    <span className={selectedOrder.dealerPayoutStatus === 'paid_out' ? 'text-emerald-400 font-extrabold' : 'text-amber-400'}>
                      {selectedOrder.dealerPayoutStatus === 'paid_out' ? '✓ Transferred' : '🔒 Withheld in Escrow'}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Courier ({selectedOrder.courierName ? selectedOrder.courierName.split(' ')[0] : 'Rider'}):</span>
                  <span className="font-mono font-bold text-white">
                    D{(selectedOrder.riderPayoutGMD || selectedOrder.deliveryFeeGMD || 120).toLocaleString()} GMD ·{' '}
                    <span className={selectedOrder.riderPayoutStatus === 'paid_out' ? 'text-emerald-400 font-extrabold' : 'text-amber-400'}>
                      {selectedOrder.riderPayoutStatus === 'paid_out' ? '✓ Transferred' : '🔒 Withheld in Escrow'}
                    </span>
                  </span>
                </div>
              </div>

              {selectedOrder.escrowStatus === 'released' && (
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Escrow Cleared: Payouts processed to dealer & courier instantly.</span>
                </div>
              )}
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

        {/* Right Column (7 cols): Available Delivery Riders & Dispatch + Progression Milestones Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Available Delivery Riders & Dispatch Fleet Console */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-7 space-y-5">
            {/* Console Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                    AutoSpares Express Dispatch Fleet
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Live System Availability
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  Choose a Delivery Rider for This Order
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a verified courier from the list. The system actively detects which riders are{' '}
                  <span className="font-bold text-emerald-700">Available</span>,{' '}
                  <span className="font-bold text-amber-700">Busy on another run</span>, or{' '}
                  <span className="font-bold text-slate-600">Offline</span>. Once dispatched, the rider will be immediately notified to begin the pickup journey.
                </p>
              </div>

              {/* Quick Summary Pill */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-2 shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{fleetSummary.available} Available Now</span>
                </span>
              </div>
            </div>

            {/* Pickup & Destination Context Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Store className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-slate-500 shrink-0 font-medium">Pickup:</span>
                <span className="font-bold text-slate-800 truncate">{selectedOrder.dealerName} ({selectedOrder.dealerLocation})</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden sm:block shrink-0" />
              <div className="flex items-center gap-2 min-w-0">
                <Wrench className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-500 shrink-0 font-medium">Deliver:</span>
                <span className="font-bold text-slate-800 truncate">
                  {associatedRequest?.workshopName || 'Mensah Auto Works'} ({selectedOrder.deliveryAddress || 'Westfield'})
                </span>
              </div>
            </div>

            {/* System Availability Status Strip (Metrics) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => setRiderFilter('available')}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  riderFilter === 'available'
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                    Available
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-lg font-black text-emerald-950 mt-0.5">
                  {fleetSummary.available} <span className="text-xs font-semibold text-emerald-700">Ready</span>
                </div>
                <p className="text-[10px] text-slate-500">Idle & ready to dispatch</p>
              </button>

              <button
                onClick={() => setRiderFilter('all')}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  assignedRider
                    ? 'border-blue-300 bg-blue-50/40'
                    : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                    Assigned
                  </span>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <div className="text-lg font-black text-blue-950 mt-0.5">
                  {fleetSummary.assigned} <span className="text-xs font-semibold text-blue-700">Active</span>
                </div>
                <p className="text-[10px] text-slate-500">On this specific order</p>
              </button>

              <button
                onClick={() => setRiderFilter('busy')}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  riderFilter === 'busy'
                    ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                    Busy
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <div className="text-lg font-black text-amber-950 mt-0.5">
                  {fleetSummary.busy} <span className="text-xs font-semibold text-amber-700">On Trip</span>
                </div>
                <p className="text-[10px] text-slate-500">Active delivery runs</p>
              </button>

              <button
                onClick={() => setRiderFilter('offline')}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  riderFilter === 'offline'
                    ? 'border-slate-400 bg-slate-100 ring-2 ring-slate-400/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Offline
                  </span>
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                </div>
                <div className="text-lg font-black text-slate-700 mt-0.5">
                  {fleetSummary.offline} <span className="text-xs font-semibold text-slate-500">Off Shift</span>
                </div>
                <p className="text-[10px] text-slate-500">Not taking requests</p>
              </button>
            </div>

            {/* Search and Filters Bar */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={riderSearchQuery}
                    onChange={(e) => setRiderSearchQuery(e.target.value)}
                    placeholder="Search couriers by name, location zone, or registration..."
                    className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
                  />
                  {riderSearchQuery && (
                    <button
                      onClick={() => setRiderSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter reset button if filtered */}
                {(riderFilter !== 'all' || riderSearchQuery) && (
                  <button
                    onClick={() => {
                      setRiderFilter('all');
                      setRiderSearchQuery('');
                    }}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Filter Fleet:
                </span>
                {[
                  { id: 'all', label: `All Fleet (${fleetSummary.total})` },
                  { id: 'available', label: `🟢 Available (${fleetSummary.available})` },
                  { id: 'busy', label: `🟡 Busy (${fleetSummary.busy})` },
                  { id: 'offline', label: `⚪ Offline (${fleetSummary.offline})` },
                  { id: 'jeshwang', label: '📍 Jeshwang & Westfield' },
                  { id: 'kanifing', label: '📍 Kanifing & Banjul' },
                  { id: 'motorcycle', label: '🏍️ Motorcycles' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setRiderFilter(f.id as typeof riderFilter)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      riderFilter === f.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Riders List with System Knowledge */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {filteredRiders.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">No delivery riders found</p>
                  <p className="text-xs text-slate-500">
                    No riders match the current filter or search criteria.
                  </p>
                  <button
                    onClick={() => {
                      setRiderFilter('all');
                      setRiderSearchQuery('');
                    }}
                    className="mt-2 px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    Show All Fleet
                  </button>
                </div>
              ) : (
                filteredRiders.map((rider) => {
                  const statusInfo = getRiderSystemStatus(rider);
                  const isSelected = statusInfo.type === 'assigned_this_order';

                  return (
                    <div
                      key={rider.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/70 shadow-md ring-2 ring-blue-500/20'
                          : statusInfo.type === 'available'
                          ? 'border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/20 shadow-xs'
                          : statusInfo.type === 'busy'
                          ? 'border-amber-200/80 bg-amber-50/30 hover:bg-amber-50/50'
                          : 'border-slate-200 bg-slate-50/50 opacity-80'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Rider Information */}
                        <div className="flex items-start gap-3.5 min-w-0">
                          {/* Avatar with live status dot */}
                          <div className="relative shrink-0">
                            <div
                              className={`w-12 h-12 rounded-2xl text-white font-extrabold flex items-center justify-center text-sm shadow-xs ${
                                isSelected
                                  ? 'bg-gradient-to-br from-blue-600 to-indigo-700'
                                  : statusInfo.type === 'available'
                                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700'
                                  : statusInfo.type === 'busy'
                                  ? 'bg-gradient-to-br from-amber-600 to-orange-700'
                                  : 'bg-slate-400'
                              }`}
                            >
                              {rider.name
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')}
                            </div>
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                statusInfo.type === 'available' || isSelected
                                  ? 'bg-emerald-500'
                                  : statusInfo.type === 'busy'
                                  ? 'bg-amber-500'
                                  : 'bg-slate-400'
                              }`}
                            />
                          </div>

                          <div className="space-y-1 min-w-0">
                            {/* Name, Verified Badge & Real-Time Availability Pill */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {rider.name}
                              </h4>
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                                <ShieldCheck className="w-3 h-3 text-blue-600" />
                                Verified
                              </span>

                              {/* Live Availability Badge */}
                              <span
                                className={`text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0 ${statusInfo.badgeClass}`}
                              >
                                <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
                                <span>{statusInfo.badgeText}</span>
                              </span>
                            </div>

                            {/* Ratings, Vehicle, Plate number */}
                            <div className="flex items-center gap-2.5 text-xs text-slate-600 flex-wrap">
                              <span className="flex items-center gap-1 font-semibold text-amber-600">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                {rider.rating.toFixed(1)} ({rider.completedDeliveries} completed trips)
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="flex items-center gap-1 font-medium">
                                <Truck className="w-3.5 h-3.5 text-blue-600" />
                                {rider.vehicleType} · <span className="font-mono text-slate-700 font-bold">{rider.plateNumber}</span>
                              </span>
                            </div>

                            {/* Zone and System ETA / Status Description */}
                            <div className="space-y-0.5 pt-0.5">
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                                <span className="flex items-center gap-1 text-slate-600 font-medium">
                                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                                  {rider.primaryZone}
                                </span>
                                <span className="text-slate-300">·</span>
                                <span
                                  className={`font-semibold ${
                                    statusInfo.type === 'available'
                                      ? 'text-emerald-700'
                                      : statusInfo.type === 'busy'
                                      ? 'text-amber-700'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {statusInfo.pickupEta}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-500 italic">
                                {statusInfo.statusText}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Pricing and Dispatch / Assignment Button */}
                        <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2.5 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                          <div className="text-left sm:text-right">
                            <span className="text-xs font-mono font-extrabold text-slate-900 block">
                              D{selectedOrder.deliveryFeeGMD || 120} GMD
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">
                              Express Dispatch
                            </span>
                          </div>

                          {isSelected ? (
                            <div className="flex items-center gap-1.5">
                              <span className="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs">
                                <Check className="w-3.5 h-3.5" />
                                <span>Dispatched</span>
                              </span>
                              <a
                                href={`tel:${rider.phone}`}
                                className="p-2 bg-white hover:bg-slate-100 text-blue-600 border border-blue-200 rounded-xl transition-colors shadow-2xs"
                                title="Call Courier"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          ) : statusInfo.type === 'available' ? (
                            <button
                              onClick={() => handleSelectAndDispatchRider(rider)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 hover:gap-2 group cursor-pointer"
                              title="Assign this available courier to pick up and deliver the part"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-300" />
                              <span>Select & Dispatch</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          ) : statusInfo.type === 'busy' ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  handleSelectAndDispatchRider(rider);
                                  showToast(`⚠️ Reassigned ${rider.name} to urgent order ${selectedOrder.id}`);
                                }}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-1"
                                title="Rider is currently busy. Click to reassign as priority dispatch."
                              >
                                <span>Busy · Reassign</span>
                              </button>
                              <a
                                href={`tel:${rider.phone}`}
                                className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl"
                                title="Call Busy Courier"
                              >
                                <Phone className="w-3 h-3" />
                              </a>
                            </div>
                          ) : (
                            <button
                              disabled
                              className="px-3.5 py-1.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-semibold cursor-not-allowed border border-slate-200"
                            >
                              <span>Offline</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Active Dispatch Live Status Banner */}
            {assignedRider && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Navigation className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-slate-900">
                        Dispatched Courier: <span className="text-blue-700">{assignedRider.name}</span>
                      </p>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        En Route
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {progressPercent >= 100
                        ? 'Package arrived at workshop bay. Ready for handover inspection.'
                        : progressPercent >= 20
                        ? `Live courier journey in transit along Banjul-Serrekunda Highway · Speed: ${courierSpeed} km/h`
                        : `Courier notified. Arriving at ${selectedOrder.dealerName} counter for pickup.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <a
                    href={`tel:${assignedRider.phone}`}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Phone className="w-3 h-3 text-blue-600" />
                    <span>Call Courier</span>
                  </a>
                  <button
                    onClick={() => {
                      setIsPlaying(true);
                      if (progressPercent < 25) setProgressPercent(25);
                      showToast(`Live telemetry active with ${assignedRider.name}`);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Play className="w-3 h-3" />
                    <span>Live Tracking</span>
                  </button>
                </div>
              </div>
            )}
          </div>

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

            {/* Handover Completion & Dual-Confirmation Escrow Settlement Panel */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              {isDelivered || selectedOrder.escrowStatus === 'released' ? (
                <div className="p-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 rounded-3xl border border-emerald-200 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-emerald-900 font-extrabold text-sm sm:text-base">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <div>
                        <span>Dual Confirmation Complete — Escrow Payouts Disbursed!</span>
                        <p className="text-xs font-normal text-emerald-700">
                          Both customer and delivery courier confirmed the product matches and is in good condition.
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-full shadow-2xs self-start sm:self-auto">
                      Settled & Complete
                    </span>
                  </div>

                  {/* Dual verification proof cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3 bg-white/90 rounded-2xl border border-emerald-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Customer Sign-off</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          ✓ Verified
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        Condition tested, connectors intact, OEM confirmed matching vehicle.
                      </p>
                    </div>

                    <div className="p-3 bg-white/90 rounded-2xl border border-emerald-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Courier Sign-off</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          ✓ Verified
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        Package delivered intact without transit damage; handover PIN validated.
                      </p>
                    </div>
                  </div>

                  {/* Real-time automated transaction distribution */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                        Instant Automatic Payment Distribution
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">AutoSpares Trust Settlement</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-0.5">
                      <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                        <span className="text-[10px] text-slate-400 block">Sent to Dealer ({selectedOrder.dealerName})</span>
                        <span className="font-mono font-black text-emerald-400 text-sm">
                          D{(selectedOrder.dealerPayoutGMD || selectedOrder.priceGMD).toLocaleString()} GMD
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono">Ref: {selectedOrder.dealerPayoutRef || 'ESC-DLR-882910'}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                        <span className="text-[10px] text-slate-400 block">Sent to Courier ({selectedOrder.courierName || 'Courier'})</span>
                        <span className="font-mono font-black text-emerald-400 text-sm">
                          D{(selectedOrder.riderPayoutGMD || selectedOrder.deliveryFeeGMD || 120).toLocaleString()} GMD
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono">Ref: {selectedOrder.riderPayoutRef || 'ESC-RDR-301920'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setShowInspectionModal(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      View Inspection Certificate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200/90 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <h4 className="text-sm font-extrabold text-slate-900">
                          Secure Escrow Dual-Confirmation Verification
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 max-w-xl">
                        To guarantee trust, the payment of{' '}
                        <strong className="text-slate-800">
                          D{(selectedOrder.escrowAmountGMD || (selectedOrder.priceGMD + (selectedOrder.deliveryFeeGMD || 120))).toLocaleString()} GMD
                        </strong>{' '}
                        is securely withheld in escrow. The system will process and immediately disburse the payouts to the dealer (D{(selectedOrder.dealerPayoutGMD || selectedOrder.priceGMD).toLocaleString()}) and courier (D{selectedOrder.riderPayoutGMD || selectedOrder.deliveryFeeGMD || 120}) once <strong>both you and the delivery rider</strong> confirm the part is identical and in good condition.
                      </p>
                    </div>

                    <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-xs font-bold shrink-0 self-start sm:self-auto">
                      🔒 Held in Escrow
                    </span>
                  </div>

                  {/* Dual Action Confirmation Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Buyer Confirmation Box */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>1. Customer Quality Check</span>
                        </span>
                        {selectedOrder.buyerConfirmedCondition ? (
                          <span className="font-extrabold text-emerald-600 flex items-center gap-1 text-[11px]">
                            <Check className="w-3 h-3 stroke-[3]" /> Confirmed
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-600 font-semibold">
                            Pending inspection
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        Verify OEM part number, check for transit damage, and confirm physical fit with your vehicle.
                      </p>
                      {selectedOrder.buyerConfirmedCondition ? (
                        <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl font-semibold text-[11px] flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>You have verified this part is in good condition!</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowInspectionModal(true)}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Inspect & Confirm Part Condition</span>
                        </button>
                      )}
                    </div>

                    {/* Delivery Rider Handover Box */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-indigo-600" />
                          <span>2. Courier Handover Check</span>
                        </span>
                        {selectedOrder.riderConfirmedCondition ? (
                          <span className="font-extrabold text-emerald-600 flex items-center gap-1 text-[11px]">
                            <Check className="w-3 h-3 stroke-[3]" /> Confirmed
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-600 font-semibold">
                            Pending handover
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        Courier confirms physical package handover intact at workshop using Handover PIN <strong>{handoverPIN}</strong>.
                      </p>
                      {selectedOrder.riderConfirmedCondition ? (
                        <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl font-semibold text-[11px] flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Courier has confirmed physical delivery!</span>
                        </div>
                      ) : (
                        <button
                          onClick={handleSimulateCourierConfirmation}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          title="Simulate courier entering PIN and verifying handover condition"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Simulate Courier Handover Sign-off</span>
                        </button>
                      )}
                    </div>
                  </div>
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
                onClick={handleConfirmBuyerInspection}
                disabled={
                  !inspectionChecks.partNumberMatch ||
                  !inspectionChecks.noTransitDamage ||
                  !inspectionChecks.connectorsIntact
                }
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>
                  {selectedOrder.riderConfirmedCondition
                    ? 'Confirm Condition & Release Escrow Payouts!'
                    : 'Confirm Condition (Awaiting Courier Handover)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
