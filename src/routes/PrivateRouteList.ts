import HelpCenter from "@/modules/_admin/pages/HelpCenter";
import HostProfileRedirect from "@/pages/HostProfileRedirect";
import { lazy } from "react";

const ConfigurationPage = lazy(
  () => import("@/modules/_account/pages/ConfigurationPage")
);
const ProfileEditPage = lazy(
  () => import("@/modules/_account/pages/ProfileEditPage")
);
const ProfilePage = lazy(() => import("@/modules/_account/pages/ProfilePage"));
const Dashboard = lazy(
  () => import("@/modules/_admin/components/dashBoard/Dashboard")
);
const DashboardDetail = lazy(
  () => import("@/modules/_admin/components/dashBoard/DashboardDetail")
);
const EarningsDashboardPage = lazy(
  () => import("@/modules/_admin/components/dashBoard/EarningsDashboardPage")
);
const MainFinancialPayTable = lazy(
  () => import("@/modules/_admin/components/dashBoard/MainFinancialPayTable")
);
const MainFinancialTable = lazy(
  () => import("@/modules/_admin/components/dashBoard/MainFinancialTable")
);
const PropertyDetailReport = lazy(
  () => import("@/modules/_admin/components/dashBoard/PropertyDetailReport")
);
const RankingPropiedades = lazy(
  () => import("@/modules/_admin/components/dashBoard/RankingProperties")
);
const AdminPanel = lazy(() => import("@/modules/_admin/pages/AdminPanel"));
const DetailAdmin = lazy(() => import("@/modules/_admin/pages/DetailAdmin"));
const IniPropertyRegistration = lazy(
  () => import("@/modules/_admin/pages/IniPropertyRegistration")
);
const PropertyRegistration = lazy(
  () => import("@/modules/_admin/pages/PropertyRegistration")
);
const PropertyRegistrationStarUsing = lazy(
  () => import("@/modules/_admin/pages/PropertyRegistrationStarUsing")
);
const ContactHostCard = lazy(
  () => import("@/modules/_guest/page/ContactHostCard")
);
const GuestMessage = lazy(() => import("@/modules/_guest/page/GuestMessage"));
const CancelReservationStep1 = lazy(
  () => import("@/pages/CancelReservationStep1")
);
const CancelReservationStep2 = lazy(
  () => import("@/pages/CancelReservationStep2")
);
//const PastTrip = lazy(() => import("@/pages/PastTrip"));
const ReservationCanceled = lazy(() => import("@/pages/ReservationCanceled"));
const ReservationDetail = lazy(() => import("@/pages/ReservationDetail"));
//const Travel = lazy(() => import("@/pages/Travel"));

const PRIVATE_ROUTES = {
  withNavbarAndFooter: [
    {
      path: "detail/:id",
      element: ReservationDetail,
    },
    {
      path: "canceled/:id",
      element: ReservationCanceled,
    },
    {
      path: "canceled-step1/:id",
      element: CancelReservationStep1,
    },
    {
      path: "canceled-step2/:id",
      element: CancelReservationStep2,
    },
    {
      path: "detailAdmin/:id",
      element: DetailAdmin,
    },
    {
      path: "info-profile/:option",
      element: ConfigurationPage,
    },
    {
      path: "profile",
      element: ProfilePage,
    },
    {
      path: "profile/edit",
      element: ProfileEditPage,
    },
  ],
  onlyWithNavbar: [
    {
      index: true,
      path: "",
      element: AdminPanel,
    },
    {
      path: "show-profile-guest/:userId/:propertyId",
      element: HostProfileRedirect,
    },
    {
      path: "messages/guest",
      element: ContactHostCard,
    },
    {
      path: "register-start-using",
      element: PropertyRegistrationStarUsing,
    },
    {
      path: "register",
      element: PropertyRegistration,
    },
    {
      path: "messages",
      element: GuestMessage,
    },
    {
      path: "dashboard",
      element: Dashboard,
    },
    {
      path: "dashboard/detail",
      element: DashboardDetail,
    },
    {
      path: "dashboard/payment",
      element: MainFinancialTable,
    },
    {
      path: "dashboard/income",
      element: MainFinancialPayTable,
    },
    {
      path: "dashboard/ranking_property",
      element: RankingPropiedades,
    },
    {
      path: "dashboard/property_detail_report",
      element: PropertyDetailReport,
    },
    {
      path: "dashboard/earnings",
      element: EarningsDashboardPage,
    },
    {
      path: "home-hosting",
      element: IniPropertyRegistration,
    },
    {
      path: "help-center",
      element: HelpCenter,
    },
  ],
};

export default PRIVATE_ROUTES;
