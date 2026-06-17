import prisma from "@/libs/prismadb";

type LayerRouteParams = {
  road: string;
};

export async function GET(
  request: Request,
  { params }: { params: LayerRouteParams }
) {
  const { road: roadId } = params;

  const road = await prisma.jalan.findUnique({
    where: {
      id: BigInt(roadId),
    },
    include: {
      ruas: {
        include: {
          sta: {
            include: {
                picturesonsta: {
                include: {
                  picture: true,
                }
              },
            },
          }
        },
      },
    },
  });

  return Response.json(road);
}

export async function DELETE(
  request: Request,
  { params }: { params: LayerRouteParams }
) {
  const { road: roadId } = params;

  const road = await prisma.jalan.delete({
    where: {
      id: BigInt(roadId),
    },
  });

  return Response.json(road);
}

export async function PATCH(
  request: Request,
  { params }: { params: LayerRouteParams }
) {
  const { road: roadId } = params;
  const body = await request.json();

  const feature = await prisma.jalan.update({
    where: {
      id: BigInt(roadId),
    },
    data: {
      ...body,
    },
  });

  return Response.json(feature);
}
