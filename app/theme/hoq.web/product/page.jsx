import Product from "./_prodComponents/page";
import './page.scss';
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

const ProductList = async ({ params, searchParams, initialData, initialFilterData }) => {
  const storeinit = await getStoreInit();
  return (
    <>
      <Product
        storeinit={storeinit}
        searchParams={searchParams}
        params={params}
        initialData={initialData}
        initialFilterData={initialFilterData}
      />
    </>
  );
};

export default ProductList;
