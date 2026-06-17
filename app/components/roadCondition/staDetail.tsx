/* eslint-disable @next/next/no-img-element */
import { StaWithPictures } from "@/app/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type StaDetailProps = {
  sta: StaWithPictures;
};
export default function StaDetail({ sta }: StaDetailProps) {
  return (
    <>
      {sta?.picturesonsta.length > 0 && (
        <Carousel
          opts={{
            align: "end",
          }}
          className="w-full"
        >
          <CarouselContent>
            {sta?.picturesonsta.map((picture: any, index: number) => (
              <CarouselItem key={index} className="">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex h-48 items-center justify-center p-0">
                      <img
                        className="w-full h-full object-cover"
                        src={"/api/picture/" + picture.picture.id}
                        alt={picture.description ?? ""}
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      )}
      <div className="w-full p-1 mt-6">
        <table className="w-full">
          <tbody className="w-full text-sm sm:text-md">
            <tr>
              <td className="w-1/3 font-bold">Nomor Ruas</td>
              <td className="w-2/3">: {sta?.ruas.nomorRuas}</td>
            </tr>
            <tr>
              <td className="w-1/3 font-bold">STA</td>
              <td className="w-2/3">: {sta?.sta}</td>
            </tr>
            <tr>
              <td className="w-1/3 font-bold">X Awal</td>
              <td className="w-2/3">: {sta?.xAwal}</td>
            </tr>
            <tr>
              <td className="w-1/3 font-bold">X Akhir</td>
              <td className="w-2/3">: {sta?.xAkhir}</td>
            </tr>
            <tr>
              <td className="w-1/3 font-bold">Y Awal</td>
              <td className="w-2/3">: {sta?.yAwal}</td>
            </tr>
            <tr>
              <td className="w-1/3 font-bold">Y Akhir</td>
              <td className="w-2/3">: {sta?.yAkhir}</td>
            </tr>
            <tr>
              <td className="w-1/3 font-bold">Kondisi</td>
              <td className="w-2/3">: {sta?.kondisi}</td>
            </tr>
            <tr>
              <td className="w-1/3 font-bold">Perkerasan</td>
              <td className="w-2/3">: {sta?.perkerasan}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
