
import prisma from "../libs/prismadb";
import getCurrentUser from "./getCurrentUser";
export default async function getTags() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }


    const owner_id = currentUser.id
    let tags

    if (currentUser.isAdmin ){
      //admin can view all
      tags = await prisma.tag.findMany({        
        orderBy: { name: "asc" },        
      });

    }else {
      //if not admin nothing return
      tags = await prisma.tag.findMany({        
        where: { name: "NoesticensxeBname" },        
      });
    }

    const safeTags = tags.map((tag) => ({
      ...tag,
      //check if user has access roles list inside of project
     
      createdAt: tag.createdAt.toString(),
      updatedAt: tag.updatedAt.toString(),
    //   emailVerified: user?.emailVerified?.toString()||null,
    
    })
  );
 
    return safeTags;
   } catch (error: unknown) {
    // Log the error for internal tracking on the Beef Platform
    console.error("GET_TAGS_ERROR:", error);
    
    // Return an empty array or throw a specific string to avoid crashing the UI
    throw new Error("Failed to fetch tags");
  }
}