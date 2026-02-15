"use client";

import ApplicationForm from '@/components/sections/private/application/ApplicationForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { redirect } from 'next/navigation';

const Page = () => {
  return (
    <div className="flex-1 w-full min-h-svh py-10 pt-24 gap-6 md:pt-10 px-6 flex flex-col items-start justify-center">
        <Button 
        onClick={()=>redirect("/create")} 
        variant={"secondary"}
        >
            <ArrowLeft />Go Back
        </Button>
        <div className="w-full mx-auto">
            <h1 className='text-xl md:text-4xl calistoga mb-4'>Track your <span className='text-primary'>next</span> <span className='text-malachite'>link</span></h1>
            <div className="w-full">
                <ApplicationForm />
            </div>
        </div>
    </div>
  )
}

export default Page;
