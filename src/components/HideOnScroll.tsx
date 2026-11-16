import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
interface HideOnScrollProps {
  children: React.ReactElement;
}
const HideOnScroll = (props: HideOnScrollProps) => {
  const { children } = props;
  const trigger = useScrollTrigger({
    threshold: 0,
  });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

export default HideOnScroll;
