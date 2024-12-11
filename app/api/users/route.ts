import prisma from "@/libs/prismadb";

export async function GET() {
    const users = await prisma.users.findMany();

    return Response.json(users);
}