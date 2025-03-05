import { getCurrentYear } from "@/app/utils/helpers";
import prisma from "@/libs/prismadb";


export async function GET(request: Request) {

    const roadConditionYeard = await prisma.jalan.groupBy({
        by: ["tahun"],
    });

    const layerYears = await prisma.featurecollection.groupBy({
        by: ["tahun"],
    });

    // Gabungkan dan ambil unique tahun
    const years = Array.from(
        new Set([...roadConditionYeard.map(d => d.tahun), ...layerYears.map(d => d.tahun), getCurrentYear()])
    ).map(tahun => ({ tahun }));
    

    return Response.json(years);
}