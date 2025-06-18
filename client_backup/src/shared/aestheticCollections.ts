export interface AestheticCollection {
  id: string;
  name: string;
  description: string;
  colors: string[];
  fonts: string[];
  mood: string;
  keywords: string[];
  albumPostUrl?: string;
}

export const aestheticCollections: AestheticCollection[] = [
  {
    id: "luxury-minimal",
    name: "Luxury Minimal",
    description: "Clean, sophisticated aesthetic with premium appeal",
    colors: ["#000000", "#FFFFFF", "#F5F5F5", "#D4AF37"],
    fonts: ["Prata", "Helvetica Neue", "Inter"],
    mood: "sophisticated",
    keywords: ["minimal", "luxury", "clean", "premium", "elegant"]
  },
  {
    id: "warm-editorial",
    name: "Warm Editorial",
    description: "Magazine-inspired with warm, inviting tones",
    colors: ["#8B4513", "#DEB887", "#F5DEB3", "#CD853F"],
    fonts: ["Playfair Display", "Crimson Text", "Source Sans Pro"],
    mood: "editorial",
    keywords: ["warm", "magazine", "editorial", "inviting", "professional"]
  },
  {
    id: "modern-chic",
    name: "Modern Chic",
    description: "Contemporary design with bold accents",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
    fonts: ["Montserrat", "Open Sans", "Lato"],
    mood: "modern",
    keywords: ["modern", "chic", "bold", "contemporary", "vibrant"]
  },
  {
    id: "soft-feminine",
    name: "Soft Feminine",
    description: "Gentle, nurturing aesthetic with soft pastels",
    colors: ["#F8BBD9", "#E4C1F9", "#A8DADC", "#F1FAEE"],
    fonts: ["Dancing Script", "Lora", "Nunito"],
    mood: "feminine",
    keywords: ["soft", "feminine", "gentle", "pastel", "nurturing"]
  },
  {
    id: "bold-confident",
    name: "Bold Confident",
    description: "Strong, empowering design with high contrast",
    colors: ["#E63946", "#F77F00", "#FCBF49", "#003566"],
    fonts: ["Oswald", "Roboto", "Source Sans Pro"],
    mood: "bold",
    keywords: ["bold", "confident", "strong", "empowering", "contrast"]
  }
];

export const getCollectionById = (id: string): AestheticCollection | undefined => {
  return aestheticCollections.find(collection => collection.id === id);
};

export const getCollectionsByMood = (mood: string): AestheticCollection[] => {
  return aestheticCollections.filter(collection => collection.mood === mood);
};

export const getRandomCollectionImages = (albumUrl?: string, count: number = 9): string[] => {
  // Generate placeholder image URLs for now
  const images: string[] = [];
  for (let i = 0; i < count; i++) {
    images.push(`/assets/aesthetic-${i + 1}.jpg`);
  }
  return images;
};