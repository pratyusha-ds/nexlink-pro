"use client";

import HeroSearch from "@/components/ui/HeroSearch";

const PublicHero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[80vh] bg-white">
      <HeroSearch subtitle="Build your next link." />
    </div>
  );
};

export default PublicHero;
