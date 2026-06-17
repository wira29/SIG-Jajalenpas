
import "@/libs/bigIntToJson";
import prisma from "@/libs/prismadb";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url); 
    const year = searchParams.get("year");

    const projects = await prisma.executor_projects.findMany({
        include: {
            fiscal_years: true,
            contract_categories: true,
            service_providers: {
                include: {
                    user: true
                }
            }
        },
        where: {
            fiscal_years: {
                name: year!
            }
        }
    });

    return Response.json(projects);
}