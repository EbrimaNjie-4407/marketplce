import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Search } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { DealerProfile, InventoryItem } from '../../types';
import alternatorImg from '../../assets/images/alternator_assembly_1791849520193.jpg';
import brakePadsImg from '../../assets/images/brake_pads_automotive_1791849520783.jpg';
import radiatorImg from '../../assets/images/radiator_cooling_car_1791849520195.jpg';
import { getPartPhoto } from '../../data/partsCatalog';

interface DealerInventoryBrowsePageProps {
  dealer?: DealerProfile;
  onBackToDealers: () => void;
  onSelectPart: (item: InventoryItem) => void;
}

export function DealerInventoryBrowsePage({
  dealer,
  onBackToDealers,
  onSelectPart,
}: DealerInventoryBrowsePageProps) {
  const store = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const activeDealer = dealer || store.dealers[0];

  // Specific dealer parts or fallback populated list matching Figma Page 4
  const dealerParts = store.inventory.filter((item) => {
    const matchesDealer = item.dealerId === activeDealer.id || item.dealerName.toLowerCase().includes(activeDealer.businessName.toLowerCase());
    const matchesSearch = item.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.compatibleMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.compatibleModel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDealer && matchesSearch;
  });

  // Pre-configured 6 parts matching Figma Page 4 if dealer inventory is small
  const defaultPage4Parts = [
    {
      id: 'P-014',
      dealerId: activeDealer.id,
      dealerName: activeDealer.businessName,
      dealerLocation: activeDealer.shopLocation,
      partName: 'Alternator',
      partNumber: '27060-0T140',
      compatibleMake: 'Toyota',
      compatibleModel: 'Corolla',
      compatibleYear: '2015',
      condition: 'New' as const,
      priceGMD: 2500,
      quantity: 3,
      status: 'available' as const,
      image: alternatorImg,
      description: 'High output 90A alternator for Toyota Corolla.',
      updatedAt: 'Today',
    },
    {
      id: 'P-017',
      dealerId: activeDealer.id,
      dealerName: activeDealer.businessName,
      dealerLocation: activeDealer.shopLocation,
      partName: 'Starter motor',
      partNumber: '23300-1HC0A',
      compatibleMake: 'Toyota',
      compatibleModel: 'Corolla',
      compatibleYear: '2015',
      condition: 'New' as const,
      priceGMD: 2500,
      quantity: 2,
      status: 'available' as const,
      image: alternatorImg,
      description: 'High cranking torque reduction starter.',
      updatedAt: 'Today',
    },
    {
      id: 'P-016',
      dealerId: activeDealer.id,
      dealerName: activeDealer.businessName,
      dealerLocation: activeDealer.shopLocation,
      partName: 'Oil filter',
      partNumber: '90915-YZZE1',
      compatibleMake: 'Toyota',
      compatibleModel: 'Corolla',
      compatibleYear: '2015',
      condition: 'New' as const,
      priceGMD: 2500,
      quantity: 12,
      status: 'available' as const,
      image: alternatorImg,
      description: 'OEM spin on oil filter element.',
      updatedAt: 'Today',
    },
    {
      id: 'P-022',
      dealerId: activeDealer.id,
      dealerName: activeDealer.businessName,
      dealerLocation: activeDealer.shopLocation,
      partName: 'Engine oil',
      partNumber: 'ROTELLA-T6',
      compatibleMake: 'Toyota',
      compatibleModel: 'Corolla',
      compatibleYear: '2015',
      condition: 'New' as const,
      priceGMD: 2500,
      quantity: 8,
      status: 'available' as const,
      image: brakePadsImg,
      description: 'Synthetic high performance motor oil 4L jug.',
      updatedAt: 'Today',
    },
    {
      id: 'P-023',
      dealerId: activeDealer.id,
      dealerName: activeDealer.businessName,
      dealerLocation: activeDealer.shopLocation,
      partName: 'Abs sensor',
      partNumber: '89542-02090',
      compatibleMake: 'Toyota',
      compatibleModel: 'Corolla',
      compatibleYear: '2015',
      condition: 'New' as const,
      priceGMD: 2500,
      quantity: 4,
      status: 'available' as const,
      image: brakePadsImg,
      description: 'Front right wheel speed ABS sensor with wiring harness.',
      updatedAt: 'Today',
    },
    {
      id: 'P-018',
      dealerId: activeDealer.id,
      dealerName: activeDealer.businessName,
      dealerLocation: activeDealer.shopLocation,
      partName: 'Radiator',
      partNumber: '16400-0T210',
      compatibleMake: 'Toyota',
      compatibleModel: 'Corolla',
      compatibleYear: '2015',
      condition: 'New' as const,
      priceGMD: 2500,
      quantity: 2,
      status: 'available' as const,
      image: radiatorImg,
      description: 'Direct fit aluminum brazed radiator.',
      updatedAt: 'Today',
    },
  ];

  const displayList = dealerParts.length > 0 ? dealerParts : defaultPage4Parts;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header matching Figma Page 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToDealers}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dealers</span>
          </button>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to {activeDealer.businessName}
          </h1>
          <p className="text-base text-slate-700 font-semibold mt-1">Choose your part</p>
        </div>

        {/* Filter input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter in this store..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"
          />
        </div>
      </div>

      {/* Grid of Parts matching Figma Page 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Part Photo Showcase */}
              <div className="h-48 bg-slate-50 flex items-center justify-center p-4 border-b border-slate-100 relative">
                <img
                  src={getPartPhoto(item.partName, item.image)}
                  alt={item.partName}
                  className="max-h-40 max-w-full object-contain"
                />
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block shadow-xs" />
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    In stock
                  </span>
                </div>
              </div>

              {/* Part Details from Figma Page 4 */}
              <div className="p-6 space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {item.partName}
                </h3>
                <p className="text-xs text-slate-500">
                  {item.compatibleMake} {item.compatibleModel} {item.compatibleYear}
                </p>
                <p className="text-xs text-slate-600 font-medium">{item.condition}</p>

                <div className="pt-2">
                  <span className="text-xl font-extrabold text-slate-900 font-mono">
                    D{item.priceGMD.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* View details button from Figma Page 4 */}
            <div className="p-6 pt-0">
              <button
                onClick={() => onSelectPart(item)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                View details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
