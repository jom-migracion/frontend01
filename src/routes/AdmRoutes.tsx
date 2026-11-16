import { Route, Routes } from 'react-router';
import RootLayout from '@/pages/RootLayout';
import LayoutOnlyWithNavbar from '@/pages/LayoutWithoutFooter';
import ADM_PRIVATE_ROUTES from './AdmPrivateRouteList';

const AdmRoutes = () => {
  return (
    <Routes>
      {/*  Private routes with navbar and footer*/}
      <Route path="/" element={<RootLayout />}>
        {ADM_PRIVATE_ROUTES.withNavbarAndFooter.map((item: any, i:number) =>
          item.index ? (
            <Route key="index-private-adm-nav-footer" index element={<item.element />} />
          ) : (
            <Route key={`index-private-adm-nav-footer-${i}`} path={item.path} element={<item.element />} />
          )
        )}
      </Route>

      {/*  Private routes with only navbar*/}
      <Route element={<LayoutOnlyWithNavbar />}>
        {ADM_PRIVATE_ROUTES.onlyWithNavbar.map((item: any, i:number) =>
          item.index ? (
            <Route key="index-private-adm-nav" index element={<item.element />} />
          ) : (
            <Route key={`index-private-adm-nav-${i}`} path={item.path} element={<item.element />} />
          )
        )}
      </Route>
    </Routes>
  );
};

export default AdmRoutes;
