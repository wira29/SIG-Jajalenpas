import prisma from "@/libs/prismadb";
import fs from "fs";

type PhotoRouteParams = {
  id: string;
};

export async function GET(request: Request, { params }: { params: PhotoRouteParams }) {
  const { id } = params;

  const image = await prisma.photo.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!image) {
    return Response.error();
  }

  // return as file
  const path = image.path!.replace('./public', '');

  const buffer = fs.readFileSync('./public' + path);

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/jpeg",
    },
  });
}