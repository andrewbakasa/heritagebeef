import getCurrentUser from "@/app/actions/getCurrentUser";
import AdminClientPage from "./AdminClientt";

 
 export default async function Home() {
   const currentUser = await getCurrentUser();
 
   return <AdminClientPage currentUser={currentUser} />;
 }