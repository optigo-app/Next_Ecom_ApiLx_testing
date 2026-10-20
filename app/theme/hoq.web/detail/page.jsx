
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import ProductDetail from "./_detComponents/page";

const ProductList = async ({ params, searchParams }) => {
    const storeinit = await getStoreInit();

    return (
        <>
            <ErrorBoundary>
                <ProductDetail params={params} searchParams={searchParams} storeInit={storeinit} />
            </ErrorBoundary>
        </>
    );
};

export default ProductList;

