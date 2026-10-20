import { getCompanyInfoData, getExtraFlag, getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import Header from "@/app/components/(dynamic)/Header/Hoq/Navbar";
import React from "react";
import { assetBase, getLogos } from "@/app/(core)/lib/ServerHelper";
import { Box } from "@mui/material";
import Footer from "@/app/components/(static)/Footer/hoq/Footer/Footer";
import ChatMenu from "@/app/components/(static)/ChatMenu/ChatMenu";
import { getSqliteMenus } from "@/app/(core)/utils/sqlite/sqliteActions";
import { cookies } from "next/headers";
import ErrorBoundary from "@/app/components/ErrorBoundary";

const layout = async ({ children }) => {
  const storeData = await getStoreInit();
  const companyInfoData = await getCompanyInfoData();
  const logos = getLogos();
  let extraFlag = await getExtraFlag();

  const cookieStore = await cookies();
  const userPkgIdCookie = cookieStore.get("userPackageId")?.value;
  const activePackageId = userPkgIdCookie ? Number(userPkgIdCookie) : storeData?.PackageId;

  let initialMenuData = [];
  try {
    const menuRes = await getSqliteMenus({ packageId: activePackageId });
    console.log(menuRes , "menuRes")
    initialMenuData = menuRes?.Data?.rd || [];
  } catch (err) {
    console.warn("[beluxjewel layout] SSR menu pre-fetch failed:", err.message);
  }
  
  return (
    <ErrorBoundary>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%", overflow: "hidden" }}>
        <ChatMenu assetBase={assetBase} />
        <Header
          logos={logos}
          storeInit={storeData}
          initialMenuData={initialMenuData}
        />
        {children}
        <Footer companyInfoData={companyInfoData} storeData={storeData} extraFlag={extraFlag} logos={logos} assetBase={assetBase} />
      </Box>
    </ErrorBoundary>
  );
};

export default layout;
