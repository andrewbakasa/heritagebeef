import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

// ... keep existing POST and GET ...

// export async function PATCH(request: Request,
//   { params }: { params: { id: string } }) {
//   try {
    
//     const { id } = params; // Grab ID from URL
//     const body = await request.json();
    
//     // Remove id from body if it exists to prevent Prisma errors
//     const { id: _, ...updates } = body;

//     if (!id) {
//       return NextResponse.json(
//         { error: "Identification Error", message: "ID is required for updates." },
//         { status: 400 }
//       );
//     }

//     // Prepare specialized data formatting for investment fields if they exist in updates
//     const formattedData: any = { ...updates };

//     // 1. Sanitize Pledge Amount (String/Formatted -> Float)
//     if (updates.pledgeAmount !== undefined) {
//       formattedData.pledgeAmount = updates.pledgeAmount 
//         ? parseFloat(updates.pledgeAmount.toString().replace(/,/g, '')) 
//         : null;
//     }

//     // 2. Format Payment Date (String -> Date Object)
//     if (updates.paymentDate !== undefined) {
//       formattedData.targetPaymentDate = updates.paymentDate 
//         ? new Date(updates.paymentDate) 
//         : null;
//       delete formattedData.paymentDate; // Remove the UI field name in favor of DB field name
//     }

//     // 3. Ensure category remains a valid array
//     if (updates.category) {
//       formattedData.category = Array.isArray(updates.category) 
//         ? updates.category 
//         : [updates.category];
//     }

//     const updatedEnquiry = await prisma.enquiry.update({
//       where: { id },
//       data: formattedData,
//     });

//     return NextResponse.json(updatedEnquiry, { status: 200 });

//   } catch (error: any) {
//     console.error("ENQUIRY_PATCH_ERROR:", error);
//     return NextResponse.json(
//       { error: "Update Failed", message: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Identification Error", message: "ID is required." },
        { status: 400 }
      );
    }

    // 1. Extract non-database fields and perform destructuring
    const { id: _, performedBy, ...updates } = body;

    // 2. Prepare and Format Data for Prisma
    const formattedData: any = { ...updates };

    // Sanitize Pledge Amount
    if (updates.pledgeAmount !== undefined) {
      formattedData.pledgeAmount = updates.pledgeAmount 
        ? parseFloat(updates.pledgeAmount.toString().replace(/,/g, '')) 
        : null;
    }

    // Format Payment Date
    if (updates.paymentDate !== undefined) {
      formattedData.targetPaymentDate = updates.paymentDate 
        ? new Date(updates.paymentDate) 
        : null;
      delete formattedData.paymentDate; 
    }

    // Ensure category is an array
    if (updates.category) {
      formattedData.category = Array.isArray(updates.category) 
        ? updates.category 
        : [updates.category];
    }

    // 3. Execute Transaction (Update + Audit Log)
    const result = await prisma.$transaction(async (tx) => {
      // Perform the update with formatted data
      const updatedEnquiry = await tx.enquiry.update({
        where: { id },
        data: formattedData,
      });

      // Determine the action message based on what was updated
      const updatedFields = Object.keys(formattedData).join(", ");
      const logAction = updates.admin_notes 
        ? "Updated internal audit notes" 
        : `Modified fields: ${updatedFields}`;

      // Create the mandatory Audit Log entry
      await tx.enquiryLog.create({
        data: {
          enquiryId: id,
          action: logAction,
          performedBy: performedBy || "System Admin",
        },
      });

      return updatedEnquiry;
    });

    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error("ENQUIRY_PATCH_SYNC_ERROR:", error);
    return NextResponse.json(
      { error: "Update Failed", message: error.message },
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Identification Error", message: "ID is required for deletion." },
        { status: 400 }
      );
    }

    await prisma.enquiry.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Record permanently removed from registry." },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("ENQUIRY_DELETE_ERROR:", error);
    return NextResponse.json(
      { error: "Deletion Failed", message: "Record may not exist or is linked to other data." },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: params.id },
      include: {
        investments: true,
        payments: true,
        auditLog: { orderBy: { timestamp: 'desc' } }
      },
    });

    if (!enquiry) return NextResponse.json({ error: "Not Found" }, { status: 404 });
    return NextResponse.json(enquiry);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

