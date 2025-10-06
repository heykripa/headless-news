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
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto p-8">
        <HeroSection />
      </main>
      
      {/* Regional News Section - Full Width */}
      <div className="mt-12 py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <HomePostSections 
            categories={REGIONAL_CATEGORIES} 
            title="Regional News"
          />
        </div>
      </div>
      
      {/* Topical News Section - Full Width */}
      <div className="py-16 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-8">
          <HomePostSections 
            categories={TOPICAL_CATEGORIES} 
            title="Topical News"
          />
        </div>
      </div>
    </div>
  );
}
