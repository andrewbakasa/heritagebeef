import prisma from "@/app/libs/prismadb";
import { notFound } from "next/navigation";
import ClientRegistryPage from "./UserClient";

export default async function RegistryEntry({ params }: { params: { id: string } }) {
  const { id } = params;

  // Fetching the inquiry with all relations needed for the Ledger
  const inquiry = await prisma.enquiry.findUnique({
    where: { id },
    include: {
      investments: true,
      payments: true,
    },
  });

  if (!inquiry) {
    notFound();
  }

  // Define the update function (Server Action or API wrapper)
  async function updateNotesAction(enquiryId: string, notes: string) {
    "use server";
    await prisma.enquiry.update({
      where: { id: enquiryId },
      data: { admin_notes: notes },
    });
    // Optional: Add logging logic here for Guideline 1 of 2025 compliance
  }

  return (
    <ClientRegistryPage 
      selectedInquiry={JSON.parse(JSON.stringify(inquiry))} 
      onUpdate={updateNotesAction}
    />
  );
}