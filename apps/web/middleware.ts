import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req:NextRequest){
    console.log(req);
    const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});

    const isAuth=!!token;
    const isAccessingRoom=req.nextUrl.pathname.startsWith('/rooms/');

    if(isAccessingRoom && !isAuth){
        return NextResponse.redirect(new URL(`/api/auth/signin?callbackUrl=${req.nextUrl.pathname}`,req.url));
    }
    return NextResponse.next();
}

export const config={matcher:["/rooms/:roomName"]}