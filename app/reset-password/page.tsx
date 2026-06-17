"use client";

import { Suspense } from "react";
import Loading from "../components/loading";
import ResetPage from "./resetPage";


export default function ResetPassword() {

    return <Suspense fallback={<Loading />}>
        <ResetPage />
      </Suspense>
}