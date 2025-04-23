import prisma from "@/libs/prismadb";

type RuasHistoryRouteParams = {
  ruas: string;
};

export async function GET(
  request: Request,
  { params }: { params: RuasHistoryRouteParams }
) {
  const { ruas } = params;

  const history = await prisma.ruashistory.findMany({
    where: {
      nomorRuas: parseInt(ruas),
    },
    orderBy: { createdAt: "desc" },
    include: {
      picturesonruashistory: {
        include: {
          picture: true,
        },
      },
    },
  });

  return Response.json(history);
}

