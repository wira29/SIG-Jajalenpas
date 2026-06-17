/* eslint-disable @next/next/no-img-element */
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader
} from "@/components/ui/dialog"

export default function ImageDialog({children, image, data, desc}: {children: React.ReactNode, image: string, data: any|null, desc: string}) {
    return (
        <Dialog >
            {children}
            <DialogContent className="z-[500] min-w-4xl max-w-4xl p-0">
                <DialogHeader>
                    {/* <DialogTitle>Are you absolutely sure?</DialogTitle> */}
                    <DialogDescription className="flex flex-col items-center relative">
                        <img src={image} alt="image" style={{ maxWidth: "90%", height: "auto", transformOrigin: "0 0" }}/>
                        <div className="absolute flex-col items-start bottom-0 w-full bg-black opacity-55 p-3">
                            <p className="text-white">{desc ?? ""}</p>
                            <p className="text-white">{data ? data.latitude ?? "" + " " + data.longitude ?? "" : ""}</p>
                            <p className="text-white">{data ? data.namaRuas ?? "" : ""}</p>
                            <p className="text-white">{(data) ? "Kecamatan " + data.kecamatan : ""}</p>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}