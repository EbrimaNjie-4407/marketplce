import { Check, ArrowRight, Clock, Info, LayoutDashboard } from 'lucide-react';
import alternatorImg from '../../assets/images/alternator_assembly_1791849520193.jpg';

interface DealerResponseSentPageProps {
  onBackToDashboard: () => void;
  onViewResponse: () => void;
}

export function DealerResponseSentPage({
  onBackToDashboard,
  onViewResponse,
}: DealerResponseSentPageProps) {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Title from Figma Page 15 */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          Response sent
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Your offer is now visible to the mechanic alongside other dealer responses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero Confirmation Card matching Figma Page 15 */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Your alternator offer is on its way.
              </h2>
              <p className="text-xs text-slate-600">
                Sent to Kwame Mensah · Today at 9:28 AM
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="font-semibold text-blue-700 bg-blue-100/80 px-3 py-1 rounded-full">
                Offer sent · Awaiting selection
              </span>
              <span className="text-slate-600 font-medium">
                REQ-1042 · Toyota Corolla 2014 · Alternator assembly
              </span>
            </div>
          </div>

          {/* Response summary Card from Figma Page 15 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900">Response summary</h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-100">
              <div className="w-28 h-28 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center p-2 shrink-0">
                <img
                  src={alternatorImg}
                  alt="Alternator"
                  className="max-h-24 max-w-full object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs w-full">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Price</span>
                  <p className="text-xl font-black text-slate-900 font-mono">D2,500</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Condition</span>
                  <p className="font-semibold text-slate-800">Used · tested</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Quantity</span>
                  <p className="font-semibold text-slate-800">2 units</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Availability</span>
                  <p className="font-semibold text-emerald-700">Available now</p>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Location</span>
              <p className="text-slate-800 font-medium">Shop 18, Jeshwang Spare Parts Hub, Serekunda</p>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              90A alternator. Tested and ready for pickup. Connector matches 27060-0T140.
            </div>

            {/* Actions matching Figma Page 15 */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={onBackToDashboard}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>

              <button
                onClick={onViewResponse}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
              >
                View Response
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: "What happens next?" & info tip */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
            <h3 className="text-base font-bold text-slate-900">What happens next?</h3>

            <div className="space-y-1.5 border-t border-slate-100 pt-4">
              <span className="font-bold text-slate-800">Mechanic compares offers</span>
              <p className="text-slate-600 leading-relaxed">
                No action needed right now. They may contact you with questions before selecting.
              </p>
            </div>

            <div className="space-y-1.5 border-t border-slate-100 pt-4">
              <span className="font-bold text-slate-800">If your offer is selected</span>
              <p className="text-slate-600 leading-relaxed">
                Confirm the reservation. We'll notify you so you can hold the part and arrange pickup or delivery.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 space-y-2 text-xs text-blue-900">
            <div className="flex items-center gap-2 font-bold text-blue-950">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Stock is not reserved yet</span>
            </div>
            <p className="text-blue-800/90 leading-relaxed">
              Your offer has been sent, but the mechanic has not selected it. Keep availability up to date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
