import prisma from "@/libs/prismadb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: bigint };
    console.log(payload);

    const hashed = await bcrypt.hash(password, 10);

    await prisma.users.update({
      where: { id: payload.userId },
      data: {
        password: hashed,
      },
    });

    return Response.json({ status: true, message: "Password berhasil diubah" });
  } catch (err) {
    console.log(err);
    return Response.json({ status: false, message: "Password gagal diubah", error: err });
  }
}