
// BUDGET SERVICE - REAL BACKEND CALLS ONLY
export const budgetService = {
  async getProjectBudget(projectId: string): Promise<any> {
    try {
      const response = await api.get(\/budget/project/\\);
      return response.data;
    } catch (error: any) {
      console.error('? Get project budget error:', error);
      throw new Error('Failed to fetch project budget');
    }
  },

  async updateProjectSpending(projectId: string, amount: number, type: 'expense' | 'income'): Promise<any> {
    try {
      const response = await api.patch(\/budget/project/\/spending\, {
        amount,
        type
      });
      return response.data;
    } catch (error: any) {
      console.error('? Update spending error:', error);
      throw new Error('Failed to update project spending');
    }
  }
};
