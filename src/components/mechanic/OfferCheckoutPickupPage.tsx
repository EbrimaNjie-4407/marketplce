import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Store,
  Check,
  CreditCard,
  ShieldCheck,
  Building2,
  Banknote,
  Receipt,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';
import { DeliveryMethod, Order } from '../../types';
import { getPartPhoto } from '../../data/partsCatalog';

interface OfferCheckoutPickupPageProps {
  requestId?: string;
  offerId?: string;
  onBack: () => void;
  onConfirmed: () => void;
  onTrackOrder?: (orderId: string) => void;
}

export function OfferCheckoutPickupPage({
  requestId = 'REQ-1042',
  offerId = 'off_burgi_1042',
  onBack,
  onConfirmed,
  onTrackOrder,
}: OfferCheckoutPickupPageProps) {
  const store = useStore();
  const activeRequest = store.requests.find((r) => r.id === requestId) || store.requests[0];
  const activeOffer = store.offers.find((o) => o.id === offerId) || store.offers[0];

  const [method, setMethod] = useState<DeliveryMethod>('pickup');
  const [pickupTime, setPickupTime] = useState('Today · 2:00 PM');
  const [deliveryAddress, setDeliveryAddress] = useState(
    activeRequest?.mechanicLocation || 'Mensah Auto Works, Westfield Junction, Serrekunda'
  );
  const [note, setNote] = useState("I'll bring the old alternator to check the connector.");

  // Payments
  const [paymentMethod, setPaymentMethod] = useState<
    'wave' | 'qmoney' | 'afrimoney' | 'bank_transfer' | 'cash_on_handover'
  >('wave');
  const [paymentPhone, setPaymentPhone] = useState(
    store.currentUser?.phone || '+220 745 5010'
  );
  const [bankRef, setBankRef] = useState(`TX-${Math.floor(100000 + Math.random() * 900000)}`);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingStep, setSubmittingStep] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const deliveryFee = method === 'delivery' ? 100 : 0;
  const partPrice = activeOffer?.priceGMD || 2500;
  const totalAmount = partPrice + deliveryFee;

  const handleConfirm = async () => {
    setIsSubmitting(true);

    if (paymentMethod === 'wave') {
      setSubmittingStep(`Pushing Wave 0% prompt to ${paymentPhone}...`);
      await new Promise((r) => setTimeout(r, 800));
      setSubmittingStep('Verifying 4-digit PIN authorization...');
      await new Promise((r) => setTimeout(r, 900));
    } else if (paymentMethod === 'qmoney' || paymentMethod === 'afrimoney') {
      setSubmittingStep(`Sending telecom wallet prompt to ${paymentPhone}...`);
      await new Promise((r) => setTimeout(r, 800));
    } else if (paymentMethod === 'bank_transfer') {
      setSubmittingStep('Logging GTBank / Trust Bank transfer voucher...');
      await new Promise((r) => setTimeout(r, 800));
    } else {
      setSubmittingStep('Securing reservation with Cash-on-Handover terms...');
      await new Promise((r) => setTimeout(r, 600));
    }

    try {
      const txRef =
        paymentMethod === 'wave'
          ? `WAVE-GM-${Math.floor(100000 + Math.random() * 900000)}`
          : paymentMethod === 'qmoney'
          ? `QM-GM-${Math.floor(100000 + Math.random() * 900000)}`
          : paymentMethod === 'afrimoney'
          ? `AFRI-GM-${Math.floor(100000 + Math.random() * 900000)}`
          : paymentMethod === 'bank_transfer'
          ? `BANK-${bankRef}`
          : `CASH-${Math.floor(100000 + Math.random() * 900000)}`;

      const order = marketplaceStore.selectOffer(activeRequest.id, activeOffer.id, {
        deliveryMethod: method,
        pickupTime: method === 'pickup' ? pickupTime : undefined,
        pickupLocation: method === 'pickup' ? activeOffer.dealerLocation : undefined,
        deliveryAddress: method === 'delivery' ? deliveryAddress : undefined,
        deliveryFeeGMD: deliveryFee,
        noteToDealer: note,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash_on_handover' ? 'cash_on_delivery' : 'paid',
        paymentPhone: paymentMethod !== 'cash_on_handover' ? paymentPhone : undefined,
        paymentTransactionRef: txRef,
      });

      setIsSubmitting(false);
      setConfirmedOrder(order);
    } catch {
      setIsSubmitting(false);
      onConfirmed();
    }
  };

  const partPhoto = getPartPhoto(activeOffer?.partName || 'Alternator', activeOffer?.image);

  if (confirmedOrder) {
    return (
      <div className="p-6 lg:p-8 space-y-6 max-w-3xl mx-auto animate-fadeIn">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
          <h2 className="text-2xl font-black text-emerald-950">
            {paymentMethod === 'cash_on_handover' ? 'Part Reserved Successfully!' : 'Payment Verified & Confirmed!'}
          </h2>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            {paymentMethod === 'cash_on_handover'
              ? `Your part is reserved with ${activeOffer.dealerName}. Pay D${totalAmount.toLocaleString()} GMD upon handover.`
              : `D${totalAmount.toLocaleString()} GMD transferred via ${paymentMethod.toUpperCase()} to ${activeOffer.dealerName}.`}
          </p>
        </div>

        {/* Digital Receipt */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Order Reference</span>
              <span className="text-lg font-black text-slate-900 font-mono">{confirmedOrder.id}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Transaction Reference</span>
              <span className="text-xs font-mono font-bold text-blue-600">{confirmedOrder.paymentTransactionRef}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Part</span>
              <p className="font-bold text-slate-800">{activeOffer.partName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Dealer</span>
              <p className="font-bold text-slate-800">{activeOffer.dealerName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Fulfillment</span>
              <p className="font-bold text-slate-800 capitalize">{method === 'pickup' ? 'Shop Pickup' : 'Express Delivery'}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total</span>
              <p className="font-black text-emerald-700 font-mono text-sm">D{totalAmount.toLocaleString()} GMD</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={onConfirmed}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              Back to Requests
            </button>

            {onTrackOrder ? (
              <button
                onClick={() => onTrackOrder(confirmedOrder.id)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Track Live Transit & Handover</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onConfirmed}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>View My Orders</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Responses</span>
      </button>

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Review Offer & Payment
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirm part specifications, choose pickup or delivery, and pay securely via Gambian local payment systems.
          </p>
        </div>

        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full self-start sm:self-auto flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          AutoSpares GM Escrow Active
        </span>
      </div>

      {/* 1. "Your chosen offer" Card matching Figma Page 6 */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Your chosen offer</h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center p-2 shrink-0 shadow-2xs">
              <img
                src={partPhoto}
                alt={activeOffer?.partName || 'Part'}
                className="max-h-20 max-w-full object-contain"
              />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-slate-900">{activeOffer?.partName}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="font-semibold text-slate-800">{activeOffer?.dealerName}</span>
                <span>·</span>
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 fill-current" /> Verified dealer
                </span>
              </p>

              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {activeOffer?.availabilityTiming || 'Available now'}
                </span>
                <span className="text-xs text-slate-500">
                  {activeRequest?.vehicleMake} {activeRequest?.vehicleModel} · {activeOffer?.condition}
                </span>
              </div>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-xs text-slate-400 block uppercase font-bold text-[10px]">Agreed Price</span>
            <span className="text-3xl font-black text-slate-900 font-mono">D{partPrice.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block">Gambian Dalasi</span>
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
            className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              method === 'pickup'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Pickup at Shop (Free)</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod('delivery')}
            className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              method === 'delivery'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Delivery (+D100 GMD)</span>
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
                  {activeOffer?.dealerLocation || 'Shop 18, Jeshwang Spare Parts Hub'}
                </p>
                <p className="text-slate-500 text-[11px]">Staff on site to test part fitment</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Opening hours</span>
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Mon–Sat · 8:00 AM–6:00 PM
                </p>
                <p className="text-slate-500 text-[11px]">Immediate handover on confirmation</p>
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

        {/* 3. GAMBIAN PAYMENT METHODS */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Payment Method
            </h3>
            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secured Handover
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setPaymentMethod('wave')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                paymentMethod === 'wave'
                  ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-[#0066f5] text-white flex items-center justify-center font-black text-xs">
                  W
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-full">
                  0% Fee
                </span>
              </div>
              <p className="font-extrabold text-xs text-slate-900 pt-1">Wave Money</p>
              <p className="text-[10px] text-slate-500">Instant USSD prompt</p>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('qmoney')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                paymentMethod === 'qmoney'
                  ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-600/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-[#e65100] text-white flex items-center justify-center font-black text-xs">
                  Q
                </span>
                <span className="text-[10px] font-mono text-slate-400">QCell</span>
              </div>
              <p className="font-extrabold text-xs text-slate-900 pt-1">QMoney</p>
              <p className="text-[10px] text-slate-500">QCell direct wallet</p>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('afrimoney')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                paymentMethod === 'afrimoney'
                  ? 'border-red-600 bg-red-50/60 ring-2 ring-red-600/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-[#b71c1c] text-white flex items-center justify-center font-black text-xs">
                  AF
                </span>
                <span className="text-[10px] font-mono text-slate-400">Africell</span>
              </div>
              <p className="font-extrabold text-xs text-slate-900 pt-1">Afrimoney</p>
              <p className="text-[10px] text-slate-500">Africell direct wallet</p>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('bank_transfer')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                paymentMethod === 'bank_transfer'
                  ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-indigo-700 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono text-slate-400">GTB/Trust</span>
              </div>
              <p className="font-extrabold text-xs text-slate-900 pt-1">Bank Transfer</p>
              <p className="text-[10px] text-slate-500">GTBank · Trust Bank GM</p>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cash_on_handover')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                paymentMethod === 'cash_on_handover'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Banknote className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                  Post-Test
                </span>
              </div>
              <p className="font-extrabold text-xs text-slate-900 pt-1">Cash on Pickup</p>
              <p className="text-[10px] text-slate-500">Pay after part testing</p>
            </button>
          </div>

          {paymentMethod !== 'cash_on_handover' && paymentMethod !== 'bank_transfer' && (
            <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/70 space-y-1.5 text-xs">
              <label className="font-bold text-slate-800 block">
                {paymentMethod === 'wave'
                  ? 'Wave Registered Phone Number'
                  : paymentMethod === 'qmoney'
                  ? 'QCell Phone Number'
                  : 'Africell Phone Number'}
              </label>
              <input
                type="text"
                value={paymentPhone}
                onChange={(e) => setPaymentPhone(e.target.value)}
                placeholder="+220 745 5010"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Note to dealer from Figma Page 6 */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700">Note to dealer (optional)</label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. I'll bring the old alternator to check the connector."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Summary Bar & Actions matching Figma Page 6 */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Total Amount Due ({paymentMethod.toUpperCase()})
            </span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              D{totalAmount.toLocaleString()} GMD
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 sm:flex-none px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-7 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>
                    {paymentMethod === 'cash_on_handover'
                      ? 'Reserve Part'
                      : `Pay D${totalAmount.toLocaleString()} GMD`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {isSubmitting && (
          <p className="text-xs text-blue-600 font-mono text-center animate-pulse">
            {submittingStep}
          </p>
        )}
      </div>
    </div>
  );
}
