import { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  Power,
  TrendingUp,
  AlertCircle,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';
import { DeliveryRequestJob } from '../../types';

interface DeliveryDashboardPageProps {
  onNavigate: (view: string) => void;
  onSelectJob?: (job: DeliveryRequestJob) => void;
}

export function DeliveryDashboardPage({ onNavigate, onSelectJob }: DeliveryDashboardPageProps) {
  const store = useStore();
  const rider = marketplaceStore.getActiveRider();
  const isOnline = rider.isOnline;

  const [pinInputs, setPinInputs] = useState<Record<string, string>>({});
  const [pinErrors, setPinErrors] = useState<Record<string, string>>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const availableJobs = store.deliveryJobs.filter((j) => j.status === 'available');
  const activeJobs = store.deliveryJobs.filter(
    (j) => j.status === 'accepted' || j.status === 'picked_up' || j.status === 'in_transit'
  );
  const completedJobs = store.deliveryJobs.filter((j) => j.status === 'delivered');

  const primaryActiveJob = activeJobs[0];

  const handleToggleOnline = () => {
    marketplaceStore.toggleRiderOnlineStatus();
  };

  const handleAcceptJob = (jobId: string) => {
    const success = marketplaceStore.acceptDeliveryJob(jobId);
    if (success) {
      setSuccessToast('Delivery request accepted! Proceed to the dealer shop for pickup.');
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const handleAdvanceActiveJob = (job: DeliveryRequestJob) => {
    if (job.status === 'accepted') {
      marketplaceStore.updateDeliveryJobStatus(job.id, 'picked_up');
      setSuccessToast('Package confirmed picked up from dealer shop. En route to workshop.');
    } else if (job.status === 'picked_up') {
      marketplaceStore.updateDeliveryJobStatus(job.id, 'in_transit');
      setSuccessToast('In transit. Approaching mechanic workshop.');
    }
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleVerifyDeliveryPin = (job: DeliveryRequestJob) => {
    const pin = pinInputs[job.id] || '';
    const res = marketplaceStore.updateDeliveryJobStatus(job.id, 'delivered', pin);
    if (res.success) {
      setSuccessToast(`Delivery confirmed! D${job.payoutGMD} GMD credited to your wallet.`);
      setPinErrors((prev) => ({ ...prev, [job.id]: '' }));
      setPinInputs((prev) => ({ ...prev, [job.id]: '' }));
    } else {
      setPinErrors((prev) => ({ ...prev, [job.id]: res.message || 'Invalid PIN' }));
    }
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {successToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header Banner matching Dealer and Mechanic styles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Courier Dispatch Fleet
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {rider.plateNumber}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Welcome back, {rider.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operating Zone: <span className="font-semibold text-slate-700">{rider.primaryZone}</span> · Vehicle: <span className="font-semibold text-slate-700">{rider.vehicleType}</span>
          </p>
        </div>

        {/* Online Status Toggle Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleOnline}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 border ${
              isOnline
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Power className={`w-3.5 h-3.5 ${isOnline ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{isOnline ? 'Ready for Dispatch (Online)' : 'Go Online'}</span>
          </button>

          <button
            onClick={() => onNavigate('delivery_requests')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>View Requests ({availableJobs.length})</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards matching design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Today's Deliveries */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-medium">Deliveries Today</span>
          <div className="text-4xl font-extrabold text-slate-900 font-mono">
            {rider.todayDeliveries}
          </div>
          <p className="text-[11px] text-slate-400">
            {rider.completedDeliveries} all-time completed
          </p>
        </div>

        {/* Card 2: Active Deliveries */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-medium">Active Deliveries</span>
          <div className="text-4xl font-extrabold text-blue-600 font-mono">
            {activeJobs.length}
          </div>
          <p className="text-[11px] text-slate-400">
            {primaryActiveJob ? '1 in transit' : 'Ready for next dispatch'}
          </p>
        </div>

        {/* Card 3: Today's Earnings */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Today's Earnings</span>
            <button
              onClick={() => onNavigate('delivery_earnings')}
              className="text-[10px] text-blue-600 hover:underline font-bold"
            >
              Payouts
            </button>
          </div>
          <div className="text-4xl font-extrabold text-emerald-600 font-mono">
            D{rider.todayEarningsGMD}
          </div>
          <p className="text-[11px] text-slate-400">
            Total wallet: D{rider.totalEarningsGMD} GMD
          </p>
        </div>

        {/* Card 4: Rider Rating */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-medium">Rider Rating</span>
          <div className="text-4xl font-extrabold text-amber-500 font-mono flex items-center gap-1.5">
            <span>{rider.rating.toFixed(1)}</span>
            <span className="text-lg text-slate-400">★</span>
          </div>
          <p className="text-[11px] text-slate-400">
            98.5% on-time delivery rate
          </p>
        </div>
      </div>

      {/* Main Grid: Active Job Stepper & Available Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 cols): Active Job Card & Live Requests */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Job Card if any */}
          {primaryActiveJob ? (
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Active Delivery in Progress
                  </span>
                  <span className="text-xs text-blue-200 font-mono">
                    #{primaryActiveJob.id}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-blue-200 block">Est. Payout</span>
                  <span className="text-lg font-mono font-extrabold text-emerald-300">
                    D{primaryActiveJob.payoutGMD} GMD
                  </span>
                </div>
              </div>

              {/* Part Details */}
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-white">{primaryActiveJob.partName}</h3>
                  <p className="text-xs text-blue-200 font-mono mt-0.5">
                    Part No: {primaryActiveJob.partNumber || 'OEM Standard'} · Weight: {primaryActiveJob.weightCategory}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 self-start sm:self-auto">
                  {primaryActiveJob.urgency}
                </span>
              </div>

              {/* Waypoints Route */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Pickup Shop */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-blue-300 font-bold uppercase text-[10px]">
                    <MapPin className="w-3.5 h-3.5 text-amber-300" />
                    <span>Pickup Point</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{primaryActiveJob.pickupShop}</h4>
                  <p className="text-blue-100 text-[11px] leading-relaxed">
                    {primaryActiveJob.pickupAddress}
                  </p>
                  <a
                    href={`tel:${primaryActiveJob.pickupPhone}`}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white font-semibold pt-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Dealer: {primaryActiveJob.pickupPhone}</span>
                  </a>
                </div>

                {/* Dropoff Workshop */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold uppercase text-[10px]">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dropoff Workshop</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{primaryActiveJob.dropoffWorkshop}</h4>
                  <p className="text-blue-100 text-[11px] leading-relaxed">
                    {primaryActiveJob.dropoffAddress}
                  </p>
                  <a
                    href={`tel:${primaryActiveJob.dropoffPhone}`}
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white font-semibold pt-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Mechanic: {primaryActiveJob.dropoffPhone}</span>
                  </a>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="bg-black/20 p-4 rounded-2xl border border-white/10 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  Current Dispatch Stage
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                  <div className="p-2 rounded-xl bg-blue-600 text-white border border-blue-400">
                    1. Accepted
                  </div>
                  <div
                    className={`p-2 rounded-xl border ${
                      primaryActiveJob.status === 'picked_up' || primaryActiveJob.status === 'in_transit' || primaryActiveJob.status === 'delivered'
                        ? 'bg-blue-600 text-white border-blue-400'
                        : 'bg-white/10 text-blue-200 border-white/10'
                    }`}
                  >
                    2. Picked Up
                  </div>
                  <div
                    className={`p-2 rounded-xl border ${
                      primaryActiveJob.status === 'in_transit' || primaryActiveJob.status === 'delivered'
                        ? 'bg-blue-600 text-white border-blue-400'
                        : 'bg-white/10 text-blue-200 border-white/10'
                    }`}
                  >
                    3. In Transit
                  </div>
                  <div
                    className={`p-2 rounded-xl border ${
                      primaryActiveJob.status === 'delivered'
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-white/10 text-blue-200 border-white/10'
                    }`}
                  >
                    4. Handover PIN
                  </div>
                </div>

                {/* Action Row for the active job */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {primaryActiveJob.status === 'accepted' && (
                    <button
                      onClick={() => handleAdvanceActiveJob(primaryActiveJob)}
                      className="w-full py-3 bg-white text-blue-950 hover:bg-slate-100 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Package className="w-4 h-4" />
                      <span>Confirm Package Collected from Shop</span>
                    </button>
                  )}

                  {primaryActiveJob.status === 'picked_up' && (
                    <button
                      onClick={() => handleAdvanceActiveJob(primaryActiveJob)}
                      className="w-full py-3 bg-white text-blue-950 hover:bg-slate-100 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Start Transit to {primaryActiveJob.dropoffWorkshop}</span>
                    </button>
                  )}

                  {primaryActiveJob.status === 'in_transit' && (
                    <div className="w-full space-y-2">
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <div className="relative flex-1 w-full">
                          <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Enter 4-digit Handover PIN from mechanic"
                            value={pinInputs[primaryActiveJob.id] || ''}
                            onChange={(e) =>
                              setPinInputs((prev) => ({ ...prev, [primaryActiveJob.id]: e.target.value }))
                            }
                            className="w-full pl-9 pr-3 py-2.5 bg-white text-slate-900 text-xs font-mono font-bold rounded-xl border border-slate-200 placeholder:text-slate-400 focus:outline-hidden"
                          />
                        </div>
                        <button
                          onClick={() => handleVerifyDeliveryPin(primaryActiveJob)}
                          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Complete & Collect D{primaryActiveJob.payoutGMD}</span>
                        </button>
                      </div>
                      {pinErrors[primaryActiveJob.id] && (
                        <p className="text-xs text-rose-300 font-medium">
                          {pinErrors[primaryActiveJob.id]}
                        </p>
                      )}
                      <p className="text-[11px] text-blue-200">
                        Ask mechanic Kwame for their 4-digit code (Demo code: <span className="font-mono font-bold text-white">{primaryActiveJob.handoverPin}</span>)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No active job right now</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You are ready to accept new parts deliveries. Browse the available requests below to pick up your next job.
              </p>
            </div>
          )}

          {/* Available Delivery Requests Table matching Dealer/Mechanic view */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Available Delivery Requests</h2>
                <p className="text-xs text-slate-400">
                  Parts awaiting courier dispatch across Greater Banjul Area
                </p>
              </div>
              <button
                onClick={() => onNavigate('delivery_requests')}
                className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1"
              >
                <span>View All ({availableJobs.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {availableJobs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No new delivery requests right now. Check back soon.
              </div>
            ) : (
              <div className="space-y-3">
                {availableJobs.slice(0, 4).map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{job.partName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                          {job.weightCategory}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {job.urgency}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>
                            From: <strong className="text-slate-800">{job.pickupShop}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>
                            To: <strong className="text-slate-800">{job.dropoffWorkshop}</strong>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-0.5">
                        <span>Distance: {job.distanceKm} km</span>
                        <span>•</span>
                        <span>Est: ~{job.estimatedMinutes} mins</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">Payout</span>
                        <span className="text-lg font-mono font-black text-emerald-600">
                          D{job.payoutGMD}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAcceptJob(job.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Accept Job</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Rider Profile Snapshot & Recent Deliveries */}
        <div className="space-y-6">
          {/* Dispatch Info Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Courier Dispatch Pass</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Rider Name</span>
                <span className="font-bold text-slate-900">{rider.name}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Mobile Phone</span>
                <span className="font-bold text-slate-900 font-mono">{rider.phone}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Plate Number</span>
                <span className="font-bold font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  {rider.plateNumber}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Dispatch Vehicle</span>
                <span className="font-semibold text-slate-800">{rider.vehicleType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Verification</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Active
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('delivery_profile')}
              className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
            >
              Manage Vehicle & Zone Profile
            </button>
          </div>

          {/* Quick Wallet Card */}
          <div className="bg-emerald-50 rounded-3xl border border-emerald-200 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Rider Payout Wallet
              </span>
              <span className="text-[10px] bg-emerald-200/60 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                Wave / QMoney
              </span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-emerald-700">
              D{rider.totalEarningsGMD} GMD
            </div>
            <p className="text-[11px] text-emerald-800">
              Instant payout available to your registered mobile number anytime.
            </p>
            <button
              onClick={() => onNavigate('delivery_earnings')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Withdraw to Mobile Money
            </button>
          </div>

          {/* Recent Completed Jobs */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Recent Completed Trips</h3>
            {completedJobs.length === 0 ? (
              <p className="text-xs text-slate-400">No completed jobs yet today.</p>
            ) : (
              <div className="space-y-2.5">
                {completedJobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate max-w-[160px]">
                        {job.partName}
                      </span>
                      <span className="font-mono font-bold text-emerald-600">
                        +D{job.payoutGMD}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{job.dropoffWorkshop}</span>
                      <span>{job.deliveredAt || 'Delivered'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
