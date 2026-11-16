import { useNavigate } from 'react-router';

const useHandleRouteLink = () => {
  const navigate = useNavigate();

  const handleRouteLink = (route: string = '/') => {
    navigate(route);
  };

  return handleRouteLink;
};

export default useHandleRouteLink;
