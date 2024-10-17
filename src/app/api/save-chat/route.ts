import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  const { userId, message, sender } = await request.json();

  if (!userId || !message || !sender) {
    return NextResponse.json(
      { error: "User ID, message, and sender are required" },
      { status: 400 }
    );
  }
  const { data: existingChat, error: fetchError } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 means no rows returned
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const newMessage = { sender, message };

  if (existingChat) {
    // If a chat record exists, update it
    const { data, error } = await supabase
      .from("chats")
      .update({
        messages: [...existingChat.messages, newMessage],
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingChat.id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ chat: data[0] });
  } else {
    // If no chat record exists, create a new one
    const { data, error } = await supabase
      .from("chats")
      .insert({
        user_id: userId,
        messages: [newMessage],
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ chat: data[0] });
  }
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ chat: data });
}
