import { useState } from 'react';
import { CheckCheck, MessageSquare, CheckCircle, FileText, Phone, Info } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';

interface DealerNotificationsPageProps {
  onOpenRequest: (reqId: string) => void;
  onOpenOrder: (orderId: string) => void;
}

export function DealerNotificationsPage({ onOpenRequest, onOpenOrder: _onOpenOrder }: DealerNotificationsPageProps) {
  const store = useStore();
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'requests' | 'messages'>('all');

  const notifications = store.notifications.filter((n) => {
    if (n.targetRole !== 'dealer') return false;
    if (filterTab === 'unread') return !n.read;
    if (filterTab === 'requests') return n.type === 'request' || n.type === 'offer' || n.type === 'reservation';
    if (filterTab === 'messages') return n.type === 'message';
    return true;
  });

  const unreadCount = store.notifications.filter((n) => n.targetRole === 'dealer' && !n.read).length;

  const handleMarkAllRead = () => {
    marketplaceStore.markAllNotificationsRead('dealer');
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header matching Figma Page 17 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Request updates, offer selections and messages from mechanics.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Tabs & Notification Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tabs Filter */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs w-fit">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ● All
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

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">Today</h3>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    !notif.read ? 'bg-blue-50/70 border-blue-200' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                      {notif.type === 'message' ? (
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      ) : notif.type === 'reservation' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-blue-600" />
                      )}
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
                      onClick={() => {
                        marketplaceStore.markNotificationRead(notif.id);
                        if (notif.relatedId) onOpenRequest(notif.relatedId);
                      }}
                      className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors shadow-2xs"
                    >
                      {notif.actionLabel || 'View request'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: "Upcoming handover" Panel matching Figma Page 17 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Upcoming handover</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Reserved
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-4">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Request</span>
                <p className="font-semibold text-slate-900">REQ-1042 · Alternator</p>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Mechanic</span>
                <p className="font-semibold text-slate-900">Kwame Mensah</p>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Pickup</span>
                <p className="font-semibold text-slate-900">Today · 2:00 PM</p>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Reservation expires</span>
                <p className="font-semibold text-slate-900">Today · 6:00 PM</p>
              </div>
            </div>

            <button
              onClick={() => alert('Contacting Kwame Mensah (+220 745 5010) on WhatsApp...')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Mechanic</span>
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 space-y-2 text-xs text-blue-900">
            <div className="flex items-center gap-2 font-bold text-blue-950">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Handover still pending</span>
            </div>
            <p className="text-blue-800/90 leading-relaxed">
              The part is reserved, not collected. Update the order status only after the mechanic inspects and receives it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
