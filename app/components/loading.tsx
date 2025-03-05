import { Circles } from "react-loader-spinner";


export default function Loading() {
    return (
        <div className="flex items-center justify-center h-full">
          <Circles
            height="35"
            width="35"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
    )
}