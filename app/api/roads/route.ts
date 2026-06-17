
import { getCurrentYear } from "@/app/utils/helpers";
import "@/libs/bigIntToJson";
import prisma from "@/libs/prismadb";
import { apiError, apiResponse } from "@/app/utils/api-helpers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url); 
        const year = searchParams.get("year");

        const roads = await prisma.jalan.findMany({
            include: {
                ruas: {
                    include: {
                        sta: true,
                    }
                }
            },
            where: {
                tahun: year ? parseInt(year) : getCurrentYear()
            }
        });

        return apiResponse(roads);
    } catch (error) {
        return apiError("Gagal mengambil data jalan", 500, error);
    }
}