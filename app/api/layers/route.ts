import { getCurrentYear } from "@/app/utils/helpers";
import prisma from "@/libs/prismadb";
import { apiError, apiResponse } from "@/app/utils/api-helpers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url); 
        const year = searchParams.get("year");

        const features = await prisma.featurecollection.findMany({
            include: {
                feature: {
                    include: {
                        properties: {
                            orderBy: {
                                createdAt: "desc"
                            },
                            take: 1,
                            include: {
                                photo: true
                            },
                        },
                        geometry: {
                            orderBy: {
                                createdAt: "desc"
                            },
                            take: 1
                        }
                    }
                }
            },
            where: {
                tahun: year ? parseInt(year) : getCurrentYear()
            }
        });

        return apiResponse(features);
    } catch (error) {
        return apiError("Gagal mengambil data layer", 500, error);
    }
}