import prisma from "../libs/prismadb";

import getCurrentUser from "./getCurrentUser";

export default async function updateListCardsVisibility() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }


    const owner_id = currentUser.id
    let boards

    if (currentUser.isAdmin){
      //admin can view all
      const updatedLists = await prisma.list.updateMany({
        data: {
           active: true
        }
      });

      const updatedCards = await prisma.card.updateMany({
        data: {
           active: true
        }
      });
      updatedLists
      updatedCards
      //console.log('User successfully updated......>>>>>')
  
    }else {
      console.log('User is not admin. No updated')
    }
 
    return [];
   } catch (error: unknown) {
    // Log the error for internal tracking on the Beef Platform
    console.error("GET_VISIBILITY_ERROR:", error);
    
    // Return an empty array or throw a specific string to avoid crashing the UI
    throw new Error("Failed to fetch  visibility");
  }
}


