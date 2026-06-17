import prisma from "@/libs/prismadb";
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

export async function POST(req: Request) {
  const body = await req.json();
  
  try {
    const user = await prisma.users.findUnique({ where: { email: body.email } });

    if (!user) {
      return new Response("User tidak ditemukan", { status: 404 });
    }

    // Buat token valid 30 menit
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "30m" }
    );

    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: 'jajalenpas@hummatech.com',
      to: body.email,
      subject: "Reset Password",
      html: `
        <h1>Reset Password</h1>
        <p>Klik link berikut untuk mengatur ulang password Anda:</p>
        <a href="${resetUrl}">Reset Password</a>
      `,
    });

    return Response.json({
      status: true,
      message: "Email reset password telah dikirim",
    });
  } catch (error) {
    return Response.json({
      status: false,
      message: "Email reset password gagal dikirim",
      error: error,
    });
  }
}
