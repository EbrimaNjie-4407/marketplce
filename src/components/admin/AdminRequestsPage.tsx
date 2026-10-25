import { useState } from 'react';
import { Download, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { PartRequest } from '../../types';

interface AdminRequestsPageProps {
  onViewRequestDetail: (req: PartRequest) => void;
}

export function AdminRequestsPage({ onViewRequestDetail }: AdminRequestsPageProps) {
  const store = useStore();
  const [filterTab, setFilterTab] = useState<'all' | 'waiting' | 'responses' | 'reserved' | 'completed' | 'reported'>('all');
  const [selectedReq, setSelectedReq] = useState<PartRequest>(store.requests[0]);

  const filteredRequests = store.requests.filter((r) => {
    if (filterTab === 'waiting') return r.status === 'Waiting for dealers';
    if (filterTab === 'responses') return r.status === 'Responses received';
    if (filterTab === 'reserved') return r.status === 'Reserved';
    if (filterTab === 'completed') return r.status === 'Collected' || r.status === 'Delivered';
    if (filterTab === 'reported') return r.status === 'Reported';
    return true;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header from Figma Page 21 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor request activity and resolve reported issues without choosing offers for users.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting requests database records...')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Requests</span>
        </button>
      </div>

      {/* Tabs Filter from Figma Page 21 */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs w-fit">
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
        <button
          onClick={() => setFilterTab('reported')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterTab === 'reported' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ○ Reported
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Request directory Table matching Figma Page 21 */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Request directory</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 font-bold">Request / part</th>
                  <th className="py-2.5 px-3 font-bold">Mechanic</th>
                  <th className="py-2.5 px-3 font-bold">Replies</th>
                  <th className="py-2.5 px-3 font-bold">Current status</th>
                  <th className="py-2.5 px-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedReq(req)}
                    className={`cursor-pointer transition-colors ${
                      selectedReq?.id === req.id ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {req.id} · {req.partName}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{req.mechanicName}</td>
                    <td className="py-3 px-3 font-mono">
                      {req.repliesCount} / {req.targetDealersCount}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          req.status === 'Reserved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : req.status === 'Reported'
                            ? 'bg-red-50 text-red-700'
                            : req.status === 'Responses received'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-blue-600 hover:text-blue-800 font-bold">
                        {selectedReq?.id === req.id ? 'Selected' : 'View →'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Showing {filteredRequests.length} of 126 requests · Last 7 days
          </p>
        </div>

        {/* Right 4 Cols: Selected Request Audit Details matching Figma Page 21 */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          {selectedReq ? (
            <>
              <div>
                <h3 className="text-lg font-black text-slate-900">{selectedReq.id}</h3>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                  {selectedReq.status}
                </span>
              </div>

              <div className="space-y-3 text-xs border-t border-slate-100 pt-4 text-slate-600">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Part / vehicle
                  </span>
                  <p className="font-semibold text-slate-900">
                    {selectedReq.partName} · {selectedReq.vehicleModel} {selectedReq.vehicleYear}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Mechanic
                  </span>
                  <p className="font-semibold text-slate-900">{selectedReq.mechanicName}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Selected dealer
                  </span>
                  <p className="font-semibold text-slate-900">Burgi Spare Parts</p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Offer
                  </span>
                  <p className="font-semibold text-slate-900">D2,500 · Used, tested</p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Handover
                  </span>
                  <p className="font-semibold text-slate-900">Pickup · Today, 2:00 PM</p>
                </div>
              </div>

              {/* Request audit timeline matching Figma Page 21 */}
              <div className="space-y-3 border-t border-slate-100 pt-4 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Request audit
                </span>

                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-slate-500">Submitted</span>
                    <span className="font-semibold text-slate-900">Today · 9:12 AM</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-slate-500">Responses received</span>
                    <span className="font-semibold text-blue-600">3 offers by 9:46 AM</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-slate-500">Offer selected</span>
                    <span className="font-semibold text-emerald-600">Today · 10:05 AM</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onViewRequestDetail(selectedReq)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                View Full Request
              </button>
            </>
          ) : (
            <p className="text-xs text-slate-500">Select a request to inspect.</p>
          )}
        </div>
      </div>
    </div>
  );
}
