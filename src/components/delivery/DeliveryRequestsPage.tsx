import { useState } from 'react';
import {
  Truck,
  MapPin,
  Phone,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  Search,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';
import { DeliveryRequestJob } from '../../types';

interface DeliveryRequestsPageProps {
  onNavigate: (view: string) => void;
}

export function DeliveryRequestsPage({ onNavigate }: DeliveryRequestsPageProps) {
  const store = useStore();
  const rider = marketplaceStore.getActiveRider();

  const [activeTab, setActiveTab] = useState<'all' | 'jeshwang' | 'westfield' | 'high_payout' | 'urgent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobForModal, setSelectedJobForModal] = useState<DeliveryRequestJob | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const jobs = store.deliveryJobs;

  const filteredJobs = jobs.filter((job) => {
    // Filter tab
    if (activeTab === 'jeshwang' && !job.pickupShop.toLowerCase().includes('jeshwang') && !job.pickupAddress.toLowerCase().includes('jeshwang')) {
      return false;
    }
    if (activeTab === 'westfield' && !job.dropoffAddress.toLowerCase().includes('westfield') && !job.dropoffWorkshop.toLowerCase().includes('westfield') && !job.pickupAddress.toLowerCase().includes('kanifing')) {
      return false;
    }
    if (activeTab === 'high_payout' && job.payoutGMD < 130) {
      return false;
    }
    if (activeTab === 'urgent' && job.urgency === 'Standard') {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        job.partName.toLowerCase().includes(q) ||
        job.pickupShop.toLowerCase().includes(q) ||
        job.dropoffWorkshop.toLowerCase().includes(q) ||
        job.pickupAddress.toLowerCase().includes(q) ||
        job.dropoffAddress.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const availableJobs = filteredJobs.filter((j) => j.status === 'available');
  const myAcceptedJobs = filteredJobs.filter(
    (j) => (j.status === 'accepted' || j.status === 'picked_up' || j.status === 'in_transit') && j.assignedRiderId === rider.id
  );

  const handleAcceptJob = (job: DeliveryRequestJob) => {
    const success = marketplaceStore.acceptDeliveryJob(job.id);
    if (success) {
      setToastMessage(`Job #${job.id} accepted! Ready to collect ${job.partName}.`);
      setSelectedJobForModal(null);
      setTimeout(() => setToastMessage(null), 4000);
    }
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
            Delivery Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse available spare-part dispatch jobs across Jeshwang Hub, Westfield, Kanifing & Banjul
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('delivery_active')}
            className="px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>My Active Dispatches ({myAcceptedJobs.length})</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search parts, dealers, workshops or Gambian location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-600 focus:bg-white"
            />
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 shrink-0 text-xs text-slate-500 font-medium px-2">
            <span>Available for dispatch:</span>
            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg">
              {availableJobs.length} jobs
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Requests ({jobs.filter((j) => j.status === 'available').length})
          </button>
          <button
            onClick={() => setActiveTab('jeshwang')}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'jeshwang'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Jeshwang Hub & Serekunda
          </button>
          <button
            onClick={() => setActiveTab('westfield')}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'westfield'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Westfield & Kanifing
          </button>
          <button
            onClick={() => setActiveTab('high_payout')}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'high_payout'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            High Payout (&gt;D130 GMD)
          </button>
          <button
            onClick={() => setActiveTab('urgent')}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'urgent'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Express / Urgent
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {availableJobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No requests matching filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try switching your filter or clearing the search query to see all active dispatch jobs across The Gambia.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSearchQuery('');
              }}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          availableJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-extrabold text-base text-slate-900">{job.partName}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    {job.weightCategory}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      job.urgency === 'Urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : job.urgency === 'Express 45-min'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {job.urgency}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Rider Payout</span>
                    <span className="text-xl font-mono font-black text-emerald-600">
                      D{job.payoutGMD} GMD
                    </span>
                  </div>
                </div>
              </div>

              {/* Route Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Pickup */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-700 font-bold uppercase text-[10px]">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pickup Dealer Shop</span>
                  </div>
                  <h4 className="font-bold text-slate-900">{job.pickupShop}</h4>
                  <p className="text-slate-600 leading-relaxed">{job.pickupAddress}</p>
                  <p className="text-slate-500 font-mono text-[11px] pt-1">
                    Phone: {job.pickupPhone}
                  </p>
                </div>

                {/* Dropoff */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold uppercase text-[10px]">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dropoff Workshop</span>
                  </div>
                  <h4 className="font-bold text-slate-900">{job.dropoffWorkshop}</h4>
                  <p className="text-slate-600 leading-relaxed">{job.dropoffAddress}</p>
                  <p className="text-slate-500 font-mono text-[11px] pt-1">
                    Phone: {job.dropoffPhone}
                  </p>
                </div>
              </div>

              {/* Courier notes */}
              {job.notes && (
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900">
                  <span className="font-bold">Courier Note: </span>
                  <span>{job.notes}</span>
                </div>
              )}

              {/* Bottom Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Est. {job.estimatedMinutes} mins
                  </span>
                  <span>•</span>
                  <span>Distance: {job.distanceKm} km</span>
                  <span>•</span>
                  <span className="text-slate-400 font-mono">Job: #{job.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedJobForModal(job)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleAcceptJob(job)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Accept Delivery Request</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJobForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 text-white">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  Dispatch Details
                </span>
                <button
                  onClick={() => setSelectedJobForModal(null)}
                  className="text-white/80 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <h2 className="text-xl font-bold mt-1">{selectedJobForModal.partName}</h2>
              <p className="text-xs text-blue-200 font-mono mt-0.5">
                Ref: #{selectedJobForModal.id} · Payout: D{selectedJobForModal.payoutGMD} GMD
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Weight</span>
                  <span className="font-semibold text-slate-900">{selectedJobForModal.weightCategory}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Est. Travel</span>
                  <span className="font-semibold text-slate-900">{selectedJobForModal.estimatedMinutes} mins ({selectedJobForModal.distanceKm} km)</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900">Pickup Location:</span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <strong>{selectedJobForModal.pickupShop}</strong>
                  <br />
                  {selectedJobForModal.pickupAddress}
                  <br />
                  <a href={`tel:${selectedJobForModal.pickupPhone}`} className="text-blue-600 underline font-mono">
                    {selectedJobForModal.pickupPhone}
                  </a>
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900">Dropoff Workshop:</span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <strong>{selectedJobForModal.dropoffWorkshop}</strong>
                  <br />
                  {selectedJobForModal.dropoffAddress}
                  <br />
                  <a href={`tel:${selectedJobForModal.dropoffPhone}`} className="text-emerald-600 underline font-mono">
                    {selectedJobForModal.dropoffPhone}
                  </a>
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                <strong>Handover Code Verification:</strong> When you arrive at {selectedJobForModal.dropoffWorkshop}, the mechanic will provide a 4-digit PIN to release the D{selectedJobForModal.payoutGMD} payout to your wallet.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedJobForModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => handleAcceptJob(selectedJobForModal)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Confirm & Accept Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
