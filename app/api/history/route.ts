import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../db";

// GET: Retrieve all batches or a specific batch with histories
export async function GET(request: NextRequest) {
  const batchId: string | null = request.nextUrl.searchParams.get("batchId");

  if (batchId) {
    // Get specific batch with histories
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: {
        histories: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!batch) {
      return NextResponse.json(
        { status: 404, data: { message: "Batch not found" } },
        { status: 404 }
      );
    }

    // Exclude batchId, userId from histories and historyId from user
    const sanitizedBatch = {
      ...batch,
      histories: batch.histories.map(({ batchId, userId, user, ...rest }) => ({
        ...rest,
        user: {
          ...user,
          historyId: undefined, // Remove historyId
        },
      })),
    };

    return NextResponse.json(
      { status: 200, data: { batch: sanitizedBatch } },
      { status: 200 }
    );
  } else {
    // Get all batches with associated histories
    const batches = await prisma.batch.findMany({
      include: {
        histories: {
          include: {
            user: true,
          },
        },
      },
    });

    // Exclude batchId and userId from histories
    const sanitizedBatches = batches.map((batch) => ({
      ...batch,
      histories: batch.histories.map(({ batchId, userId, user, ...rest }) => ({
        ...rest,
        user: {
          ...user,
          historyId: undefined, // Remove historyId
        },
      })),
    }));

    return NextResponse.json(
      { status: 200, data: { batches: sanitizedBatches } },
      { status: 200 }
    );
  }
}

// POST: Create a new batch with histories
interface HistoryInput {
  username: string;
  error?: any; // Consider defining a more specific type for errors
}

interface BatchInput {
  batchName: string;
  histories: HistoryInput[];
}

export async function POST(request: NextRequest) {
  try {
    const { histories, batchName }: BatchInput = await request.json();

    if (!batchName || !histories || !Array.isArray(histories)) {
      return NextResponse.json(
        { status: 400, error: "Invalid input data" },
        { status: 400 }
      );
    }

    console.log("====================================");
    console.log("Histories:", histories);
    console.log("Batch Name:", batchName);
    console.log("====================================");

    const batch = await prisma.batch.create({
      data: {
        batchName,
        histories: {
          create: histories.map((history) => ({
            user: {
              create: {
                username: history.username,
              },
            },
            error: history.error,
          })),
        },
      },
      include: {
        histories: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        status: 201,
        data: {
          message: "Batch created successfully with histories",
          batch,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating batch:", error);
    return NextResponse.json(
      { status: 500, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH: Update batch's details or its histories
export async function PATCH(request: NextRequest) {
  const batchId: string | null = request.nextUrl.searchParams.get("batchId");
  const body = await request.json();

  if (!batchId) {
    return NextResponse.json(
      { status: 400, data: { message: "Batch ID is required" } },
      { status: 400 }
    );
  }

  const allowedFields = ["histories"];

  // Check if the body contains any invalid fields
  for (const field in body) {
    if (!allowedFields.includes(field)) {
      return NextResponse.json(
        { status: 400, data: { message: "Invalid field: " + field } },
        { status: 400 }
      );
    }
  }

  // Update the batch's histories
  const batch = await prisma.batch.update({
    where: { id: batchId },
    data: {
      histories: {
        create: body.histories.map((history: any) => ({
          userId: history.userId,
          status: history.status,
          error: history.error,
        })),
      },
    },
    include: {
      histories: true,
    },
  });

  return NextResponse.json(
    { status: 200, data: { message: "Batch updated", batch } },
    { status: 200 }
  );
}

// DELETE: Delete a batch and associated histories
export async function DELETE(request: NextRequest) {
  const batchId: string | null = request.nextUrl.searchParams.get("batchId");

  if (!batchId) {
    return NextResponse.json(
      { status: 400, data: { message: "Batch ID is required" } },
      { status: 400 }
    );
  }

  // Delete the batch and associated histories
  await prisma.batch.delete({
    where: { id: batchId },
  });

  return NextResponse.json(
    { status: 200, data: { message: "Batch deleted" } },
    { status: 200 }
  );
}
