import authOptions from "@/libs/authOptions";
import "@/libs/bigIntToJson";
import prisma from "@/libs/prismadb";
import { writeFile } from "fs";
import moment from "moment";
import { getServerSession } from "next-auth";

export async function GET() {
  const reports = await prisma.report.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true
    }
  });

  return Response.json(reports);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json(
      {
        error: "You are not authenticated",
      },
      {
        status: 403,
      }
    );
  }

  // multipart accept file
  const body = await request.formData();

  const file = body.get("file") as unknown as File;
  const title = body.get("title");
  const description = body.get("description");

  if (!file) {
    return Response.json(
      {
        error: "No file provided",
      },
      {
        status: 401,
      }
    );
  }

  if (!title) {
    return Response.json(
      {
        error: "No title provided",
      },
      {
        status: 401,
      }
    );
  }

  if (!description) {
    return Response.json(
      {
        error: "No description provided",
      },
      {
        status: 401,
      }
    );
  }

  // save file to public folder
  const bytes = await file.arrayBuffer();
  const fileBuffer = Buffer.from(bytes);

  const fileExtension = file.name.split(".").pop();
  const slug = title?.toString().toLowerCase().replace(/\s/g, "-");
  const fileName = `${slug}-${Date.now()}.${fileExtension}`;

  const path = `./public/uploads/reports/${fileName}`;

  // write file to public folder
  await writeFile(path, fileBuffer, (err: any) => {
    if (err) {
      console.error(err);
    }
  });

  // save file to database
  const report = await prisma.report.create({
    data: {
      title: title.toString(),
      slug: `${slug}-${moment().format("YYYY-MM-DD")}`,
      description: description?.toString(),
      file: path.replace("./public", ""),
      createdBy: parseInt((session?.user as any)?.id),
    },
  });

  return Response.json(report);
}
