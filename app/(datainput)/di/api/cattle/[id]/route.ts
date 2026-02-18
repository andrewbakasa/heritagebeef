import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Find the current cattle record to get the sourceId
      const current = await tx.cattle.findUnique({
        where: { id },
        select: { sourceId: true }
      });

      if (!current) throw new Error("Record not found");

      // 2. Update Source details
      await tx.source.update({
        where: { id: current.sourceId },
        data: {
          sellerName: body.sellerName,
          purchasePricePerHead: parseFloat(body.purchasePricePerHead),
          purchaseDate: new Date(body.purchaseDate),
          vetName: body.vetName,
          movementDocRef: body.movementDocRef,
          isInternal: body.isInternal,
        }
      });

      // 3. Update Cattle details
      const updatedCattle = await tx.cattle.update({
        where: { id },
        data: {
          tagNumber: body.tagNumber,
          breed: body.breed,
          gender: body.gender,
          ageMonths: parseInt(body.ageMonths),
          entryWeight: parseFloat(body.entryWeight),
          penId: body.penId,
        }
      });

      return updatedCattle;
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// --- NEW GET HANDLER (Fetch Single Record) ---
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const cattle = await prisma.cattle.findUnique({
      where: { id },
      include: {
        source: true, // Crucial for populating seller/price info in the form
        pen: true     // Optional: if you need pen details
      }
    });

    if (!cattle) {
      return NextResponse.json(
        { error: "Cattle record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(cattle);
  } catch (error) {
    console.error("GET Single Cattle Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch record" },
      { status: 500 }
    );
  }
}