import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableContainer,
    Typography,
  } from '@mui/material';
  import EditablePriceRow from './EditablePriceRow';
  
  interface ServiceItem {
    title: string;
    dias: string;
    count: number;
  }
  
  interface EditableTableSectionProps {
    items: ServiceItem[];
    onChange: (index: number, newValue: number) => void;
    plusIcon: string;
    lessIcon: string;
  }
  
  const EditableTableSection: React.FC<EditableTableSectionProps> = ({
    items,
    onChange,
    plusIcon,
    lessIcon,
  }) => {
    return (
      <Card sx={{ boxShadow: 'none' }}>
        <Typography sx={{ mt: 1, ml: 4, mr: 20, fontWeight: 600, fontSize: '20px' }}>
          Define precios
        </Typography>
        <Typography sx={{ ml: 4, mr: 5, fontWeight: 300, fontSize: '15px', color: '#000000' }}>
        Establece precios entre semana, fines de semana y descuentos especiales 
        </Typography>
        <CardContent sx={{ width: '100%', ml: 1 }}>
          <TableContainer>
            <Table>
              <TableBody>
                {items.map((item, index) => (
                  <EditablePriceRow
                    key={index}
                    label={item.title}
                    dias={item.dias}
                    value={item.count}
                    onIncrement={() => onChange(index, item.count + 1)}
                    onDecrement={() => onChange(index, item.count - 1)}
                    lessIcon={lessIcon}
                    plusIcon={plusIcon}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };
  
  export default EditableTableSection;
  