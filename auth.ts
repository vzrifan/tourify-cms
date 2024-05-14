"use server";

import { createSession, deleteSession } from "@/lib";
import axios from "axios";
import { redirect } from "next/navigation";

export async function signin(phone_number: string, password: string) {
  // Previous steps:
  // 1. Validate form fields
  // 2. Prepare data for insertion into database
  // 3. Insert the user into the database or call an Library API

  // Current steps:
  // 4. Create user session
  try {
    const user = await getUser(phone_number, password);
    await createSession(user.id);
    // 5. Redirect user
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getUser(phone_number: string, password: string) {
  // Get user from database
  const response = await axios.post(process.env.API_URL + "/auth/login-admin", {
    phone_number: phone_number,
    password: password,
  });
  const user = { data: response.data, id: response.data.data.user.id };
  return user;
}

export async function signout(token: string) {
  await axios.post(
    process.env.API_URL + "/auth/logout",
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  deleteSession();
  redirect("/");
}
