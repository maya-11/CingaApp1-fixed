import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Button, ProgressBar, Chip, ActivityIndicator } from 'react-native-paper';
import { Project } from '../types';
import AppHeader from '../components/AppHeader';

interface BudgetScreenProps {
  navigation: any;
  route: any;
}

// Local budget service for development
const budgetService = {
  getProjectBudget: async (projectId: string) => {
    // Mock data - simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      budget: 50000,
      current_spent: 25000,
      money_left: 25000,
      days_left: 30,
    };
  },
  
  updateProjectSpending: async (projectId: string, amount: number, type: 'expense' | 'income') => {
    // Mock implementation - simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Updating ${type} for project ${projectId}: R${amount}`);
    return { success: true };
  }
};

const BudgetScreen: React.FC<BudgetScreenProps> = ({ navigation, route }) => {
  const { project } = route.params;
  const [budgetData, setBudgetData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch budget data
  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        setLoading(true);
        const data = await budgetService.getProjectBudget(project.id.toString());
        setBudgetData(data);
      } catch (error) {
        console.error('Failed to fetch budget data:', error);
        // Fallback data
        setBudgetData({
          budget: project.budget || 50000,
          current_spent: project.current_spent || 25000,
          money_left: (project.budget || 50000) - (project.current_spent || 25000),
          days_left: Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, [project.id]);

  const handleAddExpense = async () => {
    Alert.prompt(
      'Add Expense',
      'Enter expense amount:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: async (amount?: string) => { 
            if (amount && !isNaN(parseFloat(amount))) {
              try {
                setUpdating(true);
                await budgetService.updateProjectSpending(
                  project.id.toString(), 
                  parseFloat(amount), 
                  'expense'
                );
                
                // Update local state
                const expenseAmount = parseFloat(amount);
                const updatedData = {
                  ...budgetData,
                  current_spent: (budgetData.current_spent || 0) + expenseAmount,
                  money_left: (budgetData.budget || 0) - ((budgetData.current_spent || 0) + expenseAmount)
                };
                setBudgetData(updatedData);
                Alert.alert('Success', `Expense of R${expenseAmount.toLocaleString()} added successfully!`);
              } catch (error) {
                Alert.alert('Error', 'Failed to add expense');
              } finally {
                setUpdating(false);
              }
            } else {
              Alert.alert('Error', 'Please enter a valid amount');
            }
          }
        }
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const handleAddIncome = async () => {
    Alert.prompt(
      'Add Income',
      'Enter income amount:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: async (amount?: string) => {  
            if (amount && !isNaN(parseFloat(amount))) {
              try {
                setUpdating(true);
                await budgetService.updateProjectSpending(
                  project.id.toString(), 
                  parseFloat(amount), 
                  'income'
                );
                
                // Update local state
                const incomeAmount = parseFloat(amount);
                const updatedData = {
                  ...budgetData,
                  budget: (budgetData.budget || 0) + incomeAmount,
                  money_left: ((budgetData.budget || 0) + incomeAmount) - (budgetData.current_spent || 0)
                };
                setBudgetData(updatedData);
                Alert.alert('Success', `Income of R${incomeAmount.toLocaleString()} added successfully!`);
              } catch (error) {
                Alert.alert('Error', 'Failed to add income');
              } finally {
                setUpdating(false);
              }
            } else {
              Alert.alert('Error', 'Please enter a valid amount');
            }
          }
        }
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading budget data...</Text>
      </View>
    );
  }

  const budget = budgetData?.budget || 0;
  const spent = budgetData?.current_spent || 0;
  const remaining = budgetData?.money_left || 0;
  const daysLeft = budgetData?.days_left || 0;
  const budgetUsage = budget > 0 ? (spent / budget) * 100 : 0;

  return (
    <>
      <AppHeader title="Project Budget" showBackButton={true} />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Budget Overview */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Budget Overview</Title>
            
            <View style={styles.statsGrid}>
              <Card style={styles.statCard}>
                <Card.Content style={styles.statContent}>
                  <Text style={styles.statLabel}>Total Budget</Text>
                  <Text style={styles.statValue}>R{budget.toLocaleString()}</Text>
                </Card.Content>
              </Card>

              <Card style={styles.statCard}>
                <Card.Content style={styles.statContent}>
                  <Text style={styles.statLabel}>Amount Spent</Text>
                  <Text style={styles.statValue}>R{spent.toLocaleString()}</Text>
                </Card.Content>
              </Card>
            </View>

            <View style={styles.statsGrid}>
              <Card style={styles.statCard}>
                <Card.Content style={styles.statContent}>
                  <Text style={styles.statLabel}>Remaining</Text>
                  <Text style={[
                    styles.statValue, 
                    remaining < 0 ? styles.overBudget : styles.remainingValue
                  ]}>
                    R{remaining.toLocaleString()}
                  </Text>
                </Card.Content>
              </Card>

              <Card style={styles.statCard}>
                <Card.Content style={styles.statContent}>
                  <Text style={styles.statLabel}>Days Left</Text>
                  <Text style={styles.statValue}>{daysLeft > 0 ? daysLeft : 0}</Text>
                </Card.Content>
              </Card>
            </View>

            <View style={styles.budgetProgress}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Budget Usage</Text>
                <Text style={[
                  styles.progressPercentage,
                  budgetUsage > 80 ? styles.overBudget : 
                  budgetUsage > 60 ? styles.warningBudget : styles.healthyBudget
                ]}>
                  {budgetUsage.toFixed(1)}%
                </Text>
              </View>
              <ProgressBar
                progress={budget > 0 ? spent / budget : 0}
                style={styles.budgetProgressBar}
                color={budgetUsage > 80 ? '#EF4444' : budgetUsage > 60 ? '#F59E0B' : '#10B981'}
              />
              <Text style={styles.budgetText}>
                R{spent.toLocaleString()} of R{budget.toLocaleString()}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <View style={styles.actionsGrid}>
              <Button 
                mode="outlined" 
                onPress={handleAddIncome}
                style={styles.actionButton}
                icon="plus-circle"
                contentStyle={styles.buttonContent}
                disabled={updating}
                loading={updating}
              >
                Add Income
              </Button>
              <Button 
                mode="contained" 
                onPress={handleAddExpense}
                style={styles.actionButton}
                icon="minus-circle"
                contentStyle={styles.buttonContent}
                disabled={updating}
                loading={updating}
              >
                Add Expense
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Budget Status */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Budget Status</Title>
            <View style={styles.statusContainer}>
              <Chip 
                mode="flat"
                style={[
                  styles.statusChip,
                  budgetUsage <= 60 ? styles.statusGood :
                  budgetUsage <= 80 ? styles.statusWarning : styles.statusCritical
                ]}
                icon={
                  budgetUsage <= 60 ? "check-circle" :
                  budgetUsage <= 80 ? "alert-circle" : "close-circle"
                }
              >
                {budgetUsage <= 60 ? 'On Track' :
                 budgetUsage <= 80 ? 'Approaching Limit' : 'Over Budget'}
              </Chip>
              
              <Text style={styles.statusDescription}>
                {budgetUsage <= 60 ? 
                  'Your budget is healthy and on track. Keep up the good work!' :
                 budgetUsage <= 80 ? 
                  'Monitor your spending closely. Consider reviewing your expenses.' :
                  'You have exceeded your budget limit. Immediate action is recommended.'
                }
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Budget Tips</Title>
            <View style={styles.tipsContainer}>
              <Text style={styles.tipText}>
                💡 <Text style={styles.tipBold}>Track expenses regularly</Text> to stay within budget
              </Text>
              <Text style={styles.tipText}>
                💡 <Text style={styles.tipBold}>Set aside 10-15%</Text> for unexpected costs
              </Text>
              <Text style={styles.tipText}>
                💡 <Text style={styles.tipBold}>Review budget weekly</Text> to make adjustments
              </Text>
              <Text style={styles.tipText}>
                💡 <Text style={styles.tipBold}>Use the 50/30/20 rule</Text>: 50% needs, 30% wants, 20% savings
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  card: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 8,
  },
  statContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  budgetProgress: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  budgetProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  budgetText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  statusContainer: {
    alignItems: 'center',
    gap: 12,
  },
  statusChip: {
    height: 32,
  },
  statusGood: {
    backgroundColor: '#D1FAE5',
  },
  statusWarning: {
    backgroundColor: '#FEF3C7',
  },
  statusCritical: {
    backgroundColor: '#FEE2E2',
  },
  statusDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  tipsContainer: {
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: '600',
    color: '#1E293B',
  },
  remainingValue: {
    color: '#10B981',
  },
  healthyBudget: {
    color: '#10B981',
  },
  warningBudget: {
    color: '#F59E0B',
  },
  overBudget: {
    color: '#EF4444',
  },
});

export default BudgetScreen;