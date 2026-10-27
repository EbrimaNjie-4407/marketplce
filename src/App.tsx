import { useState } from 'react';
import { useStore } from './hooks/useStore';
import { marketplaceStore } from './services/store';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';

// Landing & Role selection
import { LandingPage } from './components/landing/LandingPage';
import { ChooseRolePage } from './components/landing/ChooseRolePage';

// Mechanic views
import { MechanicDealersPage } from './components/mechanic/MechanicDealersPage';
import { DealerInventoryBrowsePage } from './components/mechanic/DealerInventoryBrowsePage';
import { DealerShopAndOfferView } from './components/mechanic/DealerShopAndOfferView';
import { OfferCheckoutPickupPage } from './components/mechanic/OfferCheckoutPickupPage';
import { CreatePartRequestView } from './components/mechanic/CreatePartRequestView';
import { MechanicRequestsPage } from './components/mechanic/MechanicRequestsPage';
import { MechanicNotificationsPage } from './components/mechanic/MechanicNotificationsPage';
import { BrowseAllPartsPage } from './components/mechanic/BrowseAllPartsPage';

// Dealer views
import { DealerDashboardPage } from './components/dealer/DealerDashboardPage';
import { DealerInventoryPage } from './components/dealer/DealerInventoryPage';
import { DealerAddPartPage } from './components/dealer/DealerAddPartPage';
import { DealerRequestDetailPage } from './components/dealer/DealerRequestDetailPage';
import { DealerRespondPage } from './components/dealer/DealerRespondPage';
import { DealerResponseSentPage } from './components/dealer/DealerResponseSentPage';
import { DealerProfilePage } from './components/dealer/DealerProfilePage';
import { DealerNotificationsPage } from './components/dealer/DealerNotificationsPage';

// Admin views
import { AdminOverviewPage } from './components/admin/AdminOverviewPage';
import { AdminDealerVerificationPage } from './components/admin/AdminDealerVerificationPage';
import { AdminUsersPage } from './components/admin/AdminUsersPage';
import { AdminRequestsPage } from './components/admin/AdminRequestsPage';
import { AdminListingsPage } from './components/admin/AdminListingsPage';

// Deliveries & Handover
import { DeliveriesView } from './components/common/DeliveriesView';

// Delivery Rider Views
import { DeliveryDashboardPage } from './components/delivery/DeliveryDashboardPage';
import { DeliveryRequestsPage } from './components/delivery/DeliveryRequestsPage';
import { DeliveryActiveJobsPage } from './components/delivery/DeliveryActiveJobsPage';
import { DeliveryEarningsPage } from './components/delivery/DeliveryEarningsPage';
import { DeliveryProfilePage } from './components/delivery/DeliveryProfilePage';

import { DealerProfile, InventoryItem, PartRequest, UserRole } from './types';

export default function App() {
  const store = useStore();
  const [currentView, setCurrentView] = useState<string>('dealers');
  const [selectedDealer, setSelectedDealer] = useState<DealerProfile>(store.dealers[0]);
  const [selectedPart, setSelectedPart] = useState<InventoryItem>(store.inventory[0]);
  const [selectedRequest, setSelectedRequest] = useState<PartRequest>(store.requests[0]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [editInventoryItem, setEditInventoryItem] = useState<InventoryItem | null>(null);

  const handleSelectRole = (role: UserRole) => {
    marketplaceStore.setRole(role);
    if (role === 'mechanic') setCurrentView('dealers');
    if (role === 'dealer') setCurrentView('dealer_dashboard');
    if (role === 'admin') setCurrentView('admin_dashboard');
    if (role === 'delivery_rider') setCurrentView('delivery_dashboard');
  };

  const isFullLayoutView = currentView !== 'landing' && currentView !== 'choose_role';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* If Landing or Role selector, render stand-alone full page */}
      {currentView === 'landing' && (
        <LandingPage
          onNavigate={(view) => setCurrentView(view)}
          onSelectRole={(role) => handleSelectRole(role)}
        />
      )}

      {currentView === 'choose_role' && (
        <ChooseRolePage
          onSelectRole={(role) => handleSelectRole(role)}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {/* Main Workspace Layout with Header + Sidebar */}
      {isFullLayoutView && (
        <>
          <Header
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
          />

          <div className="flex flex-1">
            <Sidebar
              currentView={currentView}
              onNavigate={(view) => setCurrentView(view)}
            />

            <main className="flex-1 overflow-y-auto">
              {/* --- Mechanic Views (Figma Pages 3 - 9) --- */}
              {currentView === 'dealers' && (
                <MechanicDealersPage
                  onSelectDealer={(dealer) => {
                    setSelectedDealer(dealer);
                    setCurrentView('dealer_browse');
                  }}
                  onSelectPart={(item) => {
                    setSelectedPart(item);
                    const dealer = store.dealers.find((d) => d.id === item.dealerId);
                    if (dealer) setSelectedDealer(dealer);
                    setCurrentView('dealer_offer_detail');
                  }}
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'dealer_browse' && (
                <DealerInventoryBrowsePage
                  dealer={selectedDealer}
                  onBackToDealers={() => setCurrentView('dealers')}
                  onSelectPart={(item) => {
                    setSelectedPart(item);
                    setCurrentView('dealer_offer_detail');
                  }}
                />
              )}

              {currentView === 'dealer_offer_detail' && (
                <DealerShopAndOfferView
                  dealer={selectedDealer}
                  part={selectedPart}
                  onBack={() => setCurrentView('dealer_browse')}
                  onSelectOffer={() => setCurrentView('checkout_pickup')}
                />
              )}

              {currentView === 'checkout_pickup' && (
                <OfferCheckoutPickupPage
                  requestId={selectedRequest?.id || 'REQ-1042'}
                  offerId={selectedRequest?.selectedOfferId || 'off_burgi_1042'}
                  onBack={() => setCurrentView('dealer_offer_detail')}
                  onConfirmed={() => setCurrentView('requests')}
                  onTrackOrder={(orderId) => {
                    setSelectedOrderId(orderId);
                    setCurrentView('deliveries');
                  }}
                />
              )}

              {currentView === 'create_request' && (
                <CreatePartRequestView
                  onBack={() => setCurrentView('requests')}
                  onRequestSubmitted={() => setCurrentView('requests')}
                />
              )}

              {currentView === 'requests' && (
                <MechanicRequestsPage
                  onCreateRequest={() => setCurrentView('create_request')}
                  onViewRequestDetail={(req) => {
                    setSelectedRequest(req);
                    setCurrentView('dealer_offer_detail');
                  }}
                  onTrackOrder={(orderId) => {
                    if (orderId) setSelectedOrderId(orderId);
                    setCurrentView('deliveries');
                  }}
                />
              )}

              {currentView === 'notifications' && (
                <MechanicNotificationsPage
                  onNavigate={(view) => setCurrentView(view)}
                  onOpenRequest={(reqId) => {
                    const req = store.requests.find((r) => r.id === reqId);
                    if (req) setSelectedRequest(req);
                    setCurrentView('dealer_offer_detail');
                  }}
                  onTrackOrder={(orderId) => {
                    setSelectedOrderId(orderId);
                    setCurrentView('deliveries');
                  }}
                />
              )}

              {currentView === 'browse_all_parts' && (
                <BrowseAllPartsPage
                  onSelectPart={(item) => {
                    setSelectedPart(item);
                    const dealer = store.dealers.find((d) => d.id === item.dealerId);
                    if (dealer) setSelectedDealer(dealer);
                    setCurrentView('dealer_offer_detail');
                  }}
                  onNavigateToDealer={(dealerId) => {
                    const dealer = store.dealers.find((d) => d.id === dealerId);
                    if (dealer) setSelectedDealer(dealer);
                    setCurrentView('dealer_browse');
                  }}
                />
              )}

              {/* --- Dealer Views (Figma Pages 10 - 17) --- */}
              {currentView === 'dealer_dashboard' && (
                <DealerDashboardPage
                  onAddPart={() => {
                    setEditInventoryItem(null);
                    setCurrentView('dealer_add_part');
                  }}
                  onRespondRequest={(req) => {
                    setSelectedRequest(req);
                    setCurrentView('dealer_respond');
                  }}
                  onViewRequestDetail={(req) => {
                    setSelectedRequest(req);
                    setCurrentView('dealer_request_detail');
                  }}
                  onManageProfile={() => setCurrentView('dealer_profile')}
                />
              )}

              {currentView === 'dealer_inventory' && (
                <DealerInventoryPage
                  onAddPart={() => {
                    setEditInventoryItem(null);
                    setCurrentView('dealer_add_part');
                  }}
                  onEditPart={(item) => {
                    setEditInventoryItem(item);
                    setCurrentView('dealer_add_part');
                  }}
                />
              )}

              {currentView === 'dealer_add_part' && (
                <DealerAddPartPage
                  editItem={editInventoryItem}
                  onBack={() => setCurrentView('dealer_inventory')}
                  onSaved={() => setCurrentView('dealer_inventory')}
                />
              )}

              {currentView === 'dealer_request_detail' && (
                <DealerRequestDetailPage
                  request={selectedRequest}
                  onBack={() => setCurrentView('dealer_dashboard')}
                  onOpenRespond={(req) => {
                    setSelectedRequest(req);
                    setCurrentView('dealer_respond');
                  }}
                />
              )}

              {currentView === 'dealer_respond' && (
                <DealerRespondPage
                  request={selectedRequest}
                  onBack={() => setCurrentView('dealer_dashboard')}
                  onOfferSent={() => setCurrentView('dealer_response_sent')}
                />
              )}

              {currentView === 'dealer_response_sent' && (
                <DealerResponseSentPage
                  onBackToDashboard={() => setCurrentView('dealer_dashboard')}
                  onViewResponse={() => setCurrentView('dealer_requests')}
                />
              )}

              {currentView === 'dealer_profile' && <DealerProfilePage />}

              {currentView === 'dealer_notifications' && (
                <DealerNotificationsPage
                  onOpenRequest={(reqId) => {
                    const req = store.requests.find((r) => r.id === reqId);
                    if (req) setSelectedRequest(req);
                    setCurrentView('dealer_request_detail');
                  }}
                  onOpenOrder={() => setCurrentView('dealer_deliveries')}
                />
              )}

              {currentView === 'dealer_requests' && (
                <DealerRequestDetailPage
                  request={selectedRequest}
                  onBack={() => setCurrentView('dealer_dashboard')}
                  onOpenRespond={(req) => {
                    setSelectedRequest(req);
                    setCurrentView('dealer_respond');
                  }}
                />
              )}

              {/* --- Admin Views (Figma Pages 18 - 22) --- */}
              {currentView === 'admin_dashboard' && (
                <AdminOverviewPage
                  onReviewDealers={() => setCurrentView('admin_verification')}
                  onInspectListing={() => setCurrentView('admin_listings')}
                  onInspectRequest={(reqId) => {
                    const req = store.requests.find((r) => r.id === reqId);
                    if (req) setSelectedRequest(req);
                    setCurrentView('admin_requests');
                  }}
                />
              )}

              {currentView === 'admin_verification' && <AdminDealerVerificationPage />}

              {currentView === 'admin_users' && <AdminUsersPage />}

              {currentView === 'admin_requests' && (
                <AdminRequestsPage
                  onViewRequestDetail={(req) => {
                    setSelectedRequest(req);
                    setCurrentView('dealer_request_detail');
                  }}
                />
              )}

              {currentView === 'admin_listings' && <AdminListingsPage />}

              {/* --- Shared Deliveries Handover View --- */}
              {(currentView === 'deliveries' || currentView === 'dealer_deliveries') && (
                <DeliveriesView
                  initialOrderId={selectedOrderId || undefined}
                  onBack={() => setCurrentView(store.currentRole === 'dealer' ? 'dealer_dashboard' : 'dealers')}
                />
              )}

              {/* --- Delivery Rider Views --- */}
              {currentView === 'delivery_dashboard' && (
                <DeliveryDashboardPage
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'delivery_requests' && (
                <DeliveryRequestsPage
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'delivery_active' && (
                <DeliveryActiveJobsPage
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'delivery_earnings' && (
                <DeliveryEarningsPage
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'delivery_profile' && (
                <DeliveryProfilePage
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {/* Profile fallback for mechanic */}
              {currentView === 'profile' && (
                <div className="p-8 max-w-4xl mx-auto space-y-6">
                  <h1 className="text-2xl font-extrabold text-slate-900">Mechanic Workshop Profile</h1>
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center">
                        KM
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{store.currentUser.name}</h3>
                        <p className="text-xs text-blue-600 font-semibold">{store.currentUser.workshopName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100 text-slate-700">
                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[10px] block">Location</span>
                        <p className="font-medium text-slate-900">{store.currentUser.location}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[10px] block">Phone</span>
                        <p className="font-medium text-slate-900 font-mono">{store.currentUser.phone}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[10px] block">Email</span>
                        <p className="font-medium text-slate-900">{store.currentUser.email}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[10px] block">Completed Jobs</span>
                        <p className="font-medium text-slate-900 font-mono">{store.currentUser.completedRequests || 12} jobs</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
}
