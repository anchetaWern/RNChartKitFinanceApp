import React, {useState, useEffect, useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';

import {withTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import FinancePieChart from '../components/FinancePieChart';
import FinanceLineChart from '../components/FinanceLineChart';
import FinanceBarChart from '../components/FinanceBarChart';

import Legend from '../components/Legend';

import {
	getDBConnection,
	createTransactionsTable,
	getTransactionsGroupedByTransactionType,
	getExpenseTransactionsGroupedByCategory,
	getIncomeTransactionsGroupedByCategory,
	getSavingsTransactionsGroupedByCategory,
	getInvestmentTransactionsGroupedByCategory,
	getIncomeGroupedByMonth,
	getExpenseGroupedByMonth,
	getSavingsGroupedByMonth,
	getInvestmentsGroupedByMonth,
} from '../../data/db-service';

const ReportsScreen = ({theme}) => {
	const {colors, fonts} = theme;

	const [byExpenseCategories, setByExpenseCategories] = useState([]);
	const [byIncomeCategories, setByIncomeCategories] = useState([]);
	const [bySavingsCategories, setBySavingsCategories] = useState([]);
	const [byInvestmentCategories, setByInvestmentCategories] = useState([]);
	const [byTransactionTypes, setByTransactionTypes] = useState([]);

	const [monthlyIncome, setMonthlyIncome] = useState([]);
	const [monthlyExpense, setMonthlyExpense] = useState([]);

	const [monthlySavings, setMonthlySavings] = useState([]);
	const [monthlyInvestments, setMonthlyInvestments] = useState([]);

	const loadDataCallback = useCallback(async () => {
		try {
			const db = await getDBConnection();
			await createTransactionsTable(db);
			const groupedByTransactionTypes =
				await getTransactionsGroupedByTransactionType(db);
			if (groupedByTransactionTypes.length) {
				setByTransactionTypes(groupedByTransactionTypes);
			}

			const groupedByExpenseCategories =
				await getExpenseTransactionsGroupedByCategory(db);
			if (groupedByExpenseCategories.length) {
				setByExpenseCategories(groupedByExpenseCategories);
			}

			const groupedByIncomeCategories =
				await getIncomeTransactionsGroupedByCategory(db);
			if (groupedByIncomeCategories.length) {
				setByIncomeCategories(groupedByIncomeCategories);
			}

			const groupedBySavingsCategories =
				await getSavingsTransactionsGroupedByCategory(db);
			if (groupedBySavingsCategories.length) {
				setBySavingsCategories(groupedBySavingsCategories);
			}

			const groupedByInvestmentCategories =
				await getInvestmentTransactionsGroupedByCategory(db);
			if (groupedByInvestmentCategories.length) {
				setByInvestmentCategories(groupedByInvestmentCategories);
			}

			const incomeMonth = await getIncomeGroupedByMonth(db);
			if (incomeMonth) {
				setMonthlyIncome(incomeMonth);
			}

			const expenseMonth = await getExpenseGroupedByMonth(db);
			if (expenseMonth) {
				setMonthlyExpense(expenseMonth);
			}

			const savingsMonth = await getSavingsGroupedByMonth(db);
			if (savingsMonth) {
				setMonthlySavings(savingsMonth);
			}

			const investmentMonth = await getInvestmentsGroupedByMonth(db);
			if (investmentMonth) {
				setMonthlyInvestments(investmentMonth);
			}
		} catch (error) {
			console.error('transaction list err: ', error);
		}
	}, []);

	useEffect(() => {
		loadDataCallback();
	}, [loadDataCallback]);

	const hasByTransactionTypes = byTransactionTypes.length > 0;
	const hasByExpenseCategories = byExpenseCategories.length > 0;
	const hasByIncomeCategories = byIncomeCategories.length > 0;
	const hasBySavingsCategories = bySavingsCategories.length > 0;
	const hasByInvestmentCategories = byInvestmentCategories.length > 0;
	const hasMonthlyIncome = monthlyIncome.length > 0;
	const hasMonthlyExpense = monthlyExpense.length > 0;

	const hasIncomeSavingsInvestment =
		monthlyIncome.length > 0 ||
		monthlySavings.length > 0 ||
		monthlyInvestments.length > 0;

	const lineChartLegends = [
		{
			name: 'Income',
			color: '#003049',
		},
		{
			name: 'Savings',
			color: '#d62828',
		},
		{
			name: 'Investment',
			color: '#f77f00',
		},
	];

	const datasets = [];
	if (monthlyIncome.length > 0) {
		datasets.push({
			data: monthlyIncome.map(item => item.value),
			color: (opacity = 1) => '#003049',
			strokeWidth: 2,
		});
	}

	if (monthlySavings.length > 0) {
		datasets.push({
			data: monthlySavings.map(item => item.value),
			color: (opacity = 1) => '#d62828',
			strokeWidth: 2,
		});
	}

	if (monthlyInvestments.length > 0) {
		datasets.push({
			data: monthlyInvestments.map(item => item.value),
			color: (opacity = 1) => '#f77f00',
			strokeWidth: 2,
		});
	}

	const chartData = {
		labels: monthlyIncome.map(item => item.label),
		datasets,
	};

	return (
		<SafeAreaView
			style={[styles.container, {backgroundColor: colors.background}]}
		>
			<ScrollView
				style={{
					flex: 1,
				}}
			>
				{hasByTransactionTypes && (
					<FinancePieChart
						title="Transaction Types"
						data={byTransactionTypes}
					/>
				)}

				{hasByExpenseCategories && (
					<FinancePieChart title="Expenses" data={byExpenseCategories} />
				)}

				{hasByIncomeCategories && (
					<FinancePieChart title="Income" data={byIncomeCategories} />
				)}

				{hasBySavingsCategories && (
					<FinancePieChart title="Savings" data={bySavingsCategories} />
				)}

				{hasByInvestmentCategories && (
					<FinancePieChart title="Investment" data={byInvestmentCategories} />
				)}

				{hasMonthlyIncome && (
					<FinanceBarChart
						title="Monthly Income"
						data={monthlyIncome}
						fillShadowGradient="#DF5353"
						color="#d62828"
					/>
				)}

				{hasMonthlyExpense && (
					<FinanceBarChart
						title="Monthly Expense"
						data={monthlyExpense}
						fillShadowGradient="#00b4d8"
						color="#0077b6"
					/>
				)}

				{hasIncomeSavingsInvestment && (
					<FinanceLineChart
						title="Income to savings to investment"
						chartData={chartData}
						fillShadowGradient="#ccc"
						legend={lineChartLegends}
					/>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
});

export default withTheme(ReportsScreen);
