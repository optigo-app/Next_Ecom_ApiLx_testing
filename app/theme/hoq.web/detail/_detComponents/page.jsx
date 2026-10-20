"use client";

import "../page.scss";
import { Product } from "@/app/components/(static)/Constants/DynamicValue";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SliderModule from "react-slick";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Zoom, Navigation, Pagination } from "swiper/modules";
import { IoMdArrowBack } from "react-icons/io";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { FaWhatsapp } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { IoIosPlayCircle, IoMdClose } from "react-icons/io";
import { CiDeliveryTruck } from "react-icons/ci";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Skeleton, Typography } from "@mui/material";
import { FaHeart } from "react-icons/fa";
import RelatedProduct from "./RelatedProduct/RelatedProduct";
import { responsiveConfig } from "@/app/components/Config/ProductSliderConfig";
import Stockitems from "./InstockProduct/Stockitems";
import DesignSet from "./DesignSet/DesignSet";
import CustomizerDrawer from "./Customiziation";
import { formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useProductDetail } from "@/app/(core)/hooks/useProductDetail";

// react-slick's CJS build exports { __esModule, default: Slider }; production
// bundles can pass the namespace object itself — unwrap it for <Slider>.
const Slider = SliderModule?.default ?? SliderModule;

const noimage = "/image-not-found.jpg";
const imageNotFound = "/image-not-found.jpg";

const ProductDetail = ({ params, searchParams, storeInit: storeinit }) => {
    // Same shared detail flow as beluxjewel — fetching, media, customization,
    // cart/wish and article state all live in useProductDetail.
    const pd = useProductDetail({ storeinit, searchParams, params });
    const {
        decodeUrl,
        storeInit,
        loginData,
        sizeData,
        setSizeData,
        singleProd,
        singleProd1,
        diaList: hookDiaList,
        csList: hookCsList,
        SizeCombo,
        metalTypeCombo,
        metalType,
        setMetalType,
        metalColor,
        setMetalColor,
        selectDiaQc,
        setSelectDiaQc,
        diaQcCombo,
        csQcCombo,
        selectCsQC,
        setSelectCsQC,
        metalColorCombo,
        isPriceloading,
        filteredVideos: hookFilteredVideos,
        addToCardFlag,
        wishListFlag,
        isCartBtnLoading,
        isWishBtnLoading,
        isDataFound,
        pdLoadImage,
        derivedIsMediaReady,
        derivedMediaBuildDone,
        getImagesArr,
        rd1Data,
        rd2Data,
        customizationDetail,
        rd1CartMap,
        isImageDialogOpen,
        SelectedImageIndex,
        loadingdata,
        SimilarBrandArr,
        recentlyViewedArr,
        stockItemArr,
        cartArr,
        productSchema,
        defaultArticleId,
        handleCart,
        handleWishList: hookHandleWishList,
        handleCustomChange,
        handleCustomizerConfirm: hookHandleCustomizerConfirm,
        handleMetalWiseColorImg,
        handleMetalWiseColorImgWithFlag,
        HandleImageDialogOpen,
        HandleImageDialogClose,
        handleMoveToDetail,
        handleCartandWish,
        SizeSorting,
        storeCartArr,
        storeWishArr,
        pdThumbImg,
        selectedThumbImg,
        setSelectedThumbImg,
        thumbImgIndex,
        setThumbImgIndex,
        designSetList,
        decodeEntities,
        cookie,
        Navigate,
    } = pd;

    const navigate = Navigate;

    // Name adapters — keep HOQ's JSX identifiers mapped to the hook's names
    const selectMtType = metalType;
    const selectMtColor = metalColor;
    const selectCsQc = selectCsQC;
    const setSelectCsQc = setSelectCsQC;
    const addToCartFlag = addToCardFlag;
    const PdImageLoader = pdLoadImage;
    const loginInfo = loginData;

    // The hook's handleWishList expects an event (reads e.target.checked);
    // HOQ's button passes a boolean — wrap it like beluxjewel's fakeEvent.
    const handleWishList = (checked) => hookHandleWishList({ target: { checked } }, singleProd);

    // Media adapters — the slider expects { src, type, extension } items whose
    // src is a Design_Thumb URL it splits to rebuild the full image URL.
    const PdImageArr =
        pdThumbImg?.length > 0
            ? pdThumbImg.map((img) => ({
                  src: img?.thumbImageUrl ?? img?.src,
                  type: "img",
                  extension: img?.originalImageExtension ?? img?.extension,
                  originalImageExtension: img?.originalImageExtension ?? img?.extension,
              }))
            : [];
    const filteredVideos = (hookFilteredVideos || []).map((v) => (typeof v === "string" ? { src: v, type: "video" } : v));

    // Active article — mirrors beluxjewel: customizationDetail (post-confirm)
    // takes priority, else the rd1 row matching defaultArticleId. Drives the
    // price, net weight and cost-breakup bindings below.
    const defaultArticle = rd1Data?.find((r) => r.ArticleId == defaultArticleId) ?? rd1Data?.[0] ?? null;
    const activeArticle = customizationDetail || defaultArticle;
    const baseProd = singleProd1 && Object.keys(singleProd1).length > 0 ? singleProd1 : singleProd;
    const effProd = activeArticle
        ? {
              ...baseProd,
              IsMrpBase: activeArticle?.IsMrpBase ?? baseProd?.IsMrpBase,
              UnitCostWithMarkUp: activeArticle?.UnitCostWithmarkup ?? activeArticle?.TotalUnitCost ?? baseProd?.UnitCostWithMarkUp,
              Nwt: activeArticle?.NetWeight ?? baseProd?.Nwt,
              Metal_Cost: activeArticle?.TotalMetalCost ?? baseProd?.Metal_Cost,
              Diamond_Cost: activeArticle?.TotalDiamondCost ?? baseProd?.Diamond_Cost,
              ColorStone_Cost: activeArticle?.TotalColorStoneCost ?? baseProd?.ColorStone_Cost,
              Misc_Cost: activeArticle?.TotalMiscCost ?? baseProd?.Misc_Cost,
              Labour_Cost: activeArticle?.TotalMakingCost ?? baseProd?.Labour_Cost,
              Other_Cost:
                  (activeArticle?.TotalOtherCost ?? 0) +
                  (activeArticle?.TotalSettingCost ?? 0) +
                  (activeArticle?.TotalDiamondhandlingCost ?? 0) +
                  (activeArticle?.TotalCSSettingCost ?? 0) +
                  (activeArticle?.TotalDiaSettingCost ?? 0),
              Size_MarkUp: 0,
              DesignMarkUpAmount: 0,
              ColorStone_SettingCost: 0,
              Diamond_SettingCost: 0,
              Misc_SettingCost: 0,
          }
        : baseProd;

    // Confirm from the customizer drawer — hook updates customizationDetail,
    // metalType, sizeData; we additionally sync the inline DIAMOND select so the
    // visible customization state matches the confirmed combination.
    const handleCustomizerConfirm = async (articleId, size, diaQcKey, metalCombo) => {
        await hookHandleCustomizerConfirm(articleId, size, diaQcKey, metalCombo);
        if (diaQcKey) {
            const [dq, dc] = diaQcKey.split("-");
            const match = diaQcCombo?.find(
                (e) => e?.Quality?.toUpperCase() === dq?.toUpperCase() && e?.color?.toUpperCase() === dc?.toUpperCase(),
            );
            if (match) setSelectDiaQc(`${match.Quality},${match.color}`);
        }
    };

    // rd2 material rows -> the ERP rd3/rd4 field shape the accordions render
    // (D=StoneType, F=Shape, H=Quality, J=Color, M=Pcs, N=Weight).
    const activeArticleId = customizationDetail?.ArticleId ?? defaultArticleId;
    const activeMaterials = (rd2Data || []).filter((s) => activeArticleId == null || s.ArticleId == null || s.ArticleId == activeArticleId);
    const mapMat = (s) => {
        const stoneName = s.StoneTypeName || s.MaterialTypeName || "";
        return {
            D: /misc/i.test(stoneName) ? "MISC" : stoneName,
            F: s.Shape,
            H: s.Quality,
            J: s.Color,
            M: s.Pieces ?? 0,
            N: s.Weight ?? 0,
        };
    };
    const diaList = hookDiaList?.length ? hookDiaList : activeMaterials.filter((s) => s.StoneTypeid === 1).map(mapMat);
    const csList = hookCsList?.length ? hookCsList : activeMaterials.filter((s) => s.StoneTypeid !== 1 && s.StoneTypeid !== 4 && s.StoneTypeid !== 5).map(mapMat);

    // Local UI-only state (slider, accordions, magnifier)
    const [currentSlide, setCurrentSlide] = useState(0);
    const [ShowMangifier, setShowMangifier] = useState(false);
    const [ShowMdesc, setShowMdesc] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [isImageload, setIsImageLoad] = useState(true);
    const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
    const sliderRef = useRef(null);
    const imageLoaded = !derivedIsMediaReady;

    const settings = {
        dots: false,
        arrows: false,
        infinite: false,
        loop: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        // initialSlide: 2,
        autoplaySpeed: 2000,
        beforeChange: (current, next) => setCurrentSlide(next),
        afterChange: (current) => setCurrentSlide(current),
        responsive: responsiveConfig,
    };

    const handleThumbnailClick = (index) => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(index);
        }
    };

    const handleChange = (index) => (event, isExpanded) => {
        setExpandedIndex(isExpanded ? index : null);
    };

    if (isDataFound) {
        return <NotFoundProduct navigate={navigate} />;
    }

    return (
        <>
            <title>{formatTitleLine(singleProd?.TitleLine) ? `${singleProd.TitleLine} - ${singleProd?.designno ?? ""}` : singleProd?.TitleLine || singleProd?.designno ? `${singleProd?.designno ?? ""}` : "loading..."}</title>
            <div className="hoq_main_Product" style={{ marginBottom: "25px" }}>
                {ShowMangifier && <MagnifierSlider product={Product} close={() => setShowMangifier(!ShowMangifier)} list={PdImageArr} currentIndex={currentSlide} />}
                <main>
                    <div className="images_slider">
                        {/* {PdImageLoader || loadingdata ? ( */}
                        {imageLoaded ? (
                            <>
                                <div className="slider">
                                    {Array.from({ length: 3 })?.map((val, i) => {
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => handleThumbnailClick(i)}
                                                className="box"
                                                style={{
                                                    backgroundColor: "transparent",
                                                    marginTop: "-5px",
                                                }}
                                            >
                                                <Skeleton
                                                    width={100}
                                                    height={250}
                                                    sx={{
                                                        backgroundColor: "#f0ededb4 !important;",
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="main_image">
                                    <Skeleton
                                        variant="rectangular"
                                        width="100%"
                                        height={650}
                                        sx={{
                                            backgroundColor: "#f0ededb4 !important",
                                            borderRadius: "4px"
                                        }}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="slider">
                                    {[...PdImageArr, ...filteredVideos]?.map((val, i) => {
                                        const isImage = val?.type === "img";
                                        const firstHalf = isImage ? val?.src?.split("/Design_Thumb")[0] : "";
                                        const secondHalf = isImage ? val?.src?.split("/Design_Thumb")[1]?.split(".")[0] : "";

                                        return (
                                            <div
                                                key={i}
                                                className={`box ${i === currentSlide ? "active" : ""}`}
                                                onClick={() => {
                                                    handleThumbnailClick(i);
                                                    if (isImage) {
                                                        setSelectedThumbImg({
                                                            link: {
                                                                imageUrl: `${firstHalf}${secondHalf}.${val?.originalImageExtension}`,
                                                                extension: val?.originalImageExtension,
                                                            },
                                                            type: "img",
                                                        });
                                                    } else {
                                                        setSelectedThumbImg({
                                                            link: {
                                                                imageUrl: val?.src,
                                                                extension: "mp4",
                                                            },
                                                            type: "video",
                                                        });
                                                    }
                                                    setThumbImgIndex(i);
                                                }}
                                            >
                                                {isImage ? (
                                                    <img
                                                        src={val?.src}
                                                        alt=""
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = noimage;
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="video_box" style={{ position: "relative" }}>
                                                        <video
                                                            key={val?.src}
                                                            src={val?.src}
                                                            className="hoq_prod_thumb_img"
                                                            autoPlay
                                                            muted
                                                            loop
                                                            playsInline
                                                            preload="auto"
                                                        />
                                                        <IoIosPlayCircle className="play_io_icon" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="main_image" onClick={() => setShowMangifier(!ShowMangifier)}>
                                    {[...PdImageArr, ...filteredVideos]?.length > 1 ? (
                                        <>
                                            <Slider {...settings} ref={sliderRef} lazyLoad="progressive">
                                                {[...PdImageArr, ...filteredVideos]?.length > 0 ? (
                                                    [...PdImageArr, ...filteredVideos]?.map((val, i) => {
                                                        const firstHalf = val?.src?.split("/Design_Thumb")[0];
                                                        const secondHalf = val?.src?.split("/Design_Thumb")[1]?.split(".")[0];
                                                        return (
                                                            <div className="slider_card">
                                                                <div className="image">
                                                                    {val?.type === "img" ? (
                                                                        <img
                                                                            loading="lazy"
                                                                            src={`${firstHalf}${secondHalf}.${val?.extension}`}
                                                                            alt={""}
                                                                            onLoad={() => setIsImageLoad(false)}
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                // e.target.src = noimage;
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            style={{
                                                                                height: "80vh",
                                                                            }}
                                                                        >
                                                                            <video
                                                                                key={val?.src}
                                                                                loop={true}
                                                                                autoPlay={true}
                                                                                muted
                                                                                playsInline
                                                                                preload="auto"
                                                                                style={{
                                                                                    width: "100%",
                                                                                    height: "100%",
                                                                                    objectFit: "scale-down",
                                                                                }}
                                                                            >
                                                                                <source src={val?.src} type="video/mp4" />
                                                                            </video>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="main_image">
                                                        <img
                                                            src={noimage}
                                                            alt={""}
                                                            style={{
                                                                width: "100%",
                                                                height: "90%",
                                                                objectFit: "contain",
                                                                border: "1px solid #312f2f21",
                                                                marginTop: "45px",
                                                            }}
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = noimage;
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </Slider>
                                        </>
                                    ) : PdImageArr?.length === 1 ? (
                                        <div className="slider_card">
                                            <div className="image">
                                                {/* <img
                                                    src={PdImageArr[0]?.src || noimage}
                                                    alt=""
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = noimage;
                                                    }}
                                                    loading="lazy"
                                                /> */}
                                                {(() => {
                                                    const val = PdImageArr[0];

                                                    // normalize src in case it is an object (Next image import)
                                                    const srcStr = typeof val?.src === "string" ? val.src : typeof val?.src?.src === "string" ? val.src.src : "";

                                                    const firstHalf = srcStr ? srcStr.split("/Design_Thumb")[0] : "";
                                                    const secondHalf = srcStr && srcStr.includes("/Design_Thumb") ? srcStr.split("/Design_Thumb")[1]?.split(".")[0] : "";

                                                    const finalSrc = val?.type === "img" && firstHalf && secondHalf ? `${firstHalf}${secondHalf}.${val?.extension}` : srcStr || noimage;

                                                    return (
                                                        <img
                                                            src={finalSrc}
                                                            alt=""
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = noimage;
                                                            }}
                                                        />
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="slider_card">
                                            <div className="image">
                                                <img
                                                    src={noimage}
                                                    alt=""
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = noimage;
                                                    }}
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="product_details">
                        <div className="product_info">
                            {formatTitleLine(singleProd?.TitleLine) && singleProd?.TitleLine}
                            <span className="hoq_single_prod_designno" style={{ marginTop: "5px", fontSize: "1.1rem" }}>
                                {singleProd?.designno}
                            </span>
                            {storeInit?.IsPriceShow === 1 && (
                                <div className="pricecharge">
                                    {
                                        <div className="hoq_price_portion">
                                            {isPriceloading ? (
                                                ""
                                            ) : (
                                                <span
                                                    style={{ paddingRight: "0.4rem" }}
                                                    className="hoq_currencyFont"
                                                    dangerouslySetInnerHTML={{
                                                        __html: decodeEntities(loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode),
                                                    }}
                                                />
                                            )}
                                            {isPriceloading ? <Skeleton variant="rounded" width={140} height={30} /> : <>{effProd?.UnitCostWithMarkUp?.toLocaleString("en-IN")}</>}
                                        </div>
                                    }
                                </div>
                            )}
                            {singleProd?.description && (
                                <div className="desc-p-details">
                                    <p className={`${!ShowMdesc ? "showless" : "showmore"}`}>{singleProd?.description}</p>
                                    <div className="btn_sec_pd">
                                        <button onClick={() => setShowMdesc(!ShowMdesc)}>{ShowMdesc ? "...Show Less" : "...Show More"}</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="product_main_Details">
                            {storeInit?.IsProductWebCustomization == 1 && metalTypeCombo?.length > 0 && storeInit?.IsMetalCustomization === 1 && (
                                <div className="hoq_single_prod_customize_main">
                                    <div className="first_row_hoq_new">
                                        {
                                            <div className="hoq_single_prod_customize">
                                                <label className="hoqmenuItemTimeEleveDeatil">METAL TYPE:</label>
                                                {singleProd?.IsMrpBase == 1 ? (
                                                    <span
                                                        className="hoq_menuitemSelectoreMain"
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            marginLeft: "4px",
                                                        }}
                                                    >
                                                        {metalTypeCombo?.filter((ele) => ele?.Metalid == singleProd?.MetalPurityid)[0]?.metaltype}
                                                    </span>
                                                ) : (
                                                    <select
                                                        className="hoq_menuitemSelectoreMain"
                                                        value={selectMtType}
                                                        onChange={(e) => handleCustomChange(e, "mt")}
                                                        // onChange={(e) => setSelectMtType(e.target.value)}
                                                        style={{ fontSize: "1rem" }}
                                                    >
                                                        {metalTypeCombo.map((ele) => (
                                                            <option key={ele?.Metalid} value={ele?.metaltype}>
                                                                {ele?.metaltype}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        }
                                        {metalColorCombo?.length > 0 && storeInit?.IsMetalTypeWithColor === 1 && (
                                            <div className="hoq_single_prod_customize">
                                                <label className="hoqmenuItemTimeEleveDeatil" htmlFor="metal_c_hoq">
                                                    METAL COLOR:
                                                </label>
                                                {singleProd?.IsMrpBase == 1 ? (
                                                    <span
                                                        className="hoq_menuitemSelectoreMain"
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            marginLeft: "4px",
                                                        }}
                                                    >
                                                        {metalColorCombo?.filter((ele) => ele?.id == singleProd?.MetalColorid)[0]?.metalcolorname}
                                                    </span>
                                                ) : (
                                                    <select className="hoq_menuitemSelectoreMain" id="metal_c_hoq" value={selectMtColor} onChange={(e) => handleMetalWiseColorImg(e)} style={{ fontSize: "1rem" }}>
                                                        {metalColorCombo?.map((ele) => (
                                                            <option key={ele?.id} value={ele?.metalcolorname}>
                                                                {ele?.metalcolorname}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="first_row_hoq_new">
                                        {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length ? (
                                            <div className="hoq_single_prod_customize">
                                                <label className="hoqmenuItemTimeEleveDeatil">DIAMOND :</label>
                                                {
                                                    <select
                                                        className="hoq_menuitemSelectoreMain"
                                                        value={selectDiaQc}
                                                        // onChange={(e) => setSelectDiaQc(e.target.value)}
                                                        onChange={(e) => handleCustomChange(e, "dia")}
                                                        style={{ fontSize: "1rem" }}
                                                    >
                                                        {diaQcCombo.map((ele) => (
                                                            <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>{`${ele?.Quality},${ele?.color}`}</option>
                                                        ))}
                                                    </select>
                                                }
                                            </div>
                                        ) : null}
                                        {storeInit?.IsCsCustomization === 1 && selectCsQc?.length > 0 && csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 ? (
                                            <div className="hoq_single_prod_customize">
                                                <label className="hoqmenuItemTimeEleveDeatil">COLOR STONE :</label>
                                                <select
                                                    className="hoq_menuitemSelectoreMain"
                                                    value={selectCsQc}
                                                    // onChange={(e) => setSelectCsQc(e.target.value)}
                                                    onChange={(e) => handleCustomChange(e, "cs")}
                                                    style={{ fontSize: "1rem" }}
                                                >
                                                    {csQcCombo.map((ele) => (
                                                        <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>{`${ele?.Quality},${ele?.color}`}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            SizeSorting(SizeCombo?.rd)?.length > 0 &&
                                            singleProd?.DefaultSize !== "" && (
                                                <div
                                                    className="hoq_single_prod_customize"
                                                    style={{
                                                        width: "50%",
                                                    }}
                                                >
                                                    <label className="hoqmenuItemTimeEleveDeatil">SIZE:</label>
                                                    {singleProd?.IsMrpBase == 1 ? (
                                                        <span
                                                            className="hoq_menuitemSelectoreMain"
                                                            style={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                marginLeft: "4px",
                                                            }}
                                                        >
                                                            {singleProd?.DefaultSize}
                                                        </span>
                                                    ) : (
                                                        <select
                                                            className="hoq_menuitemSelectoreMain"
                                                            value={sizeData}
                                                            // onChange={(e) => {
                                                            //   setSizeData(e.target.value);
                                                            // }}
                                                            onChange={(e) => handleCustomChange(e, "sz")}
                                                            style={{ fontSize: "1rem" }}
                                                        >
                                                            {SizeSorting(SizeCombo?.rd)?.map((ele) => (
                                                                <option
                                                                    value={ele?.sizename}
                                                                    // selected={
                                                                    //   singleProd && singleProd.DefaultSize === ele.sizename
                                                                    // }
                                                                    key={ele?.id}
                                                                >
                                                                    {ele?.sizename}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                    {storeInit?.IsCsCustomization === 1 && selectCsQc?.length > 0 && csList?.filter((ele) => ele?.D !== "MISC")?.length > 0
                                        ? SizeSorting(SizeCombo?.rd)?.length > 0 &&
                                        singleProd?.DefaultSize !== "" && (
                                            <div
                                                className="hoq_single_prod_customize"
                                                style={{
                                                    width: "50%",
                                                }}
                                            >
                                                <label className="hoqmenuItemTimeEleveDeatil">SIZE:</label>
                                                {singleProd?.IsMrpBase == 1 ? (
                                                    <span
                                                        className="hoq_menuitemSelectoreMain"
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            marginLeft: "4px",
                                                        }}
                                                    >
                                                        {singleProd?.DefaultSize}
                                                    </span>
                                                ) : (
                                                    <select
                                                        className="hoq_menuitemSelectoreMain"
                                                        value={sizeData}
                                                        // onChange={(e) => {
                                                        //   setSizeData(e.target.value);
                                                        // }}
                                                        onChange={(e) => handleCustomChange(e, "sz")}
                                                        style={{ fontSize: "1rem" }}
                                                    >
                                                        {SizeSorting(SizeCombo?.rd)?.map((ele) => (
                                                            <option
                                                                value={ele?.sizename}
                                                                // selected={
                                                                //   singleProd && singleProd.DefaultSize === ele.sizename
                                                                // }
                                                                key={ele?.id}
                                                            >
                                                                {ele?.sizename}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        )
                                        : null}
                                </div>
                            )}

                            <Accordion
                                className="accordian"
                                sx={{
                                    border: "none",
                                    boxShadow: "none",
                                    "&:before": {
                                        display: "none",
                                    },
                                }}
                                key={1}
                                expanded={expandedIndex === 1}
                                onChange={handleChange(1)}
                            >
                                <AccordionSummary
                                    expandIcon={expandedIndex === 1 ? <RemoveIcon style={{ fontSize: "1.2rem", color: "black" }} /> : <AddIcon style={{ fontSize: "1.2rem", color: "black" }} />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                    className="summary"
                                    sx={{
                                        padding: "0 5px",
                                    }}
                                >
                                    <Typography
                                        className="title"
                                        sx={{
                                            textAlign: "center",
                                            width: "100%",
                                        }}
                                        style={{
                                            fontSize: "0.9rem",
                                            textTransform: "uppercase",
                                            marginLeft: "3.4px",
                                        }}
                                    >
                                        MATERIAL DETAILS
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div className="smr_prod_summury_info" style={{ border: "none" }}>
                                        <div className="smr_prod_summury_info_inner" style={{ display: "flex", flexDirection: "column" }}>
                                            <span className="smr_single_prod_designno">{singleProd?.designno}</span>
                                            <span className="smr_prod_short_key">
                                                Metal Purity : <span className="smr_prod_short_val">{activeArticle?.MetalType ?? selectMtType}</span>
                                            </span>
                                            <span className="smr_prod_short_key">
                                                Metal Color : <span className="smr_prod_short_val">{activeArticle?.MetalColor ?? selectMtColor}</span>
                                            </span>
                                            {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length ? (
                                                <span className="smr_prod_short_key">
                                                    Diamond Quality Color : <span className="smr_prod_short_val">{customizationDetail?.DiaQCLabel ?? selectDiaQc}</span>
                                                </span>
                                            ) : null}
                                            {storeInit?.IsMetalWeight === 1 && (
                                                <span className="smr_prod_short_key">
                                                    Net Wt :<span className="smr_prod_short_val">{effProd?.Nwt?.toFixed?.(3) ?? effProd?.Nwt}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </AccordionDetails>
                            </Accordion>

                            {(diaList?.length > 0 || csList?.filter((ele) => ele?.D !== "MISC")?.length > 0) && (
                                <Accordion
                                    className="accordian"
                                    sx={{
                                        border: "none", // Remove default border
                                        boxShadow: "none", // Remove default shadow
                                        "&:before": {
                                            // Remove the border-top pseudo-element
                                            display: "none",
                                        },
                                    }}
                                    key={2}
                                    expanded={expandedIndex === 2}
                                    onChange={handleChange(2)}
                                >
                                    <AccordionSummary
                                        expandIcon={expandedIndex === 2 ? <RemoveIcon style={{ fontSize: "1.2rem", color: "black" }} /> : <AddIcon style={{ fontSize: "1.2rem", color: "black" }} />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                        className="summary"
                                        sx={{
                                            padding: "0 5px",
                                        }}
                                    >
                                        <Typography
                                            className="title"
                                            sx={{
                                                textAlign: "center",
                                                width: "100%",
                                            }}
                                            style={{
                                                fontSize: "0.9rem",
                                                textTransform: "uppercase",
                                                marginLeft: "3.4px",
                                            }}
                                        >
                                            PRODUCT DETAILS
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className="details_d_C">
                                            <div className="hoq_material_details_portion">
                                                {diaList?.length > 0 && (
                                                    <div className="hoq_material_details_portion_inner">
                                                        <ul style={{ margin: "0px 0px 3px 0px" }}>
                                                            <li style={{ fontWeight: 600 }}>{`Diamond Detail (${diaList?.reduce((accumulator, data) => accumulator + data.M, 0)}   ${diaList?.reduce((accumulator, data) => accumulator + data?.N, 0).toFixed(3)}ct)`}</li>
                                                        </ul>
                                                        <ul className="hoq_mt_detail_title_ul">
                                                            <li className="hoq_proDeatilList">Shape</li>
                                                            <li className="hoq_proDeatilList">Clarity</li>
                                                            <li className="hoq_proDeatilList">Color</li>
                                                            <li className="hoq_proDeatilList">Pcs&nbsp;&nbsp;Wt</li>
                                                        </ul>
                                                        {diaList?.map((data) => (
                                                            <ul className="hoq_mt_detail_title_ul">
                                                                <li className="hoq_proDeatilList1">{data?.F}</li>
                                                                <li className="hoq_proDeatilList1">{data?.H}</li>
                                                                <li className="hoq_proDeatilList1">{data?.J}</li>
                                                                <li className="hoq_proDeatilList1">
                                                                    {data.M}&nbsp;&nbsp;{data?.N?.toFixed(3)}
                                                                </li>
                                                            </ul>
                                                        ))}
                                                    </div>
                                                )}
                                                {/* {console.log("csListcsList",csList?.filter((ele)=>ele?.D === "MISC"))} */}
                                                {csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 && (
                                                    <div className="hoq_material_details_portion_inner">
                                                        <ul style={{ margin: "10px 0px 3px 0px" }}>
                                                            <li style={{ fontWeight: 600 }}>{`ColorStone Detail (${csList?.filter((ele) => ele?.D !== "MISC")?.reduce((accumulator, data) => accumulator + data.M, 0)} ${csList
                                                                ?.filter((ele) => ele?.D !== "MISC")
                                                                ?.reduce((accumulator, data) => accumulator + data?.N, 0)
                                                                .toFixed(3)}ct)`}</li>
                                                        </ul>
                                                        <ul className="hoq_mt_detail_title_ul">
                                                            <li className="hoq_proDeatilList">Shape</li>
                                                            <li className="hoq_proDeatilList">Clarity</li>
                                                            <li className="hoq_proDeatilList">Color</li>
                                                            <li className="hoq_proDeatilList">Pcs&nbsp;&nbsp;Wt</li>
                                                        </ul>
                                                        {csList
                                                            ?.filter((ele) => ele?.D !== "MISC")
                                                            ?.map((data) => (
                                                                <ul className="hoq_mt_detail_title_ul">
                                                                    <li className="hoq_proDeatilList1">{data?.F}</li>
                                                                    <li className="hoq_proDeatilList1">{data?.H}</li>
                                                                    <li className="hoq_proDeatilList1">{data?.J}</li>
                                                                    <li className="hoq_proDeatilList1">
                                                                        {data.M}&nbsp;&nbsp;{data?.N?.toFixed(3)}
                                                                    </li>
                                                                </ul>
                                                            ))}
                                                    </div>
                                                )}

                                                {csList?.filter((ele) => ele?.D === "MISC")?.length > 0 && (
                                                    <div className="hoq_material_details_portion_inner">
                                                        <ul style={{ margin: "10px 0px 3px 0px" }}>
                                                            <li style={{ fontWeight: 600 }}>{`MISC Detail(${csList?.filter((ele) => ele?.D === "MISC")?.reduce((accumulator, data) => accumulator + data.M, 0)}  ${csList
                                                                ?.filter((ele) => ele?.D === "MISC")
                                                                ?.reduce((accumulator, data) => accumulator + data?.N, 0)
                                                                .toFixed(3)}gm)`}</li>
                                                        </ul>
                                                        <ul className="hoq_mt_detail_title_ul">
                                                            <li className="hoq_proDeatilList">Shape</li>
                                                            <li className="hoq_proDeatilList">Clarity</li>
                                                            <li className="hoq_proDeatilList">Color</li>
                                                            <li className="hoq_proDeatilList">Pcs&nbsp;&nbsp;Wt</li>
                                                        </ul>
                                                        {csList
                                                            ?.filter((ele) => ele?.D === "MISC")
                                                            ?.map((data) => (
                                                                <ul className="hoq_mt_detail_title_ul">
                                                                    <li className="hoq_proDeatilList1">{data?.F}</li>
                                                                    <li className="hoq_proDeatilList1">{data?.H}</li>
                                                                    <li className="hoq_proDeatilList1">{data?.J}</li>
                                                                    <li className="hoq_proDeatilList1">
                                                                        {data.M}&nbsp;&nbsp;{data?.N?.toFixed(3)}
                                                                    </li>
                                                                </ul>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            )}

                            {storeInit?.IsPriceShow === 1 && storeInit?.IsPriceBreakUp == 1 && effProd?.IsMrpBase !== 1 && (
                                <Accordion
                                    className="accordian"
                                    key={3}
                                    sx={{
                                        border: "none", // Remove default border
                                        boxShadow: "none", // Remove default shadow
                                        "&:before": {
                                            // Remove the border-top pseudo-element
                                            display: "none",
                                        },
                                    }}
                                    expanded={expandedIndex === 3}
                                    onChange={handleChange(3)}
                                >
                                    <AccordionSummary
                                        expandIcon={
                                            expandedIndex === 3 ? <RemoveIcon style={{ fontSize: "1.2rem", color: "black" }} /> : <AddIcon style={{ fontSize: "1.2rem", color: "black" }} />
                                        }
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                        className="summary-hoq"
                                        sx={{
                                            padding: "0 5px",
                                        }}
                                    >
                                        <Typography
                                            className="title"
                                            sx={{
                                                textAlign: "center",
                                                width: "100%",
                                            }}
                                            style={{
                                                fontSize: "0.9rem",
                                                textTransform: "uppercase",
                                                marginLeft: "3.4px",
                                            }}
                                        >
                                            Price Breakup
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {(effProd?.Metal_Cost) !== 0 ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Typography className="smr_Price_breakup_label">Metal</Typography>
                                                <span style={{ display: "flex" }}>
                                                    <Typography>
                                                        {
                                                            <span
                                                                style={{ paddingRight: "0.4rem" }}
                                                                className="smr_currencyFont"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: decodeEntities(loginInfo?.CurrencyCode),
                                                                }}
                                                            />
                                                        }
                                                    </Typography>
                                                    <Typography>{(effProd?.Metal_Cost)?.toFixed(2)}</Typography>
                                                </span>
                                            </div>
                                        ) : null}
                                        {(effProd?.Diamond_Cost) !== 0 ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Typography className="smr_Price_breakup_label">Diamond </Typography>

                                                <span style={{ display: "flex" }}>
                                                    <Typography>
                                                        {
                                                            <span
                                                                style={{ paddingRight: "0.4rem" }}
                                                                className="smr_currencyFont"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: decodeEntities(loginInfo?.CurrencyCode),
                                                                }}
                                                            />
                                                        }
                                                    </Typography>
                                                    <Typography>{(effProd?.Diamond_Cost)?.toFixed(2)}</Typography>
                                                </span>
                                            </div>
                                        ) : null}

                                        {(effProd?.ColorStone_Cost) !== 0 ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Typography className="smr_Price_breakup_label">Stone </Typography>

                                                <span style={{ display: "flex" }}>
                                                    <Typography>
                                                        {
                                                            <span
                                                                style={{ paddingRight: "0.4rem" }}
                                                                className="smr_currencyFont"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: decodeEntities(loginInfo?.CurrencyCode),
                                                                }}
                                                            />
                                                        }
                                                    </Typography>
                                                    <Typography>{(effProd?.ColorStone_Cost)?.toFixed(2)}</Typography>
                                                </span>
                                            </div>
                                        ) : null}

                                        {(effProd?.Misc_Cost) !== 0 ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Typography className="smr_Price_breakup_label">MISC </Typography>

                                                <span style={{ display: "flex" }}>
                                                    <Typography>
                                                        {
                                                            <span
                                                                style={{ paddingRight: "0.4rem" }}
                                                                className="smr_currencyFont"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: decodeEntities(loginInfo?.CurrencyCode),
                                                                }}
                                                            />
                                                        }
                                                    </Typography>
                                                    <Typography>{(effProd?.Misc_Cost)?.toFixed(2)}</Typography>
                                                </span>
                                            </div>
                                        ) : null}

                                        {(effProd?.Labour_Cost) !== 0 ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Typography className="smr_Price_breakup_label">Labour </Typography>

                                                <span style={{ display: "flex" }}>
                                                    <Typography>
                                                        {
                                                            <span
                                                                style={{ paddingRight: "0.4rem" }}
                                                                className="smr_currencyFont"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: decodeEntities(loginInfo?.CurrencyCode),
                                                                }}
                                                            />
                                                        }
                                                    </Typography>
                                                    <Typography>{(effProd?.Labour_Cost)?.toFixed(2)}</Typography>
                                                </span>
                                            </div>
                                        ) : null}

                                        {(effProd?.Other_Cost) + (effProd?.Size_MarkUp) + (effProd?.DesignMarkUpAmount) + (effProd?.ColorStone_SettingCost) + (effProd?.Diamond_SettingCost) + (effProd?.Misc_SettingCost) !== 0 ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Typography className="smr_Price_breakup_label">Other </Typography>

                                                <span style={{ display: "flex" }}>
                                                    <Typography>
                                                        {
                                                            <span
                                                                style={{ paddingRight: "0.4rem" }}
                                                                className="smr_currencyFont"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: decodeEntities(loginInfo?.CurrencyCode),
                                                                }}
                                                            />
                                                        }
                                                    </Typography>
                                                    <Typography>{((effProd?.Other_Cost) + (effProd?.Size_MarkUp) + (effProd?.DesignMarkUpAmount) + (effProd?.ColorStone_SettingCost) + (effProd?.Diamond_SettingCost) + (effProd?.Misc_SettingCost))?.toFixed(2)}</Typography>
                                                </span>
                                            </div>
                                        ) : null}
                                    </AccordionDetails>
                                </Accordion>
                            )}

                            {storeInit?.IsProductWebCustomization === 1 && (
                                <button
                                    className="hoq_customizeDesign_btn"
                                    onClick={() => setIsCustomizerOpen(true)}
                                >
                                    <span className="hoq_addtocart_btn_txt">CUSTOMIZE DESIGN</span>
                                </button>
                            )}

                            <div className="btn_Section">
                                <button className={!addToCartFlag ? "hoq_AddToCart_btn" : "hoq_AddToCart_btn_afterCart"} onClick={() => handleCart(!addToCartFlag)}>
                                    <span
                                        className="hoq_addtocart_btn_txt"
                                        style={{
                                            color: !addToCartFlag ? "" : "white",
                                            fontSize: "1rem",
                                        }}
                                    >
                                        {!addToCartFlag ? "ADD TO CART" : "REMOVE FROM CART"}
                                    </span>
                                </button>
                                <button onClick={() => handleWishList(!wishListFlag)} className={wishListFlag ? "clicked" : ""}>
                                    <span className="hoq_addtocart_btn_txt">{!wishListFlag ? "ADD TO WISHLIST" : "REMOVE FROM WISHLIST"}</span>
                                    <FaHeart style={{ color: wishListFlag ? "#c20000" : "#626262" }} />
                                </button>
                                <div className="delivery_hoq">
                                    {singleProd?.InStockDays !== 0 && (
                                        <span>
                                            <CiDeliveryTruck size={24} /> Express Shipping in Stock {singleProd?.InStockDays} Days Delivery
                                        </span>
                                    )}
                                    {singleProd?.MakeOrderDays != 0 && <span>Make To Order {singleProd?.MakeOrderDays} Days Delivery</span>}
                                </div>
                                <WhatsAppButton message="Hello, Talk to a Jewellery expert now!" />
                            </div>
                        </div>
                    </div>
                </main>
                <CustomizerDrawer
                    open={isCustomizerOpen}
                    onClose={() => setIsCustomizerOpen(false)}
                    rd1={rd1Data}
                    rd2={rd2Data}
                    defaultArticleId={defaultArticleId}
                    onConfirm={handleCustomizerConfirm}
                    storeInit={storeInit}
                    loginData={loginInfo}
                />
                {stockItemArr?.length > 0 && storeInit?.IsStockWebsite === 1 && stockItemArr?.[0]?.stat_code != 1005 && <Stockitems stockItemArr={stockItemArr} storeInit={storeInit} loginInfo={loginInfo} cartArr={cartArr} handleCartandWish={handleCartandWish} check={storeInit?.IsPriceShow === 1} />}
                {storeInit?.IsProductDetailSimilarDesign == 1 && SimilarBrandArr?.length > 0 && SimilarBrandArr?.[0]?.stat_code != 1005 && <RelatedProduct SimilarBrandArr={SimilarBrandArr} handleMoveToDetail={handleMoveToDetail} storeInit={storeInit} loginInfo={loginInfo} check={storeInit?.IsPriceShow === 1} />}
                {storeInit?.IsProductDetailDesignSet === 1 && designSetList?.length > 0 && designSetList?.[0]?.stat_code != 1005 && <DesignSet designSetList={designSetList} handleMoveToDetail={handleMoveToDetail} imageNotFound={imageNotFound} loginInfo={loginInfo} storeInit={storeInit} check={storeInit?.IsPriceShow === 1} />}
            </div>
        </>
    );
};

export default ProductDetail;

const NotFoundProduct = ({ navigate }) => {
    return (
        <div className="not-found-product">
            <h2>Product Not Found</h2>
            <p>We couldn't find the product you're looking for.</p>
            <button onClick={() => navigate.back()}>
                <IoMdArrowBack size={18} /> Go Back To Previous Page
            </button>
        </div>
    );
};

const MagnifierSlider = ({ product, close, list, currentIndex }) => {
    const swiperRef = useRef(null);

    const goNext = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };

    const goPrev = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slidePrev();
        }
    };

    return (
        <>
            <div className="MagnifierSlider">
                <Swiper ref={swiperRef} zoom={true} navigation={false} pagination={false} spaceBetween={30} loop={true} modules={[Zoom, Navigation, Pagination]} className="mySwiper" effect="fade">
                    {list?.map((val, i) => {
                        if (val?.type === "video") {
                            return null;
                        }
                        return (
                            <SwiperSlide>
                                <div className="swiper-zoom-container">
                                    <img src={val?.src} loading="lazy" onError={(e) => (e.target.src = imageNotFound)} />
                                </div>
                            </SwiperSlide>
                        );
                    })}
                    <div className="controller">
                        <button onClick={goPrev}>
                            <FaChevronLeft />
                        </button>
                        <button onClick={close}>
                            <IoMdClose size={27} />
                        </button>
                        <button onClick={goNext}>
                            <FaChevronRight />
                        </button>
                    </div>
                </Swiper>
            </div>
        </>
    );
};

const WhatsAppButton = ({ message = "Hello, Talk to a Jewellery expert now!" }) => {
    const whatsappUrl = `https://web.whatsapp.com/send?phone=9099889962&text=${encodeURIComponent(message)}`;
    const whatsappMobileUrl = `https://api.whatsapp.com/send?phone=9099889962&text=${encodeURIComponent(message)}`;

    function detectOS() {
        const userAgent = window.navigator.userAgent;

        if (/android/i.test(userAgent)) {
            return "Android";
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        } else if (/macintosh|mac os x/i.test(userAgent)) {
            return "macOS";
        } else if (/windows nt/i.test(userAgent)) {
            return "Windows";
        } else if (/linux/i.test(userAgent)) {
            return "Linux";
        } else {
            return "Unknown OS";
        }
    }

    const HandleWhatsApp = () => {
        const os = detectOS();
        const whatsappLink = os === "macOS" || os === "iOS" ? whatsappMobileUrl : whatsappUrl;
        window.location.href = whatsappLink;
    };
    return (
        <div className="whatsapp_btn">
            <div className="wa" onClick={() => HandleWhatsApp()}>
                <div className="left">
                    <FaWhatsapp size={50} color="white" className="wa-hoq" />
                </div>
                <div className="con">
                    <h4>
                        Optigo Apps <span>Online</span>
                    </h4>
                    <h3>Need Help ? Chat With Us</h3>
                </div>
            </div>
        </div>
    );
};