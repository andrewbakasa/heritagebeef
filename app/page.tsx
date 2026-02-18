import getCurrentUser from "./actions/getCurrentUser";
import MainClient from "./MainClient";

export default async function Home() {
  const currentUser = await getCurrentUser();

  return <MainClient currentUser={currentUser} />;
}