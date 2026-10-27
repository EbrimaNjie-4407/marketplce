import {
  Home,
  Search,
  FileText,
  Bell,
  User,
  LayoutDashboard,
  Package,
  Store,
  CheckCircle,
  Users,
  HelpCircle,
  LogOut,
  Layers,
  PlusCircle,
  Truck,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const store = useStore();
  const role = store.currentRole;

  const unreadNotifs = store.notifications.filter((n) => !n.read && n.targetRole === role).length;

  const renderNavLinks = () => {
    if (role === 'mechanic') {
      const links = [
        { id: 'dealers', label: 'Home', icon: Home },
        { id: 'browse_all_parts', label: 'Find Parts', icon: Search },
        { id: 'requests', label: 'Requests', icon: FileText, badge: store.requests.length },
        { id: 'deliveries', label: 'Deliveries', icon: Truck, badge: store.orders.length },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs },
        { id: 'create_request', label: 'Make Request', icon: PlusCircle },
        { id: 'profile', label: 'Profile', icon: User },
      ];

      return links.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id || (item.id === 'dealers' && currentView === 'dealer_browse');
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </div>
            {item.badge && item.badge > 0 ? (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white text-blue-700' : 'bg-blue-700 text-blue-100'
                }`}
              >
                {item.badge}
              </span>
            ) : null}
          </button>
        );
      });
    }

    if (role === 'dealer') {
      const links = [
        { id: 'dealer_dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'dealer_requests', label: 'Requests', icon: FileText, badge: store.requests.filter((r) => r.status !== 'Collected').length },
        { id: 'dealer_inventory', label: 'Inventory', icon: Package, badge: store.inventory.length },
        { id: 'dealer_deliveries', label: 'Deliveries', icon: Truck, badge: store.orders.length },
        { id: 'dealer_notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs },
        { id: 'dealer_add_part', label: 'Add Part', icon: PlusCircle },
        { id: 'dealer_profile', label: 'Dealer Profile', icon: Store },
      ];

      return links.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </div>
            {item.badge && item.badge > 0 ? (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white text-blue-700' : 'bg-blue-700 text-blue-100'
                }`}
              >
                {item.badge}
              </span>
            ) : null}
          </button>
        );
      });
    }

    if (role === 'admin') {
      const links = [
        { id: 'admin_dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'admin_verification', label: 'Verification', icon: CheckCircle, badge: store.applications.filter((a) => a.status === 'pending').length },
        { id: 'admin_users', label: 'Users', icon: Users, badge: store.users.length },
        { id: 'admin_requests', label: 'Requests', icon: FileText, badge: store.requests.length },
        { id: 'admin_listings', label: 'Listings', icon: Package, badge: store.inventory.length },
      ];

      return links.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </div>
            {item.badge && item.badge > 0 ? (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white text-blue-700' : 'bg-blue-700 text-blue-100'
                }`}
              >
                {item.badge}
              </span>
            ) : null}
          </button>
        );
      });
    }

    if (role === 'delivery_rider') {
      const activeJobsCount = store.deliveryJobs.filter(
        (j) => j.status === 'accepted' || j.status === 'picked_up' || j.status === 'in_transit'
      ).length;
      const availableJobsCount = store.deliveryJobs.filter((j) => j.status === 'available').length;

      const links = [
        { id: 'delivery_dashboard', label: 'Rider Dashboard', icon: LayoutDashboard },
        { id: 'delivery_requests', label: 'Delivery Requests', icon: FileText, badge: availableJobsCount },
        { id: 'delivery_active', label: 'Active Dispatches', icon: Truck, badge: activeJobsCount },
        { id: 'delivery_earnings', label: 'Earnings & Payouts', icon: CheckCircle },
        { id: 'delivery_profile', label: 'Rider Profile', icon: User },
      ];

      return links.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </div>
            {item.badge && item.badge > 0 ? (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white text-blue-700' : 'bg-emerald-500 text-white'
                }`}
              >
                {item.badge}
              </span>
            ) : null}
          </button>
        );
      });
    }

    return null;
  };

  return (
    <aside className="w-64 bg-[#1b3a8e] text-white flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)] border-r border-blue-900">
      <div className="p-4 space-y-6">
        {/* Workspace Brand Lockup */}
        <div className="px-2 pt-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-200 border border-blue-400/30 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide text-white leading-tight">AutoSpares GM</h2>
              <p className="text-[10px] text-blue-200 font-medium tracking-wider uppercase">
                {role === 'mechanic' ? 'Mechanic Workspace' : role === 'dealer' ? 'Dealer Workspace' : role === 'delivery_rider' ? 'Dispatch Rider Workspace' : 'Admin Workspace'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">{renderNavLinks()}</nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-4 border-t border-blue-800/80 space-y-3">
        <button
          onClick={() => alert('Support line: WhatsApp +220 745 5010 (Banjul / Jeshwang Operations)')}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs text-blue-200 hover:text-white hover:bg-blue-800/50 rounded-lg transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help & support</span>
        </button>

        <button
          onClick={() => {
            onNavigate('choose_role');
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs text-blue-200 hover:text-white hover:bg-blue-800/50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Switch role / Sign out</span>
        </button>

        {/* Identity Stamp matching Figma Page 10 & 20 */}
        <div className="pt-2 px-1 text-[11px] text-blue-200/90 leading-tight">
          {role === 'dealer' && (
            <div>
              <p className="font-semibold text-white">Suame / Burgi Auto Parts</p>
              <p className="text-emerald-400 text-[10px] flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Verified dealer · Jeshwang
              </p>
            </div>
          )}
          {role === 'admin' && (
            <div>
              <p className="font-semibold text-white">Ama Owusu</p>
              <p className="text-blue-300 text-[10px]">Administrator</p>
            </div>
          )}
          {role === 'mechanic' && (
            <div>
              <p className="font-semibold text-white">{store.currentUser.name}</p>
              <p className="text-blue-300 text-[10px]">{store.currentUser.workshopName}</p>
            </div>
          )}
          {role === 'delivery_rider' && (
            <div>
              <p className="font-semibold text-white">{store.currentUser.name}</p>
              <p className="text-emerald-400 text-[10px] flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active Dispatch Rider · {store.currentUser.location}
              </p>
            </div>
          )}
          <div className="mt-2 text-[10px] text-blue-300/70">
            <button
              onClick={() => {
                marketplaceStore.resetToDefault();
                alert('Database reset to original Figma test data.');
              }}
              className="underline hover:text-white"
            >
              Reset demo data
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
