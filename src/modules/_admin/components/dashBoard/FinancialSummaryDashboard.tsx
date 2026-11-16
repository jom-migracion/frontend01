import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import { format } from 'date-fns';

import DateFilterActions from './FinancialSummary/DateFilterActions';
import FinancialSummaryComponent from './FinancialSummary/FinancialSummary';
import PropertyIncomeTable from './FinancialSummary/PropertyIncomeTable';
import PropertyPerformanceTable from './FinancialSummary/PropertyPerformanceTable';

const FinancialSummaryDashboard: React.FC<{ idUser: string }> = ({ idUser }) => {
  const [startDate, setStartDate] = useState(new Date('2025-08-01'));
  const [endDate, setEndDate] = useState(new Date('2025-08-30'));

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSelectAll = () => {
    console.log('Seleccionar todos los anuncios');
  };

  const handleDownload = () => {
    console.log('Descargar información');
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <DateFilterActions
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          onSelectAll={handleSelectAll}
          onDownload={handleDownload}
        />
        <FinancialSummaryComponent
          idUser={idUser}
          startDate={format(startDate, "d 'de' MMMM 'de' yyyy")}
          endDate={format(endDate, "d 'de' MMMM 'de' yyyy")}
        />
        <PropertyIncomeTable idUser={idUser} />
        <PropertyPerformanceTable idUser={idUser} />
      </Box>
    </Container>
  );
};

export default FinancialSummaryDashboard;
