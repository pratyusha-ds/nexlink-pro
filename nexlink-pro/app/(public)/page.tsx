import { SignedIn, SignedOut } from "@clerk/nextjs";
import About from "@/components/sections/public/About";
import Footer from "@/components/sections/public/Footer";
import Hero from "@/components/sections/public/PublicHero";
import PrivateHero from "@/components/sections/private/PrivateHero";

const LandingPage = () => {
  return (
    <>
      <SignedOut>
        <Hero />
      </SignedOut>

      <SignedIn>
        <PrivateHero />
      </SignedIn>

      <About />
      <Footer />
    </>
  );
};

export default LandingPage;
