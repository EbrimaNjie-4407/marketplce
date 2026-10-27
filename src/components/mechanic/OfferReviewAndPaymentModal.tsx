import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Store,
  Truck,
  CreditCard,
  Phone,
  Clock,
  MapPin,
  Check,
  ArrowRight,
  ExternalLink,
  Receipt,
  FileCheck,
  Sparkles,
  Smartphone,
  Building2,
  Banknote,
  AlertCircle,
} from 'lucide-react';
import { DealerOffer, PartRequest, Order } from '../../types';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';
import { getPartPhoto } from '../../data/partsCatalog';

interface OfferReviewAndPaymentModalProps {
  request: PartRequest;
  offer: DealerOffer;
  onClose: () => void;
  onSuccess: (order: Order) => void;
  onTrackOrder?: (orderId: string) => void;
}

export function OfferReviewAndPaymentModal({
  request,
  offer,
  onClose,
  onSuccess,
  onTrackOrder,
}: OfferReviewAndPaymentModalProps) {
  const store = useStore();

  // Handover Method
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [pickupTime, setPickupTime] = useState('Today · 2:30 PM');
  const [deliveryAddress, setDeliveryAddress] = useState(
    request.mechanicLocation || 'Mensah Auto Works, Westfield Junction, Serrekunda'
  );
  const [noteToDealer, setNoteToDealer] = useState(
    'I will inspect the fitment and connector on arrival.'
  );

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<
    'wave' | 'qmoney' | 'afrimoney' | 'bank_transfer' | 'cash_on_handover'
  >('wave');
  const [paymentPhone, setPaymentPhone] = useState(
    store.currentUser?.phone || '+220 745 5010'
  );
  const [bankRef, setBankRef] = useState(`TX-${Math.floor(100000 + Math.random() * 900000)}`);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Amounts
  const deliveryFee = deliveryMethod === 'delivery' ? 100 : 0;
  const totalAmount = offer.priceGMD + deliveryFee;

  // Handle Payment Execution
  const handleExecutePayment = async () => {
    setIsProcessing(true);

    if (paymentMethod === 'wave') {
      setProcessingStep(`Sending Wave 0% prompt to ${paymentPhone}...`);
      await new Promise((r) => setTimeout(r, 900));
      setProcessingStep('Awaiting 4-digit PIN confirmation on mobile device...');
      await new Promise((r) => setTimeout(r, 1100));
      setProcessingStep('✓ Wave Payment Approved & Authorized!');
      await new Promise((r) => setTimeout(r, 600));
    } else if (paymentMethod === 'qmoney' || paymentMethod === 'afrimoney') {
      setProcessingStep(`Initiating USSD mobile wallet prompt to ${paymentPhone}...`);
      await new Promise((r) => setTimeout(r, 1000));
      setProcessingStep('Validating local telecom gateway...');
      await new Promise((r) => setTimeout(r, 800));
      setProcessingStep('✓ Payment Successful!');
      await new Promise((r) => setTimeout(r, 500));
    } else if (paymentMethod === 'bank_transfer') {
      setProcessingStep('Verifying GTBank / Trust Bank transfer voucher...');
      await new Promise((r) => setTimeout(r, 1100));
      setProcessingStep('✓ Bank Transfer Logged & Confirmed!');
      await new Promise((r) => setTimeout(r, 500));
    } else {
      setProcessingStep('Reserving part with Cash-on-Handover terms...');
      await new Promise((r) => setTimeout(r, 700));
      setProcessingStep('✓ Reservation Confirmed!');
      await new Promise((r) => setTimeout(r, 400));
    }

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

    const order = marketplaceStore.selectOffer(request.id, offer.id, {
      deliveryMethod,
      pickupTime: deliveryMethod === 'pickup' ? pickupTime : undefined,
      pickupLocation: deliveryMethod === 'pickup' ? offer.dealerLocation : undefined,
      deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
      deliveryFeeGMD: deliveryFee,
      noteToDealer,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash_on_handover' ? 'cash_on_delivery' : 'paid',
      paymentPhone: paymentMethod !== 'cash_on_handover' ? paymentPhone : undefined,
      paymentTransactionRef: txRef,
    });

    setIsProcessing(false);
    setCompletedOrder(order);
    onSuccess(order);
  };

  const partPhoto = getPartPhoto(offer.partName, offer.image);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto animate-scaleUp">
        {/* Top Header */}
        <div className="bg-slate-900 px-6 py-4.5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  {completedOrder ? 'Payment Receipt & Order Confirmation' : 'Review Offer & Checkout'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/20">
                  {request.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {offer.dealerName} · {offer.dealerLocation.split(',')[0]}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* SUCCESS RECEIPT STATE */}
          {completedOrder ? (
            <div className="space-y-6 py-2 animate-fadeIn">
              {/* Celebration Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-black text-emerald-950">
                  {paymentMethod === 'cash_on_handover'
                    ? 'Part Reserved Successfully!'
                    : 'Payment Confirmed & Verified!'}
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  {paymentMethod === 'cash_on_handover'
                    ? `Your part has been reserved at ${offer.dealerName}. Pay D${totalAmount.toLocaleString()} GMD upon handover.`
                    : `Your payment of D${totalAmount.toLocaleString()} GMD has been processed via ${
                        paymentMethod.toUpperCase()
                      } and credited to ${offer.dealerName}.`}
                </p>
              </div>

              {/* Digital Receipt Card */}
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Order Reference
                    </span>
                    <span className="text-base font-black text-slate-900 font-mono">
                      {completedOrder.id}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Transaction Reference
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-600">
                      {completedOrder.paymentTransactionRef}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Part</span>
                    <p className="font-bold text-slate-800">{offer.partName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Vehicle</span>
                    <p className="font-bold text-slate-800">
                      {request.vehicleMake} {request.vehicleModel}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Fulfillment</span>
                    <p className="font-bold text-slate-800 capitalize">
                      {deliveryMethod === 'pickup' ? 'Shop Pickup' : 'Dispatch Delivery'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Paid</span>
                    <p className="font-black text-emerald-700 font-mono text-sm">
                      D{totalAmount.toLocaleString()} GMD
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-700">
                      30-Day AutoSpares GM Testing Guarantee Active
                    </span>
                  </div>
                  <span className="font-mono text-slate-500 font-bold">Verified Deal</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  Done
                </button>

                {onTrackOrder && (
                  <button
                    onClick={() => {
                      onClose();
                      onTrackOrder(completedOrder.id);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Track Live Delivery ({completedOrder.id})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* 1. OFFER REVIEW CARD */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-center p-2 shrink-0 shadow-2xs">
                      <img
                        src={partPhoto}
                        alt={offer.partName}
                        className="max-h-16 max-w-full object-contain"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-slate-900">
                          {offer.partName}
                        </h4>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {offer.availabilityTiming || 'Ready Now'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">
                        Compatible with: <strong className="text-slate-800">{request.vehicleMake} {request.vehicleModel} ({request.vehicleYear})</strong>
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>Condition: <strong className="text-slate-700">{offer.condition}</strong></span>
                        <span>·</span>
                        <span>Qty: <strong className="text-slate-700">{offer.quantityAvailable || 1} units</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Dealer Quote
                    </span>
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      D{offer.priceGMD.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Gambian Dalasi</span>
                  </div>
                </div>

                {/* Dealer Info Bar */}
                <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">
                      BS
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">{offer.dealerName}</span>
                      <span className="text-slate-400 ml-1.5 font-mono text-[11px]">
                        ({offer.dealerLocation.split(',')[0]})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {offer.dealerPhone}
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 fill-current" />
                      Verified Merchant
                    </span>
                  </div>
                </div>

                {offer.notes && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200/70 text-xs text-slate-600">
                    <strong className="text-slate-700">Dealer Note:</strong> {offer.notes}
                  </div>
                )}
              </div>

              {/* 2. HANDOVER FULFILLMENT SELECTOR */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                  1. Choose Collection or Delivery
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                      deliveryMethod === 'pickup'
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        deliveryMethod === 'pickup'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Store className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900">
                          Pickup at Dealer Shop
                        </span>
                        <span className="text-xs font-bold text-emerald-700 font-mono">FREE</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {offer.dealerLocation} · Inspect and test immediately.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                      deliveryMethod === 'delivery'
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        deliveryMethod === 'delivery'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900">
                          Dispatch to Workshop
                        </span>
                        <span className="text-xs font-bold text-blue-700 font-mono">+D100 GMD</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Local motorcycle courier delivery in Greater Banjul.
                      </p>
                    </div>
                  </button>
                </div>

                {deliveryMethod === 'delivery' && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      Destination Workshop Address
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. Mensah Auto Works, Sayerr Jobe Ave, Westfield"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* 3. GAMBIAN PAYMENT SYSTEM SELECTOR */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                    2. Select Payment Method
                  </label>
                  <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Secured Escrow & Guarantee
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {/* Wave Mobile Money */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wave')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1 relative ${
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
                    <p className="text-[10px] text-slate-500">Instant Gambian QR / USSD</p>
                  </button>

                  {/* QMoney QCell */}
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
                    <p className="text-[10px] text-slate-500">Direct mobile wallet</p>
                  </button>

                  {/* Afrimoney */}
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
                    <p className="text-[10px] text-slate-500">Africell Wallet</p>
                  </button>

                  {/* Bank Transfer */}
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

                  {/* Cash on Handover */}
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
                        Upon Test
                      </span>
                    </div>
                    <p className="font-extrabold text-xs text-slate-900 pt-1">Cash on Pickup</p>
                    <p className="text-[10px] text-slate-500">Pay after part inspection</p>
                  </button>
                </div>

                {/* Method Input Details */}
                {paymentMethod !== 'cash_on_handover' && paymentMethod !== 'bank_transfer' && (
                  <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/70 space-y-2 text-xs">
                    <label className="font-bold text-slate-800 block">
                      {paymentMethod === 'wave'
                        ? 'Wave Registered Phone Number'
                        : paymentMethod === 'qmoney'
                        ? 'QCell Phone Number'
                        : 'Africell Phone Number'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        placeholder="+220 745 5010"
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="px-3 py-2 rounded-xl bg-blue-100 text-blue-900 font-bold text-[11px] shrink-0">
                        Prompt to Phone
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      An instant USSD verification prompt will be sent to your device to authorize D{totalAmount.toLocaleString()} GMD.
                    </p>
                  </div>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-mono">
                      <span><strong>Trust Bank GM:</strong> 002-984102-01</span>
                      <span className="text-slate-500">AutoSpares Escrow</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <label className="text-[11px] text-slate-600 shrink-0">Payment Reference:</label>
                      <input
                        type="text"
                        value={bankRef}
                        onChange={(e) => setBankRef(e.target.value)}
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-mono text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. TOTAL SUMMARY & EXECUTION */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
                  <span>Part Price:</span>
                  <span className="font-mono font-bold text-white">
                    D{offer.priceGMD.toLocaleString()} GMD
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
                  <span>Fulfillment ({deliveryMethod === 'pickup' ? 'Shop Pickup' : 'Courier Dispatch'}):</span>
                  <span className="font-mono font-bold text-white">
                    {deliveryFee > 0 ? `+D${deliveryFee} GMD` : 'FREE (D0)'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Total Due ({paymentMethod.toUpperCase()})
                    </span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      D{totalAmount.toLocaleString()} GMD
                    </span>
                  </div>

                  <button
                    onClick={handleExecutePayment}
                    disabled={isProcessing}
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 text-xs font-black transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {paymentMethod === 'cash_on_handover'
                            ? 'Confirm & Reserve Part'
                            : `Pay D${totalAmount.toLocaleString()} GMD`}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {isProcessing && (
                  <p className="text-[11px] text-amber-300 font-mono text-center animate-pulse pt-1">
                    {processingStep}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
