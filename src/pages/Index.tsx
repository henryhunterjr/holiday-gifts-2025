import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dough-cream">
      <div className="text-center max-w-2xl px-6">
        <h1 className="mb-4 text-5xl font-bold text-olive-accent">
          Henry's Bread Kitchen
        </h1>
        <p className="text-xl text-wheat-brown mb-8">
          Your home for bread baking tools, guides, and gift recommendations.
        </p>
        <Link to="/bread-baker-holiday-gift-guide-2025">
          <Button 
            size="lg"
            className="bg-olive-accent hover:bg-olive-accent/90 text-white"
          >
            View 2025 Holiday Gift Guide
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
