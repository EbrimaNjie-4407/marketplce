import { useState } from 'react';
import { ArrowLeft, Send, XCircle, Info, Upload, Check } from 'lucide-react';
import { marketplaceStore } from '../../services/store';
import { PartRequest } from '../../types';
import { VoiceNotePlayer } from '../common/VoiceNotePlayer';
import alternatorImg from '../../assets/images/alternator_assembly_1791849520193.jpg';

interface DealerRespondPageProps {
  request?: PartRequest;
  onBack: () => void;
  onOfferSent: (offerId: string) => void;
}

export function DealerRespondPage({ request, onBack, onOfferSent }: DealerRespondPageProps) {
  const activeReq = request || marketplaceStore.getState().requests[0];

  const [availabilityMode, setAvailabilityMode] = useState<'available' | 'unavailable'>('available');
  const [priceGMD, setPriceGMD] = useState('2500');
  const [quantity, setQuantity] = useState('2');
  const [condition, setCondition] = useState('Used · tested');
  const [availableFrom, setAvailableFrom] = useState('Available now');
  const [partLocation, setPartLocation] = useState('Shop 18, Jeshwang Spare Parts Hub, Serekunda');
  const [notes, setNotes] = useState('90A alternator. Tested and ready for pickup. Connector matches 27060-0T140.');
  const [unavailableReason, setUnavailableReason] = useState('No matching alternator currently in stock.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendAvailable = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const offer = marketplaceStore.submitOffer({
      requestId: activeReq.id,
      dealerId: 'dealer_burgi',
      isAvailable: true,
      priceGMD: parseFloat(priceGMD) || 2500,
      quantity: parseInt(quantity, 10) || 1,
      condition,
      timing: availableFrom,
      location: partLocation,
      notes,
      image: alternatorImg,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onOfferSent(offer.id);
    }, 400);
  };

  const handleSendUnavailable = () => {
    setIsSubmitting(true);
    const offer = marketplaceStore.submitOffer({
      requestId: activeReq.id,
      dealerId: 'dealer_burgi',
      isAvailable: false,
      unavailableReason,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onOfferSent(offer.id);
    }, 400);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header matching Figma Page 14 */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Request</span>
        </button>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          Respond to request
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {activeReq.id} · {activeReq.partName} · {activeReq.vehicleMake} {activeReq.vehicleModel} {activeReq.vehicleYear} · {activeReq.mechanicName}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Your stock availability Form matching Figma Page 14 */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Your stock availability</h2>

            {/* Availability Radio Toggle */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAvailabilityMode('available')}
                className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  availabilityMode === 'available'
                    ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${availabilityMode === 'available' ? 'border-blue-600 bg-blue-600' : 'border-slate-400'}`} />
                <span>● Available</span>
              </button>

              <button
                type="button"
                onClick={() => setAvailabilityMode('unavailable')}
                className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  availabilityMode === 'unavailable'
                    ? 'bg-red-50 border-red-600 text-red-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${availabilityMode === 'unavailable' ? 'border-red-600 bg-red-600' : 'border-slate-400'}`} />
                <span>○ Unavailable</span>
              </button>
            </div>
          </div>

          {availabilityMode === 'available' ? (
            <form onSubmit={handleSendAvailable} className="space-y-6 pt-2">
              <p className="text-xs text-blue-700 font-semibold bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                Available selected · Complete your offer below.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Price (GMD) *</label>
                  <input
                    type="number"
                    required
                    value={priceGMD}
                    onChange={(e) => setPriceGMD(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Quantity *</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Condition *</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Used · tested">Used · tested</option>
                    <option value="New">Brand New OEM</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Available from *</label>
                  <select
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Available now">Available now</option>
                    <option value="Today in 1 hour">Today in 1 hour</option>
                    <option value="Tomorrow 9:00 AM">Tomorrow 9:00 AM</option>
                    <option value="Custom order 2-3 days">Custom order 2-3 days</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Part location *</label>
                <input
                  type="text"
                  required
                  value={partLocation}
                  onChange={(e) => setPartLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Attached Photo row matching Figma Page 14 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={alternatorImg} alt="Alternator" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">alternator-reference.jpg</span>
                    <span className="text-[10px] text-slate-400">1.8 MB · Photo attached</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert('Photo updated from store inventory.')}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                >
                  Replace
                </button>
              </div>

              {/* Notes to mechanic */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Notes to mechanic</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Available Response'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* If the part is unavailable view matching Figma Page 14 */
            <div className="space-y-6 pt-2">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <span className="font-bold block">Unavailable response</span>
                <p className="leading-relaxed">
                  Use this response instead of a price offer when you don't have a matching part. The mechanic sees "Unavailable", not an offer to select.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Reason (optional)</label>
                <textarea
                  rows={3}
                  value={unavailableReason}
                  onChange={(e) => setUnavailableReason(e.target.value)}
                  placeholder="No matching alternator currently in stock."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <p className="text-[11px] text-slate-400">
                Price, quantity, condition and photo are not required for an unavailable response.
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSendUnavailable}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-slate-800 hover:bg-black text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Unavailable Response'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Request at a glance panel matching Figma Page 14 */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900">Request at a glance</h3>

          <div className="space-y-4 text-xs text-slate-700 border-t border-slate-100 pt-4">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Part</span>
              <p className="font-semibold text-slate-900">{activeReq.partName}</p>
            </div>

            <div className="space-y-0.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Vehicle</span>
              <p className="font-semibold text-slate-900">
                {activeReq.vehicleMake} {activeReq.vehicleModel} · {activeReq.vehicleYear} · {activeReq.vehicleEngine || '1.8L'}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Number</span>
              <p className="font-mono text-slate-900">{activeReq.partNumber || '27060-0T140'}</p>
            </div>

            <div className="space-y-0.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Condition requested</span>
              <p className="text-slate-800">{activeReq.preferredCondition}</p>
            </div>

            <div className="space-y-0.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Location</span>
              <p className="text-slate-800">{activeReq.mechanicLocation} · 2.1 km</p>
            </div>

            {/* Playable Voice Note */}
            {activeReq.voiceNote && (
              <div className="pt-2 border-t border-slate-100">
                <VoiceNotePlayer
                  voiceNote={activeReq.voiceNote}
                  variant="compact"
                  title="Mechanic Audio Spec"
                  senderName={activeReq.mechanicName}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
