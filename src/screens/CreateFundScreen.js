import React, {useState, useEffect, useCallback} from 'react';
import {Alert, StyleSheet} from 'react-native';

import {Button, TextInput, withTheme, RadioButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import DropDown from 'react-native-paper-dropdown';

import SectionText from '../components/SectionText';
import FieldContainer from '../components/FieldContainer';
import FieldLabel from '../components/FieldLabel';

import {
	getDBConnection,
	createFundsTable,
	createFund,
} from '../../data/db-service';

const fundTypes = [
	{
		label: 'Savings account',
		value: 'regular-savings',
	},
	{
		label: 'High-interest savings account',
		value: 'high-interest-savings',
	},
	{
		label: 'Physical wallet',
		value: 'physical-wallet',
	},
	{
		label: 'E-wallet',
		value: 'e-wallet',
	},
	{
		label: 'Investment',
		value: 'investment',
	},
];

const CreateFundScreen = ({theme}) => {
	const [name, setName] = useState('');
	const [fundType, setFundType] = useState('regular-savings');

	const [buttonloading, setButtonLoading] = useState(false);

	const [showDropDown, setShowDropDown] = useState(false);

	const {colors, fonts} = theme;

	const createFundButtonText = buttonloading ? 'Please wait..' : 'Create Fund';

	const loadDataCallback = useCallback(async () => {
		try {
			const db = await getDBConnection();
			await createFundsTable(db);
		} catch (error) {
			console.error(error);
		}
	}, []);

	useEffect(() => {
		loadDataCallback();
	}, [loadDataCallback]);

	const createFundAction = useCallback(async () => {
		try {
			const db = await getDBConnection();
			createFund(db, {name, fundType});

			setName('');
			setFundType('regular-savings');

			Alert.alert('Fund created!');
		} catch (error) {
			console.error(error);
		}
	}, [name, fundType]);

	return (
		<SafeAreaView
			style={[styles.container, {backgroundColor: colors.background}]}
		>
			<SectionText text="Create Fund" />

			<FieldContainer>
				<FieldLabel text="Name" />
				<TextInput
					mode="flat"
					underlineColor={colors.white}
					theme={{roundness: 0}}
					style={styles.input}
					onChangeText={text => setName(text)}
					value={name}
					placeholder="Name"
				/>
			</FieldContainer>

			<FieldContainer>
				<FieldLabel text="Fund Type" />
				<DropDown
					mode={'flat'}
					value={fundType}
					setValue={setFundType}
					list={fundTypes}
					visible={showDropDown}
					showDropDown={() => setShowDropDown(true)}
					onDismiss={() => setShowDropDown(false)}
					inputProps={{
						right: <TextInput.Icon name={'menu-down'} />,
						theme: {roundness: 0},
						style: {
							height: 43,
							marginTop: 5,
						},
					}}
				/>
			</FieldContainer>

			<Button
				mode="contained"
				onPress={createFundAction}
				style={styles.button}
				loading={buttonloading}
			>
				{createFundButtonText}
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
	linksContainer: {
		marginTop: 20,
	},
	linkContainer: {
		display: 'flex',
		alignItems: 'center',
		marginTop: 5,
		marginBottom: 10,
	},
	linkText: {
		fontSize: 16,
	},
});

export default withTheme(CreateFundScreen);
