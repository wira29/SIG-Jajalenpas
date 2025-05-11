import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useMemo } from "react";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type PieKondisiJalanProps = {
  road: any;
};

export default function PieKondisiJalan({ road }: PieKondisiJalanProps) {
  const { ruas } = road;

  const chartId = "pie-kondisi-jalan";

  const data = useMemo(() => {
    // from features, count the number of each type based on first properties data with key Tipe_Ker_1
    const result: Record<string, number> = {
      baik: 0, // Kon_Baik_1
      sedang: 0, // Kon_Sdg_1
      rusakRingan: 0, // Kon_Rgn_1
      rusakBerat: 0, // Kon_Rusa_1
    };

    ruas.forEach((r: any) => {
      const sta = r.sta;

      sta.forEach((data: any) => {
        const condition = data.kondisi;
        switch (condition) {
          case "Baik":
            result.baik += 1;
            break;
          case "Sedang":
            result.sedang += 1;
            break;
          case "Rusak Ringan":
            result.rusakRingan += 1;
            break;
          case "Rusak Berat":
            result.rusakBerat += 1;
            break;
        }
      });
    });

    return result;
  }, [ruas]);

  function downloadChart() {
    const canvas = document.getElementById(chartId) as HTMLCanvasElement;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "kondisi-jalan.png";
    link.click();
  }

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-xl font-semibold text-center">Kondisi Jalan</h1>

      <hr className="my-4" />

      <Pie
        id={chartId}
        data={{
          labels: Object.keys(data),
          datasets: [
            {
              label: "",
              backgroundColor: ["#7CB342", "#FFD54F", "#FFB74D", "#E57373"],
              borderWidth: 2,
              data: Object.values(data),
            },
          ],
        }}
        height={100}
        width={100}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />

      <div className="flex justify-center mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={downloadChart}
        >
          Kondisi Jalan (PNG)
        </button>
      </div>
    </div>
  );
}
