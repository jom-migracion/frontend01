import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Registrar fuentes (opcional)
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

// Interfaces
interface Reservation {
  huesped: string;
  checkIn: string;
  checkOut: string;
  estadoPago: 'Pagado' | 'Próximo' | 'Cancelado';
  montoPagado: number;
  comisionAssert: number;
  pagoNeto: number;
}

interface PerformanceSummary {
  ingresos: number;
  nReservas: number;
  nNochesReservadas: number;
  ocupacion: number;
  comisionAssert: number;
}

interface PropertyDetailReportPDFProps {
  propertyName?: string;
  dateRange?: string;
  summaryData: PerformanceSummary;
  reservations: Reservation[];
}

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 8,
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  dateRange: {
    fontSize: 10,
    color: '#95a5a6',
    marginBottom: 30,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#bdc3c7',
    marginBottom: 30,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '14.28%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#bdc3c7',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  tableCol: {
    width: '14.28%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#bdc3c7',
    padding: 8,
  },
  tableCellHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  tableCellText: {
    fontSize: 9,
    color: '#2c3e50',
    textAlign: 'center',
  },
  tableCellTextRight: {
    fontSize: 9,
    color: '#2c3e50',
    textAlign: 'right',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 5,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statusSubtext: {
    fontSize: 7,
    color: '#7f8c8d',
    marginTop: 1,
  },
  summarySection: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 3,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
    textAlign: 'center',
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryColumn: {
    width: '45%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 8,
    color: '#95a5a6',
  },
});

const PropertyDetailReportPDF: React.FC<PropertyDetailReportPDFProps> = ({
  propertyName = 'Apartamento en el centro',
  dateRange = '1 sep. - 27 sep. 2025',
  reservations,
}) => {
  // Función para obtener el color del estado
  const getStatusColor = (estado: Reservation['estadoPago']) => {
    switch (estado) {
      case 'Pagado':
        return 'rgb(189, 192, 192)';
      case 'Próximo':
        return 'rgb(189, 192, 192)';
      case 'Cancelado':
        return 'rgb(189, 192, 192)';
      default:
        return 'rgb(189, 192, 192)';
    }
  };

  // Calcular totales para el resumen
  const totalReservations = reservations.length;
  const totalAmount = reservations.reduce((sum, res) => sum + res.montoPagado, 0);
  const totalCommission = reservations.reduce((sum, res) => sum + res.comisionAssert, 0);
  const averageAmount = totalReservations > 0 ? totalAmount / totalReservations : 0;

  // Contar por estado
  const statusCounts = reservations.reduce(
    (acc, res) => {
      acc[res.estadoPago] = (acc[res.estadoPago] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{propertyName}</Text>
          <Text style={styles.subtitle}>Análisis detallado de rendimiento</Text>
          <Text style={styles.dateRange}>Generado el {dateRange}</Text>
        </View>

        {/* Tabla de Reservas */}
        <View style={styles.table}>
          {/* Header de la tabla */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeaderText}>Estado</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeaderText}>Huésped</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeaderText}>Check-in</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeaderText}>Check-out</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeaderText}>Monto (BOB)</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeaderText}>Comisión Assert</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeaderText}>Pago Neto</Text>
            </View>
          </View>

          {/* Filas de datos */}
          {reservations.map((reservation, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: getStatusColor(reservation.estadoPago) },
                    ]}
                  />
                  <View>
                    <Text style={styles.statusText}>{reservation.estadoPago}</Text>
                    <Text style={styles.statusSubtext}>
                      {reservation.estadoPago === 'Pagado' && 'Pago confirmado'}
                      {reservation.estadoPago === 'Próximo' && 'Pago pendiente'}
                      {reservation.estadoPago === 'Cancelado' && 'Reserva cancelada'}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellText}>{reservation.huesped}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellText}>{reservation.checkIn}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellText}>{reservation.checkOut}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellTextRight}>
                  BOB{' '}
                  {reservation.montoPagado.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellTextRight}>
                  BOB{' '}
                  {reservation.comisionAssert.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellTextRight}>
                  BOB {reservation.pagoNeto.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Resumen */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Resumen del Análisis de Rendimiento</Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryColumn}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total de Reservas:</Text>
                <Text style={styles.summaryValue}>{totalReservations}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Monto Total:</Text>
                <Text style={styles.summaryValue}>
                  BOB {totalAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Comisión Total:</Text>
                <Text style={styles.summaryValue}>
                  BOB {totalCommission.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
            <View style={styles.summaryColumn}>
              {Object.entries(statusCounts).map(([estado, count]) => (
                <View style={styles.summaryRow} key={estado}>
                  <Text style={styles.summaryLabel}>{estado}:</Text>
                  <Text style={styles.summaryValue}>{count}</Text>
                </View>
              ))}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Promedio por Reserva:</Text>
                <Text style={styles.summaryValue}>
                  BOB {averageAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generado el{' '}
          {new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          - Assert Dashboard
        </Text>
      </Page>
    </Document>
  );
};

export default PropertyDetailReportPDF;
