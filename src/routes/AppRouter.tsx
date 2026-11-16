import LayoutOnlyWithNavbar from '@/pages/LayoutWithoutFooter';
import PrivateRoute from '@/routes/PrivateRoute';
import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';
import PUBLIC_ROUTES from './PublicRouteList';
import RootLayout from '@/pages/RootLayout';
import PageNotFound from '@/pages/PageNotFound';
import { useAuthContext } from '@/modules/_auth/context';

const HostRoutes = lazy(() => import('./HostRoutes'));
const AdmRoutes = lazy(() => import('./AdmRoutes'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div
      style={{
        width: 40,
        height: 40,
        border: '3px solid #e0e0e0',
        borderTop: '3px solid #1976d2',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const UNAUTHENTICATED_ALLOWED_EXACT = new Set([
  '/',
  '/about-jom',
  '/how-we-work',
  '/contact',
  '/promociones',
  '/legal-center',
  '/privacy-policy',
  '/terms-and-conditions',
  '/cancellation-policy',
  '/help-center',
  '/trust-and-safety',
]);

const UNAUTHENTICATED_ALLOWED_PREFIXES = ['/detail/', '/search-results'];

const isUnauthenticatedAllowed = (pathname: string) => {
  if (UNAUTHENTICATED_ALLOWED_EXACT.has(pathname)) return true;
  return UNAUTHENTICATED_ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
};

const HostGuard = () => {
  const { isHostAuthenticated } = useAuthContext();
  const location = useLocation();

  if (isHostAuthenticated && isUnauthenticatedAllowed(location.pathname)) {
    return <Outlet />;
  }  
  
  return isHostAuthenticated ? <Navigate to="/host" replace /> : <Outlet />;
};

const UnauthGuard = () => {
  const { isHostAuthenticated, isGuestAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!isHostAuthenticated && !isGuestAuthenticated) {
    if (!isUnauthenticatedAllowed(location.pathname)) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<HostGuard />}>
          <Route element={<UnauthGuard />}>
            <Route path="/" element={<RootLayout />}>
              {PUBLIC_ROUTES.withNavbarAndFooter
                .filter((item: any) => Boolean(item?.element))
                .map((item: any, i: number) =>
                  item.index ? (
                    <Route key="index" index element={<item.element />} />
                  ) : (
                    <Route key={i} path={item.path} element={<item.element />} />
                  )
                )}
            </Route>

            {/*  Public routes with only navbar*/}
            <Route element={<LayoutOnlyWithNavbar />}>
              {PUBLIC_ROUTES.onlyWithNavbar
                .filter((item: any) => Boolean(item?.element))
                .map((item: any, i: number) => (
                  <Route key={i} path={item.path} element={<item.element />} />
                ))}
            </Route>
          </Route>
        </Route>
        {/* end HostGuard */}

        {/*  Private routes */}
        <Route
          path="/host/*"
          element={
            <PrivateRoute>
              <HostRoutes />
            </PrivateRoute>
          }
        />
        {/* Private routes Admin */}
        <Route
          path="/assert/*"
          element={
            <PrivateRoute>
              <AdmRoutes />
            </PrivateRoute>
          }
        />
        {/* page not found */}
        <Route path="not_found" element={<PageNotFound />} />
        <Route path="*" element={<Navigate to="/not_found" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
