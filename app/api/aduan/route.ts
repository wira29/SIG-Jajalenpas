import authOptions from "@/libs/authOptions";
import "@/libs/bigIntToJson";
import prisma from "@/libs/prismadb";
import { promises as fs } from "fs";
import { getServerSession } from "next-auth";
import path from "path";

export async function GET(request: Request)
{
    const aduanUnfinished = await prisma.aduans.groupBy({
        by: ["ruas_id"],
        where: {
            status: {
                not: "done"
            }
        },
        _count: {
            id: true,
        },
        orderBy: {
            _count: {
                id: "desc",
            },
        }
    })

    const aduanDone = await prisma.aduans.groupBy({
        by: ["ruas_id", "date_finished", "note"],
        where: {
            status: {
                equals: "done"
            }
        },
        _count: {
            id: true,
        },
        orderBy: {
            date_finished: "desc",
        }
    })

    // Get all unique ruas IDs from both lists
    const allRuasIds = Array.from(new Set([
        ...aduanUnfinished.map(a => a.ruas_id),
        ...aduanDone.map(a => a.ruas_id)
    ]));

    // Fetch all required ruas in one query
    const ruasData = await prisma.ruas.findMany({
        where: {
            id: {
                in: allRuasIds
            }
        }
    });

    // Create a map for quick lookup
    const ruasMap = new Map(ruasData.map(r => [r.id, r]));

    const resultUnfinished = aduanUnfinished.map((aduan) => ({
        ruas_id: aduan.ruas_id,
        laporan: aduan._count.id,
        ruas: ruasMap.get(aduan.ruas_id) || null,
    }));

    const resultFinished = aduanDone.map((aduan) => ({
        ruas_id: aduan.ruas_id,
        laporan: aduan._count.id,
        date_finished: aduan.date_finished,
        note: aduan.note,
        ruas: ruasMap.get(aduan.ruas_id) || null,
    }));
    
    return Response.json({
        unfinished: resultUnfinished,
        finished: resultFinished,
    });
}

export async function POST(request: Request)
{
    const body = await request.formData();
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ "status": "error", "message": "Unauthorized" }, { status: 401 });
    }

    const keluhan = body.get("keluhan") as string;
    const photo = body.get("photo") as File;
    const ruasId = body.get("ruas_id") as string;
    const user = session?.user as any;

    // Server-side validation
    if (!photo || photo.size === 0) {
        return Response.json({ "status": "error", "message": "Foto wajib diunggah" }, { status: 400 });
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (photo.size > MAX_SIZE) {
        return Response.json({ "status": "error", "message": "Ukuran foto maksimal 5MB" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(photo.type)) {
        return Response.json({ "status": "error", "message": "Format file tidak didukung (Gunakan JPG/PNG/WebP)" }, { status: 400 });
    }
    
    const bytes = await photo.arrayBuffer();
    const fileBuffer = Buffer.from(bytes);

    const fileExtension = photo.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    
    // Use path.join for cross-platform compatibility and safety
    const uploadDir = path.join(process.cwd(), "public", "uploads", "aduan");
    const filePath = path.join(uploadDir, fileName);
    const dbPath = `/uploads/aduan/${fileName}`;

    try {
        // Ensure directory exists
        await fs.mkdir(uploadDir, { recursive: true });
        
        // Write file using promises
        await fs.writeFile(filePath, fileBuffer);

        try {
            const aduan = await prisma.aduans.create({
                data: {
                    created_by: BigInt(user.id),
                    ruas_id: BigInt(ruasId),
                    keluhan: keluhan,
                    photo: dbPath,
                    status: user.role === "guest" ? "pending" : "verified",
                    created_at: new Date(),
                },
            });

            return Response.json({
                "status": "success",
                "data": aduan
            });
        } catch (dbError) {
            // Rollback: delete file if database creation fails
            await fs.unlink(filePath).catch(console.error);
            console.error("Database error:", dbError);
            return Response.json({
                "status": "error",
                "message": "Gagal menyimpan data ke database"
            }, { status: 500 });
        }
    } catch (fsError) {
        console.error("File system error:", fsError);
        return Response.json({
            "status": "error",
            "message": "Gagal mengunggah file"
        }, { status: 500 });
    }
}
