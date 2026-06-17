import prisma from "@/libs/prismadb";

type StaHistoryRouteParams = {
  sta: string;
};

export async function GET(
  request: Request,
  { params }: { params: StaHistoryRouteParams }
) {
  const { sta } = params;

  const history = await prisma.stahistory.findMany({
    where: {
      idSta: parseInt(sta),
    },
    orderBy: { createdAt: "desc" },
    include: {
      picturesonstahistory: {
        include: {
          picture: true,
        },
      },
    },
  });

  return Response.json(history);
}

