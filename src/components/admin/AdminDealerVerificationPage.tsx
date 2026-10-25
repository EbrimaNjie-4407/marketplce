import { useState } from 'react';
import { FileText, Image as ImageIcon, CheckCircle, XCircle, ExternalLink, Check } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';
import { DealerApplication } from '../../types';

export function AdminDealerVerificationPage() {
  const store = useStore();
  const [filterTab, setFilterTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedApp, setSelectedApp] = useState<DealerApplication>(store.applications[0]);
  const [reviewNote, setReviewNote] = useState('Registration name and phone confirmed. Review shop location before approval.');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredApps = store.applications.filter((a) => a.status === filterTab);

  const handleApprove = () => {
    if (!selectedApp) return;
    marketplaceStore.approveDealer(selectedApp.id, reviewNote);
    setActionSuccess(`Approved ${selectedApp.businessName} successfully!`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleReject = () => {
    if (!selectedApp) return;
    marketplaceStore.rejectDealer(selectedApp.id, reviewNote);
    setActionSuccess(`Rejected ${selectedApp.businessName}.`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title from Figma Page 19 */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          Dealer verification
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review business identity, contact details and location before approval.
        </p>
      </div>

      {/* Tabs Filter from Figma Page 19 */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs w-fit">
        <button
          onClick={() => setFilterTab('pending')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterTab === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ● Pending ({store.applications.filter((a) => a.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilterTab('approved')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterTab === 'approved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ○ Approved ({store.applications.filter((a) => a.status === 'approved').length + 32})
        </button>
        <button
          onClick={() => setFilterTab('rejected')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterTab === 'rejected' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ○ Rejected ({store.applications.filter((a) => a.status === 'rejected').length + 2})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Applications List */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Pending applications</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 font-bold">Business</th>
                  <th className="py-2.5 px-3 font-bold">Location</th>
                  <th className="py-2.5 px-3 font-bold">Submitted</th>
                  <th className="py-2.5 px-3 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => {
                      setSelectedApp(app);
                      setReviewNote(app.reviewNote || 'Registration confirmed. Review physical shop front.');
                    }}
                    className={`cursor-pointer transition-colors ${
                      selectedApp?.id === app.id ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-slate-900">{app.businessName}</td>
                    <td className="py-3 px-3 text-slate-600">{app.location}</td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{app.submittedDate}</td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          selectedApp?.id === app.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {selectedApp?.id === app.id ? 'Selected' : app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            {filteredApps.length} applications in this view · Oldest submission 30 September
          </p>
        </div>

        {/* Right 5 Cols: Selected Application Detail matching Figma Page 19 */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          {selectedApp ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedApp.businessName}</h3>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                    {selectedApp.status === 'pending' ? 'Pending review' : selectedApp.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs border-t border-slate-100 pt-4">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Contact person
                  </span>
                  <p className="font-semibold text-slate-900">{selectedApp.contactPerson}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Phone
                  </span>
                  <p className="font-mono font-semibold text-slate-900">{selectedApp.phone}</p>
                </div>

                <div className="col-span-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Business registration
                  </span>
                  <p className="font-mono font-semibold text-slate-900">
                    {selectedApp.businessRegistration}
                  </p>
                </div>

                <div className="col-span-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Address
                  </span>
                  <p className="font-semibold text-slate-800">{selectedApp.shopAddress}</p>
                </div>

                <div className="col-span-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Specialization
                  </span>
                  <p className="font-semibold text-slate-800">{selectedApp.specialization}</p>
                </div>
              </div>

              {/* Uploaded Documents rows matching Figma Page 19 */}
              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Verification files
                </span>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900">{selectedApp.registrationDocName}</p>
                      <span className="text-[10px] text-slate-400">Uploaded 2 Oct · {selectedApp.registrationDocSize}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Opening certificate document: ${selectedApp.registrationDocName}`)}
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                  >
                    Open
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900">{selectedApp.shopPhotoName}</p>
                      <span className="text-[10px] text-slate-400">Uploaded 2 Oct · {selectedApp.shopPhotoSize}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Opening shop front photo: ${selectedApp.shopPhotoName}`)}
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                  >
                    Open
                  </button>
                </div>
              </div>

              {/* Review Note / Rejection Reason from Figma Page 19 */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">Review note / rejection reason</label>
                <textarea
                  rows={2}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={handleReject}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Reject
                </button>

                <button
                  onClick={handleApprove}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve Dealer</span>
                </button>
              </div>

              {actionSuccess && (
                <p className="text-xs font-bold text-emerald-600 text-center animate-fadeIn">
                  {actionSuccess}
                </p>
              )}

              <p className="text-[11px] text-slate-400 text-center">
                Approval allows this dealer to receive and respond to requests.
              </p>
            </>
          ) : (
            <p className="text-xs text-slate-500">Select an application to inspect.</p>
          )}
        </div>
      </div>
    </div>
  );
}
