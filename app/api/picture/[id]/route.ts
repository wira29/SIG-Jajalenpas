import prisma from "@/libs/prismadb";
import fs from "fs";

type ImageRouteParams = {
  id: string;
};

export async function GET(request: Request, { params }: { params: ImageRouteParams }) {
  const { id } = params;

  const image = await prisma.picture.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!image) {
    return Response.error();
  }

  // return as file
  const path = image.path;

  const buffer = fs.readFileSync('./public' + path);

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/jpeg",
    },
  });
}