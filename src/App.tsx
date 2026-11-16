import { useEffect } from 'react';
import AppRouter from './routes/AppRouter';
import { useLocation } from 'react-router';
import 'App.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
function App() {
  return (
    <>
      <ScrollToTop/>
      <AppRouter/>
    </>
  );
}

export default App;
