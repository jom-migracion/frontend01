import Travel from "@/pages/Travel";
import PastTrip from "@/pages/PastTrip";
import { lazy } from "react";

const CancellationLayout = lazy(
  () => import("@/components/CancellationPolicy/CancellationLayout")
);
const AccessibilityLayout = lazy(
  () =>
    import("@/components/LegalCenter/AccessibilityPolicy/AccessibilityLayout")
);
const BillingLayout = lazy(
  () => import("@/components/LegalCenter/BillingPolicy/BillingLayout")
);
const ConductLayout = lazy(
  () => import("@/components/LegalCenter/ConductPolicy/ConductLayout")
);
const ConflictLayout = lazy(
  () => import("@/components/LegalCenter/ConflictPolicy/ConflictLayout")
);
const GuestContractLayout = lazy(
  () => import("@/components/LegalCenter/GuestContract/GuestContractLayout")
);
const HostContractLayout = lazy(
  () => import("@/components/LegalCenter/HostContract/HostContractLayout")
);
const LegalLayout = lazy(() => import("@/components/LegalCenter/LegalLayout"));
const ModerationLayout = lazy(
  () => import("@/components/LegalCenter/ModerationPolicy/ModerationLayout")
);
const PaymentLayout = lazy(
  () => import("@/components/LegalCenter/PaymentPolicy/PaymentLayout")
);
const SanctionsLayout = lazy(
  () => import("@/components/LegalCenter/SanctionsPolicy/SanctionsLayout")
);
const PrivacyLayout = lazy(
  () => import("@/components/PrivacyPolicy/PrivacyLayout")
);
const PromotionsLayout = lazy(
  () => import("@/components/Promotions/PromotionsLayout")
);
const TermsLayout = lazy(
  () => import("@/components/TermsAndConditions/TermsLayout")
);

const Home = lazy(() => import("@/pages/Home"));

const SupportCenter = lazy(() => import("@/pages/SupportCenter"));
const DetailProperty = lazy(() => import("@/pages/DetailProperty"));
const SearchResults = lazy(() => import("@/pages/SearchResults"));
const ReservationStepper = lazy(
  () => import("@/modules/_guest/page/ReservationStepper")
);
const ContactHostCard = lazy(
  () => import("@/modules/_guest/page/ContactHostCard")
);
const ReservationApproved = lazy(() => import("@/pages/ReservationApproved"));
const ReservationInProgress = lazy(
  () => import("@/pages/ReservationInProgress")
);
const ReservationPending = lazy(() => import("@/pages/ReservationPending"));
const Reservation = lazy(() => import("@/pages/Reservation"));
const ReservationCanceled = lazy(() => import("@/pages/ReservationCanceled"));
const ReservationDetailView = lazy(
  () => import("@/pages/ReservationDetailView")
);
const CancelReservationStep1 = lazy(
  () => import("@/pages/CancelReservationStep1")
);
const CancelReservationStep2 = lazy(
  () => import("@/pages/CancelReservationStep2")
);
const CancelReservationNewStep1 = lazy(
  () => import("@/pages/CancelReservationNewStep1")
);
const CancelReservationNewStep2 = lazy(
  () => import("@/pages/CancelReservationNewStep2")
);
const RefundProcess2 = lazy(() => import("@/pages/RefundProcess2"));
const RefundProcess1 = lazy(() => import("@/pages/RefundProcess1"));
const HostProfileInfo = lazy(() => import("@/pages/HostProfileInfo"));
const ReportIncident = lazy(() => import("@/pages/ReportIncident"));
const RecentlyViewed = lazy(() => import("@/pages/RecentlyViewed"));
const WishList = lazy(() => import("@/pages/WishList"));
const DetailWishList = lazy(() => import("@/pages/DetailWishList"));

const AboutJOMView = lazy(() =>
  import("@/pages/InfoPage").then((m) => ({ default: m.AboutJOMView }))
);
const HowWeWorkView = lazy(() =>
  import("@/pages/InfoPage").then((m) => ({ default: m.HowWeWorkView }))
);
const ContactView = lazy(() =>
  import("@/pages/InfoPage").then((m) => ({ default: m.ContactView }))
);
const HelpCenterView = lazy(() =>
  import("@/pages/InfoPage").then((m) => ({ default: m.HelpCenterView }))
);
const CancellationOptionsView = lazy(() =>
  import("@/pages/InfoPage").then((m) => ({
    default: m.CancellationOptionsView,
  }))
);
const TrustSafetyView = lazy(() =>
  import("@/pages/InfoPage").then((m) => ({ default: m.TrustSafetyView }))
);

const PUBLIC_ROUTES = {
  withNavbarAndFooter: [
    {
      path: "travels",
      element: Travel,
    },
    {
      path: "past-trips",
      element: PastTrip,
    },
    {
      index: true,
      path: "",
      element: Home,
    },
    {
      path: "support",
      element: SupportCenter,
    },
    {
      path: "wishlist",
      element: WishList,
    },
    {
      path: "wishlist/viewed",
      element: RecentlyViewed,
    },
    {
      path: "wishlist/detailt/:id",
      element: DetailWishList,
    },
    {
      path: "detail/:id",
      element: DetailProperty,
    },
    {
      path: "search-results",
      element: SearchResults,
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
      path: "canceled-new-step1/:id",
      element: CancelReservationNewStep1,
    },
    {
      path: "canceled-new-step2/:id",
      element: CancelReservationNewStep2,
    },
    {
      path: "refund-process/:id",
      element: RefundProcess2,
    },
    {
      path: "report-incident/:id",
      element: ReportIncident,
    },
    {
      path: "privacy-policy",
      element: PrivacyLayout,
    },
    {
      path: "terms-and-conditions",
      element: TermsLayout,
    },
    {
      path: "cancellation-policy",
      element: CancellationLayout,
    },
    {
      path: "about-jom",
      element: AboutJOMView,
    },
    {
      path: "how-we-work",
      element: HowWeWorkView,
    },
    {
      path: "contact",
      element: ContactView,
    },
    {
      path: "promociones",
      element: PromotionsLayout,
    },
    {
      path: "legal-center",
      element: LegalLayout,
    },
    {
      path: "host-contract",
      element: HostContractLayout,
    },
    {
      path: "guest-contract",
      element: GuestContractLayout,
    },
    {
      path: "accessibility-policy",
      element: AccessibilityLayout,
    },
    {
      path: "moderation-policy",
      element: ModerationLayout,
    },
    {
      path: "conduct-policy",
      element: ConductLayout,
    },
    {
      path: "billing-policy",
      element: BillingLayout,
    },
    {
      path: "payment-policy",
      element: PaymentLayout,
    },
    {
      path: "sanctions-policy",
      element: SanctionsLayout,
    },
    {
      path: "conflict-policy",
      element: ConflictLayout,
    },
    {
      path: "help-center",
      element: HelpCenterView,
    },
    {
      path: "refund-process-1/:id",
      element: RefundProcess1,
    },
    {
      path: "cancellation-options",
      element: CancellationOptionsView,
    },
    {
      path: "trust-and-safety", // URL: tusitio.com/trust-and-safety
      element: TrustSafetyView,
    },
    {
      path: "book/:id",
      element: ReservationStepper,
    },
    {
      path: "reservation/:id",
      element: Reservation,
    },
    {
      path: "approved/:id",
      element: ReservationApproved,
    },
    {
      path: "inprogress/:id",
      element: ReservationInProgress,
    },
    {
      path: "pending/:id",
      element: ReservationPending,
    },
    {
      path: "canceled/:id",
      element: ReservationCanceled,
    },
    {
      path: "completed/:id",
      element: ReservationDetailView,
    },
  ],
  onlyWithNavbar: [
    {
      path: "show-profile/:userId/:propertyId",
      element: HostProfileInfo,
    },
    {
      path: "messages/host/:listingRentId/:msgsee",
      element: ContactHostCard,
    },
  ],
};

export default PUBLIC_ROUTES;
