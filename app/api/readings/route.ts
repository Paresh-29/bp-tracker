import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { systolic, diastolic, pulse } = body;

  if (!systolic || !diastolic || !pulse) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const reading = await prisma.reading.create({
    data: {
      systolic,
      diastolic,
      pulse,
      userId: user.id,
    },
  });

  return NextResponse.json(reading, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const readings = await prisma.reading.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      orderBy: {
        recordedAt: "desc",
      },
    });

    return NextResponse.json(readings, { status: 200 });
  } catch (error) {
    NextResponse.json({ error: "Failed to fetch readings" }, { status: 500 });
  }
}
