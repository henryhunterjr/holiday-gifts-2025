import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Copy, Check, ArrowRight, Gift, Star } from "lucide-react";
import { toast } from "sonner";

// Import product images
import heroImage from "@/assets/holiday/hero-bread-baking-gifts.png";
import vitaleStarter from "@/assets/holiday/vitale-sourdough-starter.jpg";
import wireMonkeyLame from "@/assets/holiday/wire-monkey-lame.jpg";
import goldie from "@/assets/holiday/sourhouse-goldie-starter-warmer.webp";
import hollandBowl from "@/assets/holiday/holland-bowl-mill.jpg";
import brodTaylorProofer from "@/assets/holiday/brod-taylor-proofer.jpg";
import modBreadBag from "@/assets/holiday/modkitchen-bread-bag.webp";
import modBreadSling from "@/assets/holiday/modkitchen-bread-sling.webp";
import woodPulpBanneton from "@/assets/holiday/wood-pulp-banneton.webp";
import gooseLame from "@/assets/holiday/wire-monkey-goose-lame.jpg";
import doughBed from "@/assets/holiday/sourhouse-doughbed.jpg";

const HolidayGiftGuide = () => {
  const [email, setEmail] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [urgencyMessage, setUrgencyMessage] = useState("");
  const [showDigitalGifts, setShowDigitalGifts] = useState(false);

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
        "name": "Sour House Goldie Starter Warmer",
        "image": "https://bakinggreatbread.blog/holiday/sourhouse-goldie.jpg",
        "description": "Temperature-controlled starter warmer for consistent fermentation.",
        "brand": { "@type": "Brand", "name": "Sour House" },
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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--olive-accent)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
                The Holiday Gift Guide for People Who Actually Bake Bread
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Stop guessing. These are the tools real bakers want. Handpicked from my own kitchen.
              </p>
              
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-lg border border-accent/20 w-fit">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  Trusted by 50,000+ home bakers in the Baking Great Bread at Home community
                </span>
              </div>

              {urgencyMessage && (
                <div className="inline-block bg-olive text-white px-6 py-2 rounded-full text-sm font-medium">
                  {urgencyMessage}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => scrollToSection("top-five")}
                  className="bg-accent hover:bg-accent/90 text-white text-lg px-8"
                >
                  See My Top 5 Picks
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("vitale-card")}
                  className="border-2 border-accent text-accent hover:bg-accent hover:text-white text-lg px-8"
                >
                  Start With a Starter
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src={heroImage}
                alt="Holiday bread baking gifts and essential tools for home bakers"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-dough-cream border-l-4 border-olive p-6 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Quick note:</strong> Some links on this page are affiliate links. I only recommend tools I use in my own kitchen. You pay the same price, I earn a small commission that keeps this site running. No surprises.
          </p>
        </div>
      </section>

      {/* Authority Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h3 className="text-2xl font-bold text-primary">How I Picked These Tools</h3>
          <p className="text-lg text-muted-foreground italic">
            "I've been baking for 20+ years and teaching for 10. These are the tools I reach for every single week. Not the fanciest. Not the cheapest. Just the ones that actually make baking better."
          </p>
        </div>
      </section>

      {/* Top 5 Section */}
      <section id="top-five" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Henry's Top 5 Holiday Picks
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            These are the tools I actually use every week. If someone asked me what to buy a baker, I'd start here. Each one solves a real problem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product 1: Vitale Sourdough Starter */}
          <Card id="vitale-card" className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-primary text-primary-foreground">My Own Product</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={vitaleStarter}
                  alt="Vitale dehydrated sourdough starter gift kit for home bakers"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
            </CardContent>
          </Card>

          {/* Product 2: Wire Monkey Lame */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-secondary text-white">Best Scoring Tool</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={wireMonkeyLame}
                  alt="Wire Monkey bread scoring lame for artisan sourdough"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
            </CardContent>
          </Card>

          {/* Product 3: Sour House Goldie */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-bakery-copper text-white">Solves Temperature Problems</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={goldie}
                  alt="Sour House Goldie sourdough starter warmer and temperature control"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Sour House Goldie</CardTitle>
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
                  Shop Sour House
                </a>
              </Button>
              <div className="flex items-center gap-2 bg-dough-cream p-3 rounded-lg border border-border">
                <span className="text-sm font-medium">Promo Code: HBK23 (10% off)</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard("HBK23")}
                  className="ml-auto"
                >
                  {copiedCode === "HBK23" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
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
              <div className="flex items-center gap-2 bg-dough-cream p-3 rounded-lg border border-border">
                <span className="text-sm font-medium">Promo Code: bread (10% off)</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard("bread")}
                  className="ml-auto"
                >
                  {copiedCode === "bread" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
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
                  href="http://brodandtaylor.com/henrysbreadkitchen?utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Brød & Taylor
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* More Great Tools Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-dough-cream">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            More Great Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            These are the tools that round out a complete baking setup. Each one solves a specific problem and makes the process smoother.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* ModKitchen Bread Bag */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-wheat text-white">Storage Solution</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={modBreadBag}
                  alt="ModKitchen reusable linen bread storage bag"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">ModKitchen Bread Bag</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                A reusable linen-blend bread bag that actually keeps your loaf breathing instead of sweating. Perfect for same-day storage or delivering a still-warm loaf to a friend. Soft, durable, and sized for everything from boules to batards.
              </CardDescription>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Coming Soon
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* ModKitchen Bread Sling */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-wheat text-white">Transfer Tool</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={modBreadSling}
                  alt="ModKitchen heat-safe bread sling for Dutch oven transfers"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">ModKitchen Bread Sling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                This sling gives you smooth, confident transfers into a Dutch oven without the panic. Heat-safe, non-stick, and lightweight. If you've ever dropped a shaped loaf into a burning hot pot… this is your upgrade.
              </CardDescription>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Coming Soon
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Wire Monkey Wood Pulp Banneton */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-olive text-white">Modern Proofing</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={woodPulpBanneton}
                  alt="Wire Monkey wood pulp banneton proofing basket"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Wire Monkey Wood Pulp Banneton</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                A modern take on the classic proofing basket. Wood-pulp bannetons absorb excess moisture and help you score cleaner, sharper designs. They give you a more even skin on your dough and a rustic, artisanal look that people notice.
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
            </CardContent>
          </Card>

          {/* Wire Monkey Goose Lame */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-olive text-white">Precision Scoring</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={gooseLame}
                  alt="Wire Monkey Goose lame bread scoring tool with ergonomic design"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Wire Monkey Goose Lame</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                A sleek, ergonomic scoring tool with a grip that feels secure and balanced. The Goose Lame is loved for its control — you get clean, deep lines and expressive scoring without fighting the blade.
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
            </CardContent>
          </Card>

          {/* Sour House Joe Bed */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-bakery-copper text-white">Starter Care</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={doughBed}
                  alt="Sour House Joe Bed dough proofing bowl with temperature control"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardTitle className="text-2xl">Sour House 'Joe Bed'</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                A cozy, temperature-friendly resting place for your sourdough starter jars. Keeps the jar stable, lifted, and warm enough to ferment smoothly. Perfect companion for the Goldie if you want consistency without fuss.
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
                  Shop Sour House
                </a>
              </Button>
              <div className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                <span className="font-mono">HBK23</span>
                <span className="text-muted-foreground text-xs">10% off</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard("HBK23")}
                  className="ml-auto"
                >
                  {copiedCode === "HBK23" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Brød & Taylor Dough Whisk - Placeholder */}
          <Card className="group hover:shadow-lifted transition-all duration-300 hover:-translate-y-1 opacity-75">
            <CardHeader>
              <Badge className="w-fit mb-4 bg-wheat text-white">Mixing Tool</Badge>
              <div className="aspect-square overflow-hidden rounded-lg mb-4 bg-dough-cream flex items-center justify-center border-2 border-dashed border-olive">
                <p className="text-olive text-center p-4">Coming Soon</p>
              </div>
              <CardTitle className="text-2xl">Brød & Taylor Dough Whisk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                The classic Danish dough whisk made better with Brød & Taylor craftsmanship. Ideal for mixing wet, sticky doughs without clogging or straining your wrist. It's one of those tools you don't realize you need until you have it.
              </CardDescription>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a
                  href="http://brodandtaylor.com/henrysbreadkitchen?utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Brød & Taylor
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* STOCKING STUFFERS (UNDER $50) */}
      <section
        id="stocking-stuffers"
        className="w-full bg-[#FAF5EB] py-12 px-6 md:px-10 border-b border-[rgba(0,0,0,0.05)]"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-[#586247] mb-3">
            Stocking Stuffers for Bakers (Under $50)
          </h2>

          <p className="text-lg text-[#3A3A3A] mb-8">
            Small, thoughtful tools that bakers love. Perfect for stockings, 
            hostess gifts, or quick add-ons to any holiday order.
          </p>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            {/* ITEM 1 — Wire Monkey Pocket Lame */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-[#3A3A3A] text-lg mb-2">
                Wire Monkey Pocket Lame
              </h3>
              <p className="text-sm text-[#555] mb-4">
                A compact scoring tool that slips into any apron pocket. 
                Clean cuts and confident scoring for new bakers.
              </p>
              <a
                href="https://wiremonkey.com/?ref=BAKINGGREATBREAD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#C47B51] text-white py-2 px-4 rounded-lg text-sm hover:bg-[#A56441]"
              >
                Shop
              </a>
            </div>

            {/* ITEM 2 — Replacement Blades */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-lg text-[#3A3A3A] mb-2">
                Replacement Blade Pack (Wire Monkey)
              </h3>
              <p className="text-sm text-[#555] mb-4">
                Sharp, clean blades packaged for bakers. A simple upgrade that 
                makes scoring smoother and more predictable.
              </p>
              <a
                href="https://wiremonkey.com/?ref=BAKINGGREATBREAD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#C47B51] text-white py-2 px-4 rounded-lg text-sm hover:bg-[#A56441]"
              >
                Shop
              </a>
            </div>

            {/* ITEM 3 — Bread Bag */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-lg text-[#3A3A3A] mb-2">
                ModKitchen Bread Bag
              </h3>
              <p className="text-sm text-[#555] mb-4">
                A reusable linen-style bread bag that keeps loaves breathing 
                instead of sweating. Great for gifting fresh bakes.
              </p>
              <a
                href="#"
                className="inline-block bg-[#C47B51] text-white py-2 px-4 rounded-lg text-sm hover:bg-[#A56441]"
              >
                Link Coming Soon
              </a>
            </div>

            {/* ITEM 4 — Bread Sling */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-lg text-[#3A3A3A] mb-2">
                ModKitchen Bread Sling
              </h3>
              <p className="text-sm text-[#555] mb-4">
                Heat-proof, non-stick sling that makes transferring dough into 
                a Dutch oven smoother, safer, and more predictable.
              </p>
              <a
                href="#"
                className="inline-block bg-[#C47B51] text-white py-2 px-4 rounded-lg text-sm hover:bg-[#A56441]"
              >
                Link Coming Soon
              </a>
            </div>

            {/* ITEM 5 — Dough Whisk */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-lg text-[#3A3A3A] mb-2">
                Brød & Taylor Dough Whisk
              </h3>
              <p className="text-sm text-[#555] mb-4">
                Perfect for mixing sticky doughs without clogging. Light, strong, 
                and a surprisingly essential tool.
              </p>
              <a
                href="http://brodandtaylor.com/henrysbreadkitchen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#C47B51] text-white py-2 px-4 rounded-lg text-sm hover:bg-[#A56441]"
              >
                Shop
              </a>
            </div>

            {/* ITEM 6 — Bench Scraper */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-lg text-[#3A3A3A] mb-2">
                Bench Scraper
              </h3>
              <p className="text-sm text-[#555] mb-4">
                Shape, divide, lift, and clean with one tool. 
                Every baker needs one. Most bakers need two.
              </p>
              <a
                href="#"
                className="inline-block bg-[#C47B51] text-white py-2 px-4 rounded-lg text-sm hover:bg-[#A56441]"
              >
                Add Link
              </a>
            </div>

            {/* ITEM 7 — Banneton */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-lg text-[#3A3A3A] mb-2">
                Wood-Pulp Banneton (Wire Monkey)
              </h3>
              <p className="text-sm text-[#555] mb-4">
                Helps dough form consistent structure and encourages 
                beautiful crust patterns.
              </p>
              <a
                href="https://wiremonkey.com/?ref=BAKINGGREATBREAD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#C47B51] text-white py-2 px-4 rounded-lg text-sm hover:bg-[#A56441]"
              >
                Shop
              </a>
            </div>

            {/* ITEM 8 — Starter Accessories */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-lg text-[#3A3A3A] mb-2">
                Starter Jar Accessories (Sour House)
              </h3>
              <p className="text-sm text-[#555] mb-4">
                Cozy add-ons like the Joe Bed or jar grips. 
                Perfect companions for the Goldie.
              </p>
              <a
                href="https://sourhouse.co?ref=BAKINGGREATBREAD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#C47B51] text-white py-2 px-4 rounded-lg text-sm hover:bg-[#A56441]"
              >
                Shop
              </a>
            </div>

            {/* ITEM 9 — Digital Cards */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-lg text-[#3A3A3A] mb-2">
                Hydration Cheat Sheets / Recipe Cards
              </h3>
              <p className="text-sm text-[#555] mb-4">
                A tiny, thoughtful digital gift. Perfect for bakers 
                who want clarity without guesswork.
              </p>
              <a
                href="#"
                className="inline-block bg-[#C47B51] text-white py-2 px-4 rounded-lg text-sm hover:bg-[#A56441]"
              >
                Add Link
              </a>
            </div>

            {/* ITEM 10 — Book */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-lg text-[#3A3A3A] mb-2">
                "Sourdough for the Rest of Us"
              </h3>
              <p className="text-sm text-[#555] mb-4">
                A friendly beginner's sourdough guide from my own kitchen. 
                Lightweight, helpful, and gift-ready.
              </p>
              <a
                href="https://sourdough-simplified-gift.lovable.app/sourdough-for-the-rest"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#C47B51] text-white py-2 px-4 rounded-lg text-sm hover:bg-[#A56441]"
              >
                Shop
              </a>
            </div>

          </div>
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
                  className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium w-full text-left"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Vitale Sourdough Starter</span>
                </button>
                <button
                  onClick={() => scrollToSection("top-five")}
                  className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium w-full text-left"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Wire Monkey Lame</span>
                </button>
                <button
                  onClick={() => scrollToSection("top-five")}
                  className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium w-full text-left"
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
                They're past beginner tutorials. Time to upgrade their setup and remove guesswork.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => scrollToSection("top-five")}
                  className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium w-full text-left"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Brød & Taylor Folding Proofer</span>
                </button>
                <button
                  onClick={() => scrollToSection("top-five")}
                  className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium w-full text-left"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Sour House Goldie</span>
                </button>
                <a
                  href="#"
                  className="flex items-center gap-2 text-muted-foreground hover:text-accent font-medium w-full text-left"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>High-Capacity Baking Scale (coming soon)</span>
                </a>
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
                  className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium w-full text-left"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Holland Bowl Mill Bowl</span>
                </button>
                <button
                  onClick={() => scrollToSection("top-five")}
                  className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium w-full text-left"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Wire Monkey Lame</span>
                </button>
                <a
                  href="#"
                  className="flex items-center gap-2 text-muted-foreground hover:text-accent font-medium w-full text-left"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Bench Scraper or Linen Liner (more tools coming soon)</span>
                </a>
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
            <a href="#" className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium text-lg">
              <ArrowRight className="h-5 w-5" />
              Beginner Sourdough Guide
            </a>
            <a href="#" className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium text-lg">
              <ArrowRight className="h-5 w-5" />
              Baking Techniques Library
            </a>
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
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-dough-cream to-background">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            What Members of Our Community Are Saying
          </h2>
          <p className="text-lg text-muted-foreground">Real bakers. Real results.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-muted-foreground">
                "Henry's sourdough method changed everything for me. After years of dense, flat loaves, I finally achieved that perfect open crumb and crispy crust. His step-by-step approach makes it accessible for anyone."
              </p>
              <p className="font-bold text-foreground">— Sarah Mitchell, Portland, OR</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-muted-foreground">
                "I've been baking professionally for 10 years, and Henry's techniques still taught me something new. The way he explains fermentation is brilliant."
              </p>
              <p className="font-bold text-foreground">— James Chen, San Francisco, CA</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-muted-foreground">
                "As a complete beginner, I was intimidated by bread baking. Henry's clear instructions and encouraging tone gave me the confidence to try. My first loaf was a success!"
              </p>
              <p className="font-bold text-foreground">— Emily Rodriguez, Austin, TX</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-muted-foreground">
                "The science behind the bread-making process is fascinating, and Henry explains it in a way that's both educational and practical. My bakes have improved dramatically."
              </p>
              <p className="font-bold text-foreground">— Michael Thompson, Seattle, WA</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-muted-foreground">
                "I love how Henry emphasizes that bread baking is a journey, not a destination. His philosophy helped me stop stressing about perfection and just enjoy the process."
              </p>
              <p className="font-bold text-foreground">— Lisa Wang, Boston, MA</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-muted-foreground">
                "The troubleshooting section saved my baking! Henry addresses every problem I encountered and offers clear solutions. It's like having a master baker in your kitchen."
              </p>
              <p className="font-bold text-foreground">— David Kumar, Chicago, IL</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-muted-foreground">
                "My family can't get enough of the sourdough I make using Henry's recipes. Even my picky kids ask for 'daddy's special bread' every week."
              </p>
              <p className="font-bold text-foreground">— Rachel Green, Denver, CO</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-muted-foreground">
                "Henry's approach to bread scoring transformed my loaves from good to bakery-quality. The patterns I can create now are stunning, and the technique is so simple."
              </p>
              <p className="font-bold text-foreground">— Tom Anderson, Minneapolis, MN</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-muted-foreground">
                "I appreciate how Henry respects different dietary needs. His whole grain recipes are wholesome, delicious, and my family loves them."
              </p>
              <p className="font-bold text-foreground">— Priya Patel, Atlanta, GA</p>
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
      <section className="container mx-auto px-4 py-16 bg-dough-cream">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
            Questions About These Gifts
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Do you earn a commission from these links?
              </h3>
              <p className="text-muted-foreground">
                Yes. Some of these are affiliate links. When you buy through them, I earn a small commission at no extra cost to you. It supports the Baking Great Bread at Home community and helps me keep creating free content. I appreciate you using these links.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Are these tools beginner-friendly?
              </h3>
              <p className="text-muted-foreground">
                Every single tool here can be used by someone baking their first loaf. Some are upgrades for serious bakers, but nothing here requires experience to use. If you can measure flour and water, you can use these tools.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                What should I buy first if I'm overwhelmed?
              </h3>
              <p className="text-muted-foreground">
                Start with the Vitale Starter and one good tool—either the Wire Monkey lame or the Holland Bowl Mill bowl. That combination gives someone everything they need to bake their first great loaf. You can always add more later.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Do these tools ship in time for Christmas?
              </h3>
              <p className="text-muted-foreground">
                Most of them do, but I recommend ordering by December 15 to be safe. Each product page will show current shipping times. After December 15, check the Digital Gifts section for instant-delivery options.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                What if the gift doesn't work out?
              </h3>
              <p className="text-muted-foreground">
                Each brand has their own return policy. I've linked to companies I trust with good customer service. If you have issues with any purchase, reach out to me at henrysbreadkitchen@gmail.com and I'll help however I can.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Can I mix products from different brands?
              </h3>
              <p className="text-muted-foreground">
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
              variant="outline"
              onClick={() => scrollToSection("top-five")}
              className="border-2 border-white text-white hover:bg-white hover:text-bakery-copper text-lg px-8"
            >
              See All Top Picks
            </Button>
          </div>
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
              <h4 className="font-bold mb-2">Sour House</h4>
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
                href="http://brodandtaylor.com/henrysbreadkitchen?utm_source=holidayguide&utm_medium=giftguide2025&utm_campaign=christmas2025"
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

      {/* Final Disclosure */}
      <section className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground text-center max-w-4xl mx-auto">
            <strong>Affiliate Disclosure:</strong> Some links on this page are affiliate links. If you make a purchase through them, I may earn a small commission at no extra cost to you. I only recommend products I use and trust in my own kitchen. Thank you for supporting Baking Great Bread at Home and helping me create free content for this community.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HolidayGiftGuide;
