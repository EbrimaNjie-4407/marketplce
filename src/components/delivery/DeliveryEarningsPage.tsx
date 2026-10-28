import { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';

interface DeliveryEarningsPageProps {
  onNavigate: (view: string) => void;
}

export function DeliveryEarningsPage({ onNavigate: _onNavigate }: DeliveryEarningsPageProps) {
  const store = useStore();
  const rider = marketplaceStore.getActiveRider();

  const [withdrawAmount, setWithdrawAmount] = useState<string>('500');
  const [withdrawMethod, setWithdrawMethod] = useState<'wave' | 'qmoney' | 'afrimoney'>('wave');
  const [withdrawPhone, setWithdrawPhone] = useState<string>(rider.phone);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const completedJobs = store.deliveryJobs.filter((j) => j.status === 'delivered');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage('Please enter a valid payout amount.');
      return;
    }
    if (amount > rider.totalEarningsGMD) {
      setErrorMessage(`Insufficient wallet balance. Max available: D${rider.totalEarningsGMD} GMD`);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    setTimeout(() => {
      rider.totalEarningsGMD -= amount;
      setIsProcessing(false);
      setSuccessMessage(
        `Withdrawal of D${amount} GMD sent successfully to ${withdrawPhone} via ${withdrawMethod.toUpperCase()}. Reference: TXN-${Date.now().toString().slice(-6)}`
      );
    }, 1000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {successMessage && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          Earnings & Payouts
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track your delivery dispatch earnings and withdraw instantly via Gambian mobile money
        </p>
      </div>

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-md space-y-2">
          <span className="text-xs font-medium text-emerald-100">Available Wallet Balance</span>
          <div className="text-4xl font-extrabold font-mono">
            D{rider.totalEarningsGMD}
          </div>
          <p className="text-[11px] text-emerald-100 flex items-center gap-1 pt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ready for instant Wave or QMoney transfer</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-medium">Earnings Today</span>
          <div className="text-4xl font-extrabold text-slate-900 font-mono">
            D{rider.todayEarningsGMD}
          </div>
          <p className="text-[11px] text-slate-400">
            From {rider.todayDeliveries} completed dispatches today
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 font-medium">All-Time Deliveries</span>
          <div className="text-4xl font-extrabold text-blue-600 font-mono">
            {rider.completedDeliveries}
          </div>
          <p className="text-[11px] text-slate-400">
            Average payout: D130 GMD per delivery
          </p>
        </div>
      </div>

      {/* Grid: Cashout Form + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Cashout Form */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Instant Mobile Payout</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Withdraw directly to your Gambian mobile wallet
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
            {/* Wallet Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Select Mobile Money Provider</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setWithdrawMethod('wave')}
                  className={`py-2 px-2.5 rounded-xl border text-center font-bold transition-all ${
                    withdrawMethod === 'wave'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Wave GM
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawMethod('qmoney')}
                  className={`py-2 px-2.5 rounded-xl border text-center font-bold transition-all ${
                    withdrawMethod === 'qmoney'
                      ? 'border-amber-600 bg-amber-50 text-amber-700 ring-1 ring-amber-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  QMoney
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawMethod('afrimoney')}
                  className={`py-2 px-2.5 rounded-xl border text-center font-bold transition-all ${
                    withdrawMethod === 'afrimoney'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Afrimoney
                </button>
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Recipient Phone Number</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={withdrawPhone}
                  onChange={(e) => setWithdrawPhone(e.target.value)}
                  placeholder="+220 7xx xxxx"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-hidden focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Amount (GMD)</label>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(rider.totalEarningsGMD.toString())}
                  className="text-blue-600 text-[11px] font-bold hover:underline"
                >
                  Withdraw All (D{rider.totalEarningsGMD})
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-slate-500">D</span>
                <input
                  type="number"
                  min="50"
                  max={rider.totalEarningsGMD}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-hidden focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing || rider.totalEarningsGMD <= 0}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>{isProcessing ? 'Processing Transfer...' : `Withdraw D${withdrawAmount || 0} to Mobile Money`}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Deliveries Ledger Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Completed Dispatches Ledger</h3>
              <p className="text-xs text-slate-400">Record of verified parts deliveries</p>
            </div>
            <span className="text-xs font-bold text-slate-600 font-mono">
              {completedJobs.length} trips recorded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 font-bold">Delivery Job</th>
                  <th className="py-2.5 px-3 font-bold">Route</th>
                  <th className="py-2.5 px-3 font-bold">Completed</th>
                  <th className="py-2.5 px-3 font-bold text-right">Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {completedJobs.map((job) => {
                  const order = store.orders.find((o) => o.id === job.orderId);
                  return (
                    <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{job.partName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          #{job.id} {order ? `· Order #${order.id}` : ''}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800 text-[11px] font-semibold">{job.pickupShop}</div>
                        <div className="text-[10px] text-slate-500">→ {job.dropoffWorkshop}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        <div className="font-medium">{job.deliveredAt || 'Today'}</div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                          ✓ Dual Verified
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="font-mono font-bold text-emerald-600 text-sm block">
                          +D{job.payoutGMD}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {order?.riderPayoutRef || `ESC-RDR-${Math.floor(100000 + Math.random() * 900000)}`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
