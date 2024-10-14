/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getJson } from "serpapi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    const result: any = await new Promise((resolve, reject) => {
      getJson(
        {
          engine: "google_images",
          q: title,
          location: "Austin, TX, Texas, United States",
          api_key: process.env.SERPAPI_API_KEY,
        },
        (json) => {
          if (json.error) {
            reject(new Error(json.error));
          } else {
            resolve(json);
          }
        }
      );
    });

    const firstImage = result.images_results?.[0];
    if (firstImage && firstImage.thumbnail) {
      return NextResponse.json({ thumbnail: firstImage.thumbnail });
    } else {
      return NextResponse.json({ error: "No image found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Error fetching image" },
      { status: 500 }
    );
  }
}
