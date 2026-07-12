import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HolidayGiftGuide from "./pages/HolidayGiftGuide";
import NotFound from "./pages/NotFound";
import SourdoughStarterCareGuide from "./pages/SourdoughStarterCareGuide";
import SourdoughStarterTroubleshooting from "./pages/SourdoughStarterTroubleshooting";
import FixGummyDenseSourdough from "./pages/FixGummyDenseSourdough";
import SourdoughToolsAndSupplies from "./pages/SourdoughToolsAndSupplies";
import EssentialBakingTools from "./pages/EssentialBakingTools";
import HowToWrapSourdoughAsAGift from "./pages/HowToWrapSourdoughAsAGift";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HolidayGiftGuide />} />
            <Route path="/bread-baker-holiday-gift-guide-2025" element={<HolidayGiftGuide />} />
            <Route path="/sourdough-starter-care-guide" element={<SourdoughStarterCareGuide />} />
            <Route path="/sourdough-starter-troubleshooting" element={<SourdoughStarterTroubleshooting />} />
            <Route path="/fix-gummy-dense-sourdough" element={<FixGummyDenseSourdough />} />
            <Route path="/sourdough-tools-and-supplies" element={<SourdoughToolsAndSupplies />} />
            <Route path="/essential-baking-tools" element={<EssentialBakingTools />} />
            <Route path="/how-to-wrap-sourdough-as-a-gift" element={<HowToWrapSourdoughAsAGift />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
