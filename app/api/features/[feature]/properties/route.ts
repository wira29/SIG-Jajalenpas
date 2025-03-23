import prisma from "@/libs/prismadb";

type LayerPropertiesRouteParams = {
  feature: string;
};

export async function GET(request: Request, { params }: { params: LayerPropertiesRouteParams }) {
  const { feature } = params;

  const properties = await prisma.properties.findMany({
    where: {
      featureId: parseInt(feature),
    },
    orderBy: { createdAt: "desc" },
    include: {
      photo: true,
    },
  });

  return Response.json(properties);
}
