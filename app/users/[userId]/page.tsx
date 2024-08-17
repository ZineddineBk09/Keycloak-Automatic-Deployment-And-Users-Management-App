"use client";

import { UsersContextProvider } from "../../../context/users";
import UserEditPage from "./_client";
export default function UserPage({ params }: { params: { userId: string } }) {
  const { userId } = params;
  return (
    <>
      <UsersContextProvider>
        <UserEditPage params={params} />
      </UsersContextProvider>
    </>
  );
}
