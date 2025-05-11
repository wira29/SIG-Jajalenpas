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
      jalan: true,
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
          ruas: true
        },
      },
    }
  });

  return Response.json(ruas);
}