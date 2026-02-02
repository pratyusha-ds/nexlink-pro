"use client";

import { useSession } from "@clerk/nextjs"

const Avatar = () => {
    const { session, isSignedIn } = useSession();

    if(!isSignedIn) return null;

    const credentials = getCredentials(`${session?.user?.firstName} ${session?.user?.lastName}`);
  
    return (
    <div className="min-w-10 min-h-10 bg-red-400">
        {credentials}
    </div>
  )
}

function getCredentials(name : string | null){
    if (name === null) return null;
    const splice = name.split(" ");
    let firstLetters : string = "";
    for(let i = 0; i < splice.length; i++){
        firstLetters += splice[i][0];
    }
    return firstLetters;
}

export default Avatar
