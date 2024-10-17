import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  const { chatbotId } = await request.json();

  if (!chatbotId) {
    return NextResponse.json(
      { error: "Chatbot ID is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("users")
    .insert({ chatbot_id: chatbotId })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data[0] });
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, chatbot_id, created_at")
    .eq("id", userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data });
}
