
import prisma from "@/libs/prismadb";

type StaRouteParams = {
  noRuas: number;
};

export async function GET(request: Request, { params }: { params: StaRouteParams }) {

    const { noRuas } = params;

    const ruas = await prisma.ruas.findFirst({
        where: {
            nomorRuas: noRuas
        },
        include: {
            sta: true,
        },
        orderBy: {
            createdAt: "desc",
        }
    });

    return Response.json(ruas);
}
