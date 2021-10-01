import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, Alert, Platform} from 'react-native';

import {Button, TextInput, withTheme, RadioButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import DropDown from 'react-native-paper-dropdown';

import DateTimePicker from '@react-native-community/datetimepicker';

import SectionText from '../components/SectionText';
import FieldContainer from '../components/FieldContainer';
import FieldLabel from '../components/FieldLabel';

import CategoriesDropdown from '../components/CategoriesDropdown';

import {
	getDBConnection,
	createTransactionsTable,
	createTransaction,
} from '../../data/db-service';

import {transactionTypes} from '../config/app';

const CreateTransactionScreen = ({theme}) => {
	const [transactionDate, setTransactionDate] = useState(new Date());
	const [dateMode, setDateMode] = useState('date');
	const [dateShow, setDateShow] = useState(false);

	const [summary, setSummary] = useState('');
	const [transactionType, setTransactionType] = useState('expense');
	const [category, setCategory] = useState('');
	const [amount, setAmount] = useState('');

	const [buttonloading, setButtonLoading] = useState(false);

	const [showTransactionTypeDropdown, setShowTransactionTypeDropdown] =
		useState(false);
	const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);

	const loadDataCallback = useCallback(async () => {
		try {
			const db = await getDBConnection();
			await createTransactionsTable(db);
		} catch (error) {
			console.error(error);
		}
	}, []);

	useEffect(() => {
		loadDataCallback();
	}, [loadDataCallback]);

	const onDateChange = (event, selectedDate) => {
		const currentDate = selectedDate || transactionDate;
		setDateShow(Platform.OS === 'ios');
		setTransactionDate(currentDate);
	};

	const showDateMode = currentMode => {
		setDateShow(true);
		setMode(currentMode);
	};

	const showDatepicker = () => {
		showDateMode('date');
	};

	const {colors, fonts} = theme;

	const createTransactionButton = buttonloading
		? 'Please wait..'
		: 'Create Transaction';

	const createTransactionAction = useCallback(async () => {
		try {
			const db = await getDBConnection();
			createTransaction(db, {
				transactionDate,
				summary,
				category,
				transactionType,
				amount,
			});

			setTransactionDate(new Date());
			setSummary('');
			setTransactionType('expense');
			setCategory('');
			setAmount(0);

			Alert.alert('Transaction created!');
		} catch (error) {
			console.error(error);
		}
	}, [transactionDate, summary, category, transactionType, amount]);

	return (
		<SafeAreaView
			style={[styles.container, {backgroundColor: colors.background}]}
		>
			<SectionText text="Create Transaction" />

			<FieldContainer>
				<FieldLabel text="Date" />

				<DateTimePicker
					value={transactionDate}
					mode={dateMode}
					is24Hour
					display="compact"
					onChange={onDateChange}
				/>
			</FieldContainer>

			<FieldContainer>
				<FieldLabel text="Summary" />

				<TextInput
					mode="flat"
					underlineColor={colors.white}
					theme={{roundness: 0}}
					style={styles.input}
					onChangeText={text => setSummary(text)}
					value={summary}
					placeholder="Summary"
				/>
			</FieldContainer>

			<FieldContainer>
				<FieldLabel text="Category" />

				<CategoriesDropdown
					category={category}
					setCategory={setCategory}
					showCategoriesDropdown={showCategoriesDropdown}
					setShowCategoriesDropdown={setShowCategoriesDropdown}
				/>
			</FieldContainer>

			<FieldContainer>
				<FieldLabel text="Transaction Type" />
				<DropDown
					mode={'flat'}
					value={transactionType}
					setValue={setTransactionType}
					list={transactionTypes}
					visible={showTransactionTypeDropdown}
					showDropDown={() => setShowTransactionTypeDropdown(true)}
					onDismiss={() => setShowTransactionTypeDropdown(false)}
					inputProps={{
						right: <TextInput.Icon name={'menu-down'} />,
						theme: {roundness: 0},
						style: styles.dropdown,
					}}
				/>
			</FieldContainer>

			<FieldContainer>
				<FieldLabel text="Amount" />
				<TextInput
					mode="flat"
					underlineColor={colors.white}
					theme={{roundness: 0}}
					style={styles.input}
					onChangeText={text => setAmount(text)}
					value={amount}
					placeholder="Amount"
					keyboardType="number-pad"
				/>
			</FieldContainer>

			<Button
				mode="contained"
				onPress={createTransactionAction}
				style={styles.button}
				loading={buttonloading}
			>
				{createTransactionButton}
			</Button>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingRight: 30,
		paddingLeft: 30,
		flexDirection: 'column',
	},
	input: {
		fontSize: 15,
		height: 43,
		width: '100%',
		marginBottom: 10,
		marginTop: 6,
	},
	button: {
		padding: 0,
		marginTop: 15,
		width: '100%',
		borderRadius: 0,
	},
	dropdown: {
		height: 43,
		marginTop: 5,
	},
});

export default withTheme(CreateTransactionScreen);
