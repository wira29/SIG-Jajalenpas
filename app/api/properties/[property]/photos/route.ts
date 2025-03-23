import prisma from "@/libs/prismadb";
import { writeFile } from "fs";
const fs = require("fs");

type PropertiesPhotosRouteParams = {
  property: string;
};

export async function GET(request: Request, { params }: { params: PropertiesPhotosRouteParams }) {
  const { property } = params;

  const properties = await prisma.photo.findMany({
    where: {
      propertyId: parseInt(property),
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(properties);
}

// upload file
export async function POST(request: Request, { params }: { params: PropertiesPhotosRouteParams }) {
  const { property } = params;

  const body = await request.formData();

  const file = body.get("file") as unknown as File;
  const description = body.get("description");

  if (!file) {
    return Response.json({
      error: "No file provided",
    });
  }

  // save file to public folder
  const bytes = await file.arrayBuffer();
  const fileBuffer = Buffer.from(bytes);

  const fileExtension = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExtension}`;

  const path = `./public/uploads/${fileName}`;

  // write file to public folder
  await writeFile(path, fileBuffer, (err: any) => {
    if (err) {
      console.error(err);
    }
  });

  // save file to database
  const photo = await prisma.photo.create({
    data: {
      propertyId: parseInt(property),
      path: path,
      url: path.replace("./public", ""),
      description: description as string,
    },
  });

  return Response.json(photo);
}
