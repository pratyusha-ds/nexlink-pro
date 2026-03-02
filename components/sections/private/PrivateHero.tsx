"use client";

import { useRouter } from "next/navigation";
import { IoIosSearch } from "react-icons/io";
import { MdHistory, MdLocationOn } from "react-icons/md";
import HeroSearch from "@/components/ui/HeroSearch";

const mockRecentSearches = [
  {
    id: "1",
    title: "Frontend Engineer",
    company: "Google",
    location: "Remote",
  },
  {
    id: "2",
    title: "Backend Dev",
    company: "Stripe",
    location: "New York, NY",
  },
  { id: "3", title: "Fullstack Intern", company: "Vercel", location: "Hybrid" },
];

const PrivateHero = () => {
  const router = useRouter();

  const borderColors = [
    "border-l-blue-400",
    "border-l-purple-400",
    "border-l-malachite",
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-white py-20">
      <HeroSearch subtitle="Welcome back! Find your next link." />

      <div className="w-full max-w-5xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 -mt-8">
        <div className="bg-malachite/5 border border-malachite/10 rounded-[3rem] p-8 md:p-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <MdHistory className="h-5 w-5 text-malachite/60" />
            <h3 className="caladea font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs text-gray-500">
              Pick up where you left off
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {mockRecentSearches.map((job, index) => (
              <button
                key={job.id}
                onClick={() =>
                  router.push(`/search?q=${encodeURIComponent(job.title)}`)
                }
                className={`group flex flex-col items-start p-6 bg-white border border-gray-100 border-l-4 ${
                  borderColors[index % borderColors.length]
                } rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-64 text-left`}
              >
                <div className="flex items-center gap-1 mb-3 py-1 px-2.5 bg-gray-50 rounded-full group-hover:bg-malachite/10 transition-colors">
                  <MdLocationOn className="h-3 w-3 text-gray-400 group-hover:text-malachite" />
                  <span className="text-[10px] font-bold text-gray-500 group-hover:text-malachite uppercase inter">
                    {job.location}
                  </span>
                </div>

                <span className="text-gray-900 font-bold text-lg inter leading-tight mb-1">
                  {job.title}
                </span>
                <span className="text-gray-400 text-sm inter font-medium">
                  at {job.company}
                </span>

                <div className="mt-6 w-full flex justify-end">
                  <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-malachite group-hover:text-white transition-all shadow-inner">
                    <IoIosSearch className="h-4 w-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>{" "}
          <p className="mt-12 text-gray-400 text-sm inter italic text-center w-full">
            Join thousands of people finding their next link.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivateHero;
