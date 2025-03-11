import "@/libs/bigIntToJson";
import prisma from "@/libs/prismadb";

type JalanRuasRouteParams = {
  jalan: string;
  ruas: string;
};

export async function GET(request: Request, { params }: { params: JalanRuasRouteParams }) {
  const ruas = await prisma.ruas.findFirst({
    where: {
      nomorRuas: parseInt(params.ruas),
    },
    include: {
      picturesonruas: {
        include: {
          picture: true,
        },
      },
      sta: {
        include: {
          picturesonsta: {
            include: {
              picture: true,
            },
          },
        },
      },
    }
  });

  return Response.json(ruas);
}