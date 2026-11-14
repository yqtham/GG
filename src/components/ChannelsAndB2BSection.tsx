import { Building2, Calendar, CheckCircle2, Mail, MapPin } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { POPUP_EVENTS } from '../data/catalog';
import { ProductCategory } from '../types/store';

const BULK_UNIT_BASE: Record<ProductCategory, number> = {
  Phones: 32,
  Earbuds: 21,
  Laptops: 45,
  Bottles: 36,
};

export function ChannelsAndB2BSection() {
  // B2B / School Quote Calculator state
  const [orgType, setOrgType] = useState<'School / University' | 'Corporate Event' | 'Gym / Run Club'>('School / University');
  const [bulkCategory, setBulkCategory] = useState<ProductCategory>('Bottles');
  const [quantity, setQuantity] = useState<number>(100);
  const [orgName, setOrgName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [quoteSubmitted, setQuoteSubmitted] = useState<string | null>(null);

  // Pop-Up RSVP state
  const [rsvps, setRsvps] = useState<Record<string, boolean>>({});

  // Weekly Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const discountRate = quantity >= 250 ? 0.25 : quantity >= 100 ? 0.18 : 0.1;
  const unitPrice = BULK_UNIT_BASE[bulkCategory] * (1 - discountRate);
  const estimatedTotal = unitPrice * quantity;

  const handleQuoteSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !contactEmail.trim()) return;
    const refId = `B2B-${Math.floor(1000 + Math.random() * 9000)}`;
    setQuoteSubmitted(refId);
  };

  const toggleRsvp = (id: string) => {
    setRsvps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNewsletter = (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-900/10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: B2B, Schools & Corporate Collaborations */}
        <div id="b2b" className="lg:col-span-6 bg-white border border-zinc-900/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#1D4ED8]">
              <Building2 className="w-4 h-4" aria-hidden="true" />
              <span>B2B, Schools &amp; Corporate Brand Collabs</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#141416] mt-2">
              Team, Campus &amp; Event Kits
            </h2>
            <p className="text-sm text-zinc-600 mt-1.5">
              Custom-engraved bottles, laptop sleeves, and phone armor supplied directly with our bottle manufacturing partner for schools, gyms, and corporate wellness events.
            </p>

            {quoteSubmitted ? (
              <div className="mt-6 p-6 bg-[#F7F7F5] border border-zinc-900/10 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#141416]">
                  <CheckCircle2 className="w-5 h-5 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Quote Request Logged ({quoteSubmitted})</span>
                </div>
                <p className="text-sm text-zinc-600">
                  Prepared for <span className="font-medium text-[#141416]">{orgName}</span> ({orgType}):{' '}
                  <span className="font-mono tabular-nums">{quantity}</span> × {bulkCategory} at{' '}
                  <span className="font-mono tabular-nums">${unitPrice.toFixed(2)}/unit</span>. Our team will send custom logo proofs to{' '}
                  <span className="font-medium text-[#141416]">{contactEmail}</span> within 1 business day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuoteSubmitted(null);
                    setOrgName('');
                    setContactEmail('');
                  }}
                  className="text-xs font-semibold text-[#1D4ED8] hover:underline cursor-pointer"
                >
                  Create another bulk estimate
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="org-type" className="block text-xs font-semibold text-zinc-600 mb-1.5">
                      Organization Type
                    </label>
                    <select
                      id="org-type"
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value as typeof orgType)}
                      className="w-full px-3 py-2 text-sm bg-[#F7F7F5] border border-zinc-900/12 rounded-lg text-[#141416] focus:outline-none focus:border-[#1D4ED8]"
                    >
                      <option>School / University</option>
                      <option>Corporate Event</option>
                      <option>Gym / Run Club</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bulk-cat" className="block text-xs font-semibold text-zinc-600 mb-1.5">
                      Primary Gear
                    </label>
                    <select
                      id="bulk-cat"
                      value={bulkCategory}
                      onChange={(e) => setBulkCategory(e.target.value as ProductCategory)}
                      className="w-full px-3 py-2 text-sm bg-[#F7F7F5] border border-zinc-900/12 rounded-lg text-[#141416] focus:outline-none focus:border-[#1D4ED8]"
                    >
                      <option value="Bottles">Insulated Bottles</option>
                      <option value="Laptops">Laptop Sleeves</option>
                      <option value="Phones">Phone Armor</option>
                      <option value="Earbuds">Earbud Vaults</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 mb-1.5">
                    <label htmlFor="bulk-qty">Order Quantity</label>
                    <span className="font-mono tabular-nums text-[#141416]">
                      {quantity} units ({Math.round(discountRate * 100)}% tier discount)
                    </span>
                  </div>
                  <input
                    id="bulk-qty"
                    type="range"
                    min={25}
                    max={500}
                    step={25}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full accent-[#1D4ED8] cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-[#F7F7F5] rounded-xl border border-zinc-900/8">
                  <div>
                    <div className="text-xs text-zinc-500">Per-Unit Rate</div>
                    <div className="font-mono tabular-nums text-lg font-bold text-[#141416]">
                      ${unitPrice.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500">Estimated Total</div>
                    <div className="font-mono tabular-nums text-lg font-bold text-[#1D4ED8]">
                      ${estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="School or Company Name"
                    aria-label="School or Company Name"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-900/12 rounded-lg text-[#141416] placeholder:text-zinc-400 focus:outline-none focus:border-[#1D4ED8]"
                  />
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Work or School Email"
                    aria-label="Work or School Email"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-900/12 rounded-lg text-[#141416] placeholder:text-zinc-400 focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#141416] hover:bg-[#1D4ED8] rounded-lg transition-colors cursor-pointer"
                >
                  Request Bulk &amp; Co-Branded Quote
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right: Offline Pop-Up Stores & Weekly Newsletter */}
        <div id="popups" className="lg:col-span-6 flex flex-col justify-between gap-6">
          <div className="bg-white border border-zinc-900/10 rounded-2xl p-6 sm:p-8 flex-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[#1D4ED8]">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>Offline Channels · Pop-Up Stores</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#141416] mt-2">
              Pop-Up Customizer Tour
            </h2>
            <p className="text-sm text-zinc-600 mt-1.5">
              Test material grip, see Designer Series drops in person, and get instant on-site laser engraving.
            </p>

            <div className="mt-5 divide-y divide-zinc-900/10">
              {POPUP_EVENTS.map((ev) => {
                const reserved = Boolean(rsvps[ev.id]);
                return (
                  <div key={ev.id} className="py-4 first:pt-2 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[#141416]">{ev.title}</div>
                      <div className="text-xs text-zinc-500 mt-0.5 flex flex-wrap items-center gap-x-2">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                          {ev.dateLabel} · {ev.hours}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{ev.venue}</span>
                      </div>
                      <div className="text-xs text-zinc-600 mt-1">{ev.channelNote}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleRsvp(ev.id)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        reserved
                          ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                          : 'bg-white text-[#141416] border-zinc-900/15 hover:border-zinc-900/35'
                      }`}
                    >
                      {reserved ? 'Spot Reserved' : 'RSVP Spot'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Newsletter & Daily Social */}
          <div className="bg-[#141416] text-white rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
              <Mail className="w-4 h-4 text-[#60A5FA]" aria-hidden="true" />
              <span>Weekly Dispatch · Daily @kinetagear</span>
            </div>
            <h3 className="font-display text-xl font-bold mt-2">
              Weekly Designer Drops &amp; Training Guides
            </h3>
            <p className="text-sm text-zinc-300 mt-1">
              One weekly newsletter featuring new KOL collaborations, pop-up schedules, and active-gear care tips.
            </p>

            {newsletterSuccess ? (
              <div className="mt-4 py-3 px-4 rounded-lg bg-white/10 text-sm text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#60A5FA] shrink-0" aria-hidden="true" />
                <span>Subscribed to the KINETA weekly dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="mt-4 flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  aria-label="Newsletter email address"
                  className="flex-1 px-3.5 py-2.5 text-sm bg-white/10 border border-white/15 rounded-lg text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#60A5FA]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-[#141416] bg-white hover:bg-zinc-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Join Weekly List
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
