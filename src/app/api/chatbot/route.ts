import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  const { name, clientId } = await request.json();

  if (!name || !clientId) {
    return NextResponse.json(
      { error: "Name and client ID are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("chatbots")
    .insert({ name, client_id: clientId })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ chatbot: data[0] });
}

export async function GET(request: NextRequest) {
  const chatbotId = request.nextUrl.searchParams.get("id");

  if (!chatbotId) {
    return NextResponse.json(
      { error: "Chatbot ID is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("chatbots")
    .select("id, name, client_id, created_at")
    .eq("id", chatbotId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ chatbot: data });
}
