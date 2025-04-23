import prisma from "@/libs/prismadb";

type UserParams = {
    id: string;
}

export async function POST(request: Request, { params }: { params: UserParams }) {
    const { id } = params;
    const body = await request.json();

    const role = await prisma.roles.findFirst({
        where: {
            name: body.role
        }
    });

    try {
        const user = await prisma.users.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name: body.name,
                email: body.email,
                roles: {
                    deleteMany: {},
                    create: {
                        role_id: role!.id,
                        model_type: "App\Models\User",
                    }
                }
            },
            
        });

        return Response.json({
            status: true,
            message: "User updated successfully",
        });
    } catch (error) {
        return Response.json({
            status: false,
            message: "User not updated",
            error: error,
        });
    }
}

export async function DELETE(request: Request, { params }: { params: UserParams }) {
    const { id } = params;

    try {
        await prisma.model_has_roles.deleteMany({
            where: {
                model_id: parseInt(id),
            }
        });

        await prisma.users.delete({
            where: {
                id: parseInt(id),
            },
        });

        return Response.json({
            status: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        return Response.json({
            status: false,
            message: "User not deleted",
            error: error,
        });
    }
}