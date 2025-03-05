import { getCurrentYear } from "@/app/utils/helpers";
import prisma from "@/libs/prismadb";

export async function GET(request: Request) {
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

    return Response.json(features);
}