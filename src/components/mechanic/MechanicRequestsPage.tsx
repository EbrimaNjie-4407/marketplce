import { useState } from 'react';
import { Plus, ArrowRight, Truck, Mic, Volume2 } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { PartRequest, DealerOffer } from '../../types';
import { MechanicRequestDetailModal } from './MechanicRequestDetailModal';

interface MechanicRequestsPageProps {
  onCreateRequest: () => void;
  onViewRequestDetail: (req: PartRequest) => void;
  onTrackOrder: (orderId: string) => void;
}

export function MechanicRequestsPage({
  onCreateRequest,
  onViewRequestDetail,
  onTrackOrder,
}: MechanicRequestsPageProps) {
  const store = useStore();
  const [filterTab, setFilterTab] = useState<'all' | 'waiting' | 'responses' | 'reserved' | 'completed'>('all');
  const [modalRequest, setModalRequest] = useState<PartRequest | null>(null);

  const requests = store.requests.filter((r) => {
    if (filterTab === 'waiting') return r.status === 'Waiting for dealers';
    if (filterTab === 'responses') return r.status === 'Responses received';
    if (filterTab === 'reserved') return r.status === 'Reserved';
    if (filterTab === 'completed') return r.status === 'Collected' || r.status === 'Delivered';
    return true;
  });

  const activeCount = store.requests.filter((r) => r.status === 'Waiting for dealers' || r.status === 'Responses received' || r.status === 'Reserved').length;
  const reviewCount = store.requests.filter((r) => r.status === 'Responses received').length || 3;
  const completedCount = store.requests.filter((r) => r.status === 'Collected' || r.status === 'Delivered').length || 12;

  const getStatusBadge = (status: PartRequest['status']) => {
    switch (status) {
      case 'Responses received':
        return <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-semibold">Responses received</span>;
      case 'Waiting for dealers':
        return <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-semibold">Waiting for dealers</span>;
      case 'Reserved':
        return <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-semibold">Reserved</span>;
      case 'Collected':
        return <span className="text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-semibold">Collected</span>;
      case 'Delivered':
        return <span className="text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full text-xs font-semibold">Delivered</span>;
      default:
        return <span className="text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header matching Figma Page 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep every search, dealer response and handover in one place.
          </p>
        </div>

        <button
          onClick={onCreateRequest}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Request</span>
        </button>
      </div>

      {/* 3 Metric Summary Cards from Figma Page 8 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-medium">Active requests</span>
          <div className="text-4xl font-extrabold text-slate-900 font-mono">{activeCount}</div>
          <p className="text-[11px] text-slate-400">1 waiting · 1 comparing · 1 reserved</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-medium">Responses to review</span>
          <div className="text-4xl font-extrabold text-blue-600 font-mono">{reviewCount}</div>
          <p className="text-[11px] text-slate-400">Alternator assembly · REQ-1042</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-medium">Completed requests</span>
          <div className="text-4xl font-extrabold text-slate-900 font-mono">{completedCount}</div>
          <p className="text-[11px] text-slate-400">Collected or delivered</p>
        </div>
      </div>

      {/* Request History Section from Figma Page 8 */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">Request history</h2>

          {/* Tab Filter from Figma Page 8 */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ● All requests
            </button>
            <button
              onClick={() => setFilterTab('waiting')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterTab === 'waiting' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ○ Waiting
            </button>
            <button
              onClick={() => setFilterTab('responses')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterTab === 'responses' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ○ Responses
            </button>
            <button
              onClick={() => setFilterTab('reserved')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterTab === 'reserved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ○ Reserved
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterTab === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ○ Completed
            </button>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-bold">Request / part</th>
                <th className="py-3 px-4 font-bold">Vehicle</th>
                <th className="py-3 px-4 font-bold">Responses</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-900">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {req.id} · {req.partName}
                        </span>
                        {req.voiceNote && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalRequest(req);
                            }}
                            title="Voice note attached - click to play"
                          >
                            <Mic className="w-2.5 h-2.5 animate-pulse" />
                            <span>Voice ({req.voiceNote.durationSeconds}s)</span>
                          </span>
                        )}
                      </div>
                      {req.partNumber && (
                        <span className="text-[11px] text-slate-400 font-mono">{req.partNumber}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    {req.vehicleMake} {req.vehicleModel} · {req.vehicleYear}
                  </td>
                  <td className="py-4 px-4 font-medium">
                    {req.repliesCount > 0 ? (
                      <span className="text-blue-600 font-semibold">{req.repliesCount} responses</span>
                    ) : (
                      <span className="text-slate-400">0 responses</span>
                    )}
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(req.status)}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="inline-flex items-center gap-3">
                      {req.status === 'Reserved' || req.orderId ? (
                        <button
                          onClick={() => onTrackOrder(req.orderId || 'ORD-1042')}
                          className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-800 font-bold"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track request →</span>
                        </button>
                      ) : null}

                      <button
                        onClick={() => setModalRequest(req)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold"
                      >
                        <span>View request →</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer pagination info */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
          <span>Showing {requests.length} of {store.requests.length} requests</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-slate-700 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-slate-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Mechanic Request Detail Modal with Custom Audio Player */}
      {modalRequest && (
        <MechanicRequestDetailModal
          request={modalRequest}
          onClose={() => setModalRequest(null)}
          onSelectOffer={(_offer) => {
            onViewRequestDetail(modalRequest);
          }}
          onTrackOrder={(orderId) => {
            onTrackOrder(orderId);
          }}
        />
      )}
    </div>
  );
}
