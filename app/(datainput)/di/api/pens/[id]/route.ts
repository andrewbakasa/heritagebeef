import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

interface IParams {
  id?: string;
}

// GET: Fetch a single pen for editing
export async function GET(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { id } = params;

    const pen = await prisma.pen.findUnique({
      where: { id },
      include: {
        cattle: true // Optional: returns all cattle currently in this pen
      }
    });

    if (!pen) {
      return NextResponse.json({ error: "Pen not found" }, { status: 404 });
    }

    return NextResponse.json(pen);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update pen configuration
export async function PATCH(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { penNumber, capacity, status, feedStartDate } = body;

    const updatedPen = await prisma.pen.update({
      where: { id },
      data: {
        penNumber,
        capacity: parseInt(capacity),
        status,
        feedStartDate: feedStartDate ? new Date(feedStartDate) : undefined,
      }
    });

    return NextResponse.json(updatedPen);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Pen number already in use' }, { status: 409 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE: Remove a pen
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { id } = params;

    // Check if pen has cattle before deleting
    const pen = await prisma.pen.findUnique({
      where: { id },
      select: { headCount: true }
    });

    if (pen && pen.headCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete pen with active headcount. Move cattle first." },
        { status: 400 }
      );
    }

    await prisma.pen.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Pen deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}