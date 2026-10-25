import { ArrowLeft, CheckCircle2, Phone, MapPin, Clock, Wrench, Navigation } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { DealerProfile, InventoryItem } from '../../types';
import alternatorImg from '../../assets/images/alternator_assembly_1791849520193.jpg';
import { getPartPhoto } from '../../data/partsCatalog';

interface DealerShopAndOfferViewProps {
  dealer?: DealerProfile;
  part?: InventoryItem;
  onBack: () => void;
  onSelectOffer: () => void;
}

export function DealerShopAndOfferView({
  dealer,
  part,
  onBack,
  onSelectOffer,
}: DealerShopAndOfferViewProps) {
  const store = useStore();
  const activeDealer = dealer || store.dealers[0];
  const activePart = part || store.inventory[0];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Store</span>
      </button>

      {/* Dealer Header Title matching Figma Page 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeDealer.businessName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Local spare-parts specialist · {activeDealer.shopLocation.split(',')[0]}
          </p>
        </div>

        <button
          onClick={() => alert(`Dialing dealer: ${activeDealer.phone}`)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Contact Dealer</span>
        </button>
      </div>

      {/* Two Column Layout matching Figma Page 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 spans): Dealer Profile & Visit the Shop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dealer Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1c398e] text-white flex items-center justify-center font-black text-xl shrink-0">
                {activeDealer.logoText || 'BS'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900">{activeDealer.businessName}</h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                    Verified dealer
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Serving workshops in Jeshwang & Greater Banjul Area since 2016
                </p>
              </div>
            </div>

            {/* Grid of Business Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Location</span>
                <p className="text-slate-800 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {activeDealer.shopLocation}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Phone</span>
                <p className="text-slate-800 font-medium flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {activeDealer.phone}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Specialization</span>
                <p className="text-slate-800 font-medium flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {activeDealer.specialization}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Opening hours</span>
                <p className="text-slate-800 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {activeDealer.openingHours}
                </p>
              </div>
            </div>
          </div>

          {/* Visit the Shop Card from Figma Page 5 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Visit the shop</h3>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-950">
                    Jeshwang Hub · {activeDealer.distanceKm || 2.1} km away
                  </h4>
                  <p className="text-xs text-blue-800">
                    Near the main spare-parts junction, {activeDealer.shopLocation.split(',')[0]}
                  </p>
                </div>
              </div>

              <span className="px-3 py-1.5 bg-blue-100 text-blue-900 rounded-xl text-xs font-bold shrink-0">
                Hub Navigation Active
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Open today until 6:00 PM · Confirm the part before travelling.
            </p>
          </div>
        </div>

        {/* Right Column (1 span): "Their response to your request" Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
              Offer Ready
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-1">
              Their response to your request
            </h3>
          </div>

          {/* Photo Showcase */}
          <div className="h-48 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-4">
            <img
              src={getPartPhoto(activePart.partName, activePart.image)}
              alt={activePart.partName}
              className="max-h-40 max-w-full object-contain"
            />
          </div>

          {/* Part Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900">{activePart.partName}</h4>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Available now
              </span>
            </div>

            <div className="text-2xl font-black text-slate-900 font-mono">
              D{activePart.priceGMD.toLocaleString()}
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <p>
                <strong className="text-slate-800">Condition:</strong> {activePart.condition} · {activePart.quantity} units
              </p>
              <p className="text-slate-500 leading-relaxed">
                {activePart.description || '90A alternator. Tested and ready for pickup.'}
              </p>
            </div>
          </div>

          {/* Select Offer Action from Figma Page 5 */}
          <button
            onClick={onSelectOffer}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Select Offer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
