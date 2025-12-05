import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Copy, Check, ArrowRight, Gift, Star } from "lucide-react";
import { toast } from "sonner";
import { FestiveDarkModeToggle } from "@/components/FestiveDarkModeToggle";

// Import product images
import heroImage from "@/assets/holiday/hero-christmas-logo.png";
import holidayHotline from "@/assets/holiday/christmas-hotline.jpg";
import vitaleStarter from "@/assets/holiday/vitale-sourdough-starter-new.jpg";
import wireMonkeyLame from "@/assets/holiday/wire-monkey-lame-sharp.jpg";
import goldie from "@/assets/holiday/sourhouse-goldie-starter-warmer.webp";
import hollandBowl from "@/assets/holiday/holland-bowl-mill.jpg";
import brodTaylorProofer from "@/assets/holiday/brod-taylor-proofer-sharp.jpg";
import modBreadBag from "@/assets/holiday/modkitchen-bread-bag.webp";
import modBreadSling from "@/assets/holiday/modkitchen-bread-sling.webp";
import woodPulpBanneton from "@/assets/holiday/wood-pulp-banneton.webp";
import gooseLame from "@/assets/holiday/goose-lame-new-sharp.jpg";
import doughBed from "@/assets/holiday/sourhouse-doughbed.jpg";
import stockingStuffersBanner from "@/assets/holiday/stocking-stuffers-banner.webp";
import doughWhisk from "@/assets/holiday/dough-whisk.jpg";
import challengerBreadPan from "@/assets/holiday/challenger-bread-pan.jpg";
import challengerParchment from "@/assets/holiday/challenger-parchment.png";
import breadBlanket from "@/assets/holiday/bread-blanket.webp";
import benchScraper from "@/assets/holiday/bench-scraper.png";
import sourdoughRestOfUs from "@/assets/holiday/sourdough-rest-of-us-sharp.jpg";
import vitaleSourdoughMastery from "@/assets/holiday/vitale-sourdough-mastery-sharp.jpg";
import fromOvenToMarket from "@/assets/holiday/from-oven-to-market-sharp.jpg";
import loafAndLie from "@/assets/holiday/loaf-and-lie-sharp.jpg";
import breadJourney from "@/assets/holiday/bread-journey.jpg";
import doughWhiskNew from "@/assets/holiday/dough-whisk-new-sharp.png";
import gooseLameNew from "@/assets/holiday/goose-lame.jpg";
import ufoLame from "@/assets/holiday/ufo-lame.webp";
import ovalBannetonNew from "@/assets/holiday/oval-banneton.png";
import btDoughScraper from "@/assets/holiday/bt-dough-scraper.jpg";
import roundBannetonNew from "@/assets/holiday/round-banneton.png";
import starterJar from "@/assets/holiday/starter-jar.png";
import btSpiceGrinder from "@/assets/holiday/bt-spice-grinder.png";
import safInstantYeast from "@/assets/holiday/saf-instant-yeast.png";
import recipeCollection from "@/assets/holiday/recipe-collection.png";
import frenchPress from "@/assets/holiday/french-press.webp";
import btApron from "@/assets/holiday/bt-apron.png";
import saharaDehydrator from "@/assets/holiday/sahara-dehydrator.png";
import top6Banner from "@/assets/holiday/top-6-banner.png";
import proofingContainer from "@/assets/holiday/proofing-container-6qt.webp";
import saharaPolyShelves from "@/assets/holiday/sahara-poly-shelves.webp";
import nonStickMat from "@/assets/holiday/nonstick-silicone-mat.webp";
import wiremonkeyPromoOverlay from "@/assets/holiday/wiremonkey-promo-overlay.png";
import prooferAccessories from "@/assets/holiday/folding-proofer-accessories.webp";
import bakingShellBatard from "@/assets/holiday/baking-shell-batard-steel.webp";
import breadSteel from "@/assets/holiday/bread-steel.webp";
import wiremonkeyUfoNux from "@/assets/holiday/wiremonkey-ufo-nux.webp";
import wiremonkeyPoco from "@/assets/holiday/wiremonkey-poco.webp";
import toastTongs from "@/assets/holiday/toast-tongs.webp";
import sphericalDuster from "@/assets/holiday/spherical-flower-duster.webp";
import wiremonkeyUfoZero from "@/assets/holiday/wiremonkey-ufo-zero.webp";
import wiremonkeyArcLame from "@/assets/holiday/wiremonkey-arc-lame.webp";
import wiremonkeyBannetonCover from "@/assets/holiday/wiremonkey-banneton-cover.webp";
import sourHouseBreadBlanket from "@/assets/holiday/sour-house-bread-blanket.webp";
import starterJars from "@/assets/holiday/starter-jars.webp";
import bakingShellBatardAlt from "@/assets/holiday/baking-shell-batard-steel-alt.webp";
import veganBreadWrap from "@/assets/holiday/vegan-bread-wrap.webp";
import sourHouseBreadBlanketAlt from "@/assets/holiday/sour-house-bread-blanket-alt.webp";
import frenchRollingPin from "@/assets/holiday/french-rolling-pin.jpg";
import breadBoardBowKnife from "@/assets/holiday/bread-board-bow-knife.jpg";
import walnutBowl17 from "@/assets/holiday/walnut-bowl-17.jpg";
import mapleBowl17 from "@/assets/holiday/maple-bowl-17.jpg";
import starterGuide from "@/assets/holiday/starter-guide.png";
import wiremonkeyPromoBadge from "@/assets/holiday/wiremonkey-promo-badge.jpg";
import wiremonkeyPromoButton from "@/assets/holiday/wiremonkey-promo-button.png";
import sourhousePromoButton from "@/assets/holiday/sourhouse-promo-button.png";
import sourhouse20OffButton from "@/assets/holiday/sourhouse-promo-20off.png";
import hollandBowlPromoButton from "@/assets/holiday/holland-bowl-promo.png";
import btSourdoughHomeStarterBundle from "@/assets/holiday/bt-sourdough-home-starter-jar-bundle.webp";
import btBakingShellSteelBundle from "@/assets/holiday/bt-baking-shell-steel-bundle.webp";
import btDoughWhiskBenchKnifeBundle from "@/assets/holiday/bt-dough-whisk-bench-knife-bundle.webp";
import btBakersMathScale from "@/assets/holiday/bt-bakers-math-scale.webp";
import btVG2Sharpener from "@/assets/holiday/bt-vg2-sharpener.jpg";
import btChefApronPro from "@/assets/holiday/bt-chef-apron.png";
import vitalePromo20Off from "@/assets/holiday/vitale-promo-20off.png";
import modkitchenBreadBag from "@/assets/holiday/modkitchen-bread-bag.webp";
import modkitchenBreadSling from "@/assets/holiday/modkitchen-bread-sling.webp";
import modkitchenOvalSling from "@/assets/holiday/modkitchen-oval-sling.webp";
import modkitchenHolidayBags from "@/assets/holiday/modkitchen-holiday-bags.webp";
import modkitchenPromo30Off from "@/assets/holiday/modkitchen-promo-30off.png";

const HolidayGiftGuide = () => {
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [urgencyMessage, setUrgencyMessage] = useState("");
  const [showDigitalGifts, setShowDigitalGifts] = useState(false);
  const [ftcDismissed, setFtcDismissed] = useState(() => {
    return localStorage.getItem('ftc-dismissed') === 'true';
  });

  const dismissFTC = () => {
    setFtcDismissed(true);
    localStorage.setItem('ftc-dismissed', 'true');
  };

  // Product data for search functionality
  const allProducts = [
    { name: "Vitale Sourdough Starter", brand: "Vitale", category: "starter", keywords: "sourdough starter dehydrated", price: "$12", id: "vitale-starter" },
    { name: "Wire Monkey Bread Lame", brand: "Wire Monkey", category: "tools", keywords: "lame scoring blade knife", price: "$26", id: "wire-monkey-lame" },
    { name: "Sourhouse Goldie Starter Warmer", brand: "Sourhouse", category: "equipment", keywords: "warmer temperature control", price: "$89", id: "goldie-warmer" },
    { name: "Holland Bowl Mill 17\" Bowl", brand: "Holland Bowl Mill", category: "bowls", keywords: "mixing bowl wood wooden beechwood", price: "$135", id: "holland-bowl" },
    { name: "Brød & Taylor Folding Proofer", brand: "Brød & Taylor", category: "equipment", keywords: "proofer temperature control folding", price: "$189", id: "brod-proofer" },
    { name: "Holiday Hotline", brand: "Henry's Bread Kitchen", category: "digital", keywords: "hotline help support", price: "Free", id: "holiday-hotline" },
    { name: "ModKitchen Bread Bag", brand: "ModKitchen", category: "storage", keywords: "bread bag linen storage", price: "$29.95", id: "mod-bread-bag" },
    { name: "ModKitchen Bread Sling", brand: "ModKitchen", category: "tools", keywords: "sling dutch oven transfer", price: "$15.99-$16.99", id: "mod-bread-sling" },
    { name: "Wood Pulp Banneton (Round)", brand: "Wire Monkey", category: "bannetons", keywords: "banneton proofing basket wood pulp round", price: "$29", id: "wood-pulp-banneton-round" },
    { name: "Wood Pulp Banneton (Oval)", brand: "Wire Monkey", category: "bannetons", keywords: "banneton proofing basket wood pulp oval", price: "$32", id: "wood-pulp-banneton-oval" },
    { name: "Wire Monkey Goose Lame", brand: "Wire Monkey", category: "tools", keywords: "lame scoring blade goose", price: "$49.95", id: "goose-lame" },
    { name: "Sourhouse Dough Bed", brand: "Sourhouse", category: "equipment", keywords: "doughbed proofing resting", price: "$279.95", id: "dough-bed" },
    { name: "Brød & Taylor Dough Whisk", brand: "Brød & Taylor", category: "tools", keywords: "whisk mixing dough danish", price: "$20.95", id: "dough-whisk" },
    { name: "Goose Lame", brand: "Wire Monkey", category: "tools", keywords: "lame scoring blade goose wood", price: "$49.95", id: "goose-lame-stocking" },
    { name: "UFO Bread Lame", brand: "Bread Journey", category: "tools", keywords: "lame scoring blade ufo wood decorative", price: "$29.95", id: "ufo-lame" },
    { name: "Wire Monkey Oval Banneton", brand: "Wire Monkey", category: "bannetons", keywords: "banneton proofing basket oval wood pulp", price: "$32.00", id: "oval-banneton-stocking" },
    { name: "Round Wood Pulp Banneton", brand: "Wire Monkey", category: "bannetons", keywords: "banneton proofing basket round wood pulp", price: "$32.00", id: "round-banneton-stocking" },
    { name: "Sourhouse Starter Jars", brand: "Sourhouse", category: "tools", keywords: "starter jar sourdough glass container pint quart", price: "$20.76", id: "starter-jars" },
    { name: "Brød & Taylor Dough Scraper", brand: "Brød & Taylor", category: "tools", keywords: "dough scraper bench stainless steel", price: "$18.95", id: "bt-dough-scraper-stocking" },
    { name: "Brød & Taylor Spice & Coffee Grinder", brand: "Brød & Taylor", category: "tools", keywords: "grinder spice coffee electric", price: "$24.95", id: "bt-spice-grinder" },
    { name: "Challenger Parchment Papers", brand: "Challenger", category: "tools", keywords: "parchment paper precut challenger", price: "$12.95", id: "challenger-parchment" },
    { name: "Sahara Folding Dehydrator", brand: "Brød & Taylor", category: "equipment", keywords: "dehydrator sahara folding food drying", price: "$295", id: "sahara-dehydrator" },
    { name: "Sourhouse Bread Blanket", brand: "Sourhouse", category: "storage", keywords: "bread blanket muslin cloth cover", price: "$19.95", id: "bread-blanket" },
    { name: "Brød & Taylor Dough Scraper", brand: "Brød & Taylor", category: "tools", keywords: "bench scraper dough cutter stainless steel", price: "$14.95", id: "bench-scraper" },
    { name: "Double-Wall French Press & Carafe", brand: "Brød & Taylor", category: "beverages", keywords: "french press coffee tea double wall carafe", price: "$59.00", id: "french-press" },
    { name: "Classic VG2 Knife Sharpener", brand: "Brød & Taylor", category: "tools", keywords: "knife sharpener vg2 spring action austrian", price: "$79", id: "vg2-sharpener" },
    { name: "Brød & Taylor Chef's Apron", brand: "Brød & Taylor", category: "apparel", keywords: "apron chef professional kitchen", price: "$69", id: "bt-apron" },
    { name: "Challenger Bread Pan", brand: "Challenger", category: "equipment", keywords: "bread pan cast iron dutch oven steam", price: "$270", id: "challenger-bread-pan" },
    { name: "mockmill 100 Stone Grain Mill", brand: "mockmill", category: "equipment", keywords: "grain mill stone flour grinding", price: "$279", id: "mockmill-100" },
    { name: "mockmill Lino 200", brand: "mockmill", category: "equipment", keywords: "grain mill stone flour professional", price: "$449", id: "mockmill-lino" },
    { name: "Vitamix A2300", brand: "Vitamix", category: "equipment", keywords: "blender vitamix flour grinding", price: "$399", id: "vitamix" },
    { name: "Sourdough for the Rest of Us", brand: "Henry Hunter", category: "books", keywords: "book sourdough beginner guide learning", price: "$6.08", id: "sourdough-rest-of-us" },
    { name: "Vitale Sourdough Mastery", brand: "Henry Hunter", category: "books", keywords: "book sourdough advanced mastery techniques", price: "$9.60", id: "vitale-mastery" },
    { name: "From Oven to Market", brand: "Henry Hunter", category: "books", keywords: "book business selling cottage food laws market", price: "$7.62", id: "oven-to-market" },
    { name: "The Loaf and the Lie", brand: "Henry Hunter", category: "books", keywords: "book history bread industry culture", price: "$6.99", id: "loaf-and-lie" },
    { name: "Bread: A Journey Through History", brand: "Henry Hunter", category: "books", keywords: "book history science fermentation culture", price: "$7.95", id: "bread-journey" },
    { name: "Vegan Bread Wrap", brand: "Bee's Wrap", category: "storage", keywords: "bread wrap reusable vegan plant-based wax", price: "$14.99", id: "vegan-bread-wrap" },
    { name: "Sourhouse Bread Blanket", brand: "Sourhouse", category: "storage", keywords: "bread blanket muslin cloth cover storage", price: "$19.95", id: "sour-house-bread-blanket-alt" },
    { name: "French Rolling Pin", brand: "Holland Bowl Mill", category: "tools", keywords: "rolling pin french tapered wood", price: "$55", id: "french-rolling-pin" },
    { name: "Cherry Bread Board & Bow Knife", brand: "Holland Bowl Mill", category: "tools", keywords: "bread board knife cherry wood serrated", price: "$130", id: "bread-board-knife" },
    { name: "17 inch Walnut Bowl", brand: "Holland Bowl Mill", category: "bowls", keywords: "mixing bowl wood walnut large salad", price: "$385", id: "walnut-bowl-17" },
    { name: "17 inch Maple Bowl", brand: "Holland Bowl Mill", category: "bowls", keywords: "mixing bowl wood maple large salad", price: "$325", id: "maple-bowl-17" },
    { name: "17 inch Beech Bowl", brand: "Holland Bowl Mill", category: "bowls", keywords: "mixing bowl wood beech large salad", price: "$225", id: "beech-bowl-17" },
  ];

  const filteredProducts = searchQuery 
    ? allProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.keywords.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Calculate urgency messaging based on date
  useEffect(() => {
    const today = new Date();
    const cutoffDate = new Date("2025-12-15");
    const christmasEve = new Date("2025-12-24");

    if (today <= cutoffDate) {
      setUrgencyMessage("Order by December 15 for Christmas delivery 🎄");
      setShowDigitalGifts(false);
    } else if (today > cutoffDate && today < christmasEve) {
      setUrgencyMessage("Last-Minute Digital Gifts Available Below ⬇️");
      setShowDigitalGifts(true);
    } else {
      setUrgencyMessage("Planning Ahead for 2026? These Tools Ship Year-Round");
      setShowDigitalGifts(true);
    }
  }, []);

  // Smooth scroll with offset for sticky header
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Copy promo code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code copied: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Handle email form submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Check your inbox! The gift guide is on its way.");
      setEmail("");
    }
  };

  // Product schema markup
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "Product",
        "position": 1,
        "name": "Vitale Sourdough Starter",
        "image": "https://bakinggreatbread.blog/holiday/vitale-sourdough-starter.jpg",
        "description": "Dehydrated sourdough starter that wakes up in 3-5 days with just flour and water.",
        "brand": { "@type": "Brand", "name": "Vitale Sourdough Co." },
        "offers": {
          "@type": "Offer",
          "url": "https://vitalesourdoughco.etsy.com",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "Product",
        "position": 2,
        "name": "Wire Monkey Bread Lame",
        "image": "https://bakinggreatbread.blog/holiday/wire-monkey-lame.jpg",
        "description": "Professional bread scoring tool with curved blade for artisan sourdough.",
        "brand": { "@type": "Brand", "name": "Wire Monkey" },
        "offers": {
          "@type": "Offer",
          "url": "https://wiremonkey.com",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "Product",
        "position": 3,
        "name": "Sourhouse Goldie Starter Warmer",
        "image": "https://bakinggreatbread.blog/holiday/sourhouse-goldie.jpg",
        "description": "Temperature-controlled starter warmer for consistent fermentation.",
        "brand": { "@type": "Brand", "name": "Sourhouse" },
        "offers": {
          "@type": "Offer",
          "url": "https://sourhouse.co",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "Product",
        "position": 4,
        "name": "Holland Bowl Mill 17\" Beechwood Bowl",
        "image": "https://bakinggreatbread.blog/holiday/holland-bowl-mill.jpg",
        "description": "Hand-turned wooden bread mixing bowl from Michigan.",
        "brand": { "@type": "Brand", "name": "Holland Bowl Mill" },
        "offers": {
          "@type": "Offer",
          "url": "https://hollandbowlmill.com",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "Product",
        "position": 5,
        "name": "Brød & Taylor Folding Proofer",
        "image": "https://bakinggreatbread.blog/holiday/brod-taylor-proofer.jpg",
        "description": "Precision temperature-controlled bread proofer for consistent results.",
        "brand": { "@type": "Brand", "name": "Brød & Taylor" },
        "offers": {
          "@type": "Offer",
          "url": "http://brodandtaylor.com",
          "availability": "https://schema.org/InStock"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dough-cream to-background">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Festive Dark Mode Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <FestiveDarkModeToggle />
      </div>

      {/* Hero Section - Reorganized */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--olive-accent)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="space-y-6 relative z-10">
            {/* Hero Image at Top */}
            <div className="w-full max-w-4xl mx-auto">
              <img
                src={heroImage}
                alt="Holiday bread baking gifts and essential tools for home bakers"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                loading="eager"
              />
            </div>
            
            {/* Subtitle */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center text-hero-brown dark:text-secondary max-w-4xl mx-auto leading-relaxed">
              The Holiday Gift Guide for People Who Actually Bake Bread
            </h2>

            {/* Stop Guessing Text */}
            <p className="text-xl md:text-2xl text-center text-hero-brown dark:text-foreground/90 max-w-3xl mx-auto">
              Stop guessing. These are the tools real bakers want. Handpicked from my own kitchen.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search for tools, brands, or baking needs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-6 py-6 text-lg rounded-full border-2 border-accent/30 focus:border-accent bg-white dark:bg-card dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-gray-400"
                  />
                  <Button
                    onClick={() => {
                      // Search functionality is handled by the input onChange
                    }}
                    className="px-8 py-6 text-lg rounded-full bg-accent hover:bg-accent/90 text-white"
                  >
                    Search
                  </Button>
                </div>
                
                {/* Search Results Dropdown */}
                {searchQuery && (
                  <div className="absolute top-full mt-2 w-full bg-white dark:bg-card border-2 border-accent/30 dark:border-accent/50 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      <div className="p-4 space-y-2">
                        {filteredProducts.map((product) => (
                          <a
                            key={product.id}
                            href={`#${product.id}`}
                            onClick={() => setSearchQuery("")}
                            className="block p-3 hover:bg-dough-cream dark:hover:bg-card/80 rounded-lg transition-colors"
                          >
                            <div className="font-semibold text-foreground dark:text-foreground">{product.name}</div>
                            <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                              {product.brand} • {product.price}
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-muted-foreground dark:text-muted-foreground">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 bg-white/80 dark:bg-card/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-accent/20 w-fit mx-auto">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-foreground dark:text-foreground">
                Trusted by 50,000+ home bakers in the Baking Great Bread at Home community
              </span>
            </div>


            {/* Three Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center max-w-3xl mx-auto">
              <Button
                size="lg"
                onClick={() => scrollToSection("top-five")}
                className="bg-accent hover:bg-accent/90 text-white text-lg px-8"
              >
                See My Top 6 Picks
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("vitale-card")}
                className="border-2 border-accent bg-accent text-white hover:bg-accent/90 hover:text-white text-lg px-8"
              >
                Start With a Starter
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("stocking-stuffers")}
                className="border-2 border-accent bg-accent text-white hover:bg-accent/90 hover:text-white text-lg px-8"
              >
                Stocking Stuffers
              </Button>
            </div>

            {/* Holiday Hotline Section */}
            <div id="holiday-hotline" className="w-full max-w-4xl mx-auto mt-8 rounded-2xl shadow-2xl overflow-hidden">
              <img
                src={holidayHotline}
                alt="Henry's Holiday Hotline - Your Christmas Baking Lifeline December 23-24"
                className="w-full h-auto object-cover rounded-2xl"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Disclosure - More Prominent */}
      <section id="affiliate-disclosure" className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-accent/10 dark:bg-accent/20 border-2 border-accent p-6 rounded-xl">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground dark:text-foreground mb-1">Affiliate Disclosure</p>
              <p className="text-sm text-foreground/80 dark:text-foreground/80">
                Some links on this page are affiliate links. I only recommend tools I use in my own kitchen. You pay the same price, I earn a small commission that keeps this site running. No surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6 text-primary dark:text-primary">Jump to Section</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={() => scrollToSection("top-five")}
              className="border-2 border-accent/50 bg-card text-foreground hover:border-accent hover:bg-accent/10 dark:bg-card dark:text-foreground"
            >
              Top 6 Picks
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("more-tools")}
              className="border-2 border-accent/50 bg-card text-foreground hover:border-accent hover:bg-accent/10 dark:bg-card dark:text-foreground"
            >
              More Great Tools
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("stocking-stuffers")}
              className="border-2 border-accent/50 bg-card text-foreground hover:border-accent hover:bg-accent/10 dark:bg-card dark:text-foreground"
            >
              Stocking Stuffers
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("midrange-gifts")}
              className="border-2 border-accent/50 bg-card text-foreground hover:border-accent hover:bg-accent/10 dark:bg-card dark:text-foreground"
            >
              $50-$100
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("premium-tools")}
              className="border-2 border-accent/50 bg-card text-foreground hover:border-accent hover:bg-accent/10 dark:bg-card dark:text-foreground"
            >
              Premium Tools
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("books-learning")}
              className="border-2 border-accent/50 bg-card text-foreground hover:border-accent hover:bg-accent/10 dark:bg-card dark:text-foreground"
            >
              Books & Learning
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("free-resources")}
              className="border-2 border-accent/50 bg-card text-foreground hover:border-accent hover:bg-accent/10 dark:bg-card dark:text-foreground"
            >
              Free Resources
            </Button>
          </div>
        </div>
      </section>

      {/* Authority Section */}
      <section className="container mx-auto px-4 py-12 bg-gradient-to-b from-muted to-background dark:from-muted dark:to-background">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h3 className="text-2xl font-bold text-primary dark:text-primary">How I Picked These Tools</h3>
          <p className="text-lg text-secondary dark:text-secondary italic">
            "I've been baking for 20+ years and teaching for 10. These are the tools I reach for every single week. Not the fanciest. Not the cheapest. Just the ones that actually make baking better."
          </p>
        </div>
      </section>

      {/* Top 6 Section */}
      <section id="top-five" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <img
            src={top6Banner}
            alt="Henry's top 6 Holiday picks"
            className="w-full max-w-4xl mx-auto mb-4"
            loading="lazy"
          />
          <p className="text-lg text-hero-brown max-w-3xl mx-auto">
            These are the tools I actually use every week. If someone asked me what to buy a baker, I'd start here. Each one solves a real problem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product 1: Vitale Sourdough Starter */}
          <Card id="vitale-card" className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-primary text-primary-foreground">My Own Product</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4 min-h-[280px] relative bg-muted">
                <img
                  src={vitaleStarter}
                  alt="Vitale dehydrated sourdough starter gift kit for home bakers"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Vitale Sourdough Starter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Dehydrated starter that wakes up in 3-5 days with just flour and water. Comes with clear instructions that actually make sense. This is what I send to family members who want to start baking. No babysitting, no stress.
              </CardDescription>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://vitalesourdoughco.etsy.com?utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Vitale Starter
                </a>
              </Button>
              <button
                onClick={() => copyToClipboard("Henry25")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={vitalePromo20Off}
                  alt="20% OFF Vitale - Promo Code Henry25"
                  className="w-full h-auto"
                />
              </button>
            </CardContent>
          </Card>

          {/* Product 2: Wire Monkey Lame */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-secondary text-white">Best Scoring Tool</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4 min-h-[280px] relative bg-muted">
                <img
                  src={wireMonkeyLame}
                  alt="Wire Monkey bread scoring lame for artisan sourdough"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Wire Monkey Lame</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Sharp, curved blade glides through dough like butter. Leaves clean cuts that open into tall, dramatic ears. Feels balanced in your hand, like it was made for you. This is the tool that makes you look like a professional.
              </CardDescription>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://wiremonkey.com/?ref=BAKINGGREATBREAD&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Wire Monkey
                </a>
              </Button>
              <button
                onClick={() => copyToClipboard("HENRY25")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={wiremonkeyPromoButton}
                  alt="25% OFF Wire Monkey Brand - Promo Code HENRY25"
                  className="w-full h-auto"
                />
              </button>
            </CardContent>
          </Card>

          {/* Product 3: Sourhouse Goldie */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-bakery-copper text-white">Solves Temperature Problems</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4 min-h-[280px] relative bg-muted">
                <img
                  src={goldie}
                  alt="Sourhouse Goldie sourdough starter warmer and temperature control"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Sourhouse Goldie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Keeps your starter at perfect temp, 24/7. Just plug it in, set it, and stop worrying about cold kitchens or inconsistent fermentation. Soft silicone wraps around your jar. If you've ever lost a starter to temperature swings, this fixes it permanently.
              </CardDescription>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://sourhouse.co?ref=BAKINGGREATBREAD&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Sourhouse
                </a>
              </Button>
              <button
                onClick={() => copyToClipboard("HBK23")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={sourhousePromoButton}
                  alt="10% OFF Sourhouse - Promo Code HBK23"
                  className="w-full h-auto"
                />
              </button>
            </CardContent>
          </Card>

          {/* Product 4: Holland Bowl Mill */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-secondary text-white">Lifetime Tool</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={hollandBowl}
                  alt="Holland Bowl Mill hand-turned beechwood bread mixing bowl"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Holland Bowl Mill 17" Bowl</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Hand-turned in Michigan from single pieces of wood. Smooth grain that won't snag dough. Deep enough for mixing, wide enough for folding, beautiful enough to leave on your counter. Use it for decades, then pass it down.
              </CardDescription>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://hollandbowlmill.com/baking/?wpam_id=10&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Holland Bowl Mill
                </a>
              </Button>
              <button
                onClick={() => copyToClipboard("bread")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={hollandBowlPromoButton}
                  alt="10% OFF Holland Bowl Mill - Promo Code bread"
                  className="w-full h-auto"
                />
              </button>
            </CardContent>
          </Card>

          {/* Product 5: Brød & Taylor Proofer */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-bakery-copper text-white">Consistent Results</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={brodTaylorProofer}
                  alt="Brød & Taylor folding bread proofer for consistent fermentation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Brød & Taylor Folding Proofer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Set the exact temperature you want, walk away, and come back to perfectly proofed dough. No more guessing if your kitchen is warm enough. No more failed bulk fermentations. Folds flat when you're done.
              </CardDescription>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
              <a
                href="https://collabs.shop/38tf48"
                target="_blank"
                rel="noopener noreferrer"
                >
                  Shop Brød & Taylor
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Product 6: Sourhouse DoughBed */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-bakery-copper text-white">Artisan Choice</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={doughBed}
                  alt="Sourhouse DoughBed dough resting surface"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Sourhouse DoughBed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Dedicated surface for shaping and resting dough. Natural materials that won't stick. Makes the whole process calmer and more organized.
              </CardDescription>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://sourhouse.co/?ref=BAKINGGREATBREAD&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Sourhouse
                </a>
              </Button>
              <button
                onClick={() => copyToClipboard("HBK23")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={sourhousePromoButton}
                  alt="10% OFF Sourhouse - Promo Code HBK23"
                  className="w-full h-auto"
                />
              </button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* More Great Tools Section */}
      <section id="more-tools" className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-dough-cream">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[hsl(36,45%,35%)] dark:text-white mb-4">
            More Great Tools
          </h2>
          <p className="text-lg text-[hsl(142,35%,25%)] dark:text-gray-300 max-w-3xl mx-auto">
            These are the tools that round out a complete baking setup. Each one solves a specific problem and makes the process smoother.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Challenger Bread Pan */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-secondary text-white">Pro Baker Secret</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={challengerBreadPan}
                  alt="Challenger Bread Pan cast iron bread baking pan"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Challenger Bread Pan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                The game-changing cast iron bread pan designed specifically for home ovens. Features a shallow base and deep lid for easy loading and unmatched steam retention. No more wrestling scored dough into a scorching hot Dutch oven—just slide your loaf into the shallow base, cover with the lid, and bake bakery-quality bread with a crispy, blistered crust and open crumb. Built to last generations.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$270</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://challengerbreadware.com/?ref=henryhunterjr&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Shop Challenger
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Sahara Folding Dehydrator */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-accent text-white">Space Saver</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={saharaDehydrator}
                  alt="Sahara Folding Dehydrator with multiple shelves"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Sahara Folding Dehydrator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                This is the only dehydrator that folds flat when you're not using it—genius for small kitchens. Over 11 square feet of drying space, dual heaters, automated controls, and glass doors so you can actually see what's happening. Perfect for drying fruit for your bread, making crackers, or preserving herbs from your garden.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$295</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://collabs.shop/3g6pc9"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Shop Brød & Taylor
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Proofing Container (6L) */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-secondary text-white">Bulk Fermentation</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={proofingContainer}
                  alt="Brød & Taylor 6-liter proofing container with measurement markings"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Proofing Container (6L)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Clear container with volume markings so you can actually see when your dough has doubled. Perfect size for most home recipes, and the lid seals tight to prevent your dough from drying out during bulk fermentation. Essential for consistent results.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$24.95</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://collabs.shop/6iguo3"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Shop Brød & Taylor
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* SAHARA Poly Shelves */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-accent text-white">Upgrade Add-on</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={saharaPolyShelves}
                  alt="SAHARA Poly Shelves set of 7 for dehydrator"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">SAHARA Poly Shelves, Set of 7</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Upgrade your Sahara Dehydrator with these solid polycarbonate shelves. They're easier to clean than mesh screens and perfect for making fruit leather, drying herbs, or anything that might stick. Set of 7 shelves gives you maximum drying capacity.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$49.95</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://collabs.shop/lx6erl"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Shop Brød & Taylor
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Non-Stick Silicone Baking Mat */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-primary text-white">Budget Essential</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={nonStickMat}
                  alt="Non-stick silicone baking mat for bread scoring and baking"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Non-Stick Silicone Baking Mat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Reusable silicone mat that replaces parchment paper. Perfect for scoring your bread right before it goes into the oven—no more wrestling with parchment. Easy cleanup, lasts for years. At this price, you should have two or three.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$8.95</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://collabs.shop/txycc2"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Shop Brød & Taylor
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Folding Proofer with Accessories */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-bakery-copper text-white">Complete Setup</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={prooferAccessories}
                  alt="Brød & Taylor Folding Proofer with accessory shelf"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Folding Proofer with Accessories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                The complete proofer setup with accessory shelf. Perfect for serious bakers who want consistent fermentation control and the ability to proof multiple stages at once. Precise temperature control from 70°F to 195°F means perfect bulk fermentation every single time.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$269</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://collabs.shop/aygkym"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Shop Brød & Taylor
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Baking Shell (Batard) & Steel */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-secondary text-white">Pro Setup</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={bakingShellBatardAlt}
                  alt="Brød & Taylor Baking Shell and Steel bundle for batard loaves"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Baking Shell (Batard) & Steel Bundle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                The ultimate baking setup for oval batard loaves. The steel provides exceptional heat retention and the shell traps steam perfectly. This combination gives you bakery-quality crust and crumb structure at home. Professional results without a professional oven.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$164</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://collabs.shop/noauwh"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Shop Brød & Taylor
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* French Rolling Pin */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-bakery-copper text-white">Handcrafted</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={frenchRollingPin}
                  alt="Holland Bowl Mill French Rolling Pin in Cherry, Maple, or Walnut"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">French Rolling Pin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Classic French rolling pin with tapered dowel shape that's easy on hands for bake-a-thons. The tapered design makes it easy to apply just the right amount of pressure as you work angles. Available in Cherry, Maple, or Walnut. 20" length. Hand wash with warm water and soap, periodically retreat with Bee's Oil.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$55</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://hollandbowlmill.com/?ref=henrysbreadkitchen"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Shop Holland Bowl Mill
                </a>
              </Button>
              <button
                onClick={() => copyToClipboard("bread")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={hollandBowlPromoButton}
                  alt="10% OFF Holland Bowl Mill - Promo Code bread"
                  className="w-full h-auto"
                />
              </button>
            </CardContent>
          </Card>

          {/* Cherry Bread Board & Bow Knife */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-secondary text-white">Complete Set</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={breadBoardBowKnife}
                  alt="Holland Bowl Mill Cherry Bread Board and Bow Knife set"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Cherry Bread Board & Bow Knife</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Cherry wood bread board and bow knife set. The bowed handle features stainless steel blade with wide serrated edges that won't crush homemade bread and stays sharp for uniform slices. Perfect kitchen set for bread makers. Finished with Bee's Oil. Board: 20" x 6" x ¾". Knife: 17". Solid piece of cherry wood.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$130</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://hollandbowlmill.com/?ref=henrysbreadkitchen"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Shop Holland Bowl Mill
                </a>
              </Button>
              <button
                onClick={() => copyToClipboard("bread")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={hollandBowlPromoButton}
                  alt="10% OFF Holland Bowl Mill - Promo Code bread"
                  className="w-full h-auto"
                />
              </button>
            </CardContent>
          </Card>

          {/* 17 inch Walnut Bowl */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-accent text-white">Premium Wood</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={walnutBowl17}
                  alt="Holland Bowl Mill 17 inch Walnut Bowl with Bee's Oil Finish"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">17" Walnut Bowl</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Solid walnut bowl serves salad for 8-12 people, also makes great centerpiece or popcorn bowl. Not stained, only hand rubbed with food-safe Bee's Oil wood conditioner. Can request preference of all dark or two-toned wood during checkout. Dimensions: 17½" x 5½". Free personalized engraving available.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$385</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://hollandbowlmill.com/?ref=henrysbreadkitchen"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Shop Holland Bowl Mill
                </a>
              </Button>
              <button
                onClick={() => copyToClipboard("bread")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={hollandBowlPromoButton}
                  alt="10% OFF Holland Bowl Mill - Promo Code bread"
                  className="w-full h-auto"
                />
              </button>
            </CardContent>
          </Card>

          {/* 17 inch Maple Bowl */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-bakery-copper text-white">Classic Beauty</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={mapleBowl17}
                  alt="Holland Bowl Mill 17 inch Maple Bowl with Bee's Oil Finish"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">17" Maple Bowl</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Spectacular solid maple bowl turned by craftsmen at Holland Bowl Mill. Large salad serving bowl serves 8-12 people, also makes great centerpiece or popcorn bowl. Beautiful solid maple not stained, only hand rubbed with food-safe Bee's Oil wood conditioner. All natural finish. Dimensions: 17½" x 5½". Free personalized engraving available.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$325</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://hollandbowlmill.com/?ref=henrysbreadkitchen"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Shop Holland Bowl Mill
                </a>
              </Button>
              <button
                onClick={() => copyToClipboard("bread")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={hollandBowlPromoButton}
                  alt="10% OFF Holland Bowl Mill - Promo Code bread"
                  className="w-full h-auto"
                />
              </button>
            </CardContent>
          </Card>

          {/* 17 inch Beech Bowl */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-primary text-white">Best Value</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={hollandBowl}
                  alt="Holland Bowl Mill Henry's 17 inch Beech Bowl with Bee's Oil Finish"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Henry's 17" Beech Bowl</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Serving bowl holds salad for 8-12 people, also makes great centerpiece or popcorn bowl. Beautiful solid beech bowl not stained, only hand rubbed with food-safe Bee's Oil wood conditioner. All natural finish. Dimensions: 17½" x 5½". Free personalized engraving available.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$225</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://hollandbowlmill.com/?ref=henrysbreadkitchen"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Shop Holland Bowl Mill
                </a>
              </Button>
              <button
                onClick={() => copyToClipboard("bread")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={hollandBowlPromoButton}
                  alt="10% OFF Holland Bowl Mill - Promo Code bread"
                  className="w-full h-auto"
                />
              </button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* STOCKING STUFFERS (UNDER $50) */}
      <section
        id="stocking-stuffers"
        className="w-full bg-background dark:bg-background/95 py-0 px-0 border-b border-border"
      >
        {/* Banner Image */}
        <div className="w-full">
          <img
            src={stockingStuffersBanner}
            alt="Stocking Stuffers for Bakers Under $50"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
          <p className="text-lg text-foreground/80 dark:text-muted-foreground mb-8 text-center">
            Small, thoughtful tools that bakers love. Perfect for stockings, 
            hostess gifts, or quick add-ons to any holiday order.
          </p>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            {/* Brød & Taylor Dough Whisk */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Essential Tool</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={doughWhiskNew}
                  alt="Brød & Taylor Dough Whisk"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Brød & Taylor Dough Whisk
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$20.95</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Unique looped wire design that mixes dough without overworking it. Essential for any baker's toolkit.
              </p>
              <a
                href="https://brodandtaylor.com/henrysbreadkitchen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop Brød & Taylor
              </a>
            </div>

            {/* Goose Lame */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Pro Scoring</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={gooseLameNew}
                  alt="Wire Monkey Goose Lame"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Goose Lame
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$49.95</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Beautiful handcrafted wooden lame with ergonomic goose design for precise bread scoring.
              </p>
              <a
                href="https://wiremonkey.com/?ref=henrysbreadkitchen&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop Wire Monkey
              </a>
              <button
                onClick={() => copyToClipboard("HENRY25")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={wiremonkeyPromoButton}
                  alt="25% OFF Wire Monkey Brand - Promo Code HENRY25"
                  className="w-full h-auto"
                />
              </button>
            </div>

            {/* UFO Bread Lame */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Unique Design</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={ufoLame}
                  alt="UFO Bread Journey Lame"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                UFO Bread Lame
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$29.95</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Distinctive UFO-shaped wooden lame with intricate laser engraving. Art meets function in bread scoring.
              </p>
              <a
                href="https://wiremonkey.com/?ref=henrysbreadkitchen&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop Wire Monkey
              </a>
              <button
                onClick={() => copyToClipboard("HENRY25")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={wiremonkeyPromoButton}
                  alt="25% OFF Wire Monkey Brand - Promo Code HENRY25"
                  className="w-full h-auto"
                />
              </button>
            </div>

            {/* Wire Monkey Oval Banneton */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Batard Style</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={ovalBannetonNew}
                  alt="Wire Monkey Oval Wood Pulp Banneton"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Wire Monkey Oval Banneton
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$32.00</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Eco-friendly wood pulp banneton creates beautiful spiral patterns while supporting dough structure.
              </p>
              <a
                href="https://wiremonkey.com/?ref=henrysbreadkitchen&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop Wire Monkey
              </a>
            </div>

            {/* Brød & Taylor Dough Scraper */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Essential Tool</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={btDoughScraper}
                  alt="Brød & Taylor Dough Scraper with soft handle"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Brød & Taylor Dough Scraper
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$18.95</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Soft, non-slip handle designed to be an extension of your hand. Versatile for chopping, cutting, scraping, and scooping.
              </p>
              <a
                href="https://collabs.shop/i4ifmu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop Brød & Taylor
              </a>
            </div>

            {/* Round Wood Pulp Banneton */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Traditional</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={roundBannetonNew}
                  alt="Round Wood Pulp Banneton"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Wire Monkey Round Banneton
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$32.00</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Classic round wood pulp proofing basket for boules with beautiful circle patterns.
              </p>
              <a
                href="https://wiremonkey.com/?ref=henrysbreadkitchen&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop Wire Monkey
              </a>
            </div>

            {/* Sourhouse Starter Jars */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">432 Reviews</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={starterJars}
                  alt="Sourhouse Starter Jars - Pint or Quart"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Sourhouse Starter Jars (Pint or Quart)
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$20.76</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Glass jars with measurement markings and airtight lids. Available in pint or quart sizes. Perfect for maintaining your sourdough starter.
              </p>
              <a
                href="https://sourhouse.co/?ref=BAKINGGREATBREAD&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop Sourhouse
              </a>
              <button
                onClick={() => copyToClipboard("HBK20")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={sourhouse20OffButton}
                  alt="20% OFF Sourhouse - Promo Code HBK20"
                  className="w-full h-auto"
                />
              </button>
            </div>

            {/* Brød & Taylor Spice & Coffee Grinder */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Multi-Purpose</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={btSpiceGrinder}
                  alt="Brød & Taylor Spice & Coffee Grinder"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Brød & Taylor Spice & Coffee Grinder
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$24.95</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Compact electric grinder perfect for freshly ground spices, coffee, and grains for your baking.
              </p>
              <a
                href="https://brodandtaylor.com/henrysbreadkitchen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop Brød & Taylor
              </a>
            </div>

            {/* UFO Zero Lame */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Premium Scoring</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={wiremonkeyUfoZero}
                  alt="Wire Monkey UFO Zero Lame"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                UFO Zero Lame
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$29.95</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                The original circular lame by Wire Monkey. Fine control, ambidextrous design, retractable blade. Walnut construction for beautiful scoring.
              </p>
              <a
                href="https://wiremonkey.com/?ref=henrysbreadkitchen&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop Wire Monkey
              </a>
              <button
                onClick={() => copyToClipboard("HENRY25")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={wiremonkeyPromoButton}
                  alt="25% OFF Wire Monkey Brand - Promo Code HENRY25"
                  className="w-full h-auto"
                />
              </button>
            </div>

            {/* Poco Lame */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Compact Design</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={wiremonkeyPoco}
                  alt="Wire Monkey Poco Lame"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Poco Lame
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$18.95</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Smallest straight-blade lame, American black walnut. Simple, safe, and designed for maximum control without knobs or plastics.
              </p>
              <a
                href="https://wiremonkey.com/?ref=henrysbreadkitchen&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop Wire Monkey
              </a>
              <button
                onClick={() => copyToClipboard("HENRY25")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={wiremonkeyPromoButton}
                  alt="25% OFF Wire Monkey Brand - Promo Code HENRY25"
                  className="w-full h-auto"
                />
              </button>
            </div>

            {/* Arc Lame */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Curved Blade</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={wiremonkeyArcLame}
                  alt="Wire Monkey Arc Lame"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Arc Lame
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$25.95</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Smallest curved lame in the world. American black walnut with base stand. Ideal for long bread slashes and intimate scoring.
              </p>
              <a
                href="https://wiremonkey.com/?ref=henrysbreadkitchen&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop Wire Monkey
              </a>
              <button
                onClick={() => copyToClipboard("HENRY25")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={wiremonkeyPromoButton}
                  alt="25% OFF Wire Monkey Brand - Promo Code HENRY25"
                  className="w-full h-auto"
                />
              </button>
            </div>

            {/* Toast Tongs */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Kitchen Essential</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={toastTongs}
                  alt="Toast Tongs"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Toast Tongs
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$14.95</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Solid walnut toast tongs made in Ukraine. Safely retrieve toast slices with rare earth magnet for storing on fridge or toaster.
              </p>
              <a
                href="https://wiremonkey.com/?ref=henrysbreadkitchen&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop Wire Monkey
              </a>
              <button
                onClick={() => copyToClipboard("HENRY25")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={wiremonkeyPromoButton}
                  alt="25% OFF Wire Monkey Brand - Promo Code HENRY25"
                  className="w-full h-auto"
                />
              </button>
            </div>

            {/* Spherical Flower Duster */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Dusting Tool</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={sphericalDuster}
                  alt="Spherical Flower Duster"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Spherical Flower Duster
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">Price varies</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Professional flour duster for dusting bannetons and work surfaces with precision and control.
              </p>
              <a
                href="https://wiremonkey.com/?ref=henrysbreadkitchen&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop Wire Monkey
              </a>
            </div>

            {/* Reusable Banneton Cover */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Eco-Friendly</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={wiremonkeyBannetonCover}
                  alt="Reusable Banneton/Dish Covers"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Reusable Banneton/Dish Covers
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$19.99</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Elastic covers for bowls or bannetons. Made by Wild Clementine Co., washable, snug fit. Perfect for proofing and keeping dust off mixing bowls.
              </p>
              <a
                href="https://wiremonkey.com/?ref=henrysbreadkitchen&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop Wire Monkey
              </a>
            </div>

            {/* Vegan Bread Wrap */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Plant-Based</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={veganBreadWrap}
                  alt="Bee's Wrap Vegan Bread Wrap"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Vegan Bread Wrap
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$14.99</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Vegan alternative to plastic wrap, reusable for up to one year. Made from organic cotton, coated with plant-based waxes and oils. Keeps bread loaves fresher days longer than plastic bags.
              </p>
              <a
                href="https://wiremonkey.com/?ref=henrysbreadkitchen&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop Wire Monkey
              </a>
            </div>

            {/* Sourhouse Bread Blanket */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Storage Essential</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={sourHouseBreadBlanketAlt}
                  alt="Sourhouse Bread Blanket"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Sourhouse Bread Blanket
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$19.95</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Beautiful, reusable bread storage wrap that keeps loaves fresh while looking gorgeous on your counter. Perfect for gifting homemade bread or storing your own bakes.
              </p>
              <a
                href="https://sourhouse.co/?ref=henrysbreadkitchen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop Sourhouse
              </a>
              <button
                onClick={() => copyToClipboard("HBK23")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={sourhousePromoButton}
                  alt="10% OFF Sourhouse - Promo Code HBK23"
                  className="w-full h-auto"
                />
              </button>
            </div>

            {/* ModKitchn Round Bread Sling */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Essential Tool</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={modkitchenBreadSling}
                  alt="ModKitchn Round Bread Sling"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Round Bread Sling
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$16.99</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Round silicone bread sling perfect for sourdough and artisan loaves. SureHold handle design ensures safe dough transfer. BakeShield Technology prevents burnt loaves.
              </p>
              <a
                href="https://modkitchn.com/products/round-bread-sling"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop ModKitchn
              </a>
              <button
                onClick={() => copyToClipboard("BREAD30")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={modkitchenPromo30Off}
                  alt="30% OFF ModKitchn - All Items in Store"
                  className="w-full h-auto"
                />
              </button>
            </div>

            {/* ModKitchn Oval Bread Slings */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Essential Tool</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={modkitchenOvalSling}
                  alt="ModKitchn Oval Bread Slings"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Oval Bread Slings
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$15.99</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Silicone bread sling with SureHold grips for safe dough handling and counter-to-oven transfer. Features BakeShield Technology for golden brown crust.
              </p>
              <a
                href="https://modkitchn.com/products/oval-bread-sling"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop ModKitchn
              </a>
              <button
                onClick={() => copyToClipboard("BREAD30")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={modkitchenPromo30Off}
                  alt="30% OFF ModKitchn - All Items in Store"
                  className="w-full h-auto"
                />
              </button>
            </div>

            {/* ModKitchn Fresh Bread Storage Bags */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Storage Essential</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={modkitchenBreadBag}
                  alt="ModKitchn Fresh Bread Storage Bags"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Fresh Bread Storage Bags
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$29.99</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Reusable bread bags with waterproof zipper and moisture-controlling liner. Made from recycled water bottles. XL capacity holds up to 2 artisan bread boules.
              </p>
              <a
                href="https://modkitchn.com/products/bread-bag"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop ModKitchn
              </a>
              <button
                onClick={() => copyToClipboard("BREAD30")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={modkitchenPromo30Off}
                  alt="30% OFF ModKitchn - All Items in Store"
                  className="w-full h-auto"
                />
              </button>
            </div>

            {/* ModKitchn Holiday Bread Bags */}
            <div className="bg-card dark:bg-card p-5 rounded-xl shadow-sm border border-border">
              <Badge className="mb-3 bg-accent">Holiday Special</Badge>
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={modkitchenHolidayBags}
                  alt="ModKitchn Holiday Bread Bags"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg text-foreground dark:text-foreground mb-2">
                Holiday Bread Bags
              </h3>
              <p className="text-xs text-accent font-semibold mb-2">$29.99</p>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Limited-edition holiday-themed reusable bread bags with festive designs. Perfect for gifting homemade loaves - functions as both gift wrap and a reusable gift.
              </p>
              <a
                href="https://modkitchn.com/products/holiday-bread-bags"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg text-sm transition-colors font-medium"
              >
                Shop ModKitchn
              </a>
              <button
                onClick={() => copyToClipboard("BREAD30")}
                className="w-full mt-3 relative overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={modkitchenPromo30Off}
                  alt="30% OFF ModKitchn - All Items in Store"
                  className="w-full h-auto"
                />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* MID-RANGE GIFTS ($50-$100) */}
      <section id="midrange-gifts" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-primary mb-4">
            Mid-Range Gifts ($50-$100)
          </h2>
          <p className="text-lg text-foreground/80 dark:text-muted-foreground max-w-3xl mx-auto">
            Step up your baking game with these professional-grade tools that deliver serious results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Bakers Math Kitchen Scale */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="mb-3 bg-accent w-fit">Precision Required</Badge>
              <div className="mb-4 rounded-lg overflow-hidden aspect-square">
                <img
                  src={btBakersMathScale}
                  alt="Brød & Taylor Bakers Math Kitchen Scale"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-foreground dark:text-foreground">Bakers Math Kitchen Scale</CardTitle>
              <CardDescription className="text-accent font-semibold text-lg">$24.95</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70 dark:text-muted-foreground mb-6">
                This is one of my favorite scales. It's accurate to within 1g and it maintains that high precision necessary when you're baking bread. It measures kilograms, pounds, ounces, fluid ounces, and milliliters. In the United States it is $24.97.
              </p>
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a 
                  href="https://collabs.shop/bsdfl2" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Shop Now
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Classic VG2 Knife Sharpener */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="mb-3 bg-accent w-fit">Sharp Blades</Badge>
              <div className="mb-4 rounded-lg overflow-hidden aspect-square">
                <img
                  src={btVG2Sharpener}
                  alt="Brød & Taylor Classic VG2 knife sharpener"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-foreground dark:text-foreground">Classic VG2 Knife Sharpener</CardTitle>
              <CardDescription className="text-accent font-semibold text-lg">$79</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70 dark:text-muted-foreground mb-6">
                Professional-grade sharpener to keep bread knives at peak performance.
              </p>
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a 
                  href="https://collabs.shop/meedk8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Shop Now
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Professional Apron */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="mb-3 bg-accent w-fit">Pro Look</Badge>
              <div className="mb-4 rounded-lg overflow-hidden aspect-square">
                <img
                  src={btChefApronPro}
                  alt="Brød & Taylor professional apron"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-foreground dark:text-foreground">Professional Apron</CardTitle>
              <CardDescription className="text-accent font-semibold text-lg">$60</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70 dark:text-muted-foreground mb-6">
                Durable, professional-quality apron designed for everyday baking.
              </p>
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a 
                  href="https://brodandtaylor.com/henrysbreadkitchen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Shop Now
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Double-Wall French Press & Carafe */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="mb-3 bg-accent w-fit">Coffee & Tea</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={frenchPress}
                  alt="Brød & Taylor Double-Wall French Press"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-foreground dark:text-foreground">Double-Wall French Press & Carafe</CardTitle>
              <CardDescription className="text-accent font-semibold text-lg">$59.00</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70 dark:text-muted-foreground mb-6">
                Traditional French press meets modern double-wall construction. Brew coffee with the old-school method that gives you a full-bodied cup. The double-wall keeps it hot longer without burning your hand. Even better for tea—just remove the press screen and you've got a beautiful carafe.
              </p>
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a 
                  href="https://brodandtaylor.com/henrysbreadkitchen" 
                  target="_blank" 
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Shop Brød & Taylor
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* PREMIUM TOOLS ($200+) */}
      <section id="premium-tools" className="container mx-auto px-4 py-16 bg-gradient-to-b from-dough-cream to-background dark:from-background dark:to-background/95">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-primary mb-4">
            Premium Tools ($200+)
          </h2>
          <p className="text-lg text-foreground/80 dark:text-muted-foreground max-w-3xl mx-auto">
            Investment pieces that serious bakers dream about. Built to last generations and transform your baking.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Challenger Bread Pan */}
          <Card id="challenger-bread-pan" className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-bakery-copper text-white">Pro Baker Secret</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={challengerBreadPan}
                  alt="Challenger Bread Pan cast iron dutch oven alternative"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Challenger Bread Pan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                The game-changing cast iron bread pan designed specifically for home ovens. Features a shallow base and deep lid for easy loading and unmatched steam retention. No more wrestling scored dough into a scorching hot Dutch oven—just slide your loaf into the shallow base, cover with the lid, and bake bakery-quality bread with a crispy, blistered crust and open crumb. Built to last generations.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$270</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://challengerbreadware.com/?ref=henryhunterjr&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Challenger
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* BUNDLE DEALS - SAVE MORE */}
      <section id="bundle-deals" className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-dough-cream dark:from-background/95 dark:to-background">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-accent text-white text-base px-4 py-2">Best Value</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-primary mb-4">
            Brød & Taylor Bundle Deals
          </h2>
          <p className="text-lg text-foreground/80 dark:text-muted-foreground max-w-3xl mx-auto">
            Save more when you bundle! Get essential tools together at a discount.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Bundle 1: Sourdough Home + Starter Jar */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1 border-2 border-accent/20">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-accent text-white">Save $8.95!</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={btSourdoughHomeStarterBundle}
                  alt="Brød & Taylor Sourdough Home and Starter Jar bundle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Sourdough Home + Starter Jar Bundle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Everything you need to start your sourdough journey. The Sourdough Home proofer keeps your starter at the perfect temperature, while the premium starter jar makes feeding and maintenance a breeze.
              </CardDescription>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-accent">$165</p>
                <p className="text-sm text-muted-foreground line-through">Regular: $173.95</p>
              </div>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://collabs.shop/1vjisb"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Bundle
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Bundle 2: Round Baking Shell + Baking Steel */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1 border-2 border-accent/20">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-accent text-white">Pro Setup</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={btBakingShellSteelBundle}
                  alt="Brød & Taylor round baking shell and baking steel bundle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Round Baking Shell + Baking Steel Bundle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                The ultimate duo for professional-quality bread at home. The baking steel provides exceptional heat retention while the shell traps steam perfectly for crispy crusts and open crumb.
              </CardDescription>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-accent">$164</p>
              </div>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://collabs.shop/g9yxme"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Bundle
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Bundle 3: Dough Whisk + Bench Knife */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1 border-2 border-accent/20">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-accent text-white">Starter Kit</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={btDoughWhiskBenchKnifeBundle}
                  alt="Brød & Taylor dough whisk and bench knife bundle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Dough Whisk + Bench Knife Bundle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Perfect starter kit for any baker. The dough whisk makes mixing a breeze, while the bench knife is essential for dividing, shaping, and cleaning your work surface. Great value!
              </CardDescription>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-accent">$37.75</p>
                <p className="text-xs text-muted-foreground italic">Perfect starter kit - great value</p>
              </div>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://brodandtaylor.com/henrysbreadkitchen"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Bundle
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Navigation */}
      <section id="quick-nav" className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-dough-cream">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Not Sure Where to Start?</h2>
          <p className="text-lg text-muted-foreground">Jump to the section that fits your situation.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => scrollToSection("new-baker")}
            className="bg-olive hover:bg-olive/90 text-white rounded-full px-6 py-6 text-base"
          >
            Brand New to Baking
          </Button>
          <Button
            onClick={() => scrollToSection("serious-baker")}
            className="bg-olive hover:bg-olive/90 text-white rounded-full px-6 py-6 text-base"
          >
            Serious Home Baker
          </Button>
          <Button
            onClick={() => scrollToSection("has-everything")}
            className="bg-olive hover:bg-olive/90 text-white rounded-full px-6 py-6 text-base"
          >
            Baker Who Has Everything
          </Button>
          <Button
            onClick={() => scrollToSection("top-five")}
            variant="outline"
            className="border-2 border-olive text-olive hover:bg-olive hover:text-white rounded-full px-6 py-6 text-base"
          >
            Just Show Top 5 Again
          </Button>
        </div>
      </section>

      {/* BOOKS & LEARNING */}
      <section id="books-learning" className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-dough-cream dark:from-background/95 dark:to-background">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-foreground mb-4">
            Books & Learning
          </h2>
          <p className="text-lg text-foreground dark:text-foreground max-w-3xl mx-auto">
            Real knowledge from years in the kitchen. These aren't fluff—they're practical guides I wrote after making every mistake first.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Sourdough for the Rest of Us */}
          <Card id="sourdough-rest-of-us" className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-olive text-white">Start Here</Badge>
              <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <img
                  src={sourdoughRestOfUs}
                  alt="Sourdough for the Rest of Us book cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Sourdough for the Rest of Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Look, I wrote this book because I got tired of watching people give up on sourdough. Too many guides treat it like rocket science. It's not. This is the book I wish I'd had when I started, no fancy equipment required, no perfection needed. Just real techniques that work in real kitchens. If you can stir and wait, you can make great sourdough.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$6.08</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://a.co/d/guDGoiE"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Buy on Amazon
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Vitale Sourdough Mastery */}
          <Card id="vitale-mastery" className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-accent text-white">Level Up</Badge>
              <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <img
                  src={vitaleSourdoughMastery}
                  alt="Vitale Sourdough Mastery book cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Vitale Sourdough Mastery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Once you've got the basics down, this is where you level up. I dig deeper into the techniques that separate good loaves from great ones. Timing, temperature control, shaping methods that actually make sense. It's not about being perfect, it's about understanding what you're doing so you can adapt and troubleshoot like a pro.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$9.60</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://a.co/d/h8Lnskn"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Buy on Amazon
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* From Oven to Market */}
          <Card id="oven-to-market" className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-secondary text-white">Make Money</Badge>
              <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <img
                  src={fromOvenToMarket}
                  alt="From Oven to Market book cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">From Oven to Market</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                I spent years selling bread at farmers markets before moving online. This book covers everything I learned the hard way: cottage food laws, pricing that actually makes money, production planning, dealing with customers. If you're thinking about turning your baking into income, start here. It'll save you a lot of expensive mistakes.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$7.62</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://a.co/d/3MKgp3l"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Buy on Amazon
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* The Loaf and the Lie */}
          <Card id="loaf-and-lie" className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-bakery-copper text-white">Deep Dive</Badge>
              <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <img
                  src={loafAndLie}
                  alt="The Loaf and the Lie book cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">The Loaf and the Lie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                This one's different. It's part history, part exposé on how industrial bread replaced real bread in America. I trace the marketing, the culture shift, the nutritional impact. And yeah, I talk about what it means to be a Black baker in a space where we're barely visible. It's a quick read, but it'll change how you see bread.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$6.99</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://a.co/d/fyIyomh"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Buy on Amazon
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Bread: A Journey Through History */}
          <Card id="bread-journey" className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-primary text-white">Big Picture</Badge>
              <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <img
                  src={breadJourney}
                  alt="Bread: A Journey Through History, Science, Art and Community book cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Bread: A Journey Through History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                This is the big picture book. Where bread came from, how fermentation actually works, why it matters in cultures around the world. I wrote it for everyone, whether you bake or just love eating good bread. It's the kind of book you can share with your kids or keep on your coffee table. Stories, science, and a whole lot of respect for this ancient craft.
              </CardDescription>
              <p className="text-sm font-semibold text-accent">$7.95</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://a.co/d/3jUvHC8"
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                >
                  Buy on Amazon
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gift Ideas by Experience Level */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Gift Ideas by Experience Level
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Pick a path that fits the baker in your life. These are individual products, not bundled packages. Mix and match however you want.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand New Baker */}
          <Card id="new-baker" className="overflow-hidden">
            <div className="bg-olive text-white p-4 text-center">
              <h3 className="text-2xl font-bold">🌱 Brand New to Baking</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground">
                First loaf territory. Get them started with confidence and clear wins.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => scrollToSection("vitale-card")}
                  className="flex items-center gap-2 text-foreground hover:text-accent font-medium w-full text-left p-2 rounded hover:bg-accent/10 transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Vitale Sourdough Starter</span>
                </button>
                <button
                  onClick={() => scrollToSection("top-five")}
                  className="flex items-center gap-2 text-foreground hover:text-accent font-medium w-full text-left p-2 rounded hover:bg-accent/10 transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Wire Monkey Lame</span>
                </button>
                <button
                  onClick={() => scrollToSection("top-five")}
                  className="flex items-center gap-2 text-foreground hover:text-accent font-medium w-full text-left p-2 rounded hover:bg-accent/10 transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Holland Bowl Mill 17" Bowl</span>
                </button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm italic text-muted-foreground">
                  <strong>Why This Works:</strong> Starter, scoring tool, mixing bowl. That's all you need for your first great loaf. Nothing complicated, nothing you'll outgrow.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Serious Home Baker */}
          <Card id="serious-baker" className="overflow-hidden">
            <div className="bg-bakery-copper text-white p-4 text-center">
              <h3 className="text-2xl font-bold">🔥 Bakes Every Week</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground">
                They've moved past the beginner tutorials. Time to upgrade their setup and remove guesswork.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => scrollToSection("top-five")}
                  className="flex items-center gap-2 text-foreground hover:text-accent font-medium w-full text-left p-2 rounded hover:bg-accent/10 transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Brød & Taylor Folding Proofer</span>
                </button>
                <button
                  onClick={() => scrollToSection("top-five")}
                  className="flex items-center gap-2 text-foreground hover:text-accent font-medium w-full text-left p-2 rounded hover:bg-accent/10 transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Sourhouse Goldie</span>
                </button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm italic text-muted-foreground">
                  <strong>Why This Works:</strong> Temperature control and precision. These tools take the variables out of fermentation. Bake by feel, but verify with data.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Baker Who Has Everything */}
          <Card id="has-everything" className="overflow-hidden">
            <div className="bg-secondary text-white p-4 text-center">
              <h3 className="text-2xl font-bold">✨ Already Has the Basics</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground">
                Beautiful tools that earn their spot on the counter. Function meets craft.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => scrollToSection("top-five")}
                  className="flex items-center gap-2 text-foreground hover:text-accent font-medium w-full text-left p-2 rounded hover:bg-accent/10 transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Holland Bowl Mill Bowl</span>
                </button>
                <button
                  onClick={() => scrollToSection("top-five")}
                  className="flex items-center gap-2 text-foreground hover:text-accent font-medium w-full text-left p-2 rounded hover:bg-accent/10 transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Wire Monkey Lame</span>
                </button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm italic text-muted-foreground">
                  <strong>Why This Works:</strong> These are the tools that make you smile every time you use them. Too pretty to hide in a drawer, too useful to be decorative.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Internal Content Links */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h3 className="text-2xl font-bold text-primary">New to Bread Baking?</h3>
          <p className="text-lg text-muted-foreground">Start here before you buy tools.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
            <a 
              href="https://bit.ly/3srdSYS" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium text-lg"
            >
              <ArrowRight className="h-5 w-5" />
              Join 50,000+ Bakers
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-dough-cream to-background dark:from-background dark:to-background/95">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-primary mb-4">
            Real Testimonials from Our Community
          </h2>
          <p className="text-lg text-foreground/70 dark:text-muted-foreground">Real bakers. Real results.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Testimonial 1 - Vitale Starter */}
          <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-foreground/70 dark:text-muted-foreground">
                "The Vitale starter woke up in 4 days and I baked my first successful loaf that weekend. Henry's instructions made it feel impossible to fail."
              </p>
              <div>
                <p className="font-bold text-foreground dark:text-foreground">Sarah M.</p>
                <p className="text-sm text-foreground/60 dark:text-muted-foreground">Ohio • Vitale Sourdough Starter</p>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial 2 - Wire Monkey Lame */}
          <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-foreground/70 dark:text-muted-foreground">
                "The Wire Monkey lame made me feel like a professional. My scores actually open up now instead of just dragging across the surface."
              </p>
              <div>
                <p className="font-bold text-foreground dark:text-foreground">Jessica R.</p>
                <p className="text-sm text-foreground/60 dark:text-muted-foreground">North Carolina • Wire Monkey Lame</p>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial 3 - Goldie */}
          <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-foreground/70 dark:text-muted-foreground">
                "I've been baking for years but the Goldie changed everything. No more guessing about fermentation times or adjusting for my cold kitchen."
              </p>
              <div>
                <p className="font-bold text-foreground dark:text-foreground">Mike T.</p>
                <p className="text-sm text-foreground/60 dark:text-muted-foreground">Colorado • Sourhouse Goldie</p>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial 4 - Sourdough Method */}
          <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-foreground/70 dark:text-muted-foreground">
                "Henry's sourdough method changed everything for me. After years of dense, flat loaves, I finally achieved that perfect open crumb and crispy crust."
              </p>
              <div>
                <p className="font-bold text-foreground dark:text-foreground">Sarah Mitchell</p>
                <p className="text-sm text-foreground/60 dark:text-muted-foreground">Portland, OR • Sourdough Techniques</p>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial 5 - Holland Bowl Mill */}
          <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-foreground/70 dark:text-muted-foreground">
                "The Holland Bowl Mill bowl is stunning and functional. I use it for mixing, folding, and it sits on my counter like a piece of art."
              </p>
              <div>
                <p className="font-bold text-foreground dark:text-foreground">Lisa W.</p>
                <p className="text-sm text-foreground/60 dark:text-muted-foreground">Boston, MA • Holland Bowl Mill Bowl</p>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial 6 - David Kumar */}
          <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-foreground/70 dark:text-muted-foreground">
                "The troubleshooting section saved my baking! Henry addresses every problem I encountered and offers clear solutions. It's like having a master baker in your kitchen."
              </p>
              <div>
                <p className="font-bold text-foreground dark:text-foreground">David Kumar</p>
                <p className="text-sm text-foreground/60 dark:text-muted-foreground">Chicago, IL • Baguettes</p>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial 7 - Rachel Green */}
          <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-foreground/70 dark:text-muted-foreground">
                "My family can't get enough of the sourdough I make using Henry's recipes. Even my picky kids ask for 'daddy's special bread' every week."
              </p>
              <div>
                <p className="font-bold text-foreground dark:text-foreground">Rachel Green</p>
                <p className="text-sm text-foreground/60 dark:text-muted-foreground">Denver, CO • Sandwich Bread</p>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial 8 - Tom Anderson */}
          <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-foreground/70 dark:text-muted-foreground">
                "Henry's approach to bread scoring transformed my loaves from good to bakery-quality. The patterns I can create now are stunning, and the technique is so simple."
              </p>
              <div>
                <p className="font-bold text-foreground dark:text-foreground">Tom Anderson</p>
                <p className="text-sm text-foreground/60 dark:text-muted-foreground">Minneapolis, MN • Country Loaf</p>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial 9 - Priya Patel */}
          <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-foreground/70 dark:text-muted-foreground">
                "I appreciate how Henry respects different dietary needs. His whole grain recipes are wholesome, delicious, and my family loves them."
              </p>
              <div>
                <p className="font-bold text-foreground dark:text-foreground">Priya Patel</p>
                <p className="text-sm text-foreground/60 dark:text-muted-foreground">Atlanta, GA • Multigrain Bread</p>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial 10 - Chris Martinez */}
          <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-foreground/70 dark:text-muted-foreground">
                "Learning to maintain my sourdough starter seemed impossible until I found Henry's guide. Now my starter is healthy and consistent, and my bread proves it."
              </p>
              <div>
                <p className="font-bold text-foreground dark:text-foreground">Chris Martinez</p>
                <p className="text-sm text-foreground/60 dark:text-muted-foreground">Phoenix, AZ • Classic Sourdough</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* BOOKS FOR GIFT GIVING */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-primary mb-4">
            Books for Gift Giving
          </h2>
          <p className="text-lg text-foreground/80 dark:text-muted-foreground max-w-3xl mx-auto">
            Knowledge that lasts longer than any tool. Give the gift of baking wisdom.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Book 1 - Sourdough for the Rest of Us */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-foreground">Sourdough for the Rest of Us</CardTitle>
              <CardDescription className="text-foreground/60 dark:text-muted-foreground italic">No Perfection Required</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="mb-4 bg-accent">Available Now</Badge>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                Straightforward sourdough guidance that meets you where you are. No artisan jargon, just great bread.
              </p>
              <p className="text-xs text-accent font-semibold mb-6">
                Best for: Beginners or anyone tired of complicated sourdough advice
              </p>
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a 
                  href="https://www.amazon.com/Sourdough-Rest-Us-Perfection-Required/dp/B0DPRZ5NYL" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Buy on Amazon
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Book 2 - The Bread Journey */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-foreground">The Bread Journey</CardTitle>
              <CardDescription className="text-foreground/60 dark:text-muted-foreground italic">From Kitchen to Community</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="mb-4 bg-accent">Available Now</Badge>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                How bread can transform your life and bring people together. Personal stories, practical guidance, and recipes that build community.
              </p>
              <p className="text-xs text-accent font-semibold mb-6">
                Best for: Anyone who loves the story behind the bread
              </p>
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a 
                  href="https://www.amazon.com/Bread-Journey-Kitchen-Community/dp/B0DPRZM8VG" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Buy on Amazon
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Book 3 - Baking Great Bread at Home */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1 border-2 border-accent">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-foreground">Baking Great Bread at Home</CardTitle>
              <CardDescription className="text-foreground/60 dark:text-muted-foreground italic">A Journey Through the Seasons</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="mb-4 bg-secondary">Coming December 2025</Badge>
              <p className="text-sm text-foreground/70 dark:text-muted-foreground mb-4">
                A year-long journey through seasonal baking with master-level techniques made accessible. Pre-orders opening soon.
              </p>
              <p className="text-xs text-accent font-semibold mb-6">
                Best for: Serious bakers who want to deepen their craft
              </p>
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a 
                  href="https://bakinggreatbread.com/books" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Learn More
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Email Capture */}
      <section id="email-capture" className="bg-wheat-brown text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Still Not Sure? Get the Gift Guide by Email</h2>
            <p className="text-lg text-white/90">
              Save this guide for later, forward it to someone else, or print it for reference. No spam, just the guide.
            </p>

            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white text-foreground flex-1"
              />
              <Button type="submit" className="bg-olive hover:bg-olive/90 text-white px-8">
                Send Me the Guide
              </Button>
            </form>

            <p className="text-sm text-white/80">
              We respect your inbox. One email with the guide, that's it.
            </p>
          </div>
        </div>
      </section>

      {/* Digital Gifts Section (Conditional) */}
      {showDigitalGifts && (
        <section id="digital-gifts" className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Last-Minute Digital Gifts
            </h2>
            <p className="text-lg text-muted-foreground">Instant delivery. Perfect for procrastinators.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 space-y-4 text-center">
                <div className="aspect-[3/4] bg-dough-cream rounded-lg border-2 border-dashed border-olive flex items-center justify-center mb-4">
                  <p className="text-olive">Book Cover<br/>Coming Soon</p>
                </div>
                <h3 className="text-xl font-bold">Sourdough for the Rest of Us</h3>
                <Badge className="mb-2">Available Now</Badge>
                <p className="text-sm text-muted-foreground">
                  Forget the sourdough snobbery—this book is for real bakers who want great bread without the stress. No artisan jargon. No Instagram-perfect expectations. Just straightforward guidance that meets you where you are.
                </p>
                <Button asChild className="w-full bg-accent hover:bg-accent/90">
                  <a href="https://www.amazon.com/Sourdough-Rest-Us-Perfection-Required/dp/B0DPRZ5NYL" target="_blank" rel="noopener noreferrer">
                    Buy on Amazon
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4 text-center">
                <div className="aspect-[3/4] bg-dough-cream rounded-lg border-2 border-dashed border-olive flex items-center justify-center mb-4">
                  <p className="text-olive">Book Cover<br/>Coming Soon</p>
                </div>
                <h3 className="text-xl font-bold">The Bread Journey: From Kitchen to Community</h3>
                <Badge className="mb-2">Available Now</Badge>
                <p className="text-sm text-muted-foreground">
                  A heartfelt memoir about how bread can transform your life and bring people together. More than recipes, this is a story about finding purpose and building authentic relationships around a shared loaf.
                </p>
                <Button asChild className="w-full bg-accent hover:bg-accent/90">
                  <a href="https://www.amazon.com/Bread-Journey-Kitchen-Community/dp/B0DPRZM8VG" target="_blank" rel="noopener noreferrer">
                    Buy on Amazon
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4 text-center">
                <div className="aspect-[3/4] bg-dough-cream rounded-lg border-2 border-dashed border-olive flex items-center justify-center mb-4">
                  <p className="text-olive">Book Cover<br/>Coming Soon</p>
                </div>
                <h3 className="text-xl font-bold">Baking Great Bread at Home: A Journey Through the Seasons</h3>
                <Badge className="mb-2 bg-secondary">Pre-Orders Coming Soon</Badge>
                <p className="text-sm text-muted-foreground">
                  Master-level techniques made accessible, told through seasonal rhythms and family memories. A year-long journey through the craft of breadmaking. Coming December 2025.
                </p>
                <Button asChild className="w-full bg-accent hover:bg-accent/90">
                  <a href="https://bakinggreatbread.com/books" target="_blank" rel="noopener noreferrer">
                    Learn More
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-muted to-muted/50 dark:from-muted dark:to-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-primary mb-12 text-center">
            Questions About These Gifts
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-foreground dark:text-foreground mb-2">
                Do you earn a commission from these links?
              </h3>
              <p className="text-foreground dark:text-foreground">
                Yes. Some of these are affiliate links. When you buy through them, I earn a small commission at no extra cost to you. It supports the Baking Great Bread at Home community and helps me keep creating free content. I appreciate you using these links.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground dark:text-foreground mb-2">
                Are these tools beginner-friendly?
              </h3>
              <p className="text-foreground dark:text-foreground">
                Every single tool here can be used by someone baking their first loaf. Some are upgrades for serious bakers, but nothing here requires experience to use. If you can measure flour and water, you can use these tools.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground dark:text-foreground mb-2">
                What should I buy first if I'm overwhelmed?
              </h3>
              <p className="text-foreground dark:text-foreground">
                Start with the Vitale Starter and one good tool—either the Wire Monkey lame or the Holland Bowl Mill bowl. That combination gives someone everything they need to bake their first great loaf. You can always add more later.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground dark:text-foreground mb-2">
                Do these tools ship in time for Christmas?
              </h3>
              <p className="text-foreground dark:text-foreground">
                Most of them do, but I recommend ordering by December 15 to be safe. Each product page will show current shipping times. After December 15, check the Digital Gifts section for instant-delivery options.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground dark:text-foreground mb-2">
                What if the gift doesn't work out?
              </h3>
              <p className="text-foreground dark:text-foreground">
                Each brand has their own return policy. I've linked to companies I trust with good customer service. If you have issues with any purchase, reach out to me at henrysbreadkitchen@gmail.com and I'll help however I can.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground dark:text-foreground mb-2">
                Can I mix products from different brands?
              </h3>
              <p className="text-foreground dark:text-foreground">
                Absolutely. These aren't coordinated bundles. Buy one thing, buy all five, mix and match however you want. I'm just showing you what I use together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-bakery-copper text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Give Someone Their First Great Loaf
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            A good starter and one trusted tool can change how someone feels about bread forever. Start simple. Start here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-bakery-copper hover:bg-white/90 text-lg px-8"
              asChild
            >
              <a
                href="https://vitalesourdoughco.etsy.com?utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
              >
                Start With Vitale
              </a>
            </Button>
            <Button
              size="lg"
              className="bg-white text-bakery-copper hover:bg-white/90 text-lg px-8"
              onClick={() => scrollToSection("top-five")}
            >
              See All Top Picks
            </Button>
          </div>
        </div>
      </section>

      {/* FREE RESOURCES SECTION */}
      <section id="free-resources" className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-dough-cream dark:from-background/95 dark:to-background">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-primary mb-4">
            Free Resources
          </h2>
          <p className="text-lg text-foreground/80 dark:text-muted-foreground max-w-3xl mx-auto">
            Sometimes the best gifts are free. Here are my most useful tools and recipes for every baker.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Sourdough Starter 101 Guide */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-accent text-white">Essential Guide</Badge>
              <div className="aspect-video overflow-hidden rounded-lg mb-4 bg-dough-cream flex items-center justify-center">
                <img
                  src={starterGuide}
                  alt="Sourdough Starter 101 Guide"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Sourdough Starter 101 Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Give the gift of sourdough confidence with our FREE Sourdough Starter 101 guide—the most comprehensive, beginner-friendly resource for creating and maintaining a thriving starter. This guide takes the mystery out of sourdough with clear instructions, troubleshooting tips, and feeding schedules that actually work. Whether they're brand new to baking or looking to level up their bread game, this guide will help them build a healthy starter and bake incredible loaves. It's the foundation every sourdough baker needs.
              </CardDescription>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://sourdough-starter-master-kxo6qxb.gamma.site/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get the Free Guide
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Bread Buddy Converter */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-primary text-primary-foreground">Free Tool</Badge>
              <div className="aspect-video overflow-hidden rounded-lg mb-4 bg-dough-cream flex items-center justify-center">
                <img
                  src={safInstantYeast}
                  alt="Bread Buddy Sourdough to Yeast Converter Tool"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Bread Buddy Recipe Converter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Convert any sourdough recipe to commercial yeast (or vice versa) in seconds. No more guessing hydration ratios or fermentation times. This calculator does the math so you don't have to. It's the tool I use when I'm short on time but craving sourdough flavor.
              </CardDescription>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://sourdough-yeast-converter.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Try the Converter
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Free Recipes */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-olive text-white">Free Recipes</Badge>
              <div className="aspect-video overflow-hidden rounded-lg mb-4">
                <img
                  src={recipeCollection}
                  alt="Free bread baking recipes collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Complete Recipe Collection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                Over 50 tested bread recipes from rustic sourdough to enriched doughs. Each one includes step-by-step photos, timing guides, and troubleshooting tips. No paywalls. No pop-ups. Just solid recipes that work the first time.
              </CardDescription>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="https://bakinggreatbread.com/recipes"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Browse Recipes
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Shop by Brand */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-primary mb-2">Browse by Brand</h3>
          <p className="text-muted-foreground">Already have a favorite? Start there.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <h4 className="font-bold mb-2">Vitale Sourdough Co.</h4>
              <p className="text-sm text-muted-foreground mb-4">
                My own dehydrated starters. Ship fast, wake up easy.
              </p>
              <a
                href="https://vitalesourdoughco.etsy.com?utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 text-sm font-medium"
              >
                Visit Store →
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <h4 className="font-bold mb-2">Wire Monkey</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Best scoring tools in the business.
              </p>
              <a
                href="https://wiremonkey.com/?ref=BAKINGGREATBREAD&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 text-sm font-medium"
              >
                Visit Store →
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <h4 className="font-bold mb-2">Sourhouse</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Starter warmers and fermentation gear.
              </p>
              <a
                href="https://sourhouse.co?ref=BAKINGGREATBREAD&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 text-sm font-medium"
              >
                Visit Store →
              </a>
              <p className="text-xs text-muted-foreground mt-2">Code: HBK23 for 10% off</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <h4 className="font-bold mb-2">Holland Bowl Mill</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Hand-turned wooden bowls from Michigan.
              </p>
              <a
                href="https://hollandbowlmill.com/baking/?wpam_id=10&utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 text-sm font-medium"
              >
                Visit Store →
              </a>
              <p className="text-xs text-muted-foreground mt-2">Code: bread for 10% off</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <h4 className="font-bold mb-2">Brød & Taylor</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Proofers, scales, and precision tools.
              </p>
              <a
                href="https://brodandtaylor.com/henrysbreadkitchen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 text-sm font-medium"
              >
                Visit Store →
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <h4 className="font-bold mb-2">Challenger Breadware</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Revolutionary cast iron bread pans.
              </p>
              <a
                href="https://challengerbreadware.com/?ref=henryhunterjr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 text-sm font-medium"
              >
                Visit Store →
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final Affiliate Disclosure */}
      <section className="bg-background py-8">
        <div className="container mx-auto px-4">
          {!ftcDismissed && (
            <div className="bg-secondary/20 border-2 border-secondary/60 rounded-xl p-4 md:p-5 max-w-[900px] mx-auto shadow-lg relative animate-in fade-in duration-500">
              <button
                onClick={dismissFTC}
                className="absolute top-2 right-2 md:top-3 md:right-3 text-secondary hover:text-secondary/70 text-2xl md:text-3xl font-bold leading-none border-none bg-transparent cursor-pointer p-1 transition-colors"
                aria-label="Dismiss notice"
              >
                ×
              </button>
              <p className="text-foreground font-bold text-center pr-8 text-sm md:text-base">
                ⚠️ Affiliate Disclosure: I earn commissions from qualifying purchases. This supports my independent curation at no extra cost to you. Thanks for trusting my recommendations!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HolidayGiftGuide;
