import { useState } from 'react';
import { Download, CheckCircle, ArrowRight, ShieldCheck, Users, FileText, AlertTriangle } from 'lucide-react';
import { useStore } from '../../hooks/useStore';

interface AdminOverviewPageProps {
  onReviewDealers: () => void;
  onInspectListing: (listingId: string) => void;
  onInspectRequest: (reqId: string) => void;
}

export function AdminOverviewPage({
  onReviewDealers,
  onInspectListing: _onInspectListing,
  onInspectRequest,
}: AdminOverviewPageProps) {
  const store = useStore();

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(store, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', 'autospares_gm_market_report.json');
    dlAnchorElem.click();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title & Export Action matching Figma Page 18 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            The Gambia spare-parts marketplace · Jeshwang & Greater Banjul · Today, 12 October 2026
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Summary</span>
        </button>
      </div>

      {/* 3 Metric Cards from Figma Page 18 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-medium">Active users</span>
          <div className="text-4xl font-extrabold text-slate-900 font-mono">248</div>
          <p className="text-[11px] text-slate-400">212 mechanics · 36 dealers</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-medium">Requests today</span>
          <div className="text-4xl font-extrabold text-blue-600 font-mono">42</div>
          <p className="text-[11px] text-slate-400">31 have dealer responses</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-medium">Verification queue</span>
          <div className="text-4xl font-extrabold text-slate-900 font-mono">
            {store.applications.filter((a) => a.status === 'pending').length || 4}
          </div>
          <p className="text-[11px] text-slate-400">Business details awaiting review</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: "Needs your attention" & "Marketplace activity" */}
        <div className="lg:col-span-8 space-y-6">
          {/* Needs your attention Table matching Figma Page 18 */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Needs your attention</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3 font-bold">Item</th>
                    <th className="py-2.5 px-3 font-bold">Details</th>
                    <th className="py-2.5 px-3 font-bold">Submitted</th>
                    <th className="py-2.5 px-3 font-bold">Priority</th>
                    <th className="py-2.5 px-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">Dealer verification</td>
                    <td className="py-3 px-3 text-slate-700">Bantama Auto Supply</td>
                    <td className="py-3 px-3 text-slate-500">Today · 8:45 AM</td>
                    <td className="py-3 px-3">
                      <span className="text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                        Pending review
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={onReviewDealers}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        Review →
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">Dealer verification</td>
                    <td className="py-3 px-3 text-slate-700">Kejetia Parts Centre</td>
                    <td className="py-3 px-3 text-slate-500">Yesterday</td>
                    <td className="py-3 px-3">
                      <span className="text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                        Pending review
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={onReviewDealers}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        Review →
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">Listing report</td>
                    <td className="py-3 px-3 text-slate-700">Brake pads · Listing P-028</td>
                    <td className="py-3 px-3 text-slate-500">Today · 9:40 AM</td>
                    <td className="py-3 px-3">
                      <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                        Reported mismatch
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => alert('Inspecting listing P-028 compatibility data...')}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">Request report</td>
                    <td className="py-3 px-3 text-slate-700">REQ-1028 · Fuel pump</td>
                    <td className="py-3 px-3 text-slate-500">Yesterday</td>
                    <td className="py-3 px-3">
                      <span className="text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                        Dealer unavailable
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onInspectRequest('REQ-1028')}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Marketplace activity Table matching Figma Page 18 */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Marketplace activity</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3 font-bold">Time</th>
                    <th className="py-2.5 px-3 font-bold">Activity</th>
                    <th className="py-2.5 px-3 font-bold">User / business</th>
                    <th className="py-2.5 px-3 font-bold">Reference</th>
                    <th className="py-2.5 px-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {store.activityLogs.slice(0, 5).map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{act.time}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{act.activity}</td>
                      <td className="py-3 px-3 text-slate-600">{act.userOrBusiness}</td>
                      <td className="py-3 px-3 font-mono text-blue-600 font-semibold">{act.reference}</td>
                      <td className="py-3 px-3">
                        <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md font-medium text-[11px]">
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Request health & Dealer network from Figma Page 18 */}
        <div className="lg:col-span-4 space-y-6">
          {/* Request health */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Request health</h3>

            <div className="space-y-3 divide-y divide-slate-100">
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-600">Awaiting dealer responses</span>
                <span className="font-bold text-slate-900 font-mono">11 requests</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-600">Responses received</span>
                <span className="font-bold text-blue-600 font-mono">18 requests</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-600">Selected / reserved</span>
                <span className="font-bold text-emerald-600 font-mono">8 requests</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-600">Completed today</span>
                <span className="font-bold text-slate-900 font-mono">5 requests</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              42 requests total today. These are distinct current statuses.
            </p>
          </div>

          {/* Dealer network Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Dealer network</h3>

            <div className="space-y-1">
              <p className="text-lg font-black text-slate-900 font-mono">32 verified dealers</p>
              <p className="text-slate-500 leading-relaxed">
                4 dealer applications are pending. Unverified dealers cannot respond to requests.
              </p>
            </div>

            <button
              onClick={onReviewDealers}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              Review Dealers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
