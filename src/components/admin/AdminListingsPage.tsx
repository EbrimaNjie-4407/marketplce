import { useState } from 'react';
import { Download, AlertTriangle, CheckCircle, Ban, Store } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';
import { InventoryItem } from '../../types';
import alternatorImg from '../../assets/images/alternator_assembly_1791849520193.jpg';
import { getPartPhoto } from '../../data/partsCatalog';

interface AdminListingsPageProps {
  onViewDealer?: (dealerName: string) => void;
}

export function AdminListingsPage({ onViewDealer: _onViewDealer }: AdminListingsPageProps) {
  const store = useStore();
  const [filterTab, setFilterTab] = useState<'all' | 'available' | 'out_of_stock' | 'reported'>('all');
  const [selectedListing, setSelectedListing] = useState<InventoryItem>(store.inventory[0]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredListings = store.inventory.filter((item) => {
    if (filterTab === 'available') return item.quantity > 0 && item.status === 'available';
    if (filterTab === 'out_of_stock') return item.quantity === 0 || item.status === 'out_of_stock';
    if (filterTab === 'reported') return item.isReported;
    return true;
  });

  const handleTogglePublish = () => {
    if (!selectedListing) return;
    marketplaceStore.toggleListingPublication(selectedListing.id);
    const updated = store.inventory.find((i) => i.id === selectedListing.id);
    if (updated) setSelectedListing({ ...updated });
    setActionSuccess(`Listing ${selectedListing.id} publication status toggled.`);
    setTimeout(() => setActionSuccess(null), 2500);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header from Figma Page 22 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Listings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review dealer inventory, listing quality and reports.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting all inventory listings as CSV...')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Listings</span>
        </button>
      </div>

      {/* Tabs Filter from Figma Page 22 */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs w-fit">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ● All listings (324)
        </button>
        <button
          onClick={() => setFilterTab('available')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterTab === 'available' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ○ Available (289)
        </button>
        <button
          onClick={() => setFilterTab('out_of_stock')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterTab === 'out_of_stock' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ○ Out of stock (35)
        </button>
        <button
          onClick={() => setFilterTab('reported')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterTab === 'reported' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ○ Reported (2)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Inventory directory table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Inventory directory</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 font-bold">Part / number</th>
                  <th className="py-2.5 px-3 font-bold">Dealer</th>
                  <th className="py-2.5 px-3 font-bold">Price</th>
                  <th className="py-2.5 px-3 font-bold">Availability</th>
                  <th className="py-2.5 px-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredListings.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedListing(item)}
                    className={`cursor-pointer transition-colors ${
                      selectedListing?.id === item.id ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {item.partName} · {item.partNumber}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{item.dealerName}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      D{item.priceGMD.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      {item.isReported ? (
                        <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                          Reported
                        </span>
                      ) : item.status === 'unlisted' ? (
                        <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full text-[11px]">
                          Unlisted
                        </span>
                      ) : item.quantity > 0 ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                          {item.quantity} in stock
                        </span>
                      ) : (
                        <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full text-[11px]">
                          Out of stock
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-blue-600 hover:text-blue-800 font-bold">
                        {selectedListing?.id === item.id ? 'Selected' : 'View →'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              i
            </span>
            <p className="leading-relaxed">
              <strong>2 reports need review:</strong> Reported listings remain visible until reviewed. Check compatibility and supporting photos before removing a listing.
            </p>
          </div>
        </div>

        {/* Right 4 Cols: Selected listing card matching Figma Page 22 */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          {selectedListing ? (
            <>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Listing {selectedListing.id}
                </span>
                <h3 className="text-lg font-black text-slate-900">{selectedListing.partName}</h3>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block mt-1 ${
                    selectedListing.status === 'unlisted'
                      ? 'bg-slate-100 text-slate-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {selectedListing.status === 'unlisted' ? 'Unpublished' : 'Published · Available'}
                </span>
              </div>

              {/* Photo */}
              <div className="h-44 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-3">
                <img
                  src={getPartPhoto(selectedListing.partName, selectedListing.image)}
                  alt={selectedListing.partName}
                  className="max-h-36 max-w-full object-contain"
                />
              </div>

              <div className="space-y-3 text-xs border-t border-slate-100 pt-4 text-slate-600">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Dealer</span>
                  <p className="font-semibold text-slate-900">{selectedListing.dealerName} · Verified</p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Compatibility</span>
                  <p className="font-semibold text-slate-900">
                    {selectedListing.compatibleMake} {selectedListing.compatibleModel} · {selectedListing.compatibleYear}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Price</span>
                    <p className="font-mono font-black text-slate-900 text-base">
                      D{selectedListing.priceGMD.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Condition</span>
                    <p className="font-semibold text-slate-900">{selectedListing.condition}</p>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Part number</span>
                  <p className="font-mono text-slate-900">{selectedListing.partNumber}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Stock</span>
                  <p className="text-slate-900">
                    {selectedListing.quantity} units · {selectedListing.dealerLocation}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => alert(`Inspecting dealer profile: ${selectedListing.dealerName}`)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  View Dealer
                </button>

                <button
                  onClick={handleTogglePublish}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedListing.status === 'unlisted'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-red-50 hover:bg-red-100 text-red-700'
                  }`}
                >
                  {selectedListing.status === 'unlisted' ? 'Publish Listing' : 'Unpublish Listing'}
                </button>
              </div>

              {actionSuccess && (
                <p className="text-xs font-bold text-emerald-600 text-center animate-fadeIn">
                  {actionSuccess}
                </p>
              )}

              <p className="text-[11px] text-slate-400 text-center">
                Unpublishing hides this listing. The dealer is notified with the admin's reason.
              </p>
            </>
          ) : (
            <p className="text-xs text-slate-500">Select a listing to inspect.</p>
          )}
        </div>
      </div>
    </div>
  );
}
