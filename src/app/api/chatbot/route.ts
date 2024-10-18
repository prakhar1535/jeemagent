import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
/**
 * @swagger
 * /api/chatbots:
 *   post:
 *     summary: Create a new chatbot
 *     description: Creates a chatbot with the given name and client ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the chatbot
 *                 example: "My Chatbot"
 *               clientId:
 *                 type: string
 *                 description: The client ID associated with the chatbot
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: Chatbot created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chatbot:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     client_id:
 *                       type: string
 *       400:
 *         description: Missing name or client ID
 *       500:
 *         description: Internal server error
 */

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
/**
 * @swagger
 * /api/chatbots:
 *   get:
 *     summary: Get chatbot by ID
 *     description: Fetches the chatbot's details using the chatbot ID.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the chatbot to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved chatbot details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chatbot:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     client_id:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Chatbot ID is required
 *       500:
 *         description: Internal server error
 */

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
