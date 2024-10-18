import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Insert a user with a chatbot ID
 *     description: Inserts a new user record in the users table with the provided chatbot ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatbotId:
 *                 type: string
 *                 description: The ID of the chatbot
 *                 example: "abcd1234"
 *     responses:
 *       200:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     chatbot_id:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Chatbot ID is required
 *       500:
 *         description: Internal server error
 */

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
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a user by ID
 *     description: Fetches a user’s details by their ID from the users table.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     chatbot_id:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Internal server error
 */

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
