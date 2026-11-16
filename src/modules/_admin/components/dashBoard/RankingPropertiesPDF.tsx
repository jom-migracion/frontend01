import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { PropertyRanking } from './RankingProperties';

// Registrar fuentes (opcional, puedes usar fuentes del sistema)
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

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
    width: '13%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#bdc3c7',
    backgroundColor: '#ecf0f1',
    padding: 4,
  },
  tableCol: {
    width: '13%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#bdc3c7',
    padding: 4,
  },
  tableColProperty: {
    width: '22%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#bdc3c7',
    padding: 4,
  },
  tableColHeaderProperty: {
    width: '22%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#bdc3c7',
    backgroundColor: '#ecf0f1',
    padding: 4,
  },
  tableColRank: {
    width: '5%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#bdc3c7',
    padding: 4,
  },
  tableColHeaderRank: {
    width: '5%',
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
  propertyName: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 1,
  },
  propertyDescription: {
    fontSize: 6,
    color: '#7f8c8d',
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
});

interface RankingPropertiesPDFProps {
  properties: PropertyRanking[];
  dateRange?: string;
}

const RankingPropertiesPDF: React.FC<RankingPropertiesPDFProps> = ({
  properties,
  dateRange = '1 sep. – 27 sep. 2025',
}) => {
  // Calcular totales para el resumen
  const totalIncome = properties.reduce((sum, prop) => sum + prop.income, 0);
  const totalReservations = properties.reduce((sum, prop) => sum + prop.reservationCount, 0);
  const averageOccupancy =
    properties.length > 0
      ? properties.reduce((sum, prop) => sum + prop.occupancyRate, 0) / properties.length
      : 0;
  const totalOccupiedDays = properties.reduce((sum, prop) => sum + prop.occupiedDays, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Ranking de Propiedades</Text>
          <Text style={styles.subtitle}>Por ingresos</Text>
          <Text style={styles.dateRange}>{dateRange}</Text>
        </View>

        {/* Tabla */}
        <View style={styles.table}>
          {/* Header de la tabla */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeaderRank}>
              <Text style={styles.tableCellHeaderText}>#</Text>
            </View>
            <View style={styles.tableColHeaderProperty}>
              <Text style={styles.tableCellHeaderText}>Propiedad</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeaderText}>Ingresos (BOB)</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeaderText}>N° Reservas</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeaderText}>Ocupación %</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeaderText}>Días Ocupados</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeaderText}>Total Renta (BOB)</Text>
            </View>
          </View>

          {/* Filas de datos */}
          {properties.map((property, index) => (
            <View style={styles.tableRow} key={property.listingRentId}>
              <View style={styles.tableColRank}>
                <Text style={styles.tableCellText}>{index + 1}</Text>
              </View>
              <View style={styles.tableColProperty}>
                <Text style={styles.propertyName}>{property.listingRentTitle}</Text>
                <Text style={styles.propertyDescription}>
                  {property.listingRentDescription.length > 50
                    ? `${property.listingRentDescription.substring(0, 50)}...`
                    : property.listingRentDescription}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellText}>
                  {property.income.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellText}>{property.reservationCount}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellText}>{property.occupancyRate.toFixed(2)}%</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellText}>{property.occupiedDays}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellText}>
                  {property.totalRent.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Resumen */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Resumen General</Text>
          <View style={styles.summaryColumn}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Propiedades:</Text>
              <Text style={styles.summaryValue}>{properties.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Reservas:</Text>
              <Text style={styles.summaryValue}>{totalReservations}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Días Ocupados:</Text>
              <Text style={styles.summaryValue}>{totalOccupiedDays}</Text>
            </View>
          </View>
          <View style={styles.summaryColumn}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ingresos Totales:</Text>
              <Text style={styles.summaryValue}>
                BOB {totalIncome.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ocupación Promedio:</Text>
              <Text style={styles.summaryValue}>{averageOccupancy.toFixed(2)}%</Text>
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

export default RankingPropertiesPDF;
