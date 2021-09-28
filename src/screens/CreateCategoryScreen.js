import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';

import {Button, TextInput, withTheme, RadioButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import SectionText from '../components/SectionText';
import FieldContainer from '../components/FieldContainer';
import FieldLabel from '../components/FieldLabel';

import {
	getDBConnection,
	createCategoriesTable,
	createCategory,
} from '../../data/db-service';

const CreateCategoryScreen = ({theme}) => {
	const [name, setName] = useState('');
	const [categoryType, setCategoryType] = useState('expense');

	const [buttonloading, setButtonLoading] = useState(false);

	const {colors, fonts} = theme;

	const createCategoryButtonText = buttonloading
		? 'Please wait..'
		: 'Create Category';

	const loadDataCallback = useCallback(async () => {
		try {
			const db = await getDBConnection();
			await createCategoriesTable(db);
		} catch (error) {
			console.error(error);
		}
	}, []);

	useEffect(() => {
		loadDataCallback();
	}, [loadDataCallback]);

	const createCategoryAction = useCallback(async () => {
		try {
			const db = await getDBConnection();
			createCategory(db, {name, categoryType});

			setName('');
			setCategoryType('expense');

			Alert.alert('Category created!');
		} catch (error) {
			console.error(error);
		}
	}, [name, categoryType]);

	return (
		<SafeAreaView
			style={[styles.container, {backgroundColor: colors.background}]}
		>
			<SectionText text="Create Category" />

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
				<FieldLabel text="Type" />

				<RadioButton.Group
					onValueChange={newValue => setCategoryType(newValue)}
					value={categoryType}
				>
					<View style={styles.radioContainer}>
						<View style={styles.inline}>
							<RadioButton.Android value="expense" color={colors.primary} />
							<Text>Expense</Text>
						</View>
						<View style={styles.inline}>
							<RadioButton.Android value="income" color={colors.primary} />
							<Text>Income</Text>
						</View>
					</View>
				</RadioButton.Group>
			</FieldContainer>

			<Button
				mode="contained"
				onPress={createCategoryAction}
				style={styles.button}
				loading={buttonloading}
			>
				{createCategoryButtonText}
			</Button>
		</SafeAreaView>
	);
};

export default withTheme(CreateCategoryScreen);

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
	radioContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	inline: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 10,
	},
});
