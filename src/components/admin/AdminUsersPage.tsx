import { useState } from 'react';
import { Download, Ban, CheckCircle, ShieldAlert, UserCheck } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';
import { User } from '../../types';

interface AdminUsersPageProps {
  onViewRequestsForUser?: (userName: string) => void;
}

export function AdminUsersPage({ onViewRequestsForUser: _onViewRequestsForUser }: AdminUsersPageProps) {
  const store = useStore();
  const [filterTab, setFilterTab] = useState<'all' | 'mechanic' | 'dealer' | 'suspended'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User>(store.users[0]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredUsers = store.users.filter((u) => {
    if (filterTab === 'mechanic' && u.role !== 'mechanic') return false;
    if (filterTab === 'dealer' && u.role !== 'dealer') return false;
    if (filterTab === 'suspended' && u.status !== 'suspended') return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        u.name.toLowerCase().includes(term) ||
        u.phone.toLowerCase().includes(term) ||
        (u.workshopName && u.workshopName.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const handleToggleSuspend = () => {
    if (!selectedUser) return;
    marketplaceStore.toggleUserStatus(selectedUser.id);
    const updated = store.users.find((u) => u.id === selectedUser.id);
    if (updated) setSelectedUser({ ...updated });
    setActionSuccess(`Status for ${selectedUser.name} updated.`);
    setTimeout(() => setActionSuccess(null), 2500);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header matching Figma Page 20 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Users
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage mechanic and dealer accounts across the marketplace.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting 248 marketplace users as CSV...')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Users</span>
        </button>
      </div>

      {/* Tabs Filter matching Figma Page 20 */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs w-fit">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ● All users (248)
        </button>
        <button
          onClick={() => setFilterTab('mechanic')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterTab === 'mechanic' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ○ Mechanics (212)
        </button>
        <button
          onClick={() => setFilterTab('dealer')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterTab === 'dealer' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ○ Dealers (36)
        </button>
        <button
          onClick={() => setFilterTab('suspended')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterTab === 'suspended' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ○ Suspended (3)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Account directory table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-bold text-slate-900">Account directory</h2>

            <input
              type="text"
              placeholder="Search by name, phone or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 font-bold">User / business</th>
                  <th className="py-2.5 px-3 font-bold">Role</th>
                  <th className="py-2.5 px-3 font-bold">Location</th>
                  <th className="py-2.5 px-3 font-bold">Status</th>
                  <th className="py-2.5 px-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`cursor-pointer transition-colors ${
                      selectedUser?.id === u.id ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-slate-900">
                      <div>
                        <span>{u.name}</span>
                        {u.workshopName && (
                          <span className="block text-[11px] font-normal text-slate-400">{u.workshopName}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 capitalize text-slate-600">{u.role}</td>
                    <td className="py-3 px-3 text-slate-500">{u.location.split(',')[0]}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-blue-600 hover:text-blue-800 font-bold">
                        {selectedUser?.id === u.id ? 'Selected' : 'View →'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Showing {filteredUsers.length} of 248 accounts
          </p>
        </div>

        {/* Right 4 Cols: Selected user card from Figma Page 20 */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          {selectedUser ? (
            <>
              <div>
                <h3 className="text-lg font-black text-slate-900">{selectedUser.name}</h3>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                  {selectedUser.status === 'active' ? `Active ${selectedUser.role}` : 'Suspended'}
                </span>
              </div>

              <div className="space-y-3 text-xs border-t border-slate-100 pt-4 text-slate-600">
                {selectedUser.workshopName && (
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      Workshop
                    </span>
                    <p className="font-semibold text-slate-900">{selectedUser.workshopName}</p>
                  </div>
                )}

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Phone</span>
                  <p className="font-mono font-semibold text-slate-900">{selectedUser.phone}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Email</span>
                  <p className="text-slate-900">{selectedUser.email}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Location</span>
                  <p className="text-slate-900">{selectedUser.location}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Joined</span>
                  <p className="text-slate-900">{selectedUser.joinedDate}</p>
                </div>
              </div>

              {/* Account controls */}
              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Account controls
                </span>
                <p className="text-slate-700">
                  <strong>Requests:</strong> {selectedUser.totalRequests || 15} total · {selectedUser.activeRequests || 3} active
                </p>
                <p className="text-slate-700">
                  <strong>Completed:</strong> {selectedUser.completedRequests || 12} collected or delivered
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => alert(`Opening requests list filtered for ${selectedUser.name}...`)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  View Requests
                </button>

                <button
                  onClick={handleToggleSuspend}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedUser.status === 'active'
                      ? 'bg-red-50 hover:bg-red-100 text-red-700'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {selectedUser.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                </button>
              </div>

              {actionSuccess && (
                <p className="text-xs font-bold text-emerald-600 text-center animate-fadeIn">
                  {actionSuccess}
                </p>
              )}

              <p className="text-[11px] text-slate-400 text-center">
                Suspension blocks new requests. An admin reason is required before confirming.
              </p>
            </>
          ) : (
            <p className="text-xs text-slate-500">Select an account from directory.</p>
          )}
        </div>
      </div>
    </div>
  );
}
