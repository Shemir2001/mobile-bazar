import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 10 },
  header: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, marginBottom: 5 },
  tableRow: { flexDirection: 'row', marginBottom: 5 },
  colItem: { flex: 4 },
  colQty: { flex: 1, textAlign: 'center' },
  colPrice: { flex: 2, textAlign: 'right' },
  colTotal: { flex: 2, textAlign: 'right' },
});

export default function OrderSlipDocument({ order }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Order Slip / Invoice</Text>

        <View style={styles.section}>
          <Text>Order Number: {order.orderNumber}</Text>
          <Text>Order ID: {order._id}</Text>
          <Text>Email: {order.email}</Text>
          <Text>Status: {order.status.toUpperCase()}</Text>
          <Text>Payment Method: {order.paymentMethod.toUpperCase()}</Text>
          <Text>Order Date: {new Date(order.createdAt).toLocaleString()}</Text>
        </View>

        <View style={styles.section}>
          <Text>Shipping Address:</Text>
          <Text>{order.shippingAddress.name}</Text>
          <Text>{order.shippingAddress.address}</Text>
          <Text>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </Text>
          <Text>{order.shippingAddress.country}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={styles.colItem}>Item Name</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colPrice}>Price</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>

          {order.items.map((item, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.colItem}>{item.name}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>${item.price.toFixed(2)}</Text>
              <Text style={styles.colTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text>Items Price: ${order.itemsPrice.toFixed(2)}</Text>
          <Text>Tax: ${order.taxPrice.toFixed(2)}</Text>
          <Text>Shipping: ${order.shippingPrice.toFixed(2)}</Text>
          <Text style={{ fontWeight: 'bold' }}>Total: ${order.totalPrice.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
}
