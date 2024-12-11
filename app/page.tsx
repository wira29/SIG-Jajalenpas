"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Map } from "./components/map";
import useJalanStore from "./stores/jalan_store";

export default function Home() {

  const { data: session } = useSession();
  console.log(session);

  const { fetchData } = useJalanStore();
  useEffect(() => {
    fetchData();
  }, []);


  return (
    <Map />
  );
}
