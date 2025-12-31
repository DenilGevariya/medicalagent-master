import { db } from "@/config/db";
import { SessionChatTabel } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {v4 as uuidv4} from 'uuid'

export async function POST(req:NextRequest){
    const {notes,selectedDoctor}= await req.json();
    const user=await currentUser();

    try {
        const sessionId=uuidv4()
        const result=await db.insert(SessionChatTabel).values({
            sessionId:sessionId,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            notes:notes,
            selectedDoctor:selectedDoctor,
            createdOn:(new Date()).toString()
            //@ts-ignore
        }).returning({SessionChatTabel})

        return NextResponse.json(result[0]?.SessionChatTabel)
    } catch (error) {
        return NextResponse.json(error)
    }
}

export async function GET(req:NextRequest){
    const {searchParams}=new URL(req.url);
    const sessionId=searchParams.get('sessionId');
    const user=await currentUser();

    if(sessionId=='all'){
            const result=await db.select().from(SessionChatTabel)
    //@ts-ignore
    .where(eq(SessionChatTabel.createdBy,user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(SessionChatTabel.id))
    return NextResponse.json(result)
    }
    else{
                const result=await db.select().from(SessionChatTabel)
    //@ts-ignore
    .where(eq(SessionChatTabel.sessionId,sessionId));

    return NextResponse.json(result[0])
    }

}