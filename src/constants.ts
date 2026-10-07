import { SiteConfig } from './types';

export const INITIAL_CONFIG: SiteConfig = {
    hero: {
        title: "Magic",
        subtitle: "PRINTS & BALLOONS",
        welcomeTitle: "EVERYTHING FOR YOUR PARTY",
        backgroundImages: [
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2000",
            "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2000",
            "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=2000"
        ],
        primaryBtnText: "CATALOG",
        secondaryBtnText: "CUSTOM QUOTE"
    },
    categories: [
        { name: "PHOTO BOARDS", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=200" },
        { name: "CUTOUTS & PROPS", image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=200" },
        { name: "FLOOR WRAPS", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=200" },
        { name: "BACKDROPS", image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=200" },
        { name: "LATEX BALLOONS", image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=200" },
        { name: "DIY BALLOON KITS", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=200" },
        { name: "HELIUM BALLOONS", image: "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?q=80&w=200" },
        { name: "BALLOON ACCESSORIES", image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=200" }
    ],
    occasions: [
        "Anniversary", "Baby Shower", "Baptism", "Bar / Bat Mitzvah",
        "1st Birthday", "Adults Birthday", "Kids Birthday", "Tweens / Teens Birthday",
        "Bridal Shower", "Christening", "Christmas", "Easter", "Eid", "Engagement",
        "Father's Day", "Funeral", "Graduation", "Halloween", "Hen Party",
        "Holy Communion", "Mother's Day", "Prom", "Valentines", "Wedding"
    ],
    bestSellers: {
        title: "Signature",
        subtitle: "The Elite Collection",
        btnText: "VIEW ALL"
    },
    missionVision: {
        missionTitle: "Our Mission",
        missionDesc: "To provide the highest quality event materials.",
        missionIcon: "🎯",
        visionTitle: "Our Vision",
        visionDesc: "To be the leading choice for event planners.",
        visionIcon: "👁️"
    },
    aboutMe: {
        title: "Sobre Mí ✨",
        name: "Yndira",
        experience: "8+ Years",
        bio: [
            "Soy una Planificadora de Eventos con más de 8 años de experiencia, y entiendo lo esenciales que son las impresiones de alta calidad para crear un evento verdaderamente elevado.",
            "Después de trabajar con múltiples proveedores y no encontrar el nivel de servicio y calidad que esperaba, decidí crear mi propia imprenta, diseñada para apoyar a planificadores de eventos y clientes con soluciones refinadas y confiables.",
            "Hoy tengo el privilegio de trabajar con algunos de los mejores planificadores de eventos de la ciudad 🤝. Soy conocida por mi servicio personalizado, tiempos de entrega rápidos, entrega directamente al evento, instalación profesional y una calidad de impresión que establece un estándar superior."
        ],
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800",
        slogan: "Transforming Dreams Into Reality"
    },
    footer: {
        slogan: "Prints & Balloons for Every Celebration",
        copyright: "© 2026 magicprintsandballoons. All rights reserved."
    },
    corporateGallery: []
};