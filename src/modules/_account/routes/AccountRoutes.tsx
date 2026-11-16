import { Route, Routes } from 'react-router';
import AccountPage from '../pages/AccountPage';

const AccountRoutes = () => {
  return (
    <Routes>
      <Route index element={<AccountPage />} />
    </Routes>
  );
};

export default AccountRoutes;
