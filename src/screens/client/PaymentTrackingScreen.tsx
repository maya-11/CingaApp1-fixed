import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Text, 
  Button, 
  Divider, 
  List, 
  Chip,
  ProgressBar,
  useTheme
} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types';

type PaymentTrackingScreenNavigationProp = StackNavigationProp<ClientStackParamList, 'PaymentTracking'>;

interface Props {
  navigation: PaymentTrackingScreenNavigationProp;
  route: any;
}

const PaymentTrackingScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const { project } = route.params || {};

  // Mock payment data
  const paymentData = {
    budget: {
      total: 50000,
      spent: 32500,
      remaining: 17500,
      usagePercentage: 65
    },
    payments: [
      {
        id: '1',
        date: '2025-01-15',
        description: 'Initial Deposit',
        amount: 15000,
        status: 'paid' as const,
        invoiceNumber: 'INV-001',
        dueDate: '2025-01-10'
      },
      {
        id: '2',
        date: '2025-02-01', 
        description: 'Progress Payment - Design Phase',
        amount: 8000,
        status: 'paid' as const,
        invoiceNumber: 'INV-002',
        dueDate: '2025-01-30'
      },
      {
        id: '3',
        date: '2025-02-15',
        description: 'Progress Payment - Development',
        amount: 9500,
        status: 'paid' as const,
        invoiceNumber: 'INV-003',
        dueDate: '2025-02-14'
      },
      {
        id: '4',
        date: '2025-03-01',
        description: 'Progress Payment - Testing',
        amount: 7500,
        status: 'pending' as const,
        invoiceNumber: 'INV-004',
        dueDate: '2025-02-28'
      },
      {
        id: '5',
        date: '2025-03-15',
        description: 'Final Payment - Project Delivery',
        amount: 10000,
        status: 'upcoming' as const,
        invoiceNumber: 'INV-005',
        dueDate: '2025-03-14'
      }
    ],
    upcomingPayments: [
      {
        id: '4',
        description: 'Progress Payment - Testing',
        amount: 7500,
        dueDate: '2025-02-28',
        status: 'pending' as const
      },
      {
        id: '5', 
        description: 'Final Payment - Project Delivery',
        amount: 10000,
        dueDate: '2025-03-14',
        status: 'upcoming' as const
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'upcoming': return '#2196F3';
      default: return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'upcoming': return 'Upcoming';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return `R ${amount.toLocaleString()}`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Budget Overview */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Budget Overview</Title>
          <Paragraph>Track your project budget and spending</Paragraph>
          
          <Divider style={styles.divider} />
          
          {/* Budget Stats */}
          <View style={styles.budgetStats}>
            <View style={styles.budgetItem}>
              <Text variant="labelSmall">TOTAL BUDGET</Text>
              <Text variant="titleLarge" style={styles.budgetAmount}>
                {formatCurrency(paymentData.budget.total)}
              </Text>
            </View>
            <View style={styles.budgetItem}>
              <Text variant="labelSmall">AMOUNT SPENT</Text>
              <Text variant="titleLarge" style={styles.spentAmount}>
                {formatCurrency(paymentData.budget.spent)}
              </Text>
            </View>
            <View style={styles.budgetItem}>
              <Text variant="labelSmall">REMAINING</Text>
              <Text variant="titleLarge" style={styles.remainingAmount}>
                {formatCurrency(paymentData.budget.remaining)}
              </Text>
            </View>
          </View>

          {/* Budget Progress */}
          <View style={styles.budgetProgress}>
            <View style={styles.budgetProgressLabels}>
              <Text variant="bodyMedium">Budget Usage: {paymentData.budget.usagePercentage}%</Text>
              <Text variant="bodyMedium">
                {formatCurrency(paymentData.budget.spent)} / {formatCurrency(paymentData.budget.total)}
              </Text>
            </View>
            <ProgressBar 
              progress={paymentData.budget.usagePercentage / 100} 
              style={styles.budgetProgressBar}
              color={
                paymentData.budget.usagePercentage > 80 ? '#F44336' : 
                paymentData.budget.usagePercentage > 60 ? '#FF9800' : '#4CAF50'
              }
            />
          </View>
        </Card.Content>
      </Card>

      {/* Upcoming Payments */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Upcoming Payments</Title>
            <Text variant="bodyMedium" style={styles.sectionSubtitle}>
              {paymentData.upcomingPayments.length} payments due
            </Text>
          </View>

          {paymentData.upcomingPayments.map((payment) => (
            <Card key={payment.id} style={styles.paymentItem} mode="outlined">
              <Card.Content>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentInfo}>
                    <Text variant="titleSmall" style={styles.paymentDescription}>
                      {payment.description}
                    </Text>
                    <Text variant="bodySmall" style={styles.paymentDate}>
                      Due: {payment.dueDate}
                    </Text>
                  </View>
                  <View style={styles.paymentAmount}>
                    <Text variant="titleMedium" style={styles.amountText}>
                      {formatCurrency(payment.amount)}
                    </Text>
                    <Chip 
                      mode="outlined"
                      textStyle={{ 
                        color: getStatusColor(payment.status),
                        fontSize: 12 
                      }}
                    >
                      {getStatusText(payment.status)}
                    </Chip>
                  </View>
                </View>
                <Button 
                  mode="text" 
                  compact
                  icon="file-document-outline"
                  style={styles.invoiceButton}
                >
                  View Invoice
                </Button>
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>

      {/* Payment History */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Payment History</Title>
            <Text variant="bodyMedium" style={styles.sectionSubtitle}>
              {paymentData.payments.filter(p => p.status === 'paid').length} completed payments
            </Text>
          </View>

          {paymentData.payments.map((payment) => (
            <List.Item
              key={payment.id}
              title={payment.description}
              description={`${payment.date} • ${payment.invoiceNumber}`}
              left={props => (
                <List.Icon 
                  {...props} 
                  icon="cash" 
                  color={getStatusColor(payment.status)}
                />
              )}
              right={props => (
                <View style={styles.paymentRight}>
                  <Text variant="bodyLarge" style={styles.amountText}>
                    {formatCurrency(payment.amount)}
                  </Text>
                  <Chip 
                    mode="flat"
                    compact
                    textStyle={{ 
                      color: getStatusColor(payment.status),
                      fontSize: 10 
                    }}
                  >
                    {getStatusText(payment.status)}
                  </Chip>
                </View>
              )}
              style={styles.listItem}
            />
          ))}
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Payment Actions</Title>
          <View style={styles.actionButtons}>
            <Button 
              mode="contained" 
              icon="file-document-multiple-outline"
              style={styles.actionButton}
            >
              Download All Invoices
            </Button>
            <Button 
              mode="outlined" 
              icon="help-circle-outline"
              style={styles.actionButton}
            >
              Payment Help
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  budgetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  budgetItem: {
    alignItems: 'center',
    flex: 1,
  },
  budgetAmount: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  spentAmount: {
    color: '#FF9800',
    fontWeight: 'bold',
  },
  remainingAmount: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  budgetProgress: {
    marginTop: 8,
  },
  budgetProgressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  budgetProgressBar: {
    height: 8,
    borderRadius: 4,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#666',
  },
  paymentItem: {
    marginBottom: 12,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  paymentInfo: {
    flex: 1,
    marginRight: 12,
  },
  paymentDescription: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paymentDate: {
    color: '#666',
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  invoiceButton: {
    alignSelf: 'flex-start',
  },
  listItem: {
    paddingVertical: 8,
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    marginTop: 4,
  },
});

export default PaymentTrackingScreen;