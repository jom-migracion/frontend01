import { Route, Routes } from 'react-router';
import RootLayout from '@/pages/RootLayout';
import LayoutOnlyWithNavbar from '@/pages/LayoutWithoutFooter';
import PRIVATE_ROUTES from './PrivateRouteList';

const HostRoutes = () => {
  return (
    <Routes>
      {/*  Private routes with navbar and footer*/}
      <Route path="/" element={<RootLayout />}>
        {PRIVATE_ROUTES.withNavbarAndFooter.map((item: any, i:number) =>
          item.index ? (
            <Route key="index" index element={<item.element />} />
          ) : (
            <Route key={i} path={item.path} element={<item.element />} />
          )
        )}
      </Route>

      {/*  Private routes with only navbar*/}
      <Route element={<LayoutOnlyWithNavbar />}>
        {PRIVATE_ROUTES.onlyWithNavbar.map((item: any, i:number) =>
          item.index ? (
            <Route key="index" index element={<item.element />} />
          ) : (
            <Route key={i} path={item.path} element={<item.element />} />
          )
        )}
      </Route>
    </Routes>
  );
};

export default HostRoutes;
