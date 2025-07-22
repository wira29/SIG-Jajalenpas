
import "@/libs/bigIntToJson";
import prisma from "@/libs/prismadb";

type AduanRouteParams = {
  ruasId: string;
};


export async function GET(request: Request, {params}: {params: AduanRouteParams})
{
    const { ruasId } = params;

    const aduans = await prisma.aduans.findMany({
        where: {
            ruas_id: parseInt(ruasId),
            status : {
                not: "done"
            }
        },
        include: {
            createdBy: true,
            ruas: true
        },
        orderBy: {
            created_at: "desc",
        },
    });

    return Response.json(aduans);
}

export async function POST(request: Request, {params}: {params: AduanRouteParams})
{
    const { ruasId } = params;
    const body = await request.json();
    const status = body.status as string;

    await prisma.aduans.updateMany({
        where: {
            id: parseInt(ruasId),
        },
        data: {
            status: status,
        },
    });

    return Response.json({});
}

export async function PATCH(request: Request, {params}: {params: AduanRouteParams})
{
    const { ruasId } = params;
    const body = await request.json();
    const status = body.status as string;
    const note = body.note as string|null;
    const date = body.date as Date|null;

    await prisma.aduans.updateMany({
        where: {
            ruas_id: parseInt(ruasId),
        },
        data: {
            status: status,
            note: note,
            date_finished: date,
        },
    });

    return Response.json({});
}