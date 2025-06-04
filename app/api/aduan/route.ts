import authOptions from "@/libs/authOptions";
import "@/libs/bigIntToJson";
import prisma from "@/libs/prismadb";
import { writeFile } from "fs";
import { getServerSession } from "next-auth";


export async function GET(request: Request)
{

    const aduans = await prisma.aduans.findMany({
        include: {
            createdBy: true,
            ruas: true
        },
        orderBy: {
            created_at: "desc",
        },
    });

    return Response.json(aduans);
}

export async function POST(request: Request)
{
    const body = await request.formData();
    const session = await getServerSession(authOptions);

    const keluhan = body.get("keluhan") as string;
    const photo = body.get("photo") as File;
    const ruasId = body.get("ruas_id") as string;
    
    const bytes = await photo.arrayBuffer();
    const fileBuffer = Buffer.from(bytes);

    const fileExtension = photo.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;

    const path = `./public/uploads/aduan/${fileName}`;

    // write file to public folder
    await writeFile(path, fileBuffer, (err: any) => {
        if (err) {
        console.error(err);
        }
    });

    const aduan = await prisma.aduans.create({
        data: {
            created_by: parseInt((session?.user as any)?.id),
            ruas_id: parseInt(ruasId),
            keluhan: keluhan,
            photo: path.replace("./public", ""),
            status: "pending",
            created_at: new Date(),
        },
    });

    if (!aduan) {
        return Response.json({
            "status": "error",
            "message": "Data gagal disimpan"
        });
    }

    return Response.json({
        "status": "success",
        "data": aduan
    });
}