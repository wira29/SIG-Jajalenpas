
import { Prisma } from "@prisma/client";

export type JalanWithRuas = Prisma.JalanGetPayload<{
    include: {
        ruas: true
    };
}>;