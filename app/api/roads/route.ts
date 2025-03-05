
import { getCurrentYear } from "@/app/utils/helpers";
import "@/libs/bigIntToJson";
import prisma from "@/libs/prismadb";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url); 
    const year = searchParams.get("year");

    const roads = await prisma.jalan.findMany({
        include: {
            ruas: true
        },
        where: {
            tahun: year ? parseInt(year) : getCurrentYear()
        }
    });

    return Response.json(roads);
}