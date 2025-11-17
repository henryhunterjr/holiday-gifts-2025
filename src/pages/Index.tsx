import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: 'hsl(var(--dough-cream))' }}>
      <div className="text-center max-w-2xl px-6">
        <h1 className="mb-4 text-5xl font-bold" style={{ color: 'hsl(var(--olive-accent))' }}>
          Henry's Bread Kitchen
        </h1>
        <p className="text-xl mb-8" style={{ color: 'hsl(var(--wheat-brown))' }}>
          Your home for bread baking tools, guides, and gift recommendations.
        </p>
        <Link to="/bread-baker-holiday-gift-guide-2025">
          <Button 
            size="lg"
            style={{ 
              backgroundColor: 'hsl(var(--olive-accent))',
              color: 'white'
            }}
            className="hover:opacity-90 transition-opacity"
          >
            View 2025 Holiday Gift Guide
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
