import { HeroSection } from "@/components/ui/hero-section";
import { HomePostSections } from "@/components/ui/home-post-sections";

const REGIONAL_CATEGORIES = [
  { slug: "mangaluru", displayName: "Mangaluru" },
  { slug: "bengaluru", displayName: "Bengaluru" },
  { slug: "udupi", displayName: "Udupi" },
  { slug: "bidar", displayName: "Bidar" },
];

const TOPICAL_CATEGORIES = [
  { slug: "sci-tech", displayName: "Sci-Tech" },
  { slug: "health-wellness", displayName: "Health & Wellness" },
  { slug: "business-economy", displayName: "Business & Economy" },
  { slug: "market-finance", displayName: "Market & Finance" },
];

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-6xl mx-auto">
        <HeroSection />
        
        {/* Regional News Section */}
        <div className="mt-12">
          <HomePostSections 
            categories={REGIONAL_CATEGORIES} 
            title="Regional News"
          />
        </div>
        
        {/* Topical News Section */}
        <div className="mt-16">
          <HomePostSections 
            categories={TOPICAL_CATEGORIES} 
            title="Topical News"
          />
        </div>
      </main>
    </div>
  );
}
