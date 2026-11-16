import { lazy } from "react";

const VerticalTabsAssert = lazy(() => import("@/modules/_assert/page/Index"));

const ADM_PRIVATE_ROUTES = {
  withNavbarAndFooter: [],
  onlyWithNavbar: [
    {
      index: true,
      path: "",
      element: VerticalTabsAssert,
    },
  ],
};

export default ADM_PRIVATE_ROUTES;
