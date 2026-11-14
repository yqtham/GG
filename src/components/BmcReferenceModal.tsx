import { X } from 'lucide-react';

interface BmcReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BMC_MAPPING = [
  {
    block: 'Key Propositions',
    notes: 'Holistic protection for phones, earbuds, laptops, bottles · Customizable protectors · Designer series · 1-year defect warranty.',
  },
  {
    block: 'Customer Segments',
    notes: 'Students, Office workers, Gym Members, Runners, and Children — filterable across the catalog and presets.',
  },
  {
    block: 'Key Partners',
    notes: 'Bottle Manufacturer (double-wall 18/8 steel vessels) & KOL / Influencer Designer Series capsule drops.',
  },
  {
    block: 'Channels & Relationships',
    notes: 'Online storefront & daily social engagement, weekly newsletter dispatch, offline pop-up stores, and corporate collab kits.',
  },
  {
    block: 'Revenue & Cost Structure',
    notes: 'B2C ($24k/mo) + B2B/School bulk quote engine ($10k/mo) targeting $408k annual revenue against $30k R&D/supplier/marketing budget.',
  },
];

export function BmcReferenceModal({ isOpen, onClose }: BmcReferenceModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bmc-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-900/10 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-900/10">
          <div>
            <h2 id="bmc-modal-title" className="font-display text-xl font-bold text-[#141416]">
              Business Model Canvas Blueprint
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Source strategy canvas mapped directly to KINETA storefront modules.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close business model blueprint"
            className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-[#141416] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-[#F7F7F5] border border-zinc-900/10 rounded-xl p-3">
            <img
              src="/assets/aistudio/Guessing_Game_1f9ecf80.png"
              alt="Source Business Model Canvas"
              referrerPolicy="no-referrer"
              className="w-full h-auto rounded-lg"
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            {BMC_MAPPING.map((entry) => (
              <div key={entry.block} className="pb-3 border-b border-zinc-900/10 last:border-none">
                <div className="text-xs font-semibold text-[#1D4ED8]">{entry.block}</div>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{entry.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
