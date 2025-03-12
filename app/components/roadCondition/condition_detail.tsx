/* eslint-disable @next/next/no-img-element */
import useSelectedStaStore from "@/app/stores/selected_sta_store";
import { RuasWithSta } from "@/app/types";
import { Button, Table, TableBody, TableCell, TableRow } from "flowbite-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//     Carousel,
//     CarouselContent,
//     CarouselItem,
//     CarouselNext,
//     CarouselPrevious,
// } from "@/components/ui/carousel";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import { DialogTrigger } from "@radix-ui/react-dialog";
import { ChevronDownCircle, Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
// import ImageDialog from "../Dialog/ImageDiaolog";

type ConditionDetailProps = {
  ruas: RuasWithSta;
};
export default function ConditionDetail({ ruas }: ConditionDetailProps) {
    const { set: setSelectedSta } = useSelectedStaStore();
//   const { setSelectedSta } = useSelectedStaStore((selectedSta) => ({
//     setSelectedSta: selectedSta.set,
//   }));
  const [render, setRender] = useState(0);

  const panjangJalan = useRef(0);

  // kondisi
  const baik = useRef(0);
  const sedang = useRef(0);
  const rusakRingan = useRef(0);
  const rusakBerat = useRef(0);

  // permukaan
  const aspal = useRef(0);
  const beton = useRef(0);
  const kerikil = useRef(0);
  const tanah = useRef(0);

  const formatSta = (sta: string) => {
    return parseInt(sta.replace(/\+/g, ""));
  };

  const sortSta = (sta: any = []) => {
    return sta.sort((a: any, b: any) => formatSta(a.sta) - formatSta(b.sta));
  };

  const clearCondition = () => {
    baik.current = 0;
    sedang.current = 0;
    rusakRingan.current = 0;
    rusakBerat.current = 0;

    aspal.current = 0;
    beton.current = 0;
    kerikil.current = 0;
    tanah.current = 0;
  };

  useEffect(() => {
    const rerender = () => {
      setRender((prev) => prev + 1);
    };

    const cekPanjangJalan = () => {
      if (ruas?.sta) {
        sortSta(ruas.sta);
        const sta = ruas.sta[ruas.sta.length - 1].sta;
        const panjang = formatSta(sta);

        panjangJalan.current = panjang;
      }
    };

    const cekPanjangTiapKondisi = () => {
      if (ruas?.sta) {
        clearCondition();
        sortSta(ruas.sta);
        ruas.sta.forEach((sta: any, index: number) => {
          if (sta.kondisi === "Baik") {
            
            baik.current += index > 0
              ? formatSta(sta.sta) - formatSta(ruas.sta[index - 1].sta)
              : formatSta(sta.sta);
          } else if (sta.kondisi === "Sedang") {
            
            sedang.current += index > 0
              ? formatSta(sta.sta) - formatSta(ruas.sta[index - 1].sta)
              : formatSta(sta.sta);
          } else if (sta.kondisi === "Rusak Ringan") {
            
            rusakRingan.current += index > 0
              ? formatSta(sta.sta) - formatSta(ruas.sta[index - 1].sta)
              : formatSta(sta.sta);
          } else if (sta.kondisi === "Rusak Berat") {
            
            rusakBerat.current += index > 0
              ? formatSta(sta.sta) - formatSta(ruas.sta[index - 1].sta)
              : formatSta(sta.sta);
          }

          if (sta.perkerasan === "Aspal") {
            
            aspal.current += index > 0
              ? formatSta(sta.sta) - formatSta(ruas.sta[index - 1].sta)
              : formatSta(sta.sta);
          } else if (sta.perkerasan === "Beton") {
            
            beton.current += index > 0
              ? formatSta(sta.sta) - formatSta(ruas.sta[index - 1].sta)
              : formatSta(sta.sta);
          } else if (sta.perkerasan === "Kerikil") {
            
            kerikil.current += index > 0
              ? formatSta(sta.sta) - formatSta(ruas.sta[index - 1].sta)
              : formatSta(sta.sta);
          } else if (sta.perkerasan === "Tanah") {
            
            tanah.current += index > 0
              ? formatSta(sta.sta) - formatSta(ruas.sta[index - 1].sta)
              : formatSta(sta.sta);
          }
        });
        rerender();
      }

    };

    cekPanjangJalan();
    cekPanjangTiapKondisi();
    // rerender();

    // setRender((prev) => prev + 1);
  }, [ruas?.sta]);


  return (
    <>
      {/* {ruas && ruas?.pictures?.length > 0 && (
        <Carousel
          opts={{
            align: "end",
          }}
          className="w-full"
        >
          <CarouselContent>
            {ruas?.pictures.map((picture, index) => (
              <CarouselItem key={index} className="">
                <div className="p-1">
                  <ImageDialog image={"/api/picture/" + picture.picture.id} desc={picture.description ?? ""} data={ruas} >
                  <DialogTrigger className="w-full">
                  <Card className="w-full">
                    <CardContent className="flex h-48 items-center justify-center p-0">
                      <img
                        className="w-full h-full object-cover"
                        src={"/api/picture/" + picture.picture.id}
                        alt={picture.description ?? ""}
                      />
                    </CardContent>
                  </Card>
                  </DialogTrigger>
                  </ImageDialog>
                  
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      )} */}
      <div className="w-full p-1 mt-6">
        <table className="w-full">
          {ruas && (
            <tbody className="w-full">
              <tr className="w-full text-sm sm:text-md">
                <td className="w-1/2 font-bold">Nomor Ruas</td>
                <td className="w-1/2">: {ruas.nomorRuas}</td>
              </tr>
              <tr className="w-full text-sm sm:text-md">
                <td className="w-1/2 font-bold">Nama Ruas</td>
                <td className="w-1/2">: {ruas.namaRuas}</td>
              </tr>
              <tr className="w-full text-sm sm:text-md">
                <td className="w-1/2 font-bold">Kecamatan</td>
                <td className="w-1/2">: {ruas.kecamatan}</td>
              </tr>
              <tr className="w-full text-sm sm:text-md">
                <td className="w-1/2 font-bold">panjang SK</td>
                <td className="w-1/2">: {ruas.panjangSK}</td>
              </tr>
              <tr className="w-full text-sm sm:text-md">
                <td className="w-1/2 font-bold">Lebar</td>
                <td className="w-1/2">: {ruas.lebar}</td>
              </tr>
              <tr className="w-full text-sm sm:text-md">
                <td className="w-1/2 font-bold">Latitude</td>
                <td className="w-1/2">: {ruas.latitude}</td>
              </tr>
              <tr className="w-full text-sm sm:text-md">
                <td className="w-1/2 font-bold">Longitude</td>
                <td className="w-1/2">: {ruas.longitude}</td>
              </tr>
              <tr className="w-full text-sm sm:text-md">
                <td className="w-1/2 font-bold">Keterangan</td>
                <td className="w-1/2">: {ruas.keterangan}</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {ruas?.sta && ruas.sta.length > 0 && (
        <>
          <div className="w-full p-1 mt-6">
            <h6 className="font-bold flex gap-2 items-center text-sm sm:text-md">
              <ChevronDownCircle size={14} /> PANJANG TIPE PERMUKAAN
            </h6>
            <Table className="mt-3">
              <Table.Head className="text-xs sm:text-md">
                  <Table.HeadCell className="font-bold text-black ">
                    ASPAL / PENETRASI / MAKADAM
                  </Table.HeadCell>
                  <Table.HeadCell className="font-bold text-black">
                    PERKERASAN BETON
                  </Table.HeadCell>
                  <Table.HeadCell className="font-bold text-black">
                    TELFORD / KERIKIL
                  </Table.HeadCell>
                  <Table.HeadCell className="font-bold text-black">
                    TANAH / BELUM TEMBUS
                  </Table.HeadCell>
              </Table.Head>
              <Table.Body>
                <Table.Row className="text-xs sm:text-md">
                  <Table.Cell className="text-gray-500">{aspal.current}</Table.Cell>
                  <Table.Cell className="text-gray-500">{beton.current}</Table.Cell>
                  <Table.Cell className="text-gray-500">{kerikil.current}</Table.Cell>
                  <Table.Cell className="text-gray-500">{tanah.current}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>

          <div className="w-full p-1 mt-6">
            <h6 className="font-bold flex items-center gap-2 text-sm sm:text-md">
              <ChevronDownCircle size={14} /> PANJANG TIAP KONDISI
            </h6>
            <Table className="mt-3 max-w-full">
              <Table.Head className="text-xs sm:text-md">
                  <Table.HeadCell
                    className="text-center text-black font-bold"
                    colSpan={2}
                  >
                    BAIK
                  </Table.HeadCell>
                  <Table.HeadCell
                    className="text-center text-black font-bold"
                    colSpan={2}
                  >
                    SEDANG
                  </Table.HeadCell>
                  <Table.HeadCell
                    className="text-center text-black font-bold"
                    colSpan={2}
                  >
                    RUSAK RINGAN
                  </Table.HeadCell>
                  <Table.HeadCell
                    className="text-center text-black font-bold"
                    colSpan={2}
                  >
                    RUSAK BERAT
                  </Table.HeadCell>
              </Table.Head>
              <Table.Head className="text-xs sm:text-md">
                  <Table.HeadCell className="text-black font-bold">m</Table.HeadCell>
                  <Table.HeadCell className="text-black font-bold">%</Table.HeadCell>
                  <Table.HeadCell className="text-black font-bold">m</Table.HeadCell>
                  <Table.HeadCell className="text-black font-bold">%</Table.HeadCell>
                  <Table.HeadCell className="text-black font-bold">m</Table.HeadCell>
                  <Table.HeadCell className="text-black font-bold">%</Table.HeadCell>
                  <Table.HeadCell className="text-black font-bold">m</Table.HeadCell>
                  <Table.HeadCell className="text-black font-bold">%</Table.HeadCell>
              </Table.Head>
              <TableBody>
                <TableRow className="text-xs sm:text-md">
                  <TableCell className="text-gray-500">
                    {baik.current > 0 ? baik.current : "-"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {baik.current > 0 ? ((baik.current / panjangJalan.current) * 100).toFixed(2) : "-"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {sedang.current > 0 ? sedang.current : "-"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {sedang.current > 0
                      ? ((sedang.current / panjangJalan.current) * 100).toFixed(2)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {rusakRingan.current > 0 ? rusakRingan.current : "-"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {rusakRingan.current > 0
                      ? ((rusakRingan.current / panjangJalan.current) * 100).toFixed(2)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {rusakBerat.current > 0 ? rusakBerat.current : "-"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {rusakBerat.current > 0
                      ? ((rusakBerat.current / panjangJalan.current) * 100).toFixed(2)
                      : "-"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="w-full p-1 mt-6">
            <h6 className="font-bold flex items-center gap-2 text-sm sm:text-md">
              <ChevronDownCircle size={14} /> RINCIAN DATA PER STA
            </h6>
            <Table className="mt-3">
              <Table.Head className="text-xs sm:text-md">
                  <Table.HeadCell className="font-bold text-black">
                    NOMOR RUAS
                  </Table.HeadCell>
                  <Table.HeadCell className="font-bold text-black">STA</Table.HeadCell>
                  <Table.HeadCell className="font-bold text-black">
                    TIPE PERMUKAAN
                  </Table.HeadCell>
                  <Table.HeadCell className="font-bold text-black">
                    KONDISI
                  </Table.HeadCell>
                  <Table.HeadCell className="font-bold text-black">DETAIL</Table.HeadCell>
              </Table.Head>
              <TableBody>
                {ruas?.sta &&
                  ruas.sta.map((sta: any) => {
                    sortSta(ruas.sta);
                    return (
                      <TableRow key={sta.id} className="text-xs sm:text-md">
                        <TableCell className="text-gray-500">
                          {sta.nomorRuas}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {sta.sta}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {sta.perkerasan}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {sta.kondisi}
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => setSelectedSta(sta)}>
                            <Eye size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </>
  );
}
