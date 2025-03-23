import prisma from "@/libs/prismadb";
import { writeFile } from "fs";

type StaRouteParams = {
  sta: string;
};

export async function PATCH(request: Request, { params }: { params: StaRouteParams }) {
  const { sta: staId } = params;

  const body = await request.formData();

  const sta = body.get("sta") ?? "";
  const xAwal = body.get("xAwal") ?? "";
  const yAwal = body.get("yAwal") ?? "";
  const xAkhir = body.get("xAkhir") ?? "";
  const yAkhir = body.get("yAkhir") ?? "";
  const kondisi = body.get("kondisi") ?? "";
  const perkerasan = body.get("perkerasan") ?? "";

  const newPictures = body.getAll("newPictures") as unknown as File[];
  const newPicturesDescriptions = body.getAll("newPicturesDescription") as string[];

  const updatedPictures = body.getAll("updatedPictures") as string[];
  const updatedPicturesDescriptions = body.getAll("updatedPicturesDescription") as string[];

  const deletedPictures = body.getAll("deletedPictures") as string[];

  const savedPictures = [];
  for (let i = 0; i < newPictures.length; i++) {
    const file = newPictures[i];

    const bytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(bytes);

    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;

    const path = `./public/uploads/kondisi/sta/${fileName}`;

    // write file to public folder
    await writeFile(path, fileBuffer, (err: any) => {
      if (err) {
        console.error(err);
      }
    });

    // save file to database
    const picture = await prisma.picture.create({
      data: {
        path: path.replace("./public", ""),
      },
    });

    savedPictures.push(picture);

  }

  const oldSta = await prisma.sta.findFirst({
    where: {
      id: parseInt(staId),
    },
    include: {
      picturesonsta: true,
      ruas: true
    },
  });

  const updatedSta = await prisma.sta.update({
    where: {
      id: parseInt(staId),
    },
    include: {
    ruas: true,
      picturesonsta: {
        include: {
          picture: true,
        },
      },
    },
    data: {
      sta: sta as string,
      xAwal: parseFloat(xAwal as string),
      yAwal: parseFloat(yAwal as string),
      xAkhir: parseFloat(xAkhir as string),
      yAkhir: parseFloat(yAkhir as string),
      kondisi: kondisi as string,
      perkerasan: perkerasan as string,
      // todo: add more properties to update as needed
      picturesonsta: {
        create: savedPictures.map((p, i) => ({
          picture: { connect: { id: p.id } },
          description: newPicturesDescriptions[i],
        })) as any,
        update: updatedPictures.map((p, i) => ({
          where: {
            idSta_idPicture: {
              idPicture: parseInt(p),
              idSta: parseInt(staId),
            }
          },
          data: {
            description: updatedPicturesDescriptions[i],
          },
        }) as any),
        delete: deletedPictures.map((p) => ({
          idSta_idPicture: {
            idPicture: parseInt(p),
            idSta: parseInt(staId),
          }
        })) as any,
      },
      stahistory: {
        create: {
          nomorRuas: oldSta!.ruas.nomorRuas,
          sta: oldSta!.sta,
          xAwal: oldSta!.xAwal,
          yAwal: oldSta!.yAwal,
          xAkhir: oldSta!.xAkhir,
          yAkhir: oldSta!.yAkhir,
          kondisi: oldSta!.kondisi,
          perkerasan: oldSta!.perkerasan,
          coordinates: oldSta!.coordinates as any[],
          picturesonstahistory: {
            create: oldSta!.picturesonsta.map(p => ({
              picture: { connect: { id: p.idPicture } },
              description: p.description,
            })) as any,
          },
        },
      },

    }
  });

  return Response.json(updatedSta);
}
