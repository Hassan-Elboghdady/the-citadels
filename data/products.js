const products = [
  // ── Residential ──
  {
    id: 'res-001',
    name: 'Milano Leather Sectional Sofa',
    category: 'residential',
    categoryLabel: 'Residential',
    price: 42500,
    currency: 'EGP',
    description: 'Italian-designed L-shaped sectional sofa in full-grain leather with solid hardwood frame, high-density foam cushions, and adjustable headrests. Available in cognac, charcoal, and ivory.',
    specs: ['Dimensions: 320 x 180 x 85 cm', 'Material: Full-grain Italian leather', 'Frame: Kiln-dried hardwood', 'Cushions: HR foam 40 kg/m³', 'Weight capacity: 350 kg'],
    image: '/images/residential.png'
  },
  {
    id: 'res-002',
    name: 'Verona Solid Oak Dining Set',
    category: 'residential',
    categoryLabel: 'Residential',
    price: 28900,
    currency: 'EGP',
    description: 'Eight-seater dining table in solid European oak with natural oil finish, paired with upholstered dining chairs in bouclé fabric. Table extends from 200 cm to 260 cm.',
    specs: ['Table: 200/260 x 100 x 76 cm', 'Material: European solid oak', 'Finish: Natural oil, matte', 'Chairs: Bouclé fabric upholstery', 'Set includes: 1 table + 8 chairs'],
    image: '/images/residential.png'
  },

  // ── Hospitality ──
  {
    id: 'htl-001',
    name: 'ABLE Hotel Guest Room Suite',
    category: 'hospitality',
    categoryLabel: 'Hospitality',
    price: 67000,
    currency: 'EGP',
    description: 'Complete guest room furniture package from ABLE including king bed frame with upholstered headboard, two nightstands, writing desk, luggage bench, and wardrobe. Commercial-grade construction rated for hospitality use.',
    specs: ['Bed: King size, 200 x 200 cm', 'Headboard: Upholstered panel, 180 cm wide', 'Desk: 120 x 60 cm with cable port', 'Wardrobe: 160 x 60 x 210 cm', 'Partner: ABLE'],
    image: '/images/hotel.png'
  },
  {
    id: 'htl-002',
    name: 'Lobby Lounge Armchair Pair',
    category: 'hospitality',
    categoryLabel: 'Hospitality',
    price: 18500,
    currency: 'EGP',
    description: 'Set of two hotel lobby armchairs with brushed brass legs, high-resilience foam, and commercial-grade velvet upholstery. Fire-retardant to hospitality standards.',
    specs: ['Dimensions: 78 x 82 x 80 cm each', 'Upholstery: FR velvet, Martindale 80,000+', 'Legs: Brushed brass steel', 'Foam: HR 35 kg/m³', 'Set includes: 2 armchairs'],
    image: '/images/hotel.png'
  },

  // ── Office ──
  {
    id: 'ofc-001',
    name: 'Zivella Executive Desk System',
    category: 'office',
    categoryLabel: 'Office',
    price: 35200,
    currency: 'EGP',
    description: 'Premium executive desk by Zivella with melamine top, integrated cable management, modular return unit, and matching mobile pedestal. Available in walnut and anthracite finishes.',
    specs: ['Main desk: 180 x 80 x 75 cm', 'Return: 120 x 60 x 75 cm', 'Pedestal: 3-drawer, lockable', 'Top: 25 mm melamine, anti-scratch', 'Partner: Zivella'],
    image: '/images/office.png'
  },
  {
    id: 'ofc-002',
    name: 'Falmar Ergonomic Task Chair',
    category: 'office',
    categoryLabel: 'Office',
    price: 12800,
    currency: 'EGP',
    description: 'High-back ergonomic task chair by Falmar with adjustable lumbar support, 4D armrests, mesh back with breathable fabric seat, and synchronized tilt mechanism. BIFMA certified.',
    specs: ['Seat height: 42–52 cm', 'Back height: 60 cm', 'Armrests: 4D adjustable', 'Mechanism: Synchronized tilt', 'Partner: Falmar'],
    image: '/images/office.png'
  },

  // ── Control Room ──
  {
    id: 'ctrl-001',
    name: 'Bosco Operator Console',
    category: 'control-room',
    categoryLabel: 'Control Room',
    price: 89000,
    currency: 'EGP',
    description: 'Mission-critical operator console by Elettromeccanica Bosco for 24/7 control room environments. Supports up to 6 monitors with height-adjustable work surface, integrated cable management, and modular expansion capability.',
    specs: ['Work surface: 200 x 90 cm, adjustable', 'Monitor support: Up to 6 × 24"', 'Cable management: Integrated channels', 'Power: Built-in outlets and USB', 'Partner: Elettromeccanica Bosco'],
    image: '/images/control-room.png'
  },
  {
    id: 'ctrl-002',
    name: 'Control Room 24/7 Operator Chair',
    category: 'control-room',
    categoryLabel: 'Control Room',
    price: 24500,
    currency: 'EGP',
    description: 'Heavy-duty 24/7 rated operator chair designed for round-the-clock shift work. Features weight-sensing auto-tension, memory foam seat, height and depth adjustable arms, and reinforced gas lift rated for continuous use.',
    specs: ['Weight capacity: 150 kg', 'Rating: 24/7 continuous use', 'Seat: Memory foam, 55 x 50 cm', 'Armrests: Height and depth adjustable', 'Gas lift: Heavy-duty, 100,000 cycles'],
    image: '/images/control-room.png'
  },

  // ── Healthcare & Laboratory ──
  {
    id: 'hc-001',
    name: 'Medical Examination Table',
    category: 'healthcare',
    categoryLabel: 'Healthcare & Laboratory',
    price: 15600,
    currency: 'EGP',
    description: 'Height-adjustable medical examination table with antimicrobial vinyl upholstery, paper roll holder, stirrups, and steel frame with powder-coated finish. Easy to clean and disinfect.',
    specs: ['Surface: 185 x 60 cm', 'Height: 55–85 cm, adjustable', 'Upholstery: Antimicrobial vinyl', 'Frame: Powder-coated steel', 'Weight capacity: 200 kg'],
    image: '/images/healthcare.png'
  },
  {
    id: 'hc-002',
    name: 'Laboratory Workbench System',
    category: 'healthcare',
    categoryLabel: 'Healthcare & Laboratory',
    price: 31200,
    currency: 'EGP',
    description: 'Chemical-resistant laboratory workbench with phenolic resin top, integrated reagent shelving, under-bench storage cabinets, and utility connections for gas and water. Modular design allows future expansion.',
    specs: ['Work surface: 180 x 75 cm', 'Top: Phenolic resin, chemical-resistant', 'Shelving: 2-tier reagent rack', 'Cabinets: Acid-resistant coating', 'Utilities: Gas, water, electric pre-fitted'],
    image: '/images/healthcare.png'
  },

  // ── Airport ──
  {
    id: 'air-001',
    name: 'Terminal Beam Seating (6-seat)',
    category: 'airport',
    categoryLabel: 'Airport Furniture & Equipment',
    price: 22800,
    currency: 'EGP',
    description: 'Heavy-duty tandem beam seating unit for airport terminals. Six-seat configuration with armrests, anti-vandal fixings, and optional power/USB modules. Designed for high-traffic public spaces.',
    specs: ['Configuration: 6 seats on beam', 'Seat: Injection-molded PP, fire-rated', 'Frame: Heavy-gauge steel tube', 'Fixing: Floor-mounted, anti-vandal', 'Options: Power, USB, tablet arm'],
    image: '/images/healthcare.png'
  },
  {
    id: 'air-002',
    name: 'VIP Lounge Sofa Module',
    category: 'airport',
    categoryLabel: 'Airport Furniture & Equipment',
    price: 37500,
    currency: 'EGP',
    description: 'Premium modular lounge sofa for airport VIP and business class areas. Leather upholstery, integrated power outlet, USB charging port, and privacy side panels. Configurable in 2-seat and 3-seat modules.',
    specs: ['Module: 2-seat, 160 x 80 x 85 cm', 'Upholstery: Commercial-grade leather', 'Power: Built-in outlet + USB-C', 'Privacy panels: Acoustic fabric', 'Fire rating: BS 5852 compliant'],
    image: '/images/healthcare.png'
  }
];

function getAllProducts() {
  return products;
}

function getProductById(id) {
  return products.find(p => p.id === id) || null;
}

function getProductsByCategory(category) {
  return products.filter(p => p.category === category);
}

function getCategories() {
  return [
    { slug: 'residential', label: 'Residential', image: '/images/residential.png' },
    { slug: 'hospitality', label: 'Hospitality', image: '/images/hotel.png' },
    { slug: 'office', label: 'Office', image: '/images/office.png' },
    { slug: 'control-room', label: 'Control Room', image: '/images/control-room.png' },
    { slug: 'healthcare', label: 'Healthcare & Laboratory', image: '/images/healthcare.png' },
    { slug: 'airport', label: 'Airport Furniture & Equipment', image: '/images/healthcare.png' }
  ];
}

module.exports = { getAllProducts, getProductById, getProductsByCategory, getCategories };
