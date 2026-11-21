import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HolidayGiftGuide from "./pages/HolidayGiftGuide";
import BookCompanion from "./pages/BookCompanion";
import BakersToolbox from "./pages/BakersToolbox";
import MakerCollection from "./pages/MakerCollection";
import AcademyGiftCertificate from "./pages/AcademyGiftCertificate";
import NotFound from "./pages/NotFound";
import SourdoughStarterCareGuide from "./pages/SourdoughStarterCareGuide";
import SourdoughStarterTroubleshooting from "./pages/SourdoughStarterTroubleshooting";
import FixGummyDenseSourdough from "./pages/FixGummyDenseSourdough";
import SourdoughToolsAndSupplies from "./pages/SourdoughToolsAndSupplies";
import EssentialBakingTools from "./pages/EssentialBakingTools";
import HowToWrapSourdoughAsAGift from "./pages/HowToWrapSourdoughAsAGift";
import SavedGifts from "./pages/SavedGifts";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminLogin from "./pages/AdminLogin";
import AdminGiveaway from "./pages/AdminGiveaway";

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
            <Route path="/sourdough-for-the-rest-of-us" element={<BookCompanion />} />
            <Route path="/sourdough-for-the-rest-of-us/tools" element={<BakersToolbox />} />
            <Route path="/bread-baker-holiday-gift-guide-2025" element={<Navigate to="/" replace />} />
            <Route path="/makers/:makerId" element={<MakerCollection />} />
            <Route path="/makers/:makerId/" element={<MakerCollection />} />
            <Route path="/academy-gift-certificate" element={<AcademyGiftCertificate />} />
            <Route path="/academy-gift-certificate/" element={<AcademyGiftCertificate />} />
            <Route path="/sourdough-starter-care-guide" element={<SourdoughStarterCareGuide />} />
            <Route path="/sourdough-starter-troubleshooting" element={<SourdoughStarterTroubleshooting />} />
            <Route path="/fix-gummy-dense-sourdough" element={<FixGummyDenseSourdough />} />
            <Route path="/sourdough-tools-and-supplies" element={<SourdoughToolsAndSupplies />} />
            <Route path="/essential-baking-tools" element={<EssentialBakingTools />} />
            <Route path="/how-to-wrap-sourdough-as-a-gift" element={<HowToWrapSourdoughAsAGift />} />
            <Route path="/saved-gifts" element={<SavedGifts />} />
            <Route path="/saved-gifts/" element={<SavedGifts />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/giveaway" element={<AdminGiveaway />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
