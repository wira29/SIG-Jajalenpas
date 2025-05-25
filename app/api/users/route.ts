import "@/libs/bigIntToJson";
import prisma from "@/libs/prismadb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "hummatech.com",
    port: 465,
    service: 'SMTP', // atau pakai SMTP server kamu
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

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
                            in: ['superadmin', 'operator', 'opd', 'guest']
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
    const from = body.from ?? "create";

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
                email_verified_at: from === "register" ? null : new Date(),
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

        if (from == "register")
        {
            const userId = user!.id;
            const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1d' });

            const verificationUrl = `${process.env.APP_URL}/verify?token=${token}`;

            // Kirim email
            await transporter.sendMail({
                from: 'jajalenpas@hummatech.com',
                to: body.email,
                subject: 'Verifikasi Email Anda',
                html: `
                <h1>Verifikasi Email</h1>
                <p>Silakan klik link di bawah untuk verifikasi email Anda:</p>
                <a href="${verificationUrl}">Verifikasi Email</a>
                `
            });
            console.log("email sent")
        }

        return Response.json({
            status: true,
            message: "User created successfully",
        });
    } catch (error) {
        console.log(error)
        return Response.json({
            status: false,
            message: "User not created",
            error: error,
        });
    }
}