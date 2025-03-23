import "@/libs/bigIntToJson";
import prisma from "@/libs/prismadb";

type LayerRouteParams = {
  layer: string;
};

export async function GET(request: Request, { params }: { params: LayerRouteParams }) {
    const { layer } = params;
  
    const feature = await prisma.featurecollection.findUnique({
      where: {
        id: parseInt(layer),
      },
      include: {
        feature: {
          include: {
            properties: {
              orderBy: { createdAt: "desc" },
              take: 1,
              include: {
                photo: true,
              }
            },
            geometry: {
              orderBy: { createdAt: "desc" },
              take: 1,
            }
          },
        }
      },
    });
  
    return Response.json(feature);
  }

export async function DELETE(request: Request, { params }: { params: LayerRouteParams }) {
    const { layer } = params;
  
    const feature = await prisma.featurecollection.delete({
      where: {
        id: parseInt(layer),
      },
    });
  
    return Response.json(feature);
  }
  
  export async function PATCH(request: Request, { params }: { params: LayerRouteParams }) {
    const { layer } = params;
    const body = await request.json();
    
    const feature = await prisma.featurecollection.update({
      where: {
        id: parseInt(layer),
      },
      data: {
        ...body,
      },
    });
    console.log(feature);
    return Response.json(feature);
  
  }