import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      company, // Added company
      inquiryType, 
      message,
      pledgeAmount,      // New field
      paymentStructure,  // New field
      paymentDate        // New field
    } = body;

    // 1. Parse Name
    const nameParts = name ? name.trim().split(/\s+/) : [""];
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    // 2. Validation
    if (!email || !message || !inquiryType) {
      return NextResponse.json(
        { error: "Validation Error", message: "Required fields are missing." },
        { status: 400 }
      );
    }

    // 3. Database Operation
    const newEnquiry = await prisma.enquiry.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phone || null,
        company: company || null,
        message: message,
        inquiryType: inquiryType, // Map to specific field
        category: [inquiryType], 
        
        // Investment specific fields - parse values correctly
        pledgeAmount: pledgeAmount ? parseFloat(pledgeAmount.replace(/,/g, '')) : null,
        paymentStructure: paymentStructure || null,
        targetPaymentDate: paymentDate ? new Date(paymentDate) : null,
        
        // Model Selection Guidelines: If partnership, we can flag it or add synergy notes
        operationalSynergy: inquiryType === 'partnership' ? message : null,
        
        active: true,
        isRead: false,
        status: "active",
      },
    });

    return NextResponse.json(
      { message: "Inquiry submitted successfully!", enquiry: newEnquiry },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("ENQUIRY_POST_ERROR:", error);
    return NextResponse.json(
      { error: "Database Error", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(enquiries, { status: 200 });
  } catch (error) {
    console.error("ENQUIRY_GET_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
// import { NextResponse } from "next/server";
// import prisma from "@/app/libs/prismadb";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { name, email, phone, inquiryType, message } = body;

//     // 1. Parse Name: Frontend 'name' -> Backend 'first_name' & 'last_name'
//     const nameParts = name ? name.trim().split(/\s+/) : [""];
//     const firstName = nameParts[0];
//     const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

//     // 2. Validation (Matches frontend logic)
//     if (!email || !message || !inquiryType) {
//       return NextResponse.json(
//         { error: "Validation Error", message: "Required fields are missing." },
//         { status: 400 }
//       );
//     }

//     // 3. Database Operation
//     const newEnquiry = await prisma.enquiry.create({
//       data: {
//         first_name: firstName,
//         last_name: lastName,
//         email: email,
//         phone_number: phone || null, // Maps 'phone' from UI
//         message: message,
//         category: [inquiryType], // Wrap string in array for Prisma schema
//         active: true,
//         isRead: false,
//         status: "active",
//       },
//     });

//     return NextResponse.json(
//       { message: "Inquiry submitted successfully!", enquiry: newEnquiry },
//       { status: 201 }
//     );

//   } catch (error: any) {
//     console.error("ENQUIRY_POST_ERROR:", error);
//     return NextResponse.json(
//       { error: "Database Error", message: error.message },
//       { status: 500 }
//     );
//   }
// }


// // app/api/enquiries/route.ts
// export async function GET() {
//   try {
//     const enquiries = await prisma.enquiry.findMany({
//       // REMOVE the status: "active" filter to see everything
//       orderBy: { createdAt: 'desc' }
//     });
//     console.log("enquires", enquiries)
//     return NextResponse.json(enquiries, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
//   }
// }