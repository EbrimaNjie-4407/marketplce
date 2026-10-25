import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, MapPin, Truck, Store, Check } from 'lucide-react';
import { marketplaceStore } from '../../services/store';
import { DeliveryMethod } from '../../types';
import alternatorImg from '../../assets/images/alternator_assembly_1791849520193.jpg';

interface OfferCheckoutPickupPageProps {
  requestId?: string;
  offerId?: string;
  onBack: () => void;
  onConfirmed: () => void;
}

export function OfferCheckoutPickupPage({
  requestId = 'REQ-1042',
  offerId = 'off_burgi_1042',
  onBack,
  onConfirmed,
}: OfferCheckoutPickupPageProps) {
  const [method, setMethod] = useState<DeliveryMethod>('pickup');
  const [pickupTime, setPickupTime] = useState('Today · 2:00 PM');
  const [deliveryAddress, setDeliveryAddress] = useState('Mensah Auto Works, Westfield Junction, Serrekunda');
  const [note, setNote] = useState("I'll bring the old alternator to check the connector.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = () => {
    setIsSubmitting(true);
    try {
      marketplaceStore.selectOffer(requestId, offerId, {
        deliveryMethod: method,
        pickupTime: method === 'pickup' ? pickupTime : undefined,
        pickupLocation: method === 'pickup' ? 'Shop 18, Jeshwang Spare Parts Hub' : undefined,
        deliveryAddress: method === 'delivery' ? deliveryAddress : undefined,
        deliveryFeeGMD: method === 'delivery' ? 100 : 0,
        noteToDealer: note,
      });

      setTimeout(() => {
        setIsSubmitting(false);
        onConfirmed();
      }, 500);
    } catch {
      setIsSubmitting(false);
      onConfirmed();
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Responses</span>
      </button>

      {/* Title */}
      <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
        Confirm Part & Handover
      </h1>

      {/* 1. "Your chosen offer" Card matching Figma Page 6 */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Your chosen offer</h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center p-2 shrink-0">
              <img
                src={alternatorImg}
                alt="Alternator"
                className="max-h-20 max-w-full object-contain"
              />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-slate-900">Alternator</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="font-semibold text-slate-800">Bourgi Auto Parts</span>
                <span>·</span>
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 fill-current" /> Verified dealer
                </span>
              </p>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Available now
                </span>
                <span className="text-xs text-slate-500">
                  Toyota Corolla 2014 · 27060-0T140 · Used, tested
                </span>
              </div>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-xs text-slate-400 block uppercase font-bold text-[10px]">Agreed Price</span>
            <span className="text-3xl font-black text-slate-900 font-mono">D2,500</span>
          </div>
        </div>
      </div>

      {/* 2. "Pickup or delivery" Selection Card matching Figma Page 6 */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Pickup or delivery</h2>

        {/* Segmented Radio Selector */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 gap-2">
          <button
            type="button"
            onClick={() => setMethod('pickup')}
            className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              method === 'pickup'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <span className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${method === 'pickup' ? 'border-white bg-white' : 'border-slate-400'}`}>
              {method === 'pickup' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
            </span>
            <Store className="w-4 h-4" />
            <span>Pickup at Shop</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod('delivery')}
            className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              method === 'delivery'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <span className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${method === 'delivery' ? 'border-white bg-white' : 'border-slate-400'}`}>
              {method === 'delivery' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
            </span>
            <Truck className="w-4 h-4" />
            <span>Delivery to Workshop</span>
          </button>
        </div>

        {/* Method-specific fields */}
        {method === 'pickup' ? (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Pickup location</span>
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Jeshwang Spare Parts Hub, Shop 18
                </p>
                <p className="text-slate-500 text-[11px]">Delivery is also available</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Opening hours</span>
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Mon–Sat · 8:00 AM–6:00 PM
                </p>
                <p className="text-slate-500 text-[11px]">Staff on site to test connectors</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Preferred pickup time</label>
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Today · 2:00 PM">Today · 2:00 PM</option>
                <option value="Today · 4:00 PM">Today · 4:00 PM</option>
                <option value="Today · 5:30 PM">Today · 5:30 PM</option>
                <option value="Tomorrow · 9:00 AM">Tomorrow · 9:00 AM</option>
                <option value="Tomorrow · 11:30 AM">Tomorrow · 11:30 AM</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Delivery address / Workshop location</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Workshop address or landmark in Serrekunda / Banjul"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-blue-900">
              <span className="font-medium">Estimated local bike dispatch fee:</span>
              <span className="font-bold font-mono">D100 GMD</span>
            </div>
          </div>
        )}

        {/* Note to dealer from Figma Page 6 */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Note to dealer (optional)</label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. I'll bring the old alternator to check the connector."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Actions matching Figma Page 6 */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
          >
            Back to Responses
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Reserving Part...' : 'Confirm Selection'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
