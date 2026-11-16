import GuestMessage from "@/modules/_guest/page/GuestMessage";
import { Route, Routes } from "react-router";
import ContactHostCard from "@/modules/_guest/page/ContactHostCard";

const GuestRoutes = () => {
  return (
    <Routes>
      <Route path='/messages'  element={<GuestMessage />} />
      <Route path='/messages/host' element={<ContactHostCard />} />
    </Routes>
  );
}

export default GuestRoutes;