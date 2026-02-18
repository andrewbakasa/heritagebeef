import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

// --- NEW GET HANDLER ---
export async function GET() {
  try {
    const cattleRecords = await prisma.cattle.findMany({
      include: {
        source: true, // Get seller info
        pen: true,    // Get pen number/name
      },
    //   orderBy: {
    //     createdAt: 'desc',
    //   },
    });

    // Transform Prisma data to match TabRegistry keys:
    // id -> Lot ID (Tag Number)
    // source -> sellerName
    // count -> Always 1 for individual cattle record
    // weight -> currentWeight
    // status -> entry status or custom logic
    const formattedData = cattleRecords.map((c) => ({
      id: c.tagNumber,
      source: c.source?.sellerName || 'N/A',
      count: '1', // Representing 1 head
      weight: `${c.currentWeight} kg`,
      status: c.penId ? 'Active' : 'Quarantine',
      // Internal fields for edit/view actions
      dbId: c.id, 
      breed: c.breed, 
      age: c.ageMonths, 
      penName: c.pen?.penNumber || 'Unassigned'
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('GET Intake Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch intake registry' },
      { status: 500 }
    );
  }
}

// --- YOUR EXISTING POST HANDLER ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sellerName,
      purchasePricePerHead,
      purchaseDate,
      vetName,
      movementDocRef,
      isInternal,
      tagNumber,
      breed,
      gender,
      ageMonths,
      entryWeight,
      penId,
    } = body;

    if (!tagNumber || !sellerName || !entryWeight) {
      return NextResponse.json(
        { error: 'Missing required fields: Tag Number, Seller, or Weight' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const source = await tx.source.create({
        data: {
          sellerName,
          purchasePricePerHead: parseFloat(purchasePricePerHead),
          purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
          vetName,
          movementDocRef,
          isInternal: Boolean(isInternal),
        },
      });

      const cattle = await tx.cattle.create({
        data: {
          tagNumber,
          breed,
          gender,
          ageMonths: parseInt(ageMonths),
          entryWeight: parseFloat(entryWeight),
          currentWeight: parseFloat(entryWeight),
          penId: penId || null,
          sourceId: source.id,
          weightLogs: {
            create: {
              weight: parseFloat(entryWeight),
              date: new Date(),
            }
          }
        },
      });

      return { source, cattle };
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    console.error('Intake Error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A cattle with this Tag Number already exists.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to process intake record' },
      { status: 500 }
    );
  }
}

// import { NextResponse } from 'next/server';
// import  prisma  from '@/app/libs/prismadb'; // Adjust path based on your setup

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     const {
//       // Source Data
//       sellerName,
//       purchasePricePerHead,
//       purchaseDate,
//       vetName,
//       movementDocRef,
//       isInternal,
//       // Cattle Data
//       tagNumber,
//       breed,
//       gender,
//       ageMonths,
//       entryWeight,
//       penId,
//     } = body;

//     // Validation
//     if (!tagNumber || !sellerName || !entryWeight) {
//       return NextResponse.json(
//         { error: 'Missing required fields: Tag Number, Seller, or Weight' },
//         { status: 400 }
//       );
//     }

//     // Execute Transaction
//     const result = await prisma.$transaction(async (tx) => {
//       // 1. Create the Source Record first
//       const source = await tx.source.create({
//         data: {
//           sellerName,
//           purchasePricePerHead: parseFloat(purchasePricePerHead),
//           purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
//           vetName,
//           movementDocRef,
//           isInternal: Boolean(isInternal),
//         },
//       });

//       // 2. Create the Cattle Record linked to the new Source
//       const cattle = await tx.cattle.create({
//         data: {
//           tagNumber,
//           breed,
//           gender,
//           ageMonths: parseInt(ageMonths),
//           entryWeight: parseFloat(entryWeight),
//           currentWeight: parseFloat(entryWeight), // Initial current weight matches entry
//           penId: penId || null,
//           sourceId: source.id,
//           // Initialize weight logs for history tracking
//           weightLogs: {
//             create: {
//               weight: parseFloat(entryWeight),
//               date: new Date(),
//              // note: "Initial intake weight"
//             }
//           }
//         },
//       });

//       return { source, cattle };
//     });

//     return NextResponse.json(result, { status: 201 });

//   } catch (error: any) {
//     console.error('Intake Error:', error);
    
//     // Handle Prisma Unique Constraint (e.g., duplicate Tag Number)
//     if (error.code === 'P2002') {
//       return NextResponse.json(
//         { error: 'A cattle with this Tag Number already exists.' },
//         { status: 409 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Failed to process intake record' },
//       { status: 500 }
//     );
//   }
// }