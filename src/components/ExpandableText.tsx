import React, { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ExpandableTextProps {
  text?: string;
  lineClamp?: number;
  onOverflow?: (hasOverflow: boolean) => void;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, lineClamp = 3, onOverflow }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [expanded] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      const hasOverflow = element.scrollHeight > element.clientHeight;
      onOverflow?.(hasOverflow);
    }
  }, [text, onOverflow]);

  return (
    <Box>
      <Typography
        variant="body1"
        ref={textRef}
        sx={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          WebkitLineClamp: expanded ? 'none' : lineClamp,
          textOverflow: 'ellipsis',
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default ExpandableText;
