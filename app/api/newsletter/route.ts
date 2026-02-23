import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb'; // Adjust based on your db instance location

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.newsletter.findUnique({
      where: { email }
    });

    // if (existing) {
    //   return NextResponse.json({ message: 'Already subscribed!' }, { status: 200 });
    // }
    // Inside your POST function
    if (existing) {
    return NextResponse.json(
        { error: 'You are already subscribed to our newsletter!' }, 
        { status: 409 } // 409 Conflict is ideal for existing records
    );
    }

    await prisma.newsletter.create({
      data: { email }
    });

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (error) {
    console.error('NEWSLETTER_ERROR', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}