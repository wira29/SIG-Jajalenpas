
import prisma from "@/libs/prismadb";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, res: Response) {
    const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

    if (!token) {
        return Response.json({ message: "Token tidak ditemukan" }, {
            status: 400,
        });
    }

    try {
        const decoded : any = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await prisma.users.findUnique({
            where: {
                id: decoded.userId,
            },
        });
        console.log(user);

        if (!user) {
            return Response.json({ message: "User tidak ditemukan", success: false }, {
                status: 400,
            });
        }

        await prisma.users.update({
            where: {
                id: user.id,
            },
            data: {
                email_verified_at: new Date(),
            },
        });

        return Response.json({ message: "Verifikasi berhasil", success: true }, {
            status: 200,
        });
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Verifikasi gagal", success: false }, {
            status: 500,
        });
    }
}