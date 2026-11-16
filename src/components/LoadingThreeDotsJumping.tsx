import { Dialog, DialogContent, useTheme } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import React from 'react';

const LoadingThreeDotsJumping: React.FC<{ open?: boolean; modal?: boolean }> = ({
  open = false,
  modal = false,
}) => {
  const dotVariants: Variants = {
    jump: {
      y: -30,
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      },
    },
  };
  return (
    <>
      {modal ? (
        <Dialog
          open={open}
          aria-labelledby="responsive-dialog-title"
          maxWidth="xl"
          scroll="body"
          slotProps={{
            paper: {
              sx: {
                backgroundColor: 'transparent',
                boxShadow: 'none',
                overflow: 'visible',
              },
            },
          }}
        >
          <DialogContent
            sx={{
              p: 0,
              overflow: 'visible',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <motion.div
              animate="jump"
              transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
              className="container"
            >
              <motion.div className="dot" variants={dotVariants} />
              <motion.div className="dot" variants={dotVariants} />
              <motion.div className="dot" variants={dotVariants} />
              <StyleSheet modal={modal}/>
            </motion.div>
          </DialogContent>
        </Dialog>
      ) : (
        <motion.div
          animate="jump"
          transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
          className="container"
        >
          <motion.div className="dot" variants={dotVariants} />
          <motion.div className="dot" variants={dotVariants} />
          <motion.div className="dot" variants={dotVariants} />
          <StyleSheet modal={modal}/>
        </motion.div>
      )}
    </>
  );
};

/**
 * ==============   Styles   ================
 */
const StyleSheet:React.FC<{modal:boolean}> = ({modal}) =>{
  const theme = useTheme();
  return (
    <style>
      {`
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
            }

            .dot {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color:${modal ? theme.palette.primary.main : theme.palette.secondary.main};
                will-change: transform;
            }
            `}
    </style>
  );
}

export default LoadingThreeDotsJumping;
