import prisma from "../libs/prismadb";
import { Enquiry } from "@prisma/client";
import getCurrentUser from "./getCurrentUser";

export default async function getEnquiries() {
  try {
    const currentUser = await getCurrentUser();

    // Use Prisma's FindManyArgs for the type if you want to be even more strict
    const enquiries = await prisma.enquiry.findMany({
      where: {
        active: true,
      },
      orderBy: { 
        // Admin gets absolute chronological order, users get recent updates
        createdAt: currentUser?.isAdmin ? "desc" : undefined,
        updatedAt: !currentUser?.isAdmin ? "desc" : undefined,
      },
    });

    // Transform Date objects to ISO strings for Client Component compatibility
    return enquiries.map((enquiry) => ({
      ...enquiry,
      createdAt: enquiry.createdAt.toISOString(),
      updatedAt: enquiry.updatedAt.toISOString(),
    }));

  } catch (error: unknown) {
    // Log the error for internal tracking on the Beef Platform
    console.error("GET_ENQUIRIES_ERROR:", error);
    
    // Return an empty array or throw a specific string to avoid crashing the UI
    throw new Error("Failed to fetch enquiries");
  }
}