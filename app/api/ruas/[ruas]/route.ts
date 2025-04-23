import prisma from "@/libs/prismadb";
import { writeFile } from "fs";

type RuasRouteParams = {
  ruas: string;
};

export async function PATCH(request: Request, { params }: { params: RuasRouteParams }) {
  const { ruas } = params;

  const body = await request.formData();

  const namaRuas = body.get("namaRuas") as string;
  const keterangan = body.get("keterangan") as string;
  const kecamatan = body.get("kecamatan") as string;
  const panjangSK = body.get("panjangSK") as string;
  const lebar = body.get("lebar") as string;

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

    const path = `./public/uploads/kondisi/ruas/${fileName}`;

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

  const oldRuas = await prisma.ruas.findFirst({
    where: {
      id: parseInt(ruas),
    },
    include: {
      picturesonruas: true,
    },
  });

  const updatedRuas = await prisma.ruas.update({
    where: {
      id: parseInt(ruas),
    },
    include: {
      picturesonruas: {
        include: {
          picture: true,
        },
      },
    },
    data: {
      namaRuas,
      keterangan,
      kecamatan,
      panjangSK: parseFloat(panjangSK) || 0,
      lebar: parseFloat(lebar) || 0,
      picturesonruas: {
        create: savedPictures.map((p, i) => ({
          picture: { connect: { id: p.id } },
          description: newPicturesDescriptions[i],
        })) as any,
        update: updatedPictures.map((p, i) => ({
          where: {
            idRuas_idPicture: {
              idPicture: parseInt(p),
              idRuas: parseInt(ruas),
            }
          },
          data: {
            description: updatedPicturesDescriptions[i],
          },
        }) as any),
        delete: deletedPictures.map((p) => ({
          idRuas_idPicture: {
            idPicture: parseInt(p),
            idRuas: parseInt(ruas),
          }
        })) as any,
      },
      ruashistory: {
        create: {
          nomorRuas: oldRuas!.nomorRuas,
          namaRuas: oldRuas!.namaRuas,
          kecamatan: oldRuas!.kecamatan,
          keterangan: oldRuas!.keterangan,
          panjangSK: oldRuas!.panjangSK,
          lebar: oldRuas!.lebar,
          latitude: oldRuas!.latitude,
          longitude: oldRuas!.longitude,
          picturesonruashistory: {
            create: oldRuas!.picturesonruas.map(p => ({
              picture: { connect: { id: p.idPicture } },
              description: p.description,
            })) as any,
          },
        },
      },

    }
  });

  return Response.json(updatedRuas);
}
