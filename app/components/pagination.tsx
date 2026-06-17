// "use client";

// import { usePathname } from "next/navigation";

// type Props = {
//   page: number,
//   totalPages: number
// };

// export default function Pagination({ page, totalPages }: Props) {
//   const pathname = usePathname();

//   const handlePageChange = (newPage: number) => {
//     const params = new URLSearchParams(searchParams.toString());
//     params.set("page", newPage.toString());
//     router.push(`/?${params.toString()}`);
//   };

//   return (
//     <FlowbitePagination
//         currentPage={page}
//         totalPages={totalPages}
//         onPageChange={handlePageChange}
//         showIcons
//       />
//   );
// }
