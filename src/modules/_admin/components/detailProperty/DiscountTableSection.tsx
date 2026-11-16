import {
    Avatar,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
  } from '@mui/material';
  import { FC } from 'react';
  
  interface DiscountItem {
    title: string;
    desc: string;
    count: number;
    checked: boolean;
  }
  
  interface DiscountTableSectionProps {
    items: DiscountItem[];
    onChange: (index: number, newValue: number) => void;
    onToggle: (index: number) => void;
    plusIcon: string;
    lessIcon: string;
  }
  
  const DiscountTableSection: FC<DiscountTableSectionProps> = ({
    items,
    onChange,
    onToggle,
    plusIcon,
    lessIcon,
  }) => {
    return (
      <TableContainer sx={{ mt: 1 }}>
        <Table>
          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: '#F6F6F6',
                  '& td': {
                    borderBottom: '8px solid white',
                  },
                }}
              >
                <TableCell align="left" sx={{ pb: 1 }}>
                  <Checkbox
                    checked={item.checked}
                    onChange={() => onToggle(index)}
                    name={`discount-${index}`}
                    size="large"
                  />
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontWeight: 300, fontSize: '12px' }}>{item.desc}</Typography>
                </TableCell>
                <TableCell align="left" />
                <TableCell align="right" sx={{ pl: '4%', pb: 1 }}>
                  <Avatar
                    src={lessIcon}
                    onClick={() => onChange(index, item.count - 1)}
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ fontSize: '16px', fontWeight: 300, pl: '4%' }}>
                  {item.count}
                </TableCell>
                <TableCell align="right" sx={{ pr: '1%', pb: 1 }}>
                  <Avatar
                    src={plusIcon}
                    onClick={() => onChange(index, item.count + 1)}
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  export default DiscountTableSection;
  