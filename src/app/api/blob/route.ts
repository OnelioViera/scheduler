import { put, list, del } from "@vercel/blob";
import { NextResponse } from "next/server";

const DATA_PREFIX = "scheduler-data";

// Helper to get the latest data blob
async function getLatestDataBlob() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  const { blobs } = await list({
    prefix: DATA_PREFIX,
    limit: 1,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return blobs[0];
}

export async function POST(request: Request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
    }

    const { tasks, events } = await request.json();

    if (!Array.isArray(tasks) || !Array.isArray(events)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    // Delete the previous blob if it exists
    try {
      const previousBlob = await getLatestDataBlob();
      if (previousBlob) {
        await del(previousBlob.url, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
      }
    } catch (error) {
      console.error("Error deleting previous blob:", error);
      // Continue with saving new data even if deletion fails
    }

    // Store new data
    const blob = await put(
      `${DATA_PREFIX}-${Date.now()}.json`,
      JSON.stringify({ tasks, events }),
      {
        contentType: "application/json",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        access: "public",
      }
    );

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Failed to store data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to store data";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
    }

    const latestBlob = await getLatestDataBlob();

    if (!latestBlob) {
      return NextResponse.json({ tasks: [], events: [] });
    }

    const response = await fetch(latestBlob.url);
    if (!response.ok) {
      throw new Error("Failed to fetch blob data");
    }

    const data = await response.json();
    return NextResponse.json({
      tasks: data.tasks || [],
      events: data.events || [],
    });
  } catch (error) {
    console.error("Failed to fetch data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch data";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
