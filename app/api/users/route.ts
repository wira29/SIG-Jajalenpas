import "@/libs/bigIntToJson";
import prisma from "@/libs/prismadb";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {

    const users = await prisma.users.findMany({
        include: {
            roles: {
                include: {
                    role: true,
                }
            }
        },
        where: {
            roles: {
                some: {
                    role: {
                        'name': {
                            in: ['superadmin', 'admin', 'guest']
                        }
                    }
                }
            }
        }
    })

    return Response.json(users);
}

export async function POST(request: Request) {
    const body = await request.json();

    const role = await prisma.roles.findFirst({
        where: {
            name: body.role
        }
    });

    const password = await bcrypt.hash(body.password, 10);

    try {
        const user = await prisma.users.create({
            data: {
                name: body.name,
                email: body.email,
                password: password,
                phone_number: "",
                profile: null,
            } 
        });
    
        const roleUser = await prisma.model_has_roles.create({
            data: {
                role_id: role!.id,
                model_type: "App\Models\User",
                model_id: user!.id,
            }
        });

        return Response.json({
            status: true,
            message: "User created successfully",
        });
    } catch (error) {
        return Response.json({
            status: false,
            message: "User not created",
            error: error,
        });
    }
}