import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  Store,
  Layers,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import { PartRequest, DealerOffer } from '../../types';
import { useStore } from '../../hooks/useStore';
import { VoiceNotePlayer } from '../common/VoiceNotePlayer';
import alternatorImg from '../../assets/images/alternator_assembly_1791849520193.jpg';
import { OfferReviewAndPaymentModal } from './OfferReviewAndPaymentModal';

interface MechanicRequestDetailModalProps {
  request: PartRequest;
  onClose: () => void;
  onSelectOffer?: (offer: DealerOffer) => void;
  onTrackOrder?: (orderId: string) => void;
}

export function MechanicRequestDetailModal({
  request,
  onClose,
  onSelectOffer,
  onTrackOrder,
}: MechanicRequestDetailModalProps) {
  const store = useStore();
  const [selectedOfferForPayment, setSelectedOfferForPayment] = useState<DealerOffer | null>(null);

  // Find offers matching this request
  const offers = store.offers.filter((off) => off.requestId === request.id);

  const getStatusBadge = (status: PartRequest['status']) => {
    switch (status) {
      case 'Responses received':
        return (
          <span className="text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold">
            Responses received
          </span>
        );
      case 'Waiting for dealers':
        return (
          <span className="text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
            Waiting for dealers
          </span>
        );
      case 'Reserved':
        return (
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
            Reserved
          </span>
        );
      case 'Collected':
      case 'Delivered':
        return (
          <span className="text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full text-xs font-bold">
            {status}
          </span>
        );
      default:
        return (
          <span className="text-slate-600 bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8 animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                {request.id}
              </span>
              <h2 className="text-2xl font-black text-slate-900">{request.partName}</h2>
              {getStatusBadge(request.status)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Created {request.createdAt} · Broadcast to {request.targetDealersCount || 8} licensed dealers in Greater Banjul
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle & Request Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Vehicle Make
            </span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{request.vehicleMake}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Model & Year
            </span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">
              {request.vehicleModel} · {request.vehicleYear}
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              OEM Part Number
            </span>
            <p className="font-mono font-bold text-blue-700 text-sm mt-0.5">
              {request.partNumber || 'N/A'}
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Preferred Condition
            </span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{request.preferredCondition}</p>
          </div>
        </div>

        {/* Custom Audio Player UI for Voice Notes */}
        {request.voiceNote ? (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>Attached Audio Note</span>
              <span className="text-blue-600 font-normal">({request.voiceNote.durationSeconds}s)</span>
            </h3>

            <VoiceNotePlayer
              voiceNote={request.voiceNote}
              title={`Mechanic Recording · ${request.partName}`}
              senderName={request.mechanicName || 'Kwame Mensah'}
              senderRole="Mechanic"
            />
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 flex items-center justify-between">
            <span>No voice recording attached to this part request.</span>
            <span className="text-[11px] text-slate-400">Text-only submission</span>
          </div>
        )}

        {/* Reference Image & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
          {request.image && (
            <div className="sm:col-span-4 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Reference Photo
              </span>
              <div className="h-32 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center p-2 overflow-hidden">
                <img
                  src={request.image}
                  alt={request.partName}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          )}

          <div className={`${request.image ? 'sm:col-span-8' : 'sm:col-span-12'} space-y-1.5`}>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Mechanic's Diagnostic & Fitment Notes
            </span>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed min-h-[5rem]">
              {request.notes || 'No extra notes provided.'}
            </div>
          </div>
        </div>

        {/* Dealer Offers Received Section */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Dealer Offers ({offers.length})
            </h3>
            {request.orderId && onTrackOrder && (
              <button
                onClick={() => {
                  onClose();
                  onTrackOrder(request.orderId!);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center gap-1.5 border border-emerald-200"
              >
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Track Live Delivery ({request.orderId}) →</span>
              </button>
            )}
          </div>

          {offers.length > 0 ? (
            <div className="space-y-2.5">
              {offers.map((off) => (
                <div
                  key={off.id}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{off.dealerName}</span>
                      {off.dealerVerified && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 fill-current" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {off.location} · {off.condition} · {off.availabilityTiming}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-base font-black text-slate-900 font-mono">
                        D{off.priceGMD.toLocaleString()} GMD
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedOfferForPayment(off)}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Review & Pay</span>
                      </button>

                      {onSelectOffer && (
                        <button
                          onClick={() => {
                            onClose();
                            onSelectOffer(off);
                          }}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                          title="Configure pickup details"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
              Awaiting offers from dealers. Licensed dealers in Jeshwang and Banjul have been notified.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Review & Pay Modal overlay */}
      {selectedOfferForPayment && (
        <OfferReviewAndPaymentModal
          request={request}
          offer={selectedOfferForPayment}
          onClose={() => setSelectedOfferForPayment(null)}
          onSuccess={(_order) => {
            // Completed
          }}
          onTrackOrder={(orderId) => {
            setSelectedOfferForPayment(null);
            onClose();
            if (onTrackOrder) onTrackOrder(orderId);
          }}
        />
      )}
    </div>
  );
}
