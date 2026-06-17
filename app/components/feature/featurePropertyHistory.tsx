import useFeaturePropertiesStore from "@/app/stores/feature_properties_store";
import { Dialog, Transition } from "@headlessui/react";
import { properties } from "@prisma/client";
import moment from "moment";
import "moment/locale/id";
import { Fragment, useEffect, useState } from "react";
import { IoEye } from "react-icons/io5";
import { Oval } from "react-loader-spinner";
import { FeatureWithProperties } from "../../types";
import FeaturePropertyDetail from "./featurePropertyDetail";

moment.locale("id");

type FeaturePropertiesDetailHistoryProp = {
  feature: FeatureWithProperties;
};
export default function FeaturePropertiesHistory({
  feature,
}: FeaturePropertiesDetailHistoryProp) {
  // const { properties } = feature ?? {};

  const { propertiesOf, isLoadingPropertiesOf, fetchProperties } =
    useFeaturePropertiesStore();

  useEffect(() => {
    fetchProperties(Number(feature.id));
  }, [feature.id, fetchProperties]);

  const properties = propertiesOf(Number(feature.id));
  const isLoading = isLoadingPropertiesOf(Number(feature.id));

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Oval
            height="35"
            width="35"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <ul className="list-none">
          {properties?.map((property: properties, i: number) => (
            <PropertyTile key={i} property={property} />
          ))}
        </ul>
      )}
    </div>
  );
}

function PropertyTile({ property }: { property: any }) {
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <li className="flex justify-between text-sm p-4 my-2 rounded bg-slate-100">
      {moment(property.createdAt).format("LLL")}
      <button onClick={openModal}>
        <IoEye />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[1000]" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {moment(property.createdAt).format("LLL")}
                  </Dialog.Title>
                  <div className="mt-2 pt-3 pb-2">
                    <FeaturePropertyDetail property={property} />
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Tutup
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </li>
  );
}
