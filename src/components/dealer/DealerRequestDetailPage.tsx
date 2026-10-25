import { ArrowLeft, MessageSquare, MapPin, CheckCircle } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { PartRequest } from '../../types';
import { VoiceNotePlayer } from '../common/VoiceNotePlayer';
import alternatorImg from '../../assets/images/alternator_assembly_1791849520193.jpg';

interface DealerRequestDetailPageProps {
  request?: PartRequest;
  onBack: () => void;
  onOpenRespond: (req: PartRequest) => void;
}

export function DealerRequestDetailPage({
  request,
  onBack,
  onOpenRespond,
}: DealerRequestDetailPageProps) {
  const store = useStore();
  const activeReq = request || store.requests[0];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </button>

      {/* Header matching Figma Page 13 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeReq.partName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {activeReq.id} · Received {activeReq.createdAt} · Awaiting your offer
          </p>
        </div>

        <button
          onClick={() => onOpenRespond(activeReq)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md self-start sm:self-auto flex items-center gap-2"
        >
          <span>Respond to Request</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Vehicle & requested part and Reference photo */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle & requested part Card from Figma Page 13 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Vehicle & requested part</h2>
              <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                New request
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-t border-slate-100 pt-4">
              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Make / model</span>
                <p className="font-semibold text-slate-800 text-sm">
                  {activeReq.vehicleMake} {activeReq.vehicleModel}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Year / engine</span>
                <p className="font-semibold text-slate-800 text-sm">
                  {activeReq.vehicleYear} · {activeReq.vehicleEngine || '1.8L petrol'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Part name</span>
                <p className="font-semibold text-slate-800 text-sm">{activeReq.partName}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Part number</span>
                <p className="font-semibold text-slate-800 text-sm font-mono">
                  {activeReq.partNumber || '27060-0T140'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Preferred condition</span>
                <p className="font-semibold text-slate-800">{activeReq.preferredCondition}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Mechanic location</span>
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  {activeReq.mechanicLocation} · 2.1 km away
                </p>
              </div>
            </div>

            {/* Playable Voice Note Element if attached */}
            {activeReq.voiceNote && (
              <VoiceNotePlayer
                voiceNote={activeReq.voiceNote}
                title="Mechanic Part Voice Request"
                senderName={activeReq.mechanicName}
                senderRole="Mechanic"
              />
            )}

            {/* Mechanic's notes */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Mechanic's notes
              </span>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {activeReq.notes || 'Must fit the 1.8L engine. Please share a clear photo of the connector and confirm it has been tested.'}
              </p>
            </div>
          </div>

          {/* Reference photo Card matching Figma Page 13 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Reference photo</h2>
            <p className="text-xs text-slate-500">Photo uploaded by the mechanic · alternator-reference.jpg</p>

            <div className="h-80 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center p-4 overflow-hidden">
              <img
                src={activeReq.image || alternatorImg}
                alt="Reference Part"
                className="max-h-72 max-w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Requested by & Possible inventory match */}
        <div className="space-y-6">
          {/* Requested by Card from Figma Page 13 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Requested by
            </span>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">{activeReq.mechanicName}</h3>
              <p className="text-xs text-blue-600 font-semibold">{activeReq.workshopName}</p>
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-slate-100 text-slate-600">
              <p>
                <strong className="text-slate-800">Location:</strong> {activeReq.mechanicLocation}
              </p>
              <p>
                <strong className="text-slate-800">Request sent:</strong> {activeReq.createdAt}
              </p>
            </div>
          </div>

          {/* Possible inventory match Card from Figma Page 13 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Possible inventory match</h3>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                Match found
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">Alternator assembly</h4>
              <p className="text-slate-500 font-mono">27060-0T140 · Toyota Corolla 2014</p>
              <p className="text-slate-700">2 units available in your store</p>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Listed price</span>
                <span className="text-2xl font-black text-slate-900 font-mono">D2,500</span>
              </div>
              <p className="text-slate-600">Condition: Used · tested</p>
            </div>

            <button
              onClick={() => onOpenRespond(activeReq)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Respond to Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
