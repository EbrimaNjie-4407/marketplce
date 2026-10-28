import { useState } from 'react';
import { Plus, CheckCircle2, ArrowRight, Store, ShieldCheck } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { PartRequest } from '../../types';

interface DealerDashboardPageProps {
  onAddPart: () => void;
  onRespondRequest: (req: PartRequest) => void;
  onViewRequestDetail: (req: PartRequest) => void;
  onManageProfile: () => void;
}

export function DealerDashboardPage({
  onAddPart,
  onRespondRequest,
  onViewRequestDetail,
  onManageProfile,
}: DealerDashboardPageProps) {
  const store = useStore();
  const dealer = store.dealers.find((d) => d.id === 'dealer_burgi') || store.dealers[0];

  const pendingRequests = store.requests.filter((r) => r.status === 'Waiting for dealers' || r.status === 'Responses received');
  const activeRequests = store.requests.filter((r) => r.status === 'Reserved' || r.selectedOfferId);

  const inventoryAvailable = store.inventory.filter((i) => i.status === 'available').length;
  const inventoryOutOfStock = store.inventory.filter((i) => i.status === 'out_of_stock').length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header from Figma Page 10 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good morning, {dealer.businessName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Today's requests from mechanics near your shop · Jeshwang Industrial Hub · 9:20 AM
          </p>
        </div>

        <button
          onClick={onAddPart}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Part</span>
        </button>
      </div>

      {/* 3 Metric Summary Cards matching Figma Page 10 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-medium">New requests</span>
          <div className="text-4xl font-extrabold text-slate-900 font-mono">
            {pendingRequests.length || 6}
          </div>
          <p className="text-[11px] text-slate-400">Awaiting your response</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-medium">Active requests</span>
          <div className="text-4xl font-extrabold text-blue-600 font-mono">
            {activeRequests.length || 4}
          </div>
          <p className="text-[11px] text-slate-400">3 offers sent · 1 part reserved</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-medium">Parts in inventory</span>
          <div className="text-4xl font-extrabold text-slate-900 font-mono">
            {store.inventory.length}
          </div>
          <p className="text-[11px] text-slate-400">
            {inventoryAvailable} available · {inventoryOutOfStock} out of stock
          </p>
        </div>
      </div>

      {/* Two Column Layout matching Figma Page 10 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main 2 Cols: Tables */}
        <div className="lg:col-span-2 space-y-6">
          {/* New requests Table matching Figma Page 10 */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">New requests</h2>
              <span className="text-xs text-slate-400 font-medium">Auto-matched within 10 km</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3 font-bold">Requested part</th>
                    <th className="py-2.5 px-3 font-bold">Vehicle</th>
                    <th className="py-2.5 px-3 font-bold">Location</th>
                    <th className="py-2.5 px-3 font-bold">Received</th>
                    <th className="py-2.5 px-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {store.requests.slice(0, 4).map((req, idx) => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {req.partName} · {req.id}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {req.vehicleModel} · {req.vehicleYear}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {req.mechanicLocation.split(',')[0]} · {1.8 + idx * 0.9} km
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {idx === 0 ? '8 min ago' : idx === 1 ? '18 min ago' : idx === 2 ? '25 min ago' : '32 min ago'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onRespondRequest(req)}
                          className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1"
                        >
                          <span>Respond →</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => onViewRequestDetail(store.requests[0])}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 pt-2 block"
            >
              View all 6 new requests
            </button>
          </div>

          {/* Active requests Table matching Figma Page 10 */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Active requests & offers</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3 font-bold">Request</th>
                    <th className="py-2.5 px-3 font-bold">Your offer</th>
                    <th className="py-2.5 px-3 font-bold">Mechanic</th>
                    <th className="py-2.5 px-3 font-bold">Status</th>
                    <th className="py-2.5 px-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">REQ-1031 · Oil filter</td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900">D300</td>
                    <td className="py-3 px-3 text-slate-600">Kwame Mensah</td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                        Reserved
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onViewRequestDetail(store.requests[0])}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        View request →
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">REQ-1042 · Alternator</td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900">D2,500</td>
                    <td className="py-3 px-3 text-slate-600">Kwame Mensah</td>
                    <td className="py-3 px-3">
                      <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                        Offer sent
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onViewRequestDetail(store.requests[0])}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        View request →
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">REQ-1035 · Radiator</td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900">D680</td>
                    <td className="py-3 px-3 text-slate-600">Kojo Appiah</td>
                    <td className="py-3 px-3">
                      <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                        Offer sent
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onViewRequestDetail(store.requests[0])}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        View request →
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">REQ-1033 · Clutch kit</td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900">D920</td>
                    <td className="py-3 px-3 text-slate-600">Akosua Asare</td>
                    <td className="py-3 px-3">
                      <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                        Offer sent
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onViewRequestDetail(store.requests[0])}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        View request →
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Shop status card from Figma Page 10 */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Shop status</h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
              Verified dealer
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="font-medium text-slate-600">Open for requests</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Service area</span>
              <p className="font-semibold text-slate-800">{dealer.serviceArea || 'Jeshwang · Within 10 km'}</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Today's hours</span>
              <p className="font-semibold text-slate-800">{dealer.openingHours || '8:00 AM–6:00 PM'}</p>
            </div>
          </div>

          <button
            onClick={onManageProfile}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors shadow-2xs"
          >
            Manage profile
          </button>
        </div>

        {/* Escrow Settlement & Trust Vault Widget */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">Escrow Trust Vault</h3>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Dual Protection
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            Buyer payments are securely held in escrow until <strong>both customer & courier confirm</strong> the delivered part matches specifications and is undamaged.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-1">
              <span className="text-[10px] text-slate-400 block font-medium">Withheld in Escrow</span>
              <div className="text-xl font-mono font-black text-amber-400">
                D{store.orders
                  .filter((o) => o.dealerId === dealer.id || o.dealerName.includes('BURGI'))
                  .filter((o) => o.escrowStatus === 'held_in_escrow' || o.dealerPayoutStatus === 'pending_confirmation')
                  .reduce((sum, o) => sum + (o.dealerPayoutGMD || o.priceGMD || 0), 0)
                  .toLocaleString()} GMD
              </div>
              <span className="text-[10px] text-amber-200/80 block">Awaiting dual sign-off</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-1">
              <span className="text-[10px] text-slate-400 block font-medium">Settled & Paid Out</span>
              <div className="text-xl font-mono font-black text-emerald-400">
                D{store.orders
                  .filter((o) => o.dealerId === dealer.id || o.dealerName.includes('BURGI'))
                  .filter((o) => o.escrowStatus === 'released' || o.dealerPayoutStatus === 'paid_out')
                  .reduce((sum, o) => sum + (o.dealerPayoutGMD || o.priceGMD || 0), 0)
                  .toLocaleString()} GMD
              </div>
              <span className="text-[10px] text-emerald-300/80 block">Dispatched via Wave</span>
            </div>
          </div>

          {/* Recent Escrow Records */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Recent Dual-Confirmation Orders
            </span>
            {store.orders
              .filter((o) => o.dealerId === dealer.id || o.dealerName.includes('BURGI'))
              .slice(0, 2)
              .map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-white truncate">{ord.partName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {ord.id} · {ord.dealerPayoutRef ? `Ref: ${ord.dealerPayoutRef}` : 'Escrow Protected'}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-emerald-400 block text-xs">
                      +D{(ord.dealerPayoutGMD || ord.priceGMD || 0).toLocaleString()}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        ord.escrowStatus === 'released'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {ord.escrowStatus === 'released' ? 'Settled' : 'Withheld'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
