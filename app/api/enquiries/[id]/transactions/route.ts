import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
/**
 * POST /api/enquiries/[id]/transactions
 * Body: { amount: number, type: 'investment' | 'payment', performedBy?: string }
 */

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: enquiryId } = params;
    const body = await request.json();
    const { amount, type, performedBy } = body;

    // 1. Authentication & Role Check
    const currentUser = await getCurrentUser();
    
    // Define roles allowed to post payments (Compliance: Section 3 - Leadership)
    const allowedRoles = ["admin", "manager", "treasurer"]; 
    const isAuthorized = currentUser?.isAdmin ||currentUser?.roles?.some(role => allowedRoles.includes(role.toLowerCase()));

    if (!currentUser ) {
      return NextResponse.json(
        { error: "Unauthorized: You do not have permission to post financial transactions." }, 
        { status: 403 }
      );
    }

    // 2. Validation
    if (!enquiryId) {
      return NextResponse.json({ error: "Missing Enquiry ID" }, { status: 400 });
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "A valid positive amount is required" }, { status: 400 });
    }
    if (!['investment', 'payment'].includes(type)) {
      return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 });
    }

    // 3. Database Transaction
    const result = await prisma.$transaction(async (tx) => {
      let transactionRecord;

      if (type === 'payment') {  
        if (!currentUser || !isAuthorized) {
          return NextResponse.json(
            { error: "Unauthorized: You do not have permission to post financial transactions." }, 
            { status: 403 }
          );
        } 
        transactionRecord = await tx.payment.create({
          data: {
            amount: parseFloat(amount),
            enquiryId: enquiryId,
          },
        });
      } else {
        
        transactionRecord = await tx.investment.create({
          data: {
            amount: parseFloat(amount),
            enquiryId: enquiryId,
          },
        });
      }

      // 4. Audit Log (Guideline 1 Requirement: Standardized Documentation)
      await tx.enquiryLog.create({
        data: {
          enquiryId: enquiryId,
          action: `Logged ${type}: $${amount.toLocaleString()}`,
          performedBy: currentUser.name || performedBy || "Authorized User",
        },
      });

      // 5. Update the Enquiry's 'updatedAt'
      await tx.enquiry.update({
        where: { id: enquiryId },
        data: { updatedAt: new Date() }
      });

      return transactionRecord;
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    console.error("TRANSACTION_POST_ERROR:", error);
    return NextResponse.json(
      { error: "Transaction Failed", message: error.message },
      { status: 500 }
    );
  }
}
// export async function POST(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id: enquiryId } = params;
//     const body = await request.json();
//     const { amount, type, performedBy } = body;

//     // 1. Validation
//     if (!enquiryId) {
//       return NextResponse.json({ error: "Missing Enquiry ID" }, { status: 400 });
//     }
//     if (!amount || isNaN(amount) || amount <= 0) {
//       return NextResponse.json({ error: "A valid positive amount is required" }, { status: 400 });
//     }
//     if (!['investment', 'payment'].includes(type)) {
//       return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 });
//     }

//     // 2. Database Transaction
//     const result = await prisma.$transaction(async (tx) => {
//       let transactionRecord;

//       // Create the specific financial record
//       if (type === 'payment') {

       
//         transactionRecord = await tx.payment.create({
//           data: {
//             amount: parseFloat(amount),
//             enquiryId: enquiryId,
//           },
//         });
//       } else {
//         transactionRecord = await tx.investment.create({
//           data: {
//             amount: parseFloat(amount),
//             enquiryId: enquiryId,
//           },
//         });
//       }

//       // 3. Create Audit Log (Compliance Requirement)
//       await tx.enquiryLog.create({
//         data: {
//           enquiryId: enquiryId,
//           action: `Logged ${type}: $${amount.toLocaleString()}`,
//           performedBy: performedBy || "System Admin",
//         },
//       });

//       // 4. Update the Enquiry's 'updatedAt' timestamp
//       await tx.enquiry.update({
//         where: { id: enquiryId },
//         data: { updatedAt: new Date() }
//       });

//       return transactionRecord;
//     });

//     return NextResponse.json(result, { status: 201 });

//   } catch (error: any) {
//     console.error("TRANSACTION_POST_ERROR:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error", message: error.message },
//       { status: 500 }
//     );
//   }
// }