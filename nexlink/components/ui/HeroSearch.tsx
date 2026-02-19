"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosSearch } from "react-icons/io";
import { Button } from "@/components/ui/button"; // Shadcn Button
import { Input } from "@/components/ui/input"; // Shadcn Input

interface HeroSearchProps {
  subtitle: string;
}

const HeroSearch = ({ subtitle }: HeroSearchProps) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center text-center">
        <h1 className="calistoga text-6xl md:text-7xl lg:text-8xl">
          <span className="text-primary">Nex</span>
          <span className="text-malachite">Link</span>
        </h1>
        <h2 className="caladea m-[-10] md:text-lg lg:text-2xl text-gray-400 font-medium">
          {subtitle}
        </h2>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex mb-16 gap-3 md:w-130 lg:w-170 w-full justify-center px-4 mt-8"
      >
        <div className="group border-2 border-gray-100 bg-white rounded-2xl py-2 px-6 flex items-center gap-3 shadow-sm focus-within:shadow-md focus-within:border-malachite/40 transition-all w-full">
          <IoIosSearch className="h-6 w-6 text-gray-300 group-focus-within:text-malachite transition-colors" />
          <input
            /* You can use a standard input or Shadcn's <Input /> here */
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles, companies..."
            className="w-full bg-transparent outline-none text-base md:text-lg text-gray-700 placeholder:text-gray-300 inter"
          />
        </div>
        <Button
          type="submit"
          className="bg-malachite h-auto py-4 text-white font-bold px-10 rounded-2xl hover:brightness-105 transition-all shadow-lg active:scale-95"
        >
          Search
        </Button>
      </form>
    </div>
  );
};

export default HeroSearch;
