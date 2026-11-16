import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface InvoiceDetail {
  productCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

interface InvoicePdfDocumentProps {
  invoiceNumber: string;
  nit: string,
  date: string;
  totalAmount: string;
  clientName?: string;
  clientDocument?: string;
  authorizationCode?: string;
  literalAmount?: string;
  subtotalAmount?: string;
  discountAmount?: string;
  items?: InvoiceDetail[];
  issuerName?: string;
  issuerBranchName?: string;
  issuerCity?: string;
  issuerAddress?: string[];
  issuerPhone?: string[];
  legend?: string;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    color: '#1A2138',
    fontFamily: 'Helvetica',
    padding: 32,
    fontSize: 9,
    lineHeight: 1.4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  companyBlock: {
    width: '45%',
  },
  invoiceBlock: {
    width: '50%',
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A2138',
    marginBottom: 4,
  },
  companyDetails: {
    color: '#555555',
    fontSize: 9,
    marginBottom: 2,
  },
  companyNit: {
    fontWeight: 'bold',
    fontSize: 9,
    marginTop: 4,
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A2138',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  invoiceMetaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 3,
  },
  metaLabel: {
    color: '#555555',
    marginRight: 4,
  },
  metaValue: {
    fontWeight: 'bold',
  },
  authRow: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  authValue: {
    fontWeight: 'bold',
    fontSize: 8,
    marginTop: 2,
    // maxWidth: 220,
    textAlign: 'right',
    lineHeight: 1.2,
  },
  sectionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginVertical: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoBlock: {
    width: '48%',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555555',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dataLabel: {
    width: 110,
    color: '#555555',
  },
  dataValue: {
    fontWeight: 'bold',
    flex: 1,
  },
  tableContainer: {
    width: '100%',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1A2138',
    paddingBottom: 6,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  colCode: { width: '10%', textAlign: 'left' },
  colDesc: { width: '50%', textAlign: 'left' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'right' },
  colSub: { width: '15%', textAlign: 'right' },
  thText: {
    color: '#555555',
    fontSize: 9,
    fontWeight: 'bold',
  },
  tdText: {
    fontSize: 9,
  },
  tdBold: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  totalsBlock: {
    width: 220,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#1A2138',
    marginVertical: 6,
  },
  totalTextBig: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  literalBox: {
    textAlign: 'right',
    fontSize: 8,
    fontStyle: 'italic',
    color: '#555555',
    marginTop: 2,
  },
  legalFooter: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 8,
    color: '#333333',
    lineHeight: 1.5,
  },
  legalMain: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

/* const splitLongCode = (code: string) => {
  if (!code) return '';
  // el cuf se divide a la mitad
  if (code.length > 30) {
    const midpoint = Math.ceil(code.length / 2);
    return `${code.substring(0, midpoint)}\n${code.substring(midpoint)}`;
  }
  return code;
}; */

const InvoicePdfDocument: React.FC<InvoicePdfDocumentProps> = ({
  invoiceNumber,
  nit = '',
  date,
  totalAmount,
  clientName = '',
  clientDocument = '',
  // authorizationCode = '',
  literalAmount = '',
  subtotalAmount = '0,00',
  // discountAmount = '0,00',
  items = [],
  
  issuerName = '',
  issuerBranchName = '',
  issuerCity = '',
  issuerAddress = '',
  issuerPhone = '',
  legend = ''
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ENCABEZADO FISCAL */}
        <View style={styles.headerContainer}>
          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>{issuerName || 'JOM'}</Text>
            <Text style={styles.companyDetails}>{issuerBranchName || 'Sin datos'}</Text>
            <Text style={styles.companyDetails}>
              Dirección: <Text style={styles.dataValue}>{issuerAddress || 'Sin datos'}</Text>
            </Text>
            <Text style={styles.companyDetails}>
              Celular: <Text style={styles.dataValue}>{issuerPhone || 'Sin datos'}</Text>
            </Text>
          </View>

          <View style={styles.invoiceBlock}>
            <Text style={styles.invoiceTitle}>FACTURA</Text>

            <View style={styles.invoiceMetaRow}>
              <Text style={styles.metaLabel}>NIT:</Text>
              <Text style={styles.metaValue}>{nit || '00000000'}</Text>
            </View>
            <View style={styles.invoiceMetaRow}>
              <Text style={styles.metaLabel}>N° FACTURA:</Text>
              <Text style={styles.metaValue}>{invoiceNumber || '00000000'}</Text>
            </View>
            {/* <View style={styles.authRow}>
              <Text style={styles.metaLabel}>CÓD. AUTORIZACIÓN:</Text>
              <Text style={styles.metaValue}>{splitLongCode(authorizationCode)}</Text>
            </View> */}
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* SECCIÓN DATOS CLIENTE Y UBICACIÓN */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.sectionTitle}>DATOS DEL CLIENTE</Text>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Nombre/Razón Social:</Text>
              <Text style={styles.dataValue}>{clientName}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>NIT/CI:</Text>
              <Text style={styles.dataValue}>{clientDocument}</Text>
            </View>
          </View>

          <View style={[styles.infoBlock, { textAlign: 'right' }]}>
            <Text style={styles.sectionTitle}>LUGAR Y FECHA</Text>
            <Text style={styles.dataValue}>{date}</Text>
            <Text style={styles.companyDetails}>{issuerCity}</Text>
          </View>
        </View>

        {/* TABLA DE CONCEPTOS */}
        <View style={styles.tableContainer}>
          {/* Headers */}
          <View style={styles.tableHeader}>
            <Text style={[styles.colCode, styles.thText]}>CÓDIGO</Text>
            <Text style={[styles.colDesc, styles.thText]}>DESCRIPCIÓN</Text>
            <Text style={[styles.colQty, styles.thText]}>CANTIDAD</Text>
            <Text style={[styles.colPrice, styles.thText]}>P. UNITARIO</Text>
            <Text style={[styles.colSub, styles.thText]}>SUBTOTAL</Text>
          </View>

          {/* Detalle */}
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>

              <Text style={[styles.colCode, styles.tdText]}>{index + 1}</Text>
              <Text style={[styles.colDesc, styles.tdText]}>
                {item.description}
              </Text>
              <Text style={[styles.colQty, styles.tdText]}>{item.quantity}</Text>
              <Text style={[styles.colPrice, styles.tdText]}>{item.unitPrice.toFixed(2)}</Text>
              <Text style={[styles.colSub, styles.tdBold]}>{item.subTotal.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* TOTALES Y LITERAL */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBlock}>
            <View style={styles.totalRow}>
              <Text style={styles.metaLabel}>Subtotal</Text>
              <Text style={styles.metaValue}>BOB {subtotalAmount}</Text>
            </View>
            {/* <View style={styles.totalRow}>
              <Text style={styles.metaLabel}>Descuento</Text>
              <Text style={styles.metaValue}>{discountAmount}</Text>
            </View> */}

            <View style={styles.totalDivider} />

            <View style={styles.totalRow}>
              <Text style={[styles.metaLabel, styles.totalTextBig]}>TOTAL</Text>
              <Text style={[styles.metaValue, styles.totalTextBig]}>BOB {totalAmount}</Text>
            </View>

            <Text style={styles.literalBox}>
              {literalAmount}
            </Text>
          </View>
        </View>

        {/* PIE DE PÁGINA NORMATIVO DE IMPUESTOS */}
        <View style={styles.legalFooter}>
          <Text style={styles.legalMain}>
            "ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAÍS, EL USO ILÍCITO DE ÉSTA SERÁ SANCIONADO DE ACUERDO CON LA LEY"
          </Text>
          <Text style={styles.legalMain}>
            {legend}
          </Text>
        </View>

      </Page>
    </Document>
  );
};

export default InvoicePdfDocument;