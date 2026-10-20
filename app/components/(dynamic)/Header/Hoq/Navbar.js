"use client";

import "./Navbar.modul.scss";
import { CiSearch, CiHeart } from "react-icons/ci";
import { PiBagSimpleThin } from "react-icons/pi";
import { HiMenuAlt1 } from "react-icons/hi";
import { IoIosLogOut } from "react-icons/io";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { IoChevronDown, IoClose } from "react-icons/io5";
import CartDrawer from "../../../../theme/hoq.web/cart/CartPageB2c/Cart";
import { IoSearchOutline } from "react-icons/io5";
import { TfiClose } from "react-icons/tfi";
import MuiLink from "@mui/material/Link";
import Cookies from "js-cookie";
import LogoutIcon from "@mui/icons-material/Logout";
import { Badge, Box, Tooltip, useMediaQuery } from "@mui/material";
import Pako from "pako";
import DummyNav from "./DummyNav";
import TemporaryDrawer from "./MobileNavbar";
import useGlobalPreventSave from "@/app/(core)/utils/Glob_Functions/useGlobalPreventSave";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import Link from "next/link";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import LogOutModal from "@/app/components/ui/LogOut";

const UserIcons = ({ color = "grey", size }) => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
        <path
          fill={color}
          d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12S6.201 22.5 12 22.5S22.5 17.799 22.5 12S17.799 1.5 12 1.5M2.5 12a9.5 9.5 0 1 1 16.4 6.53a4.64 4.64 0 0 0-1.219-2.381c-.743-.774-1.679-1.228-2.501-1.484c-.527-.164-1.037.023-1.39.26c-.383.259-1.013.575-1.79.575s-1.407-.316-1.79-.574c-.353-.239-.863-.425-1.39-.261c-.822.256-1.758.71-2.501 1.484a4.64 4.64 0 0 0-1.22 2.38A9.47 9.47 0 0 1 2.5 12m3.505 7.37c.056-1.14.476-1.947 1.035-2.528c.59-.615 1.36-.999 2.078-1.223c.128-.04.319-.009.533.136c.477.322 1.302.745 2.349.745s1.872-.423 2.349-.745c.214-.145.405-.176.533-.136c.719.224 1.487.608 2.078 1.223c.559.58.979 1.389 1.035 2.528A9.46 9.46 0 0 1 12 21.5a9.46 9.46 0 0 1-5.995-2.13M9.5 10c0-1.385 1.08-2.5 2.5-2.5s2.5 1.115 2.5 2.5s-1.08 2.5-2.5 2.5s-2.5-1.114-2.5-2.5M12 6.5A3.47 3.47 0 0 0 8.5 10c0 1.928 1.519 3.5 3.5 3.5s3.5-1.572 3.5-3.5s-1.519-3.5-3.5-3.5"
        />
      </svg>
    </>
  );
};

const Navbar = ({ storeInit: storeinit, logos, initialMenuData = [] }) => {
  const { islogin, setislogin, cartCountNum, setCartCountNum, wishCountNum, setWishCountNum, setCartOpenStateB2C } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenu, setisMobileMenu] = useState(false);
  const [isNavbarSticky, setisNavbarSticky] = useState(false);
  const [showSearchBar, setshowSearchBar] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const setCartOpenState = setCartOpenStateB2C;
  const prevScrollY = useRef(0);
  const navigate = useNextRouterLikeRR().push;
  //After Login Header...........
  const [LoggedUserDetails, setLoggedUserDetails] = useState();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [IsCartNo, setIsCartNo] = useState();
  const blackLogo = logos?.black_logo || logos?.blackLogo || logos?.web;
  useEffect(() => {
    setisMobileMenu(false);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("isCart_hOQ", cartCountNum);
  }, [cartCountNum]);

  useGlobalPreventSave();

  useEffect(() => {
    let interval;
    const checkStoreInit = () => {
      try {
        const storeInit = sessionStorage.getItem("storeInit");
        if (storeInit) {
          window.scroll({ behavior: "smooth", top: 0 });
          setLoading(false);
          if (interval) {
            clearInterval(interval);
          }
        } else {
          setLoading(true);
        }
      } catch (error) {
        console.error("Error parsing storeInit:", error);
        setLoading(false);

        if (interval) {
          clearInterval(interval);
        }
      }
    };

    checkStoreInit();
    interval = setInterval(checkStoreInit, 1000);
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  useEffect(() => {
    const value = JSON.parse(sessionStorage.getItem("LoginUser"));
    setislogin(value);
    setIsCartNo(storeinit?.CartNo);
    window.scroll({ behavior: "smooth", top: 0 });
  }, []);

  const HandleAccountRoute = () => {
    navigate("/account");
  };

  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    const currentScrollY = window.scrollY;
    if (window.innerWidth < 768) {
      if (currentScrollY > prevScrollY.current) {
        setisNavbarSticky(false);
      } else {
        setisNavbarSticky(true);
      }
      prevScrollY.current = currentScrollY;
    }
    if (scrollTop > 200) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };
  const fetchData = () => {
    const value = JSON.parse(sessionStorage?.getItem("LoginUser"));
    setislogin(value);
  };

  const handleLogout = () => {
    setislogin(false);
    Cookies.remove("userLoginCookie");
    sessionStorage.setItem("LoginUser", false);
    sessionStorage.removeItem("storeInit");
    sessionStorage.removeItem("loginUserDetail");
    sessionStorage.removeItem("remarks");
    sessionStorage.removeItem("selectedAddressId");
    sessionStorage.removeItem("orderNumber");
    sessionStorage.removeItem("registerEmail");
    sessionStorage.removeItem("UploadLogicalPath");
    sessionStorage.removeItem("remarks");
    sessionStorage.removeItem("registerMobile");
    sessionStorage.removeItem("allproductlist");
    sessionStorage.clear();
    window.location.replace("/");
  };

  useEffect(() => {
    fetchData();
  }, [islogin]);

  const toggleCartDrawer = () => {
    setIsCartOpen((prevState) => !prevState);
    const isCartDrawerOpen = JSON.parse(sessionStorage.getItem("isCartDrawer"));
    sessionStorage.setItem("isCartDrawer", !isCartDrawerOpen);
    setCartOpenState((prevState) => !prevState);
  };

  const menuItems = useMemo(() => {
    const data = Array.isArray(initialMenuData) ? initialMenuData : [];
    if (data.length === 0) return [];

    const uniqueMenuIds = [...new Set(data.map((item) => item?.menuid))];

    const items = uniqueMenuIds.map((menuid) => {
      const rowsOfMenu = data.filter((d) => d?.menuid === menuid);
      const item = rowsOfMenu[0];

      const param1DataIds = [...new Set(rowsOfMenu.map((r) => r?.param1dataid))];

      const param1Items = param1DataIds.map((param1dataid) => {
        const rowsOfParam1 = rowsOfMenu.filter((r) => r?.param1dataid === param1dataid);
        const param1Item = rowsOfParam1[0];

        const param2Items = rowsOfParam1.map((r) => ({
          param2dataid: r?.param2dataid,
          param2dataname: r?.param2dataname,
          param2id: r?.param2id,
          param2name: r?.param2name,
        }));

        return {
          menuname: param1Item?.menuname,
          param1dataid: param1Item?.param1dataid,
          param1dataname: param1Item?.param1dataname,
          param1id: param1Item?.param1id,
          param1name: param1Item?.param1name,
          param2: param2Items,
        };
      });

      return {
        menuid: item?.menuid,
        menuname: item?.menuname,
        param0dataid: item?.param0dataid,
        param0dataname: item?.param0dataname,
        param0id: item?.param0id,
        param0name: item?.param0name,
        displayorder: item?.displayorder,
        param1: param1Items,
      };
    });

    return items.sort((a, b) => (a?.displayorder ?? 0) - (b?.displayorder ?? 0));
  }, [initialMenuData]);

  const handleMenu = (param, param1, param2) => {
    let finalData = {
      menuname: param?.menuname ?? "",
      FilterKey: param?.key ?? "",
      FilterVal: param?.value ?? "",
      FilterKey1: param1?.key ?? "",
      FilterVal1: param1?.value ?? "",
      FilterKey2: param2?.key ?? "",
      FilterVal2: param2?.value ?? "",
    };
    sessionStorage.setItem("menuparams", JSON.stringify(finalData));

    const queryParameters1 = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`].filter(Boolean).join("/");

    const queryParameters = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`]
      // .filter(Boolean)
      .join(",");

    const otherparamUrl = Object.entries({
      b: finalData?.FilterKey,
      g: finalData?.FilterKey1,
      c: finalData?.FilterKey2,
    })
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => value)
      .filter(Boolean)
      .join(",");

    const paginationParam = [`page=${finalData.page ?? 1}`, `size=${finalData.size ?? 50}`].join("&");

    let menuEncoded = `${queryParameters}/${otherparamUrl}`;
    // const url = `/productlist?V=${queryParameters}/K=${otherparamUrl}`;
    const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;
    // let d = new Date();
    // let randomno = Math.floor(Math.random() * 1000 * d.getMilliseconds() * d.getSeconds() * d.getDate() * d.getHours() * d.getMinutes())
    navigate(url);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const executeSearch = () => {
    const searchValue = searchText?.trim();
    if (!searchValue) return;

    const loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
    const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));

    const obj = {
      a: "",
      b: searchValue,
      m: loginInfo?.MetalId ?? storeInit?.MetalId,
      d: loginInfo?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
      c: loginInfo?.cmboCSQCid ?? storeInit?.cmboCSQCid,
      f: {},
    };

    const encodeObj = btoa(JSON.stringify(obj));
    navigate(`/p/${encodeURIComponent(searchValue)}?S=${encodeObj}`);
    setSearchText("");
    setshowSearchBar(false);
  };

  const searchDataFucn = (e) => {
    if (e?.type === "click" || e?.type === "submit" || e?.key === "Enter") {
      e?.preventDefault?.();
      executeSearch();
    }
  };

  return (
    <>
      <div
        className={`hoq_main_navbar ${isScrolled ? "sticky animate" : "s"}  ${!isMobileMenu ? "hide" : ""}
      ${!isNavbarSticky ? "isScrollTop" : ""}
      `}
        draggable={true}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="new_bar">
          {showSearchBar && <SearchBar size={28} color="grey" closeSearch={() => setshowSearchBar(!showSearchBar)} showSearchBar={showSearchBar} searchText={searchText} setSearchText={setSearchText} searchDataFucn={searchDataFucn} />}
          <div className="first_bar_sec_hoq">
            <div className="nav_left2">
              <div className="navbar_search_hoq_m">
                <Tooltip title="Search">
                  <button
                    style={{
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                    }}
                  >
                    <CiSearch size={28} color="grey" className="search_icon icons desktop-search" onClick={() => setshowSearchBar(!showSearchBar)} />
                  </button>
                </Tooltip>
              </div>
              <div className="hamburger_hoq_m">
                <Tooltip title="Search">
                  <div>
                    <HiMenuAlt1 className="search_icon_hoq" onClick={() => setisMobileMenu(!isMobileMenu)} color="#9c9c9cea" />
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className="logo" draggable={false} onContextMenu={(e) => e.preventDefault()}>
              <Link href={"/"} draggable={false} onContextMenu={(e) => e.preventDefault()}>
                <img src={blackLogo} alt="" onClick={() => window.scrollTo({ behavior: "smooth", top: 0, left: 0 })} draggable={false} onContextMenu={(e) => e.preventDefault()} />
              </Link>
            </div>
            <div className="nav_right2">
              <div className="desk_hoq_a1">
                {islogin && (
                  <>
                    <span
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={HandleAccountRoute}
                    >
                      Hey ,
                      <span
                        style={{
                          color: "#C20000",
                          fontWeight: "600",
                        }}
                      >
                        {LoggedUserDetails?.firstname}
                      </span>
                    </span>
                  </>
                )}
                <Link href={"/myWishList"} className="wishlist_hoq_hide">
                  <Tooltip title="Wishlist">
                    <Badge
                      style={{ size: "2px" }}
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: "10px",
                          padding: "7px",
                          borderRadius: "4px",
                          marginRight: "7px",
                          marginTop: "-2px",
                          bgcolor: "#C20000",
                          width: 0,
                          height: 0,
                          height: "18px",
                          minWidth: "18px",
                          borderRadius: "10px",
                          padding: "0 4px",
                          bgcolor: "#C20000",
                          color: "white",
                        },
                      }}
                      badgeContent={wishCountNum}
                      color="primary"
                    >
                      <CiHeart color="grey" className="wishlist_icon icons" size={28} />
                    </Badge>
                  </Tooltip>
                </Link>
                <MuiLink
                  sx={{
                    cursor: "pointer",
                    padding: "0",
                    margin: "0",
                  }}
                  // to={"/cartPage"}
                  style={{
                    marginRight: "5px",
                  }}
                  onClick={IsCartNo == 2 ? toggleCartDrawer : () => navigate("/cartPage")}
                >
                  <Badge
                    style={{ size: "2px" }}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "10px",
                        height: "18px",
                        minWidth: "18px",
                        borderRadius: "10px",
                        padding: "0 4px",
                        bgcolor: "#C20000",
                        color: "white",
                      },
                    }}
                    badgeContent={cartCountNum}
                    color="primary"
                  >
                    <Tooltip title="Cart">
                      <PiBagSimpleThin
                        size={27}
                        color="grey"
                      // onClick={() => setshowDrawer(!showDrawer)}   b2c drawer
                      />
                    </Tooltip>
                  </Badge>
                </MuiLink>
                {islogin ? (
                  <Tooltip title="Logout" className="tooltip-logout">
                    <button onClick={() => setIsLogoutModalOpen(true)} className="logout_btn_hoq icons" style={{ border: "none", backgroundColor: "transparent", cursor: "pointer" }}>
                      <IoIosLogOut color="grey" size={27} />
                    </button>
                  </Tooltip>
                ) : (
                  <Link href={"/LoginOption"}>
                    <small style={{ fontSize: "1rem", fontWeight: "500" }}>
                      <UserIcons color="grey" size={28} />
                    </small>
                  </Link>
                )}
              </div>
              <div className="mob_hoq_a1">
                <Tooltip title="Search">
                  <button
                    style={{
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                    }}
                  >
                    <CiSearch size={28} color="grey" className="search_icon icons desktop-search" onClick={() => setshowSearchBar(!showSearchBar)} />
                  </button>
                </Tooltip>
                <Link
                  href={"/cartPage"}
                  style={{
                    marginRight: "5px",
                  }}
                >
                  <Badge
                    style={{ size: "2px" }}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "10px",
                        height: "18px",
                        minWidth: "18px",
                        borderRadius: "10px",
                        padding: "0 4px",
                        bgcolor: "#C20000",
                        color: "white",
                      },
                    }}
                    badgeContent={cartCountNum}
                    color="primary"
                  >
                    <Tooltip title="Cart">
                      <PiBagSimpleThin
                        size={27}
                        color="grey"
                      />
                    </Tooltip>
                  </Badge>
                </Link>
              </div>
              <Link href={"/LoginOption"} className="hoq_login_a1">
                <small style={{ fontSize: "1rem", fontWeight: "500" }}>
                  <UserIcons color="grey" size={28} />
                </small>
              </Link>
            </div>
          </div>
          <div className="menu_bar_Sec_hoq">
            <div className="navbar_menus">
              <div className="mobile-close">
                <IoClose size={32} onClick={() => setisMobileMenu(!isMobileMenu)} />
              </div>
              <ul className="lg_navbar_item">
                {menuItems.map((menuItem, i) => {
                  const { menuname, param1 } = menuItem;
                  const hasSubMenu = param1?.length > 0 && param1[0]?.param1name !== "";

                  return (
                    <li key={menuItem.menuid ?? i}>
                      <span
                        onClick={() => {
                          handleMenu({
                            menuname,
                            key: menuItem?.param0name,
                            value: menuItem?.param0dataname,
                          });
                          window.scrollTo({ behavior: "smooth", top: 0, left: 0 });
                        }}
                      >
                        {menuname}
                      </span>

                      {hasSubMenu && <IoChevronDown className="chevron-downn-mobile" />}

                      {hasSubMenu && (
                        <ul className="submenu">
                          {param1.map(({ param1dataid, param1dataname, param1name }, j) => (
                            <li key={param1dataid ?? j}>
                              <span
                                onClick={() => {
                                  handleMenu(
                                    {
                                      menuname,
                                      key: menuItem?.param0name,
                                      value: menuItem?.param0dataname,
                                    },
                                    { key: param1name, value: param1dataname }
                                  );
                                  window.scrollTo({ behavior: "smooth", top: 0, left: 0 });
                                }}
                              >
                                {param1dataname}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {isMobileMenu && <TemporaryDrawer menuItems={menuItems} handleMenu={handleMenu} setisMobileMenu={setisMobileMenu} isMobileMenu={isMobileMenu} />}
        </div>
        <div className="nav_bottom_head">
          <span>
            <Link href={"/Lookbook"}>Explore Our Artful Jewellery Lookbook</Link>
          </span>
        </div>
      </div>
      {isScrolled && <DummyNav />}
      {IsCartNo == 2 && <CartDrawer storeinit={storeinit} open={isCartOpen} />}
      <LogOutModal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Navbar;

const SearchBar = ({ closeSearch, showSearchBar, searchText, setSearchText, searchDataFucn }) => {
  const searchInputRef = useRef(null);
  useEffect(() => {
    if (showSearchBar && searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      setSearchText("");
    }
  }, [showSearchBar, setSearchText]);
  return (
    <>
      <form className="SearchBar-hoq" onSubmit={searchDataFucn}>
        <button type="submit" aria-label="Search" style={{ border: "none", background: "transparent", padding: 0, lineHeight: 0 }} onClick={searchDataFucn}>
          <IoSearchOutline size={28} color="grey" />
        </button>
        <input type="text" ref={searchInputRef} placeholder="Search..." value={searchText} autoFocus onChange={(e) => setSearchText(e.target.value)} onKeyDown={searchDataFucn} />
        <button type="button" className="cls_btn_search" onClick={closeSearch}>
          <TfiClose size={20} color="grey" />
        </button>
      </form>
      <div className="bg_search_overlay" onClick={closeSearch}></div>
    </>
  );
};
