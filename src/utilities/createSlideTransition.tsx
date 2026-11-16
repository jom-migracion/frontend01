import React from 'react';
import { Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

const createSlideTransition = (direction: 'up' | 'down' | 'left' | 'right') => {
  return React.forwardRef(function SlideTransition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction={direction} ref={ref} {...props} />;
  });
}

export default createSlideTransition;