import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatearFechaYHora } from '@/common/util/dateFunctions';
import { estadoColorReserva } from '@/common/util/statusFunctios';
import { formatSemicolon } from '@/common/util/numbersFuntios';


export interface ReservationData {
  bookId: string;
  bookStatus: { code: string };
  userIdRenterNavigation: { name: string, lastName: string };
  gests: number;
  checkin: string;
  checkout: string;
  datetimePayment: string;
  listingRent: { name: string };
  paymentCode: string;
  amountTotal: string;
}

interface ReservationsTablePDFProps {
  reservations: ReservationData[];
  dateRangeText?: string;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 9,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  table: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  tableRow: {
    flexDirection: 'row',
    width: '100%',
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#bdc3c7',
    backgroundColor: '#ecf0f1',
    padding: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    minHeight: 35,
  },
  tableCol: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#bdc3c7',
    padding: 6,
    display: 'flex',
    justifyContent: 'center',
    minHeight: 35,
  },
  // Column widths
  colStatus: { 
    width: '12%',
    alignItems: 'center',
  },
  colGuest: { 
    width: '18%',
  },
  colDates: { 
    width: '18%',
  },
  colBooked: { 
    width: '15%',
  },
  colProperty: { 
    width: '15%',
  },
  colCode: { 
    width: '12%',
    alignItems: 'center',
  },
  colTotal: { 
    width: '10%',
    alignItems: 'flex-end',
  },
  
  statusChip: {
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 7,
    fontWeight: 'bold',
  },
  cellText: {
    fontSize: 8,
    marginBottom: 1,
    lineHeight: 1.3,
  },
  subText: {
    fontSize: 7,
    color: '#7f8c8d',
    lineHeight: 1.2,
  },
  headerText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  }
});

const ReservationsTablePDF: React.FC<ReservationsTablePDFProps> = ({ reservations, dateRangeText }) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Reporte de Reservaciones</Text>
          {dateRangeText && <Text style={styles.subtitle}>{dateRangeText}</Text>}
        </View>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, styles.colStatus]}>
              <Text style={styles.headerText}>Estado</Text>
            </View>
            <View style={[styles.tableColHeader, styles.colGuest]}>
              <Text style={styles.headerText}>Huésped</Text>
            </View>
            <View style={[styles.tableColHeader, styles.colDates]}>
              <Text style={styles.headerText}>Llegada/Salida</Text>
            </View>
            <View style={[styles.tableColHeader, styles.colBooked]}>
              <Text style={styles.headerText}>Reservado</Text>
            </View>
            <View style={[styles.tableColHeader, styles.colProperty]}>
              <Text style={styles.headerText}>Inmueble</Text>
            </View>
            <View style={[styles.tableColHeader, styles.colCode]}>
              <Text style={styles.headerText}>Código</Text>
            </View>
            <View style={[styles.tableColHeader, styles.colTotal, { borderRightWidth: 0 }]}>
              <Text style={styles.headerText}>Total</Text>
            </View>
          </View>

          {/* Table Body */}
          {reservations.map((row:any, index) => {
             const estadoResult: any = estadoColorReserva(row?.bookStatus?.code, row?.checkin, row?.checkout);
             const chipStyle = {
                 backgroundColor: estadoResult?.bg || '#e0e0e0',
                 color: estadoResult?.color || '#000000',
             };
             
             // Eliminar el borde inferior de la última fila
             const isLastRow = index === reservations.length - 1;

            return (
              <View 
                style={[
                  styles.tableRow, 
                  isLastRow ? { borderBottomWidth: 0 } : {}
                ]} 
                key={row.bookId}
              >
                <View style={[
                  styles.tableCol, 
                  styles.colStatus,
                  isLastRow ? { borderBottomWidth: 0 } : {}
                ]}>
                   <View style={[styles.statusChip, { backgroundColor: chipStyle.backgroundColor }]}>
                      <Text style={[styles.statusText, { color: chipStyle.color }]}>
                        {estadoResult?.estado || 'Desconocido'}
                      </Text>
                   </View>
                </View>
                <View style={[
                  styles.tableCol, 
                  styles.colGuest,
                 isLastRow ? { borderBottomWidth: 0 } : {}
                ]}>
                  <Text style={styles.cellText}>
                    {row?.userIdRenterNavigation?.name} {row?.userIdRenterNavigation?.lastName}
                  </Text>
                  <Text style={styles.subText}>{row?.gests} adulto(s)</Text>
                </View>
                <View style={[
                  styles.tableCol, 
                  styles.colDates,
                  isLastRow ? { borderBottomWidth: 0 } : {}
                ]}>
                  <Text style={styles.cellText}>{formatearFechaYHora(row?.checkin)?.fecha}</Text>
                  <Text style={styles.cellText}>{formatearFechaYHora(row?.checkout)?.fecha}</Text>
                </View>
                <View style={[
                  styles.tableCol, 
                  styles.colBooked,
                  isLastRow ? { borderBottomWidth: 0 } : {}
                ]}>
                  <Text style={styles.cellText}>{formatearFechaYHora(row?.datetimePayment)?.fecha}</Text>
                  <Text style={styles.subText}>{formatearFechaYHora(row?.datetimePayment)?.hora}</Text>
                </View>
                <View style={[
                  styles.tableCol, 
                  styles.colProperty,
                  isLastRow ? { borderBottomWidth: 0 } : {}
                ]}>
                  <Text style={styles.cellText}>{row?.listingRent?.name}</Text>
                </View>
                <View style={[
                  styles.tableCol, 
                  styles.colCode,
                  isLastRow ? { borderBottomWidth: 0 } : {}
                ]}>
                  <Text style={styles.cellText}>{row?.paymentCode}</Text>
                </View>
                <View style={[
                  styles.tableCol, 
                  styles.colTotal,
                  isLastRow ? { borderBottomWidth: 0 } : {},
                  { borderRightWidth: 0 }
                ]}>
                  <Text style={styles.cellText}>{formatSemicolon(row?.payPriceCalculations?.[0]?.priceCalculation?.hostResume?.amountToCollect??0)}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default ReservationsTablePDF;
