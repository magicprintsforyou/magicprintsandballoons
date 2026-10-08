import { Product } from '../types';

export const CATEGORIZED_PRODUCTS = {
  photoBoards: {
    title: "Premium Photo Boards & Panels",
    description: "Museum-grade rigid substrates for high-impact backdrops and displays.",
    image: "/images/photo-board-9856.jpg",
    items: [
      {
        id: "luxury-welcome-sign",
        name: "Luxury Event Welcome Sign",
        category: "Signage",
        image: "/images/welcome-sign-easel.jpg",
        description: "Bespoke acrylic or foam board welcome board with UV print and custom vinyl lettering.",
        themes: ["wedding", "corporate", "quinceanera", "birthday"],
        variants: [
          { size: "24 in. x 36 in.", price: 120.00 },
          { size: "30 in. x 40 in.", price: 160.00 },
          { size: "36 in. x 48 in.", price: 210.00 },
        ]
      },
      {
        id: "standard-photo-board",
        name: "Standard Photo Board",
        category: "Photo",
        image: "/images/photo-board-9856.jpg",
        description: "Museum-grade foam board or Sintra material with scratch-resistant matte finish.",
        themes: ["wedding", "birthday", "corporate", "graduation"],
        price: 120.00,
        variants: [
          { size: "5x4 ft", price: 120.00 },
          { size: "6x4 ft", price: 130.00 },
          { size: "7x4 ft", price: 150.00 },
          { size: "7x8 ft", price: 160.00 },
          { size: "6x6 ft", price: 260.00 },
          { size: "7x7 ft", price: 300.00 },
          { size: "8x8 ft", price: 320.00 },
          { size: "8x10 ft", price: 480.00 },
          { size: "8x12 ft", price: 590.00 },
          { size: "8x20 ft", price: 950.00 },
        ]
      },
      {
        id: "custom-seating-chart",
        name: "Custom Seating Chart",
        category: "Photo",
        image: "/images/photo-board-9856.jpg",
        description: "Elegant seating charts for weddings and quinceañeras. Design fee $20 additional — free if you already have your design.",
        themes: ["wedding", "quinceanera", "birthday", "corporate"],
        price: 120.00,
        variants: [
          { size: "5x4 ft", price: 120.00 },
          { size: "6x4 ft", price: 130.00 },
          { size: "7x4 ft", price: 150.00 },
          { size: "7x8 ft", price: 160.00 },
        ]
      },
      {
        id: "backdrop-panel",
        name: "Backdrop Rigid Panel",
        category: "Photo",
        image: "/images/backdrop-6x4-size-reference.jpg",
        description: "Perfect for vinyl decals or custom painting. Seamless high-density boards.",
        themes: ["safari", "barbie", "birthday"],
        variants: [
          { size: "6ft x 4ft Panel", price: 100.00 },
          { size: "7ft x 4ft Panel", price: 140.00 },
          { size: "8ft x 4ft Panel", price: 180.00 },
        ]
      },
      {
        id: "step-repeat-backdrop",
        name: "Step & Repeat Backdrop (Media Wall)",
        category: "Backdrop",
        image: "/images/covers/step-repeat-backdrop.jpg",
        description: "Premium polyester fabric or heavy-duty vinyl media wall with repeating logos. Matte finish prevents photo reflections. Includes free 5-7 day shipping. / Muro de prensa premium de tela poliéster o vinilo resistente con logos repetidos. Acabado mate antirreflejos. Envío estándar gratis (5-7 días).",
        themes: ["corporate", "wedding", "quinceanera", "birthday", "expo"],
        materials: ["Premium Polyester Fabric", "Heavy-Duty 13oz Matte Vinyl"],
        variants: [
          { size: "8ft x 8ft (Banner Only)", price: 264.00 },
          { size: "8ft x 8ft (Banner + Stand)", price: 464.75 },
          { size: "10ft x 8ft (Banner Only)", price: 330.00 },
          { size: "10ft x 8ft (Banner + Stand)", price: 492.25 },
          { size: "10ft x 10ft (Banner Only)", price: 387.50 },
          { size: "10ft x 10ft (Banner + Stand)", price: 550.00 }
        ],
        rush_price: 60.00,
        rush_label: "Express 2-Day Shipping",
        rush_desc: "Deliver in 2 business days instead of standard 5-7 days."
      },
      {
        id: "non-lit-seg-display",
        name: "Non-Lit SEG Fabric Display",
        category: "Backdrop",
        image: "/images/covers/non-lit-seg-display.jpg",
        description: "Slim profile aluminum frame with silicone edge fabric graphics (SEG). Easy slide-in installation, wrinkle-free tension fabric. Standard 5-7 day shipping included. / Estructura de aluminio de perfil delgado con tela de borde de silicona (SEG). Instalación sin arrugas. Envío estándar gratis (5-7 días).",
        themes: ["corporate", "expo", "retail"],
        materials: ["9oz Tension Fabric"],
        variants: [
          { size: "3ft (Non-Lit Slim Frame)", price: 219.80 },
          { size: "10ft (Non-Lit Slim Frame)", price: 659.80 },
          { size: "20ft (Non-Lit Slim Frame)", price: 1295.80 }
        ],
        rush_price: 150.00,
        rush_label: "Express 2-Day Shipping",
        rush_desc: "Deliver in 2 business days instead of standard 5-7 days."
      },
      {
        id: "slim-backlit-seg",
        name: "Slim Backlit SEG LED Display",
        category: "Backdrop",
        image: "/images/covers/slim-backlit-seg.jpg",
        description: "Ultra-thin aluminum light box with internal LED illumination. Seamless silicone edge fabric graphics (SEG) glow beautifully. Standard 5-7 day shipping included. / Caja de luz de aluminio ultra delgada con iluminación LED interna. Gráficos de tela SEG con brillo espectacular. Envío estándar gratis (5-7 días).",
        themes: ["corporate", "expo", "retail"],
        materials: ["LED Backlit Tension Fabric"],
        variants: [
          { size: "10ft (Backlit Slim Frame)", price: 1799.80 }
        ],
        rush_price: 250.00,
        rush_label: "Express 2-Day Shipping",
        rush_desc: "Deliver in 2 business days instead of standard 5-7 days."
      },
      {
        id: "backlit-seg-popup",
        name: "Backlit SEG LED Popup Display",
        category: "Backdrop",
        image: "/images/covers/backlit-seg-popup.jpg",
        description: "Illuminated popup frame with graphics extending to the edges. Tool-free assembly with quick-connect LED bars. Standard 5-7 day shipping included. / Estructura popup retroiluminada con LEDs de conexión rápida. Gráficos de tela que cubren los bordes. Envío estándar gratis (5-7 días).",
        themes: ["corporate", "expo", "retail"],
        materials: ["LED Backlit Tension Fabric"],
        variants: [
          { size: "8ft SEG Backlit Popup", price: 1735.58 },
          { size: "10ft SEG Backlit Popup", price: 2199.78 }
        ],
        rush_price: 300.00,
        rush_label: "Express 2-Day Shipping",
        rush_desc: "Deliver in 2 business days instead of standard 5-7 days."
      },
      {
        id: "curved-tension-fabric",
        name: "Curved Tension Fabric Display",
        category: "Backdrop",
        image: "/images/covers/curved-tension-fabric.jpg",
        description: "Premium curved aluminum tube frame with a pillowcase stretch fabric graphic. Easy tool-free assembly, travel bag included. Standard 5-7 day shipping included. / Estructura curva premium de tubos de aluminio con gráfico de tela elástica tipo funda. Armado rápido sin herramientas y bolsa de viaje incluida. Envío estándar gratis (5-7 días).",
        themes: ["corporate", "expo", "wedding"],
        materials: ["8.8 oz. Tension Fabric"],
        variants: [
          { size: "6ft Curved Display (Frame + Graphic)", price: 482.60 },
          { size: "8ft Curved Display (Frame + Graphic)", price: 627.00 },
          { size: "10ft Curved Display (Frame + Graphic)", price: 652.60 }
        ],
        rush_price: 90.00,
        rush_label: "Express 2-Day Shipping",
        rush_desc: "Deliver in 2 business days instead of standard 5-7 days."
      }
    ]
  },
  props: {
    title: "Foam Board Props & Cut-outs",
    description: "Life-size figures and character props for immersive event themes.",
    image: "/images/covers/themed-props.jpg",
    items: [
      {
        id: "themed-props",
        name: "Custom Life-Size Cutout",
        category: "Props",
        image: "/images/covers/themed-props.jpg",
        description: "Custom photo cutouts on durable coroplast with a matching stand. Perfect for birthdays, graduations, weddings and quinceañeras.",
        themes: ["kids birthday", "barbie", "safari", "superhero", "graduation", "wedding"],
        price: 40.00,
        variants: [
          { size: "2 ft", price: 40.00 },
          { size: "3 ft", price: 45.00 },
          { size: "4 ft", price: 65.00 },
          { size: "5 ft", price: 85.00 },
          { size: "6 ft", price: 95.00 },
        ]
      }
    ]
  },
  floorWraps: {
    title: "Luxury Floor Wraps",
    description: "Turn your event floor into a canvas with high-density non-slip vinyl.",
    image: "/images/floor-wrap-wedding.jpg",
    items: [
      {
        id: "custom-floor-wrap",
        name: "Custom Vinyl Floor Wrap",
        category: "Floor",
        image: "/images/floor-wrap-wedding.jpg",
        description: "Custom printed floor wraps with non-slip vinyl. Design included. Installation and delivery available at an additional cost.",
        themes: ["wedding", "corporate", "party", "dance"],
        price: 250.00,
        variants: [
          { size: "8x8 ft", price: 250.00 },
          { size: "9x9 ft", price: 280.00 },
          { size: "10x10 ft", price: 350.00 },
          { size: "12x12 ft", price: 510.00 },
          { size: "14x14 ft", price: 750.00 },
          { size: "15x15 ft", price: 780.00 },
          { size: "16x16 ft", price: 890.00 },
          { size: "18x18 ft", price: 1200.00 },
          { size: "20x20 ft", price: 1700.00 },
          { size: "12x24 ft", price: 1020.00 },
        ]
      }
    ]
  },
  themedKits: {
    title: "Signature Event Packages",
    description: "Curated kits with everything you need for a professional themed setup.",
    image: "/images/covers/grand-production-kit.jpg",
    items: [
      {
        id: "essential-kit",
        name: "Essential Event Kit",
        category: "Signature",
        image: "/images/covers/essential-kit.jpg",
        description: "The perfect starting point for any small-to-medium event.",
        price: 320.00,
        includes: ["1 Rigid Backdrop Panel", "1 Custom Floor Mat (4x3)", "1 Life-size 2ft Prop"],
        themes: ["birthday", "baby shower", "kids party"]
      },
      {
        id: "deluxe-party-suite",
        name: "Deluxe Party Suite",
        category: "Signature",
        image: "/images/covers/deluxe-party-suite.jpg",
        description: "Our most popular package for high-impact birthdays and celebrations.",
        price: 550.00,
        includes: ["1 Large Backdrop (8x8)", "2 Character Props (3ft)", "1 Custom Name Decal"],
        themes: ["barbie", "safari", "graduation"]
      },
      {
        id: "grand-production-kit",
        name: "Grand Production Kit",
        category: "Signature",
        image: "/images/covers/grand-production-kit.jpg",
        description: "A full museum-grade production for elite corporate and social events.",
        price: 850.00,
        includes: ["2 Giant Backdrop Panels", "3 Props of any size", "1 Large Floor Wrap (8x8)"],
        themes: ["corporate", "wedding", "luxury party"]
      }
    ]
  },
  essentials: {
    title: "Event Essentials & Banner Stands",
    description: "Professional banner displays, retractable stands, custom advertising flags, and premium signage. Standard 5-7 day shipping included.",
    image: "/images/covers/standard-retractable.jpg",
    items: [
      {
        id: "standard-retractable",
        name: "Standard Retractable Banner",
        category: "Essentials",
        image: "/images/covers/standard-retractable.jpg",
        description: "Economic and compact retractable banner stand. Easy assembly, perfect for exhibitions and store entryways. Includes free 5-7 day shipping. / Banner roll-up estándar económico y compacto. Fácil armado, ideal para ferias y entradas comerciales. Envío estándar gratis (5-7 días).",
        themes: ["corporate", "expo", "retail", "wedding"],
        materials: ["13oz Matte Vinyl", "Premium Block-out Fabric"],
        variants: [
          { size: "33 in. x 81 in. (Standard)", price: 137.50 },
          { size: "47 in. x 81 in. (Grand)", price: 280.00 }
        ],
        rush_price: 45.00,
        rush_label: "Express 2-Day Shipping",
        rush_desc: "Deliver in 2 business days instead of standard 5-7 days."
      },
      {
        id: "deluxe-retractable",
        name: "Deluxe Retractable Banner",
        category: "Essentials",
        image: "/images/covers/deluxe-retractable.jpg",
        description: "Upgraded heavy-duty retractable banner hardware with a stylish wide base. Available in single or double-sided print. Includes free 5-7 day shipping. / Banner roll-up de lujo con base de aluminio pesada y elegante. Impresión a una o doble cara. Envío estándar gratis (5-7 días).",
        themes: ["corporate", "expo", "retail"],
        materials: ["13oz Matte Vinyl", "Premium Block-out Fabric"],
        variants: [
          { size: "33 in. x 81 in. (Single Sided)", price: 206.00 },
          { size: "33 in. x 81 in. (Double Sided)", price: 509.00 }
        ],
        rush_price: 55.00,
        rush_label: "Express 2-Day Shipping",
        rush_desc: "Deliver in 2 business days instead of standard 5-7 days."
      },
      {
        id: "tension-fabric-stand",
        name: "Tension Fabric Banner Stand",
        category: "Essentials",
        image: "/images/covers/tension-fabric-stand.jpg",
        description: "Premium heavy-duty stand with a stretch fabric sleeve. Washable, dye-sublimated double-sided graphics for a seamless look. Includes free 5-7 day shipping. / Estructura premium de alta resistencia con funda de tela elástica. Gráfico lavable de doble cara sin costuras. Envío estándar gratis (5-7 días).",
        themes: ["corporate", "expo", "retail"],
        materials: ["Stretch Fabric Sleeve"],
        variants: [
          { size: "36 in. x 90 in.", price: 357.50 },
          { size: "48 in. x 90 in.", price: 412.50 }
        ],
        rush_price: 70.00,
        rush_label: "Express 2-Day Shipping",
        rush_desc: "Deliver in 2 business days instead of standard 5-7 days."
      },
      {
        id: "x-stand-banner",
        name: "X-Frame Banner Stand",
        category: "Essentials",
        image: "/images/covers/x-stand-banner.jpg",
        description: "Ultra lightweight and economical banner stand. Features a flexible tripod mechanism for easy graphic changes. Includes free 5-7 day shipping. / Banner económico con estructura de trípode en X ligera. Sistema flexible para cambiar de gráfico de forma rápida. Envío estándar gratis (5-7 días).",
        themes: ["corporate", "expo", "retail", "birthday"],
        materials: ["13oz Matte Vinyl"],
        variants: [
          { size: "24 in. x 63 in. (Standard)", price: 75.50 },
          { size: "32 in. x 71 in. (Large)", price: 103.00 }
        ],
        rush_price: 25.00,
        rush_label: "Express 2-Day Shipping",
        rush_desc: "Deliver in 2 business days instead of standard 5-7 days."
      },
      {
        id: "table-top-banner",
        name: "Table-Top Banner Stand (Mini)",
        category: "Essentials",
        image: "/images/covers/table-top-banner.jpg",
        description: "Mini retractable banner stand, perfect for registration desks, POS checkouts, restaurant menus, and table displays. Includes free 5-7 day shipping. / Mini banner roll-up para mesa, ideal para recepciones, cajas registradoras, menús y mostradores. Envío estándar gratis (5-7 días).",
        themes: ["corporate", "expo", "retail", "wedding"],
        materials: ["13oz Matte Vinyl"],
        variants: [
          { size: "11.5 in. x 17.5 in. (Mini)", price: 55.00 }
        ],
        rush_price: 15.00,
        rush_label: "Express 2-Day Shipping",
        rush_desc: "Deliver in 2 business days instead of standard 5-7 days."
      },
      {
        id: "feather-angled-flag",
        name: "Feather Angled Flag",
        category: "Flags",
        image: "/images/covers/feather-angled-flag.jpg",
        description: "Premium angled feather flag for high visibility indoor and outdoor branding. Includes ground spike or cross base options. Standard 5-7 day shipping included. / Bandera pluma angular premium para publicidad de alto impacto en interiores y exteriores. Incluye estaca para tierra o base en cruz. Envío estándar gratis (5-7 días).",
        themes: ["corporate", "expo", "retail"],
        materials: ["Premium Polyester Fabric"],
        variants: [
          { size: "Small 9 ft.", price: 164.00 },
          { size: "Medium 10.5 ft.", price: 164.00 },
          { size: "Large 14 ft. (Popular)", price: 175.00 },
          { size: "X-Large 18 ft.", price: 220.00 }
        ],
        rush_price: 35.00,
        rush_label: "Express 2-Day Shipping",
        rush_desc: "Deliver in 2 business days instead of standard 5-7 days."
      },
      {
        id: "feather-convex-flag",
        name: "Feather Convex Flag",
        category: "Flags",
        image: "/images/covers/feather-convex-flag.jpg",
        description: "Sleek convex bottom feather flag designed to stand out. Ideal for retail stores and outdoor corporate events. Standard 5-7 day shipping included. / Bandera pluma convexa elegante diseñada para destacar. Ideal para tiendas y eventos corporativos al aire libre. Envío estándar gratis (5-7 días).",
        themes: ["corporate", "expo", "retail"],
        materials: ["Premium Polyester Fabric"],
        variants: [
          { size: "Small 9 ft.", price: 164.00 },
          { size: "Medium 10.5 ft.", price: 164.00 },
          { size: "Large 14 ft.", price: 175.00 },
          { size: "X-Large 18 ft.", price: 220.00 }
        ],
        rush_price: 35.00,
        rush_label: "Express 2-Day Shipping",
        rush_desc: "Deliver in 2 business days instead of standard 5-7 days."
      },
      {
        id: "teardrop-flag",
        name: "Teardrop Advertising Flag",
        category: "Flags",
        image: "/images/covers/teardrop-flag.jpg",
        description: "Distinctive teardrop shape keeps the flag taut even in light wind. High-impact visibility for festivals, markets, and shopfronts. Standard 5-7 day shipping included. / Bandera de gota publicitaria de alta resistencia. Mantiene la tela tensada con el viento. Ideal para festivales y fachadas. Envío estándar gratis (5-7 días).",
        themes: ["corporate", "expo", "retail"],
        materials: ["Premium Polyester Fabric"],
        variants: [
          { size: "Small 7 ft.", price: 164.00 },
          { size: "Medium 9 ft.", price: 164.00 },
          { size: "Large 11.2 ft.", price: 175.00 },
          { size: "X-Large 13.5 ft.", price: 220.00 }
        ],
        rush_price: 35.00,
        rush_label: "Express 2-Day Shipping",
        rush_desc: "Deliver in 2 business days instead of standard 5-7 days."
      },
      {
        id: "rectangle-flag",
        name: "Rectangle Advertising Flag",
        category: "Flags",
        image: "/images/covers/rectangle-flag.jpg",
        description: "Large rectangular fabric flag offering maximum print space for company logos and messaging. Complete with hardware and stand. Standard 5-7 day shipping included. / Bandera rectangular de gran formato para máxima área de impresión de logos corporativos. Incluye estructura y base. Envío estándar gratis (5-7 días).",
        themes: ["corporate", "expo", "retail"],
        materials: ["Premium Polyester Fabric"],
        variants: [
          { size: "Small 8.5 ft.", price: 257.00 },
          { size: "Medium 11.8 ft.", price: 286.00 },
          { size: "Large 15 ft.", price: 315.00 }
        ],
        rush_price: 45.00,
        rush_label: "Express 2-Day Shipping",
        rush_desc: "Deliver in 2 business days instead of standard 5-7 days."
      },
      {
        id: "econo-feather-flag",
        name: "Econo Feather Flag (16ft)",
        category: "Flags",
        image: "/images/covers/econo-feather-flag.jpg",
        description: "Economical outdoor feather flag. Single-sided print that flutters gracefully in the wind. Includes ground spike stand. Standard 5-7 day shipping included. / Bandera pluma económica para exteriores. Impresión a una cara que ondea con el viento. Incluye estaca para tierra. Envío estándar gratis (5-7 días).",
        themes: ["corporate", "expo", "retail"],
        materials: ["Premium Polyester Fabric"],
        variants: [
          { size: "One Size 16 ft.", price: 190.00 }
        ],
        rush_price: 30.00,
        rush_label: "Express 2-Day Shipping",
        rush_desc: "Deliver in 2 business days instead of standard 5-7 days."
      },
      {
        id: "custom-pole-flag",
        name: "Custom Pole Flag",
        category: "Flags",
        image: "/images/covers/custom-pole-flag.jpg",
        description: "Double-sided or single-sided custom flag with grommet strips for standard flagpole installations. Full color high-definition prints. Standard 5-7 day shipping included. / Bandera clásica para mástil con ojales metálicos. Impresión en alta definición a una o doble cara. Envío estándar gratis (5-7 días).",
        themes: ["corporate", "expo", "retail", "wedding"],
        materials: ["Premium Polyester Fabric"],
        variants: [
          { size: "3ft x 2ft", price: 49.50 },
          { size: "5ft x 3ft", price: 124.00 },
          { size: "6ft x 4ft", price: 198.00 }
        ],
        rush_price: 15.00,
        rush_label: "Express 2-Day Shipping",
        rush_desc: "Deliver in 2 business days instead of standard 5-7 days."
      }
    ]
  },
  latexBalloons: {
    title: "Latex Balloons by Brand",
    description: "Professional latex balloons organized by brand — SemperTex and TufTex, the names balloon decorators trust. Pick your brand, size and finish. Ships nationwide, uninflated.",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800",
    items: [
      {
        id: "sempertex-11in",
        name: "SemperTex 11\" Latex Balloons",
        category: "SemperTex",
        image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800",
        description: "The industry standard. SemperTex 11\" balloons with rich, consistent color — the workhorse for garlands, arches, bouquets and centerpieces. Available in Deluxe, Fashion, Pastel Matte, Pearl, Metallic, Reflex and Neon finishes. Ships uninflated.",
        themes: ["birthday", "wedding", "quinceanera", "graduation", "baby shower", "corporate"],
        materials: ["Natural Latex", "SemperTex"],
        fulfillment: "ships",
        price: 19.99,
        variants: [
          { size: "11\" — Pack of 50", price: 11.99 },
          { size: "11\" — Pack of 100", price: 19.99 }
        ]
      },
      {
        id: "sempertex-5in",
        name: "SemperTex 5\" Latex Balloons",
        category: "SemperTex",
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800",
        description: "Small but mighty. 5\" SemperTex balloons for filling out garlands, balloon walls and detailed decor work. Ships uninflated.",
        themes: ["birthday", "wedding", "quinceanera", "baby shower"],
        materials: ["Natural Latex", "SemperTex"],
        fulfillment: "ships",
        price: 8.99,
        variants: [
          { size: "5\" — Pack of 100", price: 8.99 }
        ]
      },
      {
        id: "sempertex-18in",
        name: "SemperTex 18\" Latex Balloons",
        category: "SemperTex",
        image: "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?q=80&w=800",
        description: "Big statement balloons. 18\" SemperTex rounds for dramatic focal pieces, photo moments and venue entrances. Ships uninflated.",
        themes: ["birthday", "wedding", "quinceanera", "graduation", "corporate"],
        materials: ["Natural Latex", "SemperTex"],
        fulfillment: "ships",
        price: 14.99,
        variants: [
          { size: "18\" — Pack of 25", price: 14.99 }
        ]
      },
      {
        id: "sempertex-24in",
        name: "SemperTex 24\" Latex Balloons",
        category: "SemperTex",
        image: "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?q=80&w=800",
        description: "Giant 24\" SemperTex balloons — the showstopper for grand entrances, stage decor and unforgettable photos. Ships uninflated.",
        themes: ["wedding", "quinceanera", "graduation", "corporate", "birthday"],
        materials: ["Natural Latex", "SemperTex"],
        fulfillment: "ships",
        price: 26.99,
        variants: [
          { size: "24\" — Pack of 10", price: 26.99 }
        ]
      },
      {
        id: "sempertex-36in",
        name: "SemperTex 36\" Jumbo Latex Balloons",
        category: "SemperTex",
        image: "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?q=80&w=800",
        description: "The biggest of them all. 36\" jumbo SemperTex balloons for jaw-dropping installs. Ships uninflated.",
        themes: ["wedding", "quinceanera", "corporate", "birthday"],
        materials: ["Natural Latex", "SemperTex"],
        fulfillment: "ships",
        price: 8.99,
        variants: [
          { size: "36\" — Pack of 2", price: 8.99 }
        ]
      },
      {
        id: "tuftex-11in",
        name: "TufTex 11\" Latex Balloons",
        category: "TufTex",
        image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800",
        description: "Made in the USA. TufTex 11\" balloons are a decorator favorite for their durability and gorgeous matte and pearl finishes — including the popular retro and muted tones. Ships uninflated.",
        themes: ["birthday", "wedding", "quinceanera", "graduation", "baby shower", "corporate"],
        materials: ["Natural Latex", "TufTex"],
        fulfillment: "ships",
        price: 18.99,
        variants: [
          { size: "11\" — Pack of 50", price: 10.99 },
          { size: "11\" — Pack of 100", price: 18.99 }
        ]
      },
      {
        id: "tuftex-17in",
        name: "TufTex 17\" Latex Balloons",
        category: "TufTex",
        image: "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?q=80&w=800",
        description: "The in-between showpiece. 17\" TufTex rounds in matte, pearl and crystal finishes — perfect for adding dimension to garlands and bouquets. Ships uninflated.",
        themes: ["birthday", "wedding", "quinceanera", "baby shower", "graduation"],
        materials: ["Natural Latex", "TufTex"],
        fulfillment: "ships",
        price: 16.99,
        variants: [
          { size: "17\" — Pack of 50", price: 16.99 }
        ]
      },
      {
        id: "tuftex-24in",
        name: "TufTex 24\" Latex Balloons",
        category: "TufTex",
        image: "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?q=80&w=800",
        description: "Giant 24\" TufTex balloons with that signature strong latex and beautiful matte finish. A bold anchor for entrances and photo walls. Ships uninflated.",
        themes: ["wedding", "quinceanera", "corporate", "birthday", "graduation"],
        materials: ["Natural Latex", "TufTex"],
        fulfillment: "ships",
        price: 29.99,
        variants: [
          { size: "24\" — Pack of 25", price: 29.99 }
        ]
      }
    ]
  },
  foilBalloons: {
    title: "Foil Balloons by Theme",
    description: "Shiny, long-lasting foil balloons organized the way party pros shop — by theme. Numbers, letters, shapes and occasion prints. Sold uninflated and shipped nationwide, or pick up inflated with helium in Arlington.",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800",
    items: [
      {
        id: "foil-numbers",
        name: "Jumbo Number Foil Balloons (0–9)",
        category: "Numbers",
        image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800",
        description: "The milestone must-have. Giant 34\" foil numbers in gold, silver, rose gold and more — pick any digit 0–9. Self-sealing valve. Ships uninflated; helium inflation available at pickup in Arlington.",
        themes: ["birthday", "graduation", "anniversary", "quinceanera"],
        materials: ["Foil", "Self-Sealing Valve"],
        fulfillment: "ships",
        price: 6.99,
        variants: [
          { size: "34\" Single Number (0–9)", price: 6.99 },
          { size: "34\" Number Pair", price: 12.99 }
        ]
      },
      {
        id: "foil-letters",
        name: "Letter Foil Balloons (A–Z)",
        category: "Letters",
        image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800",
        description: "Spell names, words and messages. 16\" gold and silver script letters — air-fillable, no helium needed, with tabs for easy hanging. Ships uninflated.",
        themes: ["birthday", "wedding", "baby shower", "graduation", "bridal shower"],
        materials: ["Foil", "Hanging Tabs"],
        fulfillment: "ships",
        price: 4.99,
        variants: [
          { size: "16\" Single Letter (A–Z)", price: 4.99 },
          { size: "16\" 4-Letter Word Set", price: 17.99 }
        ]
      },
      {
        id: "foil-stars",
        name: "Star Foil Balloons",
        category: "Shapes",
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800",
        description: "Classic 19\" foil stars in every party color — the easiest way to add shine to bouquets, columns and backdrops. Self-sealing. Ships uninflated.",
        themes: ["birthday", "graduation", "corporate", "quinceanera"],
        materials: ["Foil", "Self-Sealing Valve"],
        fulfillment: "ships",
        price: 12.99,
        variants: [
          { size: "19\" Single Star", price: 2.99 },
          { size: "19\" Star — Pack of 5", price: 12.99 }
        ]
      },
      {
        id: "foil-hearts",
        name: "Heart Foil Balloons",
        category: "Shapes",
        image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800",
        description: "Sweet 18\" foil hearts for weddings, anniversaries, Valentine's Day and bridal showers. Self-sealing. Ships uninflated.",
        themes: ["wedding", "anniversary", "bridal shower", "valentine"],
        materials: ["Foil", "Self-Sealing Valve"],
        fulfillment: "ships",
        price: 12.99,
        variants: [
          { size: "18\" Single Heart", price: 2.99 },
          { size: "18\" Heart — Pack of 5", price: 12.99 }
        ]
      },
      {
        id: "foil-rounds",
        name: "Round Foil Balloons",
        category: "Shapes",
        image: "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?q=80&w=800",
        description: "Versatile 18\" round foils — solid colors, satin finishes and fun prints. Float for days with helium or hang air-filled. Ships uninflated.",
        themes: ["birthday", "wedding", "corporate", "graduation", "baby shower"],
        materials: ["Foil", "Self-Sealing Valve"],
        fulfillment: "ships",
        price: 12.99,
        variants: [
          { size: "18\" Single Round", price: 2.99 },
          { size: "18\" Round — Pack of 5", price: 12.99 }
        ]
      },
      {
        id: "foil-birthday",
        name: "Happy Birthday Foil Balloons",
        category: "Birthday",
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800",
        description: "Birthday-themed foil prints — \"Happy Birthday\" scripts, confetti designs and age-specific styles for kids, teens and milestone years. Ships uninflated.",
        themes: ["birthday"],
        materials: ["Foil", "Self-Sealing Valve"],
        fulfillment: "ships",
        price: 3.99,
        variants: [
          { size: "18\" Birthday Foil — Single", price: 3.99 },
          { size: "18\" Birthday Foil — Pack of 3", price: 10.99 }
        ]
      },
      {
        id: "foil-baby",
        name: "Baby Shower & Gender Reveal Foil Balloons",
        category: "Baby Shower",
        image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800",
        description: "\"It's a Boy\", \"It's a Girl\", baby bottles, rattles and oh-baby scripts in soft pinks, blues and neutrals. Ships uninflated.",
        themes: ["baby shower", "gender reveal"],
        materials: ["Foil", "Self-Sealing Valve"],
        fulfillment: "ships",
        price: 3.99,
        variants: [
          { size: "18\" Baby Foil — Single", price: 3.99 },
          { size: "18\" Baby Foil — Pack of 3", price: 10.99 }
        ]
      },
      {
        id: "foil-wedding",
        name: "Wedding & Anniversary Foil Balloons",
        category: "Wedding",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800",
        description: "\"Mr & Mrs\", \"Just Married\", \"I Do\" and anniversary scripts in elegant gold, silver and white. Ships uninflated.",
        themes: ["wedding", "anniversary", "bridal shower"],
        materials: ["Foil", "Self-Sealing Valve"],
        fulfillment: "ships",
        price: 3.99,
        variants: [
          { size: "18\" Wedding Foil — Single", price: 3.99 },
          { size: "18\" Wedding Foil — Pack of 3", price: 10.99 }
        ]
      },
      {
        id: "foil-holiday",
        name: "Holiday Foil Balloons",
        category: "Holiday",
        image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=800",
        description: "Seasonal foil prints — Christmas, Halloween, Thanksgiving, New Year's and more. Festive shapes and messages that change with the calendar. Ships uninflated.",
        themes: ["christmas", "halloween", "holiday"],
        materials: ["Foil", "Self-Sealing Valve"],
        fulfillment: "ships",
        price: 3.99,
        variants: [
          { size: "18\" Holiday Foil — Single", price: 3.99 },
          { size: "18\" Holiday Foil — Pack of 3", price: 10.99 }
        ]
      }
    ]
  },
  heliumBalloons: {
    title: "Helium Balloons — Pickup Only",
    description: "Fresh helium balloons, inflated in-store and ready for your event. Singles and bunches — order ahead and pick up in Arlington, TX. Helium can't ship!",
    image: "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?q=80&w=800",
    items: [
      {
        id: "helium-single-latex",
        name: "Single Helium Latex Balloon",
        category: "Individual",
        image: "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?q=80&w=800",
        description: "One 11\" latex balloon (SemperTex or TufTex) filled with helium, tied with ribbon and weighted. Pick your color. Pickup in Arlington only.",
        themes: ["birthday", "graduation", "baby shower", "anniversary"],
        materials: ["Latex", "Helium", "Ribbon"],
        fulfillment: "pickup",
        price: 3.49,
        variants: [
          { size: "Single 11\" Helium Latex", price: 3.49 }
        ]
      },
      {
        id: "helium-single-foil",
        name: "Single Helium Foil Balloon",
        category: "Individual",
        image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800",
        description: "One foil balloon — star, heart, round or themed print — filled with helium and ready to float for days. Pickup in Arlington only.",
        themes: ["birthday", "wedding", "graduation", "baby shower"],
        materials: ["Foil", "Helium", "Ribbon"],
        fulfillment: "pickup",
        price: 6.99,
        variants: [
          { size: "Single 18–19\" Helium Foil", price: 6.99 },
          { size: "Single 34\" Helium Number", price: 14.99 }
        ]
      },
      {
        id: "helium-latex-bouquet",
        name: "Helium Latex Bouquet",
        category: "Bunches",
        image: "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?q=80&w=800",
        description: "A hand-tied bunch of helium-filled latex balloons in your choice of colors, with ribbon and weight included. Ready for pickup in Arlington — order ahead so they're fresh for your event!",
        themes: ["birthday", "graduation", "baby shower", "anniversary"],
        materials: ["Latex", "Helium", "Ribbon", "Weight"],
        fulfillment: "pickup",
        price: 24.99,
        variants: [
          { size: "Half Dozen (6 balloons)", price: 24.99 },
          { size: "Dozen (12 balloons)", price: 44.99 }
        ]
      },
      {
        id: "helium-deluxe-bouquet",
        name: "Deluxe Mixed Helium Bouquet",
        category: "Bunches",
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800",
        description: "The best of both — helium latex balloons paired with shiny foil stars or hearts, hand-tied with ribbon and weight. A ready-made centerpiece. Pickup in Arlington only.",
        themes: ["birthday", "wedding", "quinceanera", "graduation", "baby shower"],
        materials: ["Latex", "Foil", "Helium", "Ribbon", "Weight"],
        fulfillment: "pickup",
        price: 39.99,
        variants: [
          { size: "6 Latex + 2 Foil Bouquet", price: 39.99 },
          { size: "12 Latex + 4 Foil Bouquet", price: 69.99 }
        ]
      },
      {
        id: "helium-custom-message",
        name: "Custom Message Helium Balloon",
        category: "Individual",
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800",
        description: "A jumbo 24\" latex balloon with your custom message in vinyl lettering, filled with helium and ready to float. Pickup in Arlington only.",
        themes: ["birthday", "wedding", "baby shower", "graduation"],
        materials: ["Latex", "Helium", "Custom Vinyl Lettering"],
        fulfillment: "pickup",
        price: 19.99,
        variants: [
          { size: "24\" with Custom Message", price: 19.99 }
        ]
      }
    ]
  },
  balloonKits: {
    title: "DIY Balloon Garland Kits",
    description: "Everything you need to build a stunning balloon garland at home — premium latex balloons in curated color palettes, garland strip, glue dots, pump and step-by-step instructions. Ships nationwide, uninflated.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800",
    items: [
      {
        id: "garland-kit-blush-gold",
        name: "Blush & Gold Garland Kit",
        category: "DIY Kit",
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800",
        description: "The wedding-and-shower favorite. Blush pink, cream and gold chrome balloons with everything you need: balloons, garland strip, glue dots, hand pump and step-by-step instructions. Ships uninflated.",
        themes: ["wedding", "bridal shower", "baby shower", "quinceanera", "birthday"],
        materials: ["Latex Balloons", "Garland Strip", "Glue Dots", "Hand Pump", "Instructions"],
        fulfillment: "ships",
        price: 49.99,
        variants: [
          { size: "6 ft Garland Kit", price: 49.99 },
          { size: "12 ft Garland Kit", price: 89.99 }
        ]
      },
      {
        id: "garland-kit-fiesta",
        name: "Fiesta Brights Garland Kit",
        category: "DIY Kit",
        image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800",
        description: "Bold, bright and ready to party. Vibrant fiesta colors with balloons, garland strip, glue dots, hand pump and instructions. Ships uninflated.",
        themes: ["birthday", "fiesta", "graduation", "corporate"],
        materials: ["Latex Balloons", "Garland Strip", "Glue Dots", "Hand Pump", "Instructions"],
        fulfillment: "ships",
        price: 44.99,
        variants: [
          { size: "6 ft Garland Kit", price: 44.99 },
          { size: "12 ft Garland Kit", price: 79.99 }
        ]
      },
      {
        id: "garland-kit-safari",
        name: "Safari Wild Garland Kit",
        category: "DIY Kit",
        image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800",
        description: "Jungle greens, warm neutrals and animal-print accents. Everything included: balloons, garland strip, glue dots, hand pump and instructions. Ships uninflated.",
        themes: ["birthday", "baby shower"],
        materials: ["Latex Balloons", "Garland Strip", "Glue Dots", "Hand Pump", "Instructions"],
        fulfillment: "ships",
        price: 44.99,
        variants: [
          { size: "6 ft Garland Kit", price: 44.99 },
          { size: "12 ft Garland Kit", price: 79.99 }
        ]
      },
      {
        id: "garland-kit-pastel-dream",
        name: "Pastel Dream Garland Kit",
        category: "DIY Kit",
        image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800",
        description: "Soft pastels in every shade — matte pink, lavender, baby blue and cream. A dreamy palette for birthdays, showers and spring parties. Balloons, strip, glue dots, pump and instructions included. Ships uninflated.",
        themes: ["birthday", "baby shower", "bridal shower", "easter"],
        materials: ["Latex Balloons", "Garland Strip", "Glue Dots", "Hand Pump", "Instructions"],
        fulfillment: "ships",
        price: 49.99,
        variants: [
          { size: "6 ft Garland Kit", price: 49.99 },
          { size: "12 ft Garland Kit", price: 89.99 }
        ]
      },
      {
        id: "garland-kit-black-gold",
        name: "Black & Gold Glam Garland Kit",
        category: "DIY Kit",
        image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800",
        description: "Dramatic and luxe. Black, gold chrome and champagne balloons for milestone birthdays, New Year's Eve and glam corporate events. Everything included. Ships uninflated.",
        themes: ["birthday", "corporate", "new year", "graduation"],
        materials: ["Latex Balloons", "Garland Strip", "Glue Dots", "Hand Pump", "Instructions"],
        fulfillment: "ships",
        price: 54.99,
        variants: [
          { size: "6 ft Garland Kit", price: 54.99 },
          { size: "12 ft Garland Kit", price: 94.99 }
        ]
      },
      {
        id: "garland-kit-oh-baby",
        name: "Oh Baby Garland Kit",
        category: "DIY Kit",
        image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800",
        description: "Gender-reveal ready neutrals — white sand, cream and beige with pops of pink and blue to mix your way. Balloons, strip, glue dots, pump and instructions. Ships uninflated.",
        themes: ["baby shower", "gender reveal", "birthday"],
        materials: ["Latex Balloons", "Garland Strip", "Glue Dots", "Hand Pump", "Instructions"],
        fulfillment: "ships",
        price: 49.99,
        variants: [
          { size: "6 ft Garland Kit", price: 49.99 },
          { size: "12 ft Garland Kit", price: 89.99 }
        ]
      }
    ]
  },
  balloonAccessories: {
    title: "Balloon Accessories",
    description: "Pumps, ribbon, weights and stands — everything to inflate, tie and display your balloons like a pro. Ships nationwide.",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800",
    items: [
      {
        id: "dual-action-pump",
        name: "Dual-Action Hand Pump",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800",
        description: "Inflates on both push and pull — cut your balloon prep time in half. A must-have for garlands and arches.",
        themes: ["birthday", "wedding", "quinceanera", "graduation", "corporate"],
        materials: ["Plastic"],
        fulfillment: "ships",
        price: 6.99,
        variants: [
          { size: "Single Pump", price: 6.99 }
        ]
      },
      {
        id: "electric-pump",
        name: "Electric Balloon Pump",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800",
        description: "High-volume electric inflator for big installs. Fills a 11\" balloon in seconds. Perfect for decorators and large events.",
        themes: ["corporate", "wedding", "quinceanera", "birthday"],
        materials: ["Electric", "ABS"],
        fulfillment: "ships",
        price: 34.99,
        variants: [
          { size: "Standard Electric Pump", price: 34.99 }
        ]
      },
      {
        id: "curling-ribbon",
        name: "Curling Ribbon Rolls",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800",
        description: "Classic curling ribbon for tying bouquets and adding that finished look. Multiple colors available.",
        themes: ["birthday", "wedding", "graduation", "baby shower"],
        materials: ["Polypropylene Ribbon"],
        fulfillment: "ships",
        price: 4.99,
        variants: [
          { size: "Pack of 3 Rolls", price: 4.99 }
        ]
      },
      {
        id: "balloon-weights",
        name: "Balloon Weights",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?q=80&w=800",
        description: "Keep your helium bouquets grounded in style. Decorative weights that match any theme.",
        themes: ["birthday", "wedding", "graduation", "baby shower"],
        materials: ["Weighted Base", "Foil Cover"],
        fulfillment: "ships",
        price: 7.99,
        variants: [
          { size: "Pack of 4 Weights", price: 7.99 }
        ]
      },
      {
        id: "balloon-stand-kit",
        name: "Balloon Stand Kit",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800",
        description: "Reusable stand kit for tabletop balloon displays — no helium needed. Great for centerpieces and photo backdrops.",
        themes: ["birthday", "wedding", "quinceanera", "corporate"],
        materials: ["Plastic Tubes", "Base"],
        fulfillment: "ships",
        price: 12.99,
        variants: [
          { size: "Tabletop Stand Kit", price: 12.99 }
        ]
      }
    ]
  }
};
