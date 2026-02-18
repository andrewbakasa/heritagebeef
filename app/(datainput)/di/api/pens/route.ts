import { NextResponse } from 'next/server';
import prisma  from '@/app/libs/prismadb'; // Ensure this points to your Prisma client instance

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { 
      penNumber, 
      capacity, 
      status, 
      feedStartDate 
    } = body;

    // 1. Basic Server-side Validation
    if (!penNumber || !capacity) {
      return NextResponse.json(
        { error: 'Pen Number and Capacity are required' },
        { status: 400 }
      );
    }

    // 2. Create the Pen Record
    const newPen = await prisma.pen.create({
      data: {
        penNumber,
        capacity: parseInt(capacity),
        status: status || "STARTING",
        // Convert string date from form to JS Date object
        feedStartDate: feedStartDate ? new Date(feedStartDate) : null,
        // Initializing defaults (though Prisma schema handles these, explicit is often safer)
        headCount: 0,
        daysOnFeed: 0,
      },
    });

    return NextResponse.json(newPen, { status: 201 });

  } catch (error: any) {
    console.error('Pen Creation Error:', error);

    // Handle Prisma Unique Constraint Error (P2002) for penNumber
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A pen with this number already exists.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * GET Handler to fetch available pens for the Cattle Intake Form dropdown
 */
export async function GET() {
  try {
    const pens = await prisma.pen.findMany({
      select: {
        id: true,
        penNumber: true,
        headCount: true,
        capacity: true,
        status: true
      },
      orderBy: { penNumber: 'asc' }
    });
    return NextResponse.json(pens);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pens' }, { status: 500 });
  }
}