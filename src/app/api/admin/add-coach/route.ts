import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANT
);

const DEFAULT_PASSWORD_HASH =
// carefull with this 
 // do not share it plz you nigger 
  /*"$2b$10$9JwWwM2XU9zq9zqJp6Z6eOBm4Y8tZ9E3CjH2T0R4oVYjz5WJkq1mS";*/ 
  "$2b$10$AnO7ei2vEIDwU94axSwvOukRTKzkvYYuDUHdCXynGFZDiVi6lbiC6";// AOI

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { error: "Email required" },
      { status: 400 }
    );
  }

  // Prevent duplicates
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("users").insert({
    email,
    role: "coach",
    full_name: null,
    password_hash: DEFAULT_PASSWORD_HASH,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
