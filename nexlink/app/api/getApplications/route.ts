import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(){    
    try{
        const { userId } = await auth();

        if(!userId){
            return NextResponse.json(
                { error: "Unauthorized"},
                { status: 401 }
            )
        }

        const data = await db.application.findMany({
            select: {
                id: true,
                companyName: true,
                status: true,
                type: true,
                notes: true,
                interviewDnT: true
            },
            orderBy: {
                id: 'asc'
            }
            });

        if (data.length === 0){
            return NextResponse.json(
                { message: "The database is empty", data: [] }
            )
        }

        return NextResponse.json(data);

    }catch(error){
        console.error("Error fetching applications: ", error);
        return NextResponse.json({error: "Failed to fetch applications"}, {status: 500});
    }
}
