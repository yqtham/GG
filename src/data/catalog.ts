import {
  ColorSwatch,
  GraphicStamp,
  PatternType,
  PopupEvent,
  Product,
  ProductCategory,
  ProtectionTier,
  TextFont,
  TextLayout,
} from '../types/store';

export const SHELL_COLORS: ColorSwatch[] = [
  { id: 'obsidian', name: 'Matte Ink', hex: '#141416', isDark: true },
  { id: 'chalk', name: 'Cloud White', hex: '#F2F1EC', isDark: false },
  { id: 'cobalt', name: 'Electric Cobalt', hex: '#2563EB', isDark: true },
  { id: 'coral', name: 'Coral Punch', hex: '#FF5A36', isDark: true },
  { id: 'lilac', name: 'Lilac Haze', hex: '#8B5CF6', isDark: true },
  { id: 'butter', name: 'Sunburst Yellow', hex: '#FACC15', isDark: false },
  { id: 'sage', name: 'Matcha Sage', hex: '#3D6B58', isDark: true },
];

export const ACCENT_COLORS: ColorSwatch[] = [
  { id: 'cobalt', name: 'Cobalt Bumper', hex: '#2563EB', isDark: true },
  { id: 'lime', name: 'Acid Volt', hex: '#84CC16', isDark: false },
  { id: 'coral', name: 'Coral Punch', hex: '#FF5A36', isDark: true },
  { id: 'butter', name: 'Sunburst', hex: '#FACC15', isDark: false },
  { id: 'lilac', name: 'Electric Lilac', hex: '#8B5CF6', isDark: true },
  { id: 'chalk', name: 'Optic White', hex: '#F8F8F5', isDark: false },
  { id: 'graphite', name: 'Stealth Ink', hex: '#27272A', isDark: true },
];

export const PATTERNS: { id: PatternType; label: string; surcharge: number; description: string }[] = [
  { id: 'Smooth Matte', label: 'Smooth Matte', surcharge: 0, description: 'Anti-fingerprint satin shell' },
  { id: 'Grip Ribbed', label: 'Grip Ribbed', surcharge: 4, description: 'Sweat-channel tactile rails' },
  { id: 'Carbon Weave', label: 'Carbon Weave', surcharge: 6, description: 'Cross-hatch speed weave' },
  { id: 'Topo Contour', label: 'Topo Contour', surcharge: 6, description: 'Laser-etched elevation lines' },
];

export const GRAPHIC_STAMPS: { id: GraphicStamp; label: string }[] = [
  { id: 'None', label: 'Clean Shell' },
  { id: 'Bolt', label: 'Bolt Energy' },
  { id: 'Checker', label: 'Track Checker' },
  { id: 'Sunburst', label: 'Sunburst Smile' },
  { id: 'Stars', label: 'Star Club' },
  { id: 'Wave', label: 'Motion Wave' },
];

export const PROTECTION_TIERS: {
  id: ProtectionTier;
  label: string;
  dropRating: string;
  milStd: string;
  surcharge: number;
  summary: string;
}[] = [
  {
    id: 'Impact',
    label: 'Impact',
    dropRating: '2.5m',
    milStd: '4× MIL-STD-810G',
    surcharge: 0,
    summary: 'Slim everyday armor with raised camera-ring bezel',
  },
  {
    id: 'Bounce',
    label: 'Bounce',
    dropRating: '4.0m',
    milStd: '6× MIL-STD-810G',
    surcharge: 10,
    summary: 'Sculpted corner bumpers built for active drops',
  },
  {
    id: 'Ultra Bounce',
    label: 'Ultra Bounce',
    dropRating: '6.5m',
    milStd: '10× MIL-STD-810G',
    surcharge: 18,
    summary: 'Max shock core + oversized corner shields',
  },
];

export const DEVICE_MODELS: Record<ProductCategory, string[]> = {
  Phones: ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 15', 'Galaxy S25 Ultra'],
  Earbuds: ['AirPods Pro 2', 'AirPods 4', 'Galaxy Buds 3 Pro'],
  Laptops: ['MacBook Pro 16"', 'MacBook Pro 14"', 'MacBook Air 13"'],
  Bottles: ['750ml Active Steel', '500ml Junior Steel', '1L Marathon Flask'],
};

export const TEXT_LAYOUTS: { id: TextLayout; label: string }[] = [
  { id: 'Bottom', label: 'Bottom Bar' },
  { id: 'Center', label: 'Center Stack' },
  { id: 'Diagonal', label: 'Diagonal Slash' },
  { id: 'Spine', label: 'Vertical Spine' },
];

export const TEXT_FONTS: { id: TextFont; label: string }[] = [
  { id: 'Display', label: 'Bold Sans' },
  { id: 'Mono', label: 'Tech Mono' },
  { id: 'Serif', label: 'Editorial' },
];

export const CATEGORY_BASE_PRICES: Record<ProductCategory, { basePrice: number; defaultName: string; skuPrefix: string; specLine: string }> = {
  Phones: {
    basePrice: 42,
    defaultName: 'Custom Impact Phone Case',
    skuPrefix: 'KN-PHN',
    specLine: 'Eco-shock inner frame · Signature camera ring · Mag-ring aligned · 1-year warranty',
  },
  Earbuds: {
    basePrice: 28,
    defaultName: 'Custom Bounce Earbud Case',
    skuPrefix: 'KN-EBD',
    specLine: '360° corner bumpers · Locking carabiner ring · Wireless charge ready · 1-year warranty',
  },
  Laptops: {
    basePrice: 58,
    defaultName: 'Custom Bounce Laptop Sleeve',
    skuPrefix: 'KN-LPT',
    specLine: 'Corner shock pods · Splash-proof ballistic shell · Fleece interior · 1-year warranty',
  },
  Bottles: {
    basePrice: 44,
    defaultName: 'Custom Hydro-Shield Bottle',
    skuPrefix: 'KN-BTL',
    specLine: 'Partner-forged 18/8 steel · Silicone bounce boot · 24h cold lock · 1-year warranty',
  },
};

export interface DesignerPreset {
  id: string;
  title: string;
  collaborator: string;
  segmentFit: string;
  protectionTier: ProtectionTier;
  shellColorId: string;
  accentColorId: string;
  pattern: PatternType;
  stamp: GraphicStamp;
  engraving: string;
  textLayout: TextLayout;
  textFont: TextFont;
}

export const DESIGNER_PRESETS: DesignerPreset[] = [
  {
    id: 'pace-01',
    title: 'Pace 01 — Run Club Volt',
    collaborator: 'Maya Lin · Running KOL',
    segmentFit: 'Runners & Gym',
    protectionTier: 'Bounce',
    shellColorId: 'obsidian',
    accentColorId: 'lime',
    pattern: 'Topo Contour',
    stamp: 'Bolt',
    engraving: 'PACE 01',
    textLayout: 'Diagonal',
    textFont: 'Display',
  },
  {
    id: 'campus-pop',
    title: 'Campus Checker Co-Lab',
    collaborator: 'Civic Track Collective',
    segmentFit: 'Students & Kids',
    protectionTier: 'Ultra Bounce',
    shellColorId: 'cobalt',
    accentColorId: 'butter',
    pattern: 'Grip Ribbed',
    stamp: 'Checker',
    engraving: 'VARSITY',
    textLayout: 'Center',
    textFont: 'Display',
  },
  {
    id: 'sunburst-club',
    title: 'Sunburst Studio Edition',
    collaborator: 'Sora Kim · Graphic Artist',
    segmentFit: 'Students & Office',
    protectionTier: 'Impact',
    shellColorId: 'coral',
    accentColorId: 'chalk',
    pattern: 'Smooth Matte',
    stamp: 'Sunburst',
    engraving: 'GOOD DAY',
    textLayout: 'Bottom',
    textFont: 'Display',
  },
  {
    id: 'lilac-wave',
    title: 'After-Hours Gym Wave',
    collaborator: 'Devon Brooks · Coach',
    segmentFit: 'Gym & Runners',
    protectionTier: 'Bounce',
    shellColorId: 'lilac',
    accentColorId: 'lime',
    pattern: 'Carbon Weave',
    stamp: 'Wave',
    engraving: 'MOTION',
    textLayout: 'Spine',
    textFont: 'Mono',
  },
];

export const CATALOG_PRODUCTS: Product[] = [
  {
    id: 'apex-phone-custom',
    sku: 'KN-PHN-01',
    name: 'Bounce Corner Phone Armor',
    category: 'Phones',
    deviceModel: 'iPhone 16 Pro Max',
    protectionTier: 'Bounce',
    segments: ['Runners', 'Gym', 'Students'],
    series: 'Custom Studio',
    price: 52,
    baseColorId: 'cobalt',
    accentColorId: 'lime',
    pattern: 'Grip Ribbed',
    stamp: 'Bolt',
    tagline: '4.0m drop-tested corner bounce pods paired with sweat-channel side grip and bold camera-ring shield.',
    specs: ['4.0m drop rating (6× MIL-STD-810G)', 'Mag-ring aligned charging core', '1-year manufacturing defect warranty'],
    inStock: true,
  },
  {
    id: 'pace-phone-designer',
    sku: 'KN-PHN-09',
    name: 'Pace 01 Ultra Bounce Case',
    category: 'Phones',
    deviceModel: 'iPhone 16 Pro',
    protectionTier: 'Ultra Bounce',
    segments: ['Runners', 'Office'],
    series: 'Designer Series',
    designerName: 'Maya Lin · Running KOL Co-Lab',
    price: 62,
    baseColorId: 'obsidian',
    accentColorId: 'lime',
    pattern: 'Topo Contour',
    stamp: 'Checker',
    tagline: 'Limited KOL Co-Lab featuring 6.5m Ultra Bounce corner shields, topo plate, and acid volt ring.',
    specs: ['6.5m Ultra Bounce protection', 'Signature engraved camera bezel', '1-year manufacturing defect warranty'],
    inStock: true,
  },
  {
    id: 'pulse-earbud-custom',
    sku: 'KN-EBD-02',
    name: 'Pulse Impact Earbud Case',
    category: 'Earbuds',
    deviceModel: 'AirPods Pro 2',
    protectionTier: 'Impact',
    segments: ['Gym', 'Runners', 'Students'],
    series: 'Custom Studio',
    price: 28,
    baseColorId: 'coral',
    accentColorId: 'butter',
    pattern: 'Smooth Matte',
    stamp: 'Sunburst',
    tagline: 'Snap-lock latch and bright carabiner loop keep earbuds anchored during runs, lifts, and campus sprints.',
    specs: ['2.5m impact-tested shell', 'Anodized carabiner included', '1-year manufacturing defect warranty'],
    inStock: true,
  },
  {
    id: 'studio-earbud-designer',
    sku: 'KN-EBD-07',
    name: 'Lilac Wave Earbud Vault',
    category: 'Earbuds',
    deviceModel: 'AirPods Pro 2',
    protectionTier: 'Bounce',
    segments: ['Office', 'Students'],
    series: 'Designer Series',
    designerName: 'Sora Kim · Graphic Co-Lab',
    price: 38,
    baseColorId: 'lilac',
    accentColorId: 'chalk',
    pattern: 'Carbon Weave',
    stamp: 'Stars',
    tagline: 'Electric lilac shell with optic white corner bumpers and micro-weave shock liner.',
    specs: ['4.0m Bounce corner liner', 'Dust-sealed hinge guard', '1-year manufacturing defect warranty'],
    inStock: true,
  },
  {
    id: 'stride-laptop-custom',
    sku: 'KN-LPT-03',
    name: 'Stride Bounce Laptop Sleeve',
    category: 'Laptops',
    deviceModel: 'MacBook Pro 14"',
    protectionTier: 'Bounce',
    segments: ['Students', 'Office'],
    series: 'Custom Studio',
    price: 64,
    baseColorId: 'butter',
    accentColorId: 'cobalt',
    pattern: 'Smooth Matte',
    stamp: 'Checker',
    tagline: 'Sculpted corner shock pods built for crowded lecture halls, skate commutes, and studio cafés.',
    specs: ['4.0m corner-pod impact protection', 'Water-repellent exterior + fleece lining', '1-year manufacturing defect warranty'],
    inStock: true,
  },
  {
    id: 'commute-laptop-designer',
    sku: 'KN-LPT-11',
    name: 'Monolith Ultra Bounce Folio 16"',
    category: 'Laptops',
    deviceModel: 'MacBook Pro 16"',
    protectionTier: 'Ultra Bounce',
    segments: ['Office', 'Students'],
    series: 'Designer Series',
    designerName: 'Kenji Sato · Industrial Co-Lab',
    price: 76,
    baseColorId: 'obsidian',
    accentColorId: 'coral',
    pattern: 'Carbon Weave',
    stamp: 'Wave',
    tagline: 'Compression-molded EVA armor with dual corner bumpers and magnetic accessory bay.',
    specs: ['6.5m Ultra Bounce corner shields', 'Quick-access charger & stylus pocket', '1-year manufacturing defect warranty'],
    inStock: true,
  },
  {
    id: 'hydro-bottle-custom',
    sku: 'KN-BTL-04',
    name: 'Hydro-Shield Bounce Bottle',
    category: 'Bottles',
    deviceModel: '750ml Active Steel',
    protectionTier: 'Bounce',
    segments: ['Gym', 'Runners', 'Kids', 'Students'],
    series: 'Custom Studio',
    price: 52,
    baseColorId: 'coral',
    accentColorId: 'cobalt',
    pattern: 'Grip Ribbed',
    stamp: 'Wave',
    tagline: 'Partner-manufactured double-wall steel vessel wrapped in a replaceable high-impact silicone boot.',
    specs: ['750ml 18/8 food-grade steel', '24h cold / 12h hot thermal lock', '1-year manufacturing defect warranty'],
    inStock: true,
  },
  {
    id: 'junior-bottle-kids',
    sku: 'KN-BTL-08',
    name: 'Junior Ultra Bounce Bottle 500ml',
    category: 'Bottles',
    deviceModel: '500ml Junior Steel',
    protectionTier: 'Ultra Bounce',
    segments: ['Kids', 'Students'],
    series: 'Custom Studio',
    price: 42,
    baseColorId: 'cobalt',
    accentColorId: 'lime',
    pattern: 'Grip Ribbed',
    stamp: 'Stars',
    tagline: 'Kid-sized easy-grip loop cap and full-wrap Ultra Bounce silicone armor built for playgrounds and sports.',
    specs: ['500ml BPA-free insulated steel', 'Flip-straw leakproof cap', '1-year manufacturing defect warranty'],
    inStock: true,
  },
  {
    id: 'trail-bottle-designer',
    sku: 'KN-BTL-12',
    name: 'Trailhead Co-Lab Bottle 750ml',
    category: 'Bottles',
    deviceModel: '750ml Active Steel',
    protectionTier: 'Impact',
    segments: ['Runners', 'Gym'],
    series: 'Designer Series',
    designerName: 'Devon Brooks · Endurance Co-Lab',
    price: 50,
    baseColorId: 'sage',
    accentColorId: 'butter',
    pattern: 'Topo Contour',
    stamp: 'Bolt',
    tagline: 'Co-developed with our bottle manufacturer for ultralight hydration and slip-free wet trail grip.',
    specs: ['Textured powder-coat + bounce boot', 'Custom typography ready', '1-year manufacturing defect warranty'],
    inStock: true,
  },
];

export const POPUP_EVENTS: PopupEvent[] = [
  {
    id: 'pop-campus',
    title: 'Campus Custom Lab Pop-Up',
    venue: 'University Commons Plaza · Booth B4',
    dateLabel: 'Nov 21 – Nov 23',
    hours: '10:00 – 18:00',
    channelNote: 'Live sticker stamp bar · Student bundle pricing',
  },
  {
    id: 'pop-marathon',
    title: 'City Half-Marathon Expo',
    venue: 'Harbor Athletics Pavilion',
    dateLabel: 'Dec 05 – Dec 06',
    hours: '08:00 – 19:00',
    channelNote: 'Pace 01 KOL Co-Lab drop · Free bottle sleeve fitting',
  },
  {
    id: 'pop-corporate',
    title: 'Midtown Tech & Wellness Showcase',
    venue: 'Apex District Atrium',
    dateLabel: 'Dec 12',
    hours: '11:00 – 17:00',
    channelNote: 'Corporate co-branding samples · B2B consultations',
  },
];

export function getSwatchHex(swatches: ColorSwatch[], id: string): string {
  return swatches.find((s) => s.id === id)?.hex ?? swatches[0].hex;
}

export function getSwatchName(swatches: ColorSwatch[], id: string): string {
  return swatches.find((s) => s.id === id)?.name ?? swatches[0].name;
}

export function isSwatchDark(swatches: ColorSwatch[], id: string): boolean {
  return swatches.find((s) => s.id === id)?.isDark ?? true;
}
