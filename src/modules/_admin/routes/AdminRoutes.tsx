import { Route, Routes } from 'react-router';
import AdminPanel from '@/modules/_admin/pages/AdminPanel';
import DetailAdmin from '@/modules/_admin/pages/DetailAdmin';
import GuestMessage from '@/modules/_guest/page/GuestMessage';
import ContactHostCard from '@/modules/_guest/page/ContactHostCard';
import RootLayout from '@/pages/RootLayout';
import LayoutOnlyWithNavbar from '@/pages/LayoutWithoutFooter';

const ROUTES = {
  private: {
    withNavbarAndFooter: [
      {
        index: true,
        path: '',
        element: <AdminPanel />,
      },
      {
        path: 'detailAdmin/:id',
        element: <DetailAdmin />,
      },
      {
        path: 'messages',
        element: <GuestMessage />,
      },
      {
        path: 'messages/guest',
        element: <ContactHostCard />,
      },
    ],
    onlyWithNavbar: [
      {
        index: true,
        path: '',
        element: <AdminPanel />,
      },
      {
        path: 'detailAdmin/:id',
        element: <DetailAdmin />,
      },
      {
        path: 'messages',
        element: <GuestMessage />,
      },
      {
        path: 'messages/guest',
        element: <ContactHostCard />,
      },
    ],
  },
};

const AdminRoutes: React.FC<{ pathname: string }> = ({ pathname }) => {
  return (
    <Routes>
      <Route path={pathname} element={<RootLayout />}>
        <Route index element={<AdminPanel />} />
        <Route path="detailAdmin/:id" element={<DetailAdmin />} />
        <Route path="messages" element={<GuestMessage />} />
      </Route>

      <Route element={<LayoutOnlyWithNavbar />}>
        <Route path="messages/host" element={<ContactHostCard />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
