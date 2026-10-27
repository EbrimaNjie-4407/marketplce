import { useState } from 'react';
import {
  Truck,
  MapPin,
  Phone,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  KeyRound,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';
import { DeliveryRequestJob } from '../../types';

interface DeliveryActiveJobsPageProps {
  onNavigate: (view: string) => void;
}

export function DeliveryActiveJobsPage({ onNavigate }: DeliveryActiveJobsPageProps) {
  const store = useStore();
  const rider = marketplaceStore.getActiveRider();

  const [pinInputs, setPinInputs] = useState<Record<string, string>>({});
  const [pinErrors, setPinErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeJobs = store.deliveryJobs.filter(
    (j) => j.status === 'accepted' || j.status === 'picked_up' || j.status === 'in_transit'
  );

  const handleAdvanceStatus = (job: DeliveryRequestJob) => {
    if (job.status === 'accepted') {
      marketplaceStore.updateDeliveryJobStatus(job.id, 'picked_up');
      setToastMessage(`Package for ${job.partName} confirmed picked up. Now en route to ${job.dropoffWorkshop}.`);
    } else if (job.status === 'picked_up') {
      marketplaceStore.updateDeliveryJobStatus(job.id, 'in_transit');
      setToastMessage(`In transit! Heading toward ${job.dropoffWorkshop}.`);
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleVerifyDelivery = (job: DeliveryRequestJob) => {
    const pin = pinInputs[job.id] || '';
    const res = marketplaceStore.updateDeliveryJobStatus(job.id, 'delivered', pin);
    if (res.success) {
      setToastMessage(`🎉 Delivery completed! D${job.payoutGMD} GMD credited to your wallet.`);
      setPinErrors((prev) => ({ ...prev, [job.id]: '' }));
      setPinInputs((prev) => ({ ...prev, [job.id]: '' }));
    } else {
      setPinErrors((prev) => ({ ...prev, [job.id]: res.message || 'Incorrect PIN.' }));
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Active Dispatches
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time management for parts orders assigned to you
          </p>
        </div>

        <button
          onClick={() => onNavigate('delivery_requests')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Truck className="w-4 h-4" />
          <span>Browse Available Jobs</span>
        </button>
      </div>

      {activeJobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">All dispatches completed!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You do not have any active deliveries at the moment. Check the requests board to claim your next high-payout trip.
            </p>
          </div>
          <button
            onClick={() => onNavigate('delivery_requests')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>View Available Delivery Requests</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {activeJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-7 space-y-6"
            >
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Dispatched Order #{job.orderId}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">({job.id})</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">{job.partName}</h2>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Payout upon Handover</span>
                  <span className="text-2xl font-mono font-black text-emerald-600">
                    D{job.payoutGMD} GMD
                  </span>
                </div>
              </div>

              {/* Waypoints Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 1. Pickup */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      1. Pickup Dealer Shop
                    </span>
                    {job.status !== 'accepted' && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        ✓ Collected
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{job.pickupShop}</h4>
                  <p className="text-slate-600">{job.pickupAddress}</p>
                  <div className="pt-1 flex items-center gap-3">
                    <a
                      href={`tel:${job.pickupPhone}`}
                      className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call: {job.pickupPhone}</span>
                    </a>
                  </div>
                </div>

                {/* 2. Dropoff */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      2. Destination Workshop
                    </span>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      Handover PIN Protected
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{job.dropoffWorkshop}</h4>
                  <p className="text-slate-600">{job.dropoffAddress}</p>
                  <div className="pt-1 flex items-center gap-3">
                    <a
                      href={`tel:${job.dropoffPhone}`}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call: {job.dropoffPhone}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Progress Stepper & Actions */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Delivery Workflow
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    className={`p-3 rounded-xl border text-xs text-center font-bold ${
                      job.status === 'accepted'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    1. Collect from Shop
                  </div>

                  <div
                    className={`p-3 rounded-xl border text-xs text-center font-bold ${
                      job.status === 'picked_up' || job.status === 'in_transit'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : job.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-white text-slate-400 border-slate-200'
                    }`}
                  >
                    2. En Route
                  </div>

                  <div
                    className={`p-3 rounded-xl border text-xs text-center font-bold ${
                      job.status === 'delivered'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-400 border-slate-200'
                    }`}
                  >
                    3. Handover PIN & Payout
                  </div>
                </div>

                {/* Status action buttons */}
                {job.status === 'accepted' && (
                  <button
                    onClick={() => handleAdvanceStatus(job)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    <span>Confirm I Have Collected the Package from {job.pickupShop}</span>
                  </button>
                )}

                {job.status === 'picked_up' && (
                  <button
                    onClick={() => handleAdvanceStatus(job)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Start Live Transit to {job.dropoffWorkshop}</span>
                  </button>
                )}

                {job.status === 'in_transit' && (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>
                        Enter the 4-digit Handover PIN given to you by the mechanic upon receiving the part. (Demo PIN: <strong>{job.handoverPin}</strong>)
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <div className="relative flex-1 w-full">
                        <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Enter Handover PIN (e.g. 4819)"
                          value={pinInputs[job.id] || ''}
                          onChange={(e) =>
                            setPinInputs((prev) => ({ ...prev, [job.id]: e.target.value }))
                          }
                          className="w-full pl-9 pr-3 py-2.5 bg-white text-slate-900 text-sm font-mono font-bold rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600"
                        />
                      </div>
                      <button
                        onClick={() => handleVerifyDelivery(job)}
                        className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Handover & Claim D{job.payoutGMD}</span>
                      </button>
                    </div>

                    {pinErrors[job.id] && (
                      <p className="text-xs text-rose-600 font-medium">
                        {pinErrors[job.id]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
