import { Avatar, TableRow, TableCell, Typography } from '@mui/material';
import { FC } from 'react';

interface EditablePriceRowProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  dias: string;
  lessIcon: string;
  plusIcon: string;
}

const EditablePriceRow: FC<EditablePriceRowProps> = ({
  label,
  dias,
  value,
  onIncrement,
  onDecrement,
  lessIcon,
  plusIcon,
}) => (
  <TableRow>
    <TableCell align="left" sx={{ pb: 1 }}>
      <Typography sx={{ fontWeight: 300, fontSize: '14px', color: '#B6B6B6' }}>{label}</Typography>
      <Typography sx={{ fontWeight: 300, fontSize: '16px' }}>{dias}</Typography>
    </TableCell>
    <TableCell align="right" />
    <TableCell align="right" />
    <TableCell align="right" />
    <TableCell align="right" sx={{ pl: '10%', pb: 1 }}>
      <Avatar src={lessIcon} onClick={onDecrement} sx={{ cursor: 'pointer' }} />
    </TableCell>
    <TableCell align="right" sx={{ fontSize: '16px', fontWeight: 300, pl: '8%' }}>
      {value}
    </TableCell>
    <TableCell align="right" sx={{ pl: '5%', pb: 1 }}>
      <Avatar src={plusIcon} onClick={onIncrement} sx={{ cursor: 'pointer' }} />
    </TableCell>
  </TableRow>
);

export default EditablePriceRow;
