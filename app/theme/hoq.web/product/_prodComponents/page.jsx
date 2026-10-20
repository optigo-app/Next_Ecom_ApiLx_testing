"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
    Badge,
    Checkbox,
    Pagination,
    PaginationItem,
    Skeleton,
    useMediaQuery,
} from "@mui/material";
import Cookies from "js-cookie";
import { MdOutlineFilterList, MdOutlineFilterListOff } from "react-icons/md";

import EditablePagination from "@/app/components/EditablePagination/EditablePagination";
import { FilterListAPI } from "@/app/(core)/utils/API/FilterAPI/FilterListAPI";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import {
    useListingPage,
    decodeEntities,
    handleMoveToDetail as handleMoveToDetailHelper,
} from "@/app/(core)/hooks/useListingPage";
import { useDynamicImage } from "./useProductHook";
import BreadCrumbs from "./BreadCrums";
import Product_Card from "./Product_Card";

const MobileFilter = dynamic(() => import("./MobileFilter"), { ssr: false });

/* ───────────────────────── helpers ───────────────────────── */

// Reads { Min, Max } for a named filter ("Diamond" | "NetWt" | "Gross")
const getRangeOption = (filterData, name) => {
    const raw = filterData?.find((ele) => ele?.Name === name)?.options;
    if (!raw || raw.length === 0) return null;
    try {
        return JSON.parse(raw)?.[0] ?? null;
    } catch {
        return null;
    }
};

// A slider counts as "applied" when it differs from the filter's default range
const isRangeApplied = (sliderValue, option) => {
    const defaults =
        option && (option.Min != null || option.Max != null)
            ? [option.Min, option.Max]
            : [];
    return JSON.stringify(sliderValue) !== JSON.stringify(defaults);
};

// menuparams are base64 encoded inside the "M=..." entry of `result`
const decodeMenuParam = (result) => {
    const menuEntry = Array.isArray(result)
        ? result.find((ele) => ele?.charAt(0) === "M")
        : null;
    if (!menuEntry) return "";
    try {
        return atob(menuEntry.split("=")[1]);
    } catch {
        return "";
    }
};

const readSession = (key) => {
    try {
        return JSON.parse(sessionStorage.getItem(key));
    } catch {
        return null;
    }
};

/* ───────────────────────── page ───────────────────────── */

const ProductList = ({
    storeinit,
    searchParams,
    params,
    initialData,
    initialFilterData,
}) => {
    const { loginUserDetail, finalId } = useStore();
    const navigate = useNextRouterLikeRR();
    const pathname = usePathname();
    const cookie = Cookies.get("visiterId");
    const maxwidth464px = useMediaQuery("(max-width:464px)");

    const [showMore, setShowMore] = useState(false);
    const [expandedAccordions, setExpandedAccordions] = useState({});
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [csQcCombo, setCsQcCombo] = useState([]);

    const isEditablePage = 1;

    // Master engine hook: owns fetching, filters, paging, sorting, cart/wish
    const {
        productListData,
        isProdLoading,
        afterFilterCount,
        filterData,
        metalTypeCombo,
        diaQcCombo,
        selectedMetalId,
        setSelectedMetalId,
        selectedDiaId,
        setSelectedDiaId,
        selectedCsId,
        setSelectedCsId,
        cartArr,
        wishArr,
        handleCartandWish,
        filterChecked,
        handleCheckboxChange,
        FilterValueWithCheckedOnly,
        handelFilterClearAll,
        sliderValue,
        setSliderValue,
        sliderValue1,
        setSliderValue1,
        sliderValue2,
        setSliderValue2,
        appliedRange1,
        setAppliedRange1,
        appliedRange2,
        setAppliedRange2,
        appliedRange3,
        setAppliedRange3,
        show,
        setShow,
        show1,
        setShow1,
        show2,
        setShow2,
        handleRangeFilterApi,
        result,
        trend,
        setTrend,
        detailsMenu,
        prodListType,
        currPage,
        setCurrPage,
        inputPage,
        setInputPage,
        handelPageChange,
        handleSortby,
        anyFilterApplied,
        afterCountStatus,
    } = useListingPage({
        searchParams,
        params,
        storeinit,
        loginUserDetail,
        finalId,
        initialData,
        initialFilterData,
    });

    const { finalProductListData, StoryLineProductList, getDynamicRollImages, getDynamicImages, getDynamicVideo } =
        useDynamicImage(storeinit, productListData);

    // One-time page setup: CSS variable, scroll to top, colour-stone combo
    useEffect(() => {
        document.documentElement.style.setProperty(
            "--background-color",
            storeinit?.IsPLW == 1 ? "#c4cfdb" : "#c0bbb1",
        );
        window.scroll({ top: 0, behavior: "smooth" });
        setCsQcCombo(readSession("ColorStoneQualityColorCombo") ?? []);
    }, [storeinit?.IsPLW]);

    // MobileFilter calls showClearAllButton() as a function, while the hook may
    // return a boolean. Normalise so both cases work.

    const menuDecode = useMemo(() => decodeMenuParam(result), [result]);
    const isBreadCumShow = menuDecode.length > 0;

    const totalPages = Math.ceil((afterFilterCount || 0) / (storeinit?.PageSize || 1));

    const handleAccordionChange = (index) => (event, isExpanded) => {
        setExpandedAccordions((prev) => ({ ...prev, [index]: isExpanded }));
    };

    // Sort handler accepts either a raw value or a change event
    const handleChangeSort = (valueOrEvent) => {
        const val = valueOrEvent?.target?.value ?? valueOrEvent;
        if (!val) return;
        setTrend(val);
        handleSortby(val);
    };

    const handlePageInputChange = (event) => {
        if (event.key !== "Enter") return;
        let newPage = parseInt(inputPage, 10);
        if (Number.isNaN(newPage) || newPage < 1) newPage = 1;
        if (newPage > totalPages) newPage = totalPages;
        setCurrPage(newPage);
        setInputPage(newPage);
        handelPageChange("", newPage);
    };

    const handleMoveToDetail = (productData, imageUrl) => {
        handleMoveToDetailHelper({
            productData,
            imageUrl,
            storeinit,
            selectedMetalId,
            selectedDiaId,
            selectedCsId,
            detailsMenu,
            outputFilters: FilterValueWithCheckedOnly(),
            navigate,
        });
    };

    // Used by MobileFilter's range "reset" buttons
    const resetRangeFilter = async ({
        filterName,
        setSliderValue: setSlider,
        setTempSliderValue,
        handleRangeFilterApi: applyRange,
        prodListType: listType,
        cookie: ck,
        setIsShowBtn,
        show: isShown,
        setShow: setShown,
        setAppliedRange,
        apiPosition = 0,
    }) => {
        try {
            const res = await FilterListAPI(listType, ck);
            const optionsRaw = res?.find((f) => f?.Name === filterName)?.options;
            if (!optionsRaw) return;

            const { Min = 0, Max = 100 } = JSON.parse(optionsRaw)?.[0] || {};
            const resetValue = [Min, Max];
            setSlider(resetValue);
            setTempSliderValue(resetValue);

            const args = [null, null, null];
            args[apiPosition] = resetValue;
            applyRange(...args);

            setAppliedRange(["", ""]);
            setIsShowBtn?.(false);
            if (isShown) setShown(false);
        } catch (error) {
            console.error(`Failed to reset filter "${filterName}":`, error);
        }
    };

    const showProducts = finalProductListData?.length > 0;
    const showPagination =
        storeinit?.IsProductListPagination == 1 && totalPages > 1;

    // MobileFilter expects a function; the hook exposes a boolean
    const showClearAllFn = () => anyFilterApplied;

    return (
        <div className="hoq_dynamic_Collections">
            <MobileFilter
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                filterData={filterData}
                storeInit={storeinit}
                selectedMetalId={selectedMetalId}
                setSelectedMetalId={setSelectedMetalId}
                metalTypeCombo={metalTypeCombo}
                selectedDiaId={selectedDiaId}
                setSelectedDiaId={setSelectedDiaId}
                diaQcCombo={diaQcCombo}
                selectedCsId={selectedCsId}
                setSelectedCsId={setSelectedCsId}
                csQcCombo={csQcCombo}
                sortBySelect={trend}
                handleSortby={handleChangeSort}
                afterFilterCount={afterFilterCount}
                showClearAllButtonM={showClearAllFn}
                afterCountStatus={afterCountStatus}
                handelFilterClearAll={handelFilterClearAll}
                expandedAccordions={expandedAccordions}
                handleAccordionChange={handleAccordionChange}
                FilterValueWithCheckedOnly={FilterValueWithCheckedOnly}
                handleCheckboxChange={handleCheckboxChange}
                loginUserDetail={loginUserDetail}
                filterChecked={filterChecked}
                sliderValue={sliderValue}
                setSliderValue={setSliderValue}
                show={show}
                setShow={setShow}
                appliedRange1={appliedRange1}
                setAppliedRange1={setAppliedRange1}
                sliderValue1={sliderValue1}
                setSliderValue1={setSliderValue1}
                show1={show1}
                setShow1={setShow1}
                appliedRange2={appliedRange2}
                setAppliedRange2={setAppliedRange2}
                sliderValue2={sliderValue2}
                setSliderValue2={setSliderValue2}
                show2={show2}
                setShow2={setShow2}
                appliedRange3={appliedRange3}
                setAppliedRange3={setAppliedRange3}
                handleRangeFilterApi={handleRangeFilterApi}
                prodListType={prodListType}
                cookie={cookie}
                resetRangeFilter={resetRangeFilter}
                isMobile={true}
            />

            <Banner />

            <div className="collection_info">
                <div className="para">
                    <p>
                        Symmetry is boring, imperfections make you perfect. But you know that
                        because you dare to be different, you dare to be you.
                    </p>
                    {showMore && (
                        <p>
                            This collection symbolises just that. Spanning over the three shapes
                            of diamond cuts, Emerald, Oval and Pear, these pieces bring out the
                            various shades of your personality. Unique, edgy and unconventional
                            yet unfailingly in vogue. A cut above the rest, these stones are
                            intertwined with light weight white gold, that lets the diamonds do
                            the talking.
                        </p>
                    )}
                    <span onClick={() => setShowMore((prev) => !prev)}>
                        {showMore ? "Read Less" : "Read More"}
                    </span>
                </div>
            </div>

            <div className="bread_crumb_section">
                <BreadCrumbs
                    result={result}
                    IsBreadCumShow={isBreadCumShow}
                    menuDecode={menuDecode}
                />
            </div>

            <div className="filter_btn_mobile">
                <FilterButton
                    isDrawerOpen={isDrawerOpen}
                    setIsDrawerOpen={setIsDrawerOpen}
                    filterData={filterData}
                    sliderValue={sliderValue}
                    sliderValue1={sliderValue1}
                    sliderValue2={sliderValue2}
                    FilterValueWithCheckedOnly={FilterValueWithCheckedOnly}
                />
            </div>

            <div className="filter_section">
                <div className="cc_list">
                    {isProdLoading ? (
                        <div className="collections_list">
                            <LoadingSkeleton />
                        </div>
                    ) : showProducts ? (
                        <div className="collections_list">
                            {finalProductListData.map((val, i) => (
                                <Product_Card
                                    key={val?.autocode ?? i}
                                    index={i}
                                    productIndex={i}
                                    img={getDynamicImages(val?.designno)}
                                    videoUrl={getDynamicVideo(val?.designno, 1, val?.VideoExtension)}
                                    rollUpImage={getDynamicRollImages(val?.designno, val?.ImageCount)}
                                    title={val?.TitleLine}
                                    designo={val?.designno}
                                    decodeEntities={decodeEntities}
                                    productData={val}
                                    handleMoveToDetail={handleMoveToDetail}
                                    storeInit={storeinit}
                                    selectedMetalId={selectedMetalId}
                                    handleCartandWish={handleCartandWish}
                                    cartArr={cartArr}
                                    wishArr={wishArr}
                                    CurrencyCode={loginUserDetail?.CurrencyCode}
                                    CurrencyCode2={storeinit?.CurrencyCode}
                                    StoryLineProductList={StoryLineProductList}
                                />
                            ))}
                        </div>
                    ) : (
                        <NoSearchRes pathname={pathname} />
                    )}

                    {showPagination && (
                        <div className="pagination_sec">
                            <div className="pagination-bar">
                                {isEditablePage === 1 ? (
                                    <EditablePagination
                                        currentPage={currPage}
                                        currPage={currPage}
                                        totalItems={afterFilterCount}
                                        itemsPerPage={storeinit.PageSize}
                                        totalPages={totalPages}
                                        onPageChange={handelPageChange}
                                        inputPage={inputPage}
                                        setInputPage={setInputPage}
                                        handlePageInputChange={handlePageInputChange}
                                        maxwidth464px={maxwidth464px}
                                        isShowButton={false}
                                    />
                                ) : (
                                    <Pagination
                                        count={totalPages}
                                        page={currPage}
                                        onChange={handelPageChange}
                                        shape="rounded"
                                        className="pagination-btn"
                                        size={maxwidth464px ? "small" : "large"}
                                        showFirstButton
                                        showLastButton
                                        renderItem={(item) => (
                                            <PaginationItem
                                                {...item}
                                                sx={{ pointerEvents: item.page === currPage ? "none" : "auto" }}
                                            />
                                        )}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;

/* ───────────────────────── sub components ───────────────────────── */

const Banner = () => (
    <div
        className="Banner"
        style={{ backgroundImage: "url(/WebSiteStaticImage/imageBanner/2.png)" }}
    >
        <h1>Imperfectly Perfect.</h1>
    </div>
);

const NoSearchRes = ({ pathname }) => {
    const searchTerm = (() => {
        try {
            return decodeURIComponent(pathname?.split("/")[2] ?? "");
        } catch {
            return pathname?.split("/")[2] ?? "";
        }
    })();

    return (
        <div className="NoProductFound">
            <div>
                <p style={{ textTransform: "capitalize" }}>We couldn't find any matches for</p>
                <p style={{ fontWeight: "bold" }}>{`"${searchTerm}".`}</p>
            </div>
            <br />
            <p className="search_notfound2">Please try another search.</p>
        </div>
    );
};

const FilterButton = ({
    isDrawerOpen,
    setIsDrawerOpen,
    FilterValueWithCheckedOnly = () => ({}),
    sliderValue,
    sliderValue1,
    sliderValue2,
    filterData,
}) => {
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [totalSelected, setTotalSelected] = useState(0);

    useEffect(() => {
        const timeoutId = setTimeout(() => setIsFirstLoad(false), 1000);
        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        if (isFirstLoad || !filterData) return;

        const selectedFilters = FilterValueWithCheckedOnly() || {};

        // Each checked option counts once, comma separated values count individually
        let total = Object.values(selectedFilters).reduce((sum, value) => {
            const str = String(value ?? "");
            return sum + (str.includes(",") ? str.split(",").length : 1);
        }, 0);

        if (isRangeApplied(sliderValue, getRangeOption(filterData, "Diamond"))) total += 1;
        if (isRangeApplied(sliderValue1, getRangeOption(filterData, "NetWt"))) total += 1;
        if (isRangeApplied(sliderValue2, getRangeOption(filterData, "Gross"))) total += 1;

        setTotalSelected(total);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFirstLoad, filterData, sliderValue, sliderValue1, sliderValue2, FilterValueWithCheckedOnly]);

    return (
        <div className="fb_btn">
            <Badge
                sx={{ "& .MuiBadge-badge": { bgcolor: "#C20000" } }}
                badgeContent={totalSelected}
                color="primary"
                className="badge_hoq_filter_Count"
            >
                <Checkbox
                    icon={<MdOutlineFilterList size={32} />}
                    checkedIcon={<MdOutlineFilterListOff size={32} style={{ color: "#666666" }} />}
                    checked={isDrawerOpen}
                    onChange={(e) => setIsDrawerOpen(e.target.checked)}
                />
            </Badge>
        </div>
    );
};

const LoadingSkeleton = () =>
    Array.from({ length: 8 }).map((_, i) => (
        <div className="C_Card" key={`skeleton-${i}`}>
            <div className="image">
                <Skeleton
                    variant="rectangular"
                    className="hoq_CartSkelton"
                    sx={{
                        width: "100%",
                        display: "block",
                        height: {
                            xs: "200px !important",
                            sm: "300px !important",
                            md: "500px !important",
                        },
                    }}
                />
            </div>
            <div
                className="det"
                style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
                {[1, 2, 3].map((n) => (
                    <Skeleton
                        key={`skeleton-desc-${i}-${n}`}
                        className="hoq_CartSkelton"
                        width="100%"
                        height="22px"
                    />
                ))}
            </div>
        </div>
    ));