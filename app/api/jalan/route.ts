

export async function GET(req: Request) {
    const jalan = await prisma.jalan.findMany({
        include: {
            ruas: {
                include: {
                    sta: {
                        include: {
                            picturesonsta: true,
                            ruas: true,
                        }
                    },
                    picturesonruas: true,
                }
            }
        }
    });

    return Response.json(jalan);
}