import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

// Interface para los datos de pagos realizados
export interface PaymentRowData {
  id: string;
  estado: string;
  detalleEstado: string;
  fecha: string;
  propiedad: string;
  detallePropiedad: string;
  monto: string;
  metodo: string;
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
    marginBottom: 15,
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
    marginBottom: 15,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#bdc3c7',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '18%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#bdc3c7',
    backgroundColor: '#ecf0f1',
    padding: 4,
  },
  tableCol: {
    width: '18%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#bdc3c7',
    padding: 4,
  },
  tableColEstado: {
    width: '22%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#bdc3c7',
    padding: 4,
  },
  tableColHeaderEstado: {
    width: '22%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#bdc3c7',
    backgroundColor: '#ecf0f1',
    padding: 4,
  },
  tableColPropiedad: {
    width: '24%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#bdc3c7',
    padding: 4,
  },
  tableColHeaderPropiedad: {
    width: '24%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#bdc3c7',
    backgroundColor: '#ecf0f1',
    padding: 4,
  },
  tableCellHeaderText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  tableCellText: {
    fontSize: 7,
    color: '#2c3e50',
    textAlign: 'center',
  },
  tableCellTextLeft: {
    fontSize: 7,
    color: '#2c3e50',
    textAlign: 'left',
  },
  estadoText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 1,
  },
  detalleEstadoText: {
    fontSize: 6,
    color: '#7f8c8d',
  },
  propertyText: {
    fontSize: 7,
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
  summarySection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  summaryColumn: {
    width: '45%',
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
    textAlign: 'center',
    width: '100%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  summaryLabel: {
    fontSize: 8,
    color: '#7f8c8d',
  },
  summaryValue: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statusIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 2,
    marginTop: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

interface FinancialPayTablePDFProps {
  paymentsData: PaymentRowData[];
  dateRange?: string;
}

const FinancialPayTablePDF: React.FC<FinancialPayTablePDFProps> = ({
  paymentsData,
  dateRange = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
}) => {
  // Calcular totales para el resumen
  const totalAmount = paymentsData.reduce((sum, row) => {
    const amount = parseFloat(row.monto.replace('BOB ', '').replace(/[,\.]/g, ''));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalPayments = paymentsData.length;

  // Contar por estado
  const statusCounts = paymentsData.reduce(
    (acc, row) => {
      acc[row.estado] = (acc[row.estado] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Función para obtener color del estado (rojo para pendiente)
  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return '#d9534f';
      case 'pagado':
      case 'completado':
        return '#4caf50';
      case 'en proceso':
        return '#ffc107';
      default:
        return '#95a5a6';
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reporte de Pagos Realizados</Text>
          <Text style={styles.subtitle}>Historial de Transacciones</Text>
          <Text style={styles.dateRange}>Generado el {dateRange}</Text>
        </View>

        {/* Tabla */}
        <View style={styles.table}>
          {/* Header de la tabla */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeaderEstado}>
              <Text style={styles.tableCellHeaderText}>Estado</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeaderText}>Fecha</Text>
            </View>
            <View style={styles.tableColHeaderPropiedad}>
              <Text style={styles.tableCellHeaderText}>Propiedad</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeaderText}>Monto (BOB)</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeaderText}>Método de Pago</Text>
            </View>
          </View>

          {/* Filas de datos */}
          {paymentsData.map((row) => (
            <View style={styles.tableRow} key={row.id}>
              <View style={styles.tableColEstado}>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: getStatusColor(row.estado) },
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.estadoText}>{row.estado}</Text>
                    <Text style={styles.detalleEstadoText}>
                      {row.detalleEstado.length > 25
                        ? `${row.detalleEstado.substring(0, 25)}...`
                        : row.detalleEstado}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellText}>{row.fecha}</Text>
              </View>
              <View style={styles.tableColPropiedad}>
                <Text style={styles.propertyText}>
                  {row.propiedad.length > 30
                    ? `${row.propiedad.substring(0, 30)}...`
                    : row.propiedad}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellText}>{row.monto}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellText}>
                  {row.metodo.length > 20 ? `${row.metodo.substring(0, 20)}...` : row.metodo}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Resumen */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Resumen de Pagos Realizados</Text>
          <View style={styles.summaryColumn}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total de Pagos:</Text>
              <Text style={styles.summaryValue}>{totalPayments}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Monto Total:</Text>
              <Text style={styles.summaryValue}>
                BOB {totalAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
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
              <Text style={styles.summaryLabel}>Promedio por Pago:</Text>
              <Text style={styles.summaryValue}>
                BOB{' '}
                {totalPayments > 0
                  ? (totalAmount / totalPayments).toLocaleString('es-BO', {
                      minimumFractionDigits: 2,
                    })
                  : '0,00'}
              </Text>
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

export default FinancialPayTablePDF;
