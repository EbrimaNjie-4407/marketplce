import { useState } from 'react';
import { CheckCheck, MessageSquare, CheckCircle, FileText, Bell, CreditCard, ChevronRight } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';
import { PartRequest, DealerOffer, Order } from '../../types';
import { OfferReviewAndPaymentModal } from './OfferReviewAndPaymentModal';

interface MechanicNotificationsPageProps {
  onNavigate: (view: string) => void;
  onOpenRequest: (reqId: string) => void;
  onTrackOrder?: (orderId: string) => void;
}

export function MechanicNotificationsPage({
  onNavigate,
  onOpenRequest,
  onTrackOrder,
}: MechanicNotificationsPageProps) {
  const store = useStore();
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'requests' | 'messages'>('all');
  const [reviewOfferTarget, setReviewOfferTarget] = useState<{
    request: PartRequest;
    offer: DealerOffer;
  } | null>(null);

  const notifications = store.notifications.filter((n) => {
    if (n.targetRole !== 'mechanic') return false;
    if (filterTab === 'unread') return !n.read;
    if (filterTab === 'requests') return n.type === 'request' || n.type === 'offer' || n.type === 'reservation';
    if (filterTab === 'messages') return n.type === 'message';
    return true;
  });

  const unreadCount = store.notifications.filter((n) => n.targetRole === 'mechanic' && !n.read).length;

  const handleMarkAllRead = () => {
    marketplaceStore.markAllNotificationsRead('mechanic');
  };

  const handleActionClick = (notif: any) => {
    marketplaceStore.markNotificationRead(notif.id);

    // If it's an offer notification or "View offer" action, open the Offer Review & Payment flow
    if (notif.type === 'offer' || notif.actionLabel === 'View offer' || notif.actionView === 'responses_compare') {
      const req = store.requests.find((r) => r.id === notif.relatedId) || store.requests[0];
      const off = store.offers.find((o) => o.requestId === req.id) || store.offers[0];
      if (req && off) {
        setReviewOfferTarget({ request: req, offer: off });
        return;
      }
    }

    if (notif.actionView === 'responses_compare') {
      onNavigate('dealers');
    } else if (notif.relatedId) {
      onOpenRequest(notif.relatedId);
    } else {
      onNavigate('requests');
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'reservation':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'offer':
        return <CheckCheck className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header matching Figma Page 9 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Updates from your requests and local dealers.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Tabs Filter from Figma Page 9 */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs w-fit">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ● All notifications
        </button>
        <button
          onClick={() => setFilterTab('unread')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterTab === 'unread' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ○ Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilterTab('requests')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterTab === 'requests' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ○ Requests
        </button>
        <button
          onClick={() => setFilterTab('messages')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterTab === 'messages' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ○ Messages
        </button>
      </div>

      {/* Section "Today" */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-wide">Today</h3>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No notifications in this category.
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !notif.read
                    ? 'bg-blue-50/70 border-blue-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                    {getNotifIcon(notif.type)}
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                    <p className="text-xs text-slate-600">{notif.description}</p>
                    <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-400">
                      <span>{notif.timestamp}</span>
                      {!notif.read && (
                        <>
                          <span>·</span>
                          <span className="text-blue-600 font-semibold">Unread</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleActionClick(notif)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer ${
                      notif.type === 'offer' || notif.actionLabel === 'View offer'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 active:scale-95'
                        : 'bg-white hover:bg-slate-50 border border-slate-300 text-slate-800'
                    }`}
                  >
                    {notif.type === 'offer' || notif.actionLabel === 'View offer' ? (
                      <>
                        <CreditCard className="w-3.5 h-3.5 text-blue-200" />
                        <span>View Offer & Pay</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <span>{notif.actionLabel || 'View status'}</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Offer Review & Payment Modal */}
      {reviewOfferTarget && (
        <OfferReviewAndPaymentModal
          request={reviewOfferTarget.request}
          offer={reviewOfferTarget.offer}
          onClose={() => setReviewOfferTarget(null)}
          onSuccess={(_order) => {
            // Keep modal open to show official receipt or let user navigate to tracking
          }}
          onTrackOrder={(orderId) => {
            setReviewOfferTarget(null);
            if (onTrackOrder) {
              onTrackOrder(orderId);
            } else {
              onNavigate('deliveries');
            }
          }}
        />
      )}
    </div>
  );
}
