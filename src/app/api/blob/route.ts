import { put, list, del } from "@vercel/blob";
import { NextResponse } from "next/server";

const TASKS_PREFIX = "tasks";

// Helper to get the latest tasks blob
async function getLatestTasksBlob() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  const { blobs } = await list({
    prefix: TASKS_PREFIX,
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

    const { tasks } = await request.json();

    if (!Array.isArray(tasks)) {
      return NextResponse.json(
        { error: "Invalid tasks data format" },
        { status: 400 }
      );
    }

    // Delete the previous blob if it exists
    try {
      const previousBlob = await getLatestTasksBlob();
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
      `${TASKS_PREFIX}-${Date.now()}.json`,
      JSON.stringify(tasks),
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

    const latestBlob = await getLatestTasksBlob();

    if (!latestBlob) {
      return NextResponse.json({ tasks: [] });
    }

    const response = await fetch(latestBlob.url);
    if (!response.ok) {
      throw new Error("Failed to fetch blob data");
    }

    const tasks = await response.json();
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Failed to fetch data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch data";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
