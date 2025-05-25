import useSelectedRuasStore from "@/app/stores/selected_ruas_store";
import { useToast } from "@/hooks/use-toast";
import { FileInput, Label, Textarea } from "flowbite-react";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
    keluhan: z.string().min(10),
    photo: z.custom<File>((file) => {
        if (!(file instanceof File)) return false;

        const name = file.name.toLowerCase();
        const extension = name.split('.').pop();
        return extension && ["jpg", "jpeg", "png"].includes(extension);
    }, {
        message: "File harus berupa JPG, JPEG, atau PNG",
      }),
  });

  type FormPengaduanProps = {
    onDoneAduan: () => void;
  }

export default function FormPengaduan({ onDoneAduan }: FormPengaduanProps) {
    const [errors, setErrors] = useState<{ keluhan?: string; photo?: string }>({});
    const { selected: selectedRuas } = useSelectedRuasStore();
    const {toast} = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
    
        const keluhan = formData.get("keluhan");
        const photo = formData.get("photo");
    
        const result = schema.safeParse({ keluhan, photo });
    
        if (!result.success) {
          const formatted = result.error.format();
          setErrors({
            keluhan: formatted.keluhan?._errors[0],
            photo: formatted.photo?._errors[0],
          });
        } else {
          setErrors({});

          const data = new FormData(e.currentTarget);
          data.append("ruas_id", selectedRuas?.id.toString() ?? "");

          const response = await fetch(`/api/aduan`, {
            method: "POST",
            body: data,
          });

          if (!response.ok) {
            return null;
          }

          toast({
            title: "Berhasil",
            description: "Berhasil mengadukan kondisi jalan",
          })
          onDoneAduan();
        }
      };
    

    return (
        <form action="" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="flex flex-col">
                <div className="w-full">
                    <div className="mb-2 block">
                        <Label htmlFor="comment">Keluhan</Label>
                    </div>
                    <Textarea id="comment" name="keluhan" placeholder="Tulis keluhan anda disini..." rows={4} />
                    {errors.keluhan && <p className="text-red-600 text-sm">{errors.keluhan}</p>}
                </div>
                <div className="mt-3">
                    <Label className="mb-2 block" htmlFor="file-upload">
                        Foto
                    </Label>
                    <FileInput name="photo" id="file-upload" />
                    {errors.photo && <p className="text-red-600 text-sm">{errors.photo}</p>}
                </div>

                <div className="flex justify-stretch pt-4">
                    <button
                    type="submit"
                    className={
                        "bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-all duration-300 w-full text-xs sm:text-md"
                    }
                    >
                    Adukan
                    </button>
                </div>
            </div>
        </form>
    )
}