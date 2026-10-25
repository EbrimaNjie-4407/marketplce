import { useState } from 'react';
import { Plus, Edit3, Search } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { InventoryItem } from '../../types';
import alternatorImg from '../../assets/images/alternator_assembly_1791849520193.jpg';
import { getPartPhoto } from '../../data/partsCatalog';

interface DealerInventoryPageProps {
  onAddPart: () => void;
  onEditPart: (item: InventoryItem) => void;
}

export function DealerInventoryPage({ onAddPart, onEditPart }: DealerInventoryPageProps) {
  const store = useStore();
  const [filterTab, setFilterTab] = useState<'all' | 'available' | 'out_of_stock'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const dealerItems = store.inventory.filter((item) => {
    if (filterTab === 'available' && (item.quantity === 0 || item.status === 'out_of_stock')) return false;
    if (filterTab === 'out_of_stock' && item.quantity > 0 && item.status !== 'out_of_stock') return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.partName.toLowerCase().includes(term) ||
        item.partNumber.toLowerCase().includes(term) ||
        item.compatibleMake.toLowerCase().includes(term) ||
        item.compatibleModel.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const availableCount = store.inventory.filter((i) => i.quantity > 0 && i.status === 'available').length;
  const outOfStockCount = store.inventory.filter((i) => i.quantity === 0 || i.status === 'out_of_stock').length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header from Figma Page 11 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your inventory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Burgi Auto Parts · Keep part details, prices and availability current.
          </p>
        </div>

        <button
          onClick={onAddPart}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Part</span>
        </button>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ● All parts ({store.inventory.length})
          </button>
          <button
            onClick={() => setFilterTab('available')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterTab === 'available' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ○ Available ({availableCount})
          </button>
          <button
            onClick={() => setFilterTab('out_of_stock')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterTab === 'out_of_stock' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ○ Out of stock ({outOfStockCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search stock..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"
          />
        </div>
      </div>

      {/* Grid of Parts Cards matching Figma Page 11 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dealerItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Photo Showcase */}
              <div className="h-44 bg-slate-50 flex items-center justify-center p-4 border-b border-slate-100 relative">
                <img
                  src={getPartPhoto(item.partName, item.image)}
                  alt={item.partName}
                  className="max-h-36 max-w-full object-contain"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.quantity > 0
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {item.quantity > 0 ? `${item.quantity} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              {/* Information */}
              <div className="p-6 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-base">{item.partName}</h3>
                <p className="text-xs text-slate-500">
                  {item.partNumber} · {item.compatibleMake} {item.compatibleModel} · {item.compatibleYear}
                </p>
                <p className="text-xs text-slate-600 font-medium">{item.condition}</p>

                <div className="pt-2">
                  <span className="text-xl font-black text-slate-900 font-mono">
                    D{item.priceGMD.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Part Action from Figma Page 11 */}
            <div className="p-6 pt-0">
              <button
                onClick={() => onEditPart(item)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Part</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer from Figma Page 11 */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
        <span>
          Showing {dealerItems.length} of {store.inventory.length} parts · Sorted by recently updated
        </span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-slate-700 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-slate-700 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
