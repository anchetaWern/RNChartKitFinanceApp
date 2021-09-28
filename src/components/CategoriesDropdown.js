import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';

import {
	getDBConnection,
	createCategoriesTable,
	getCategories,
} from '../../data/db-service';

function CategoriesDropdown({
	category,
	setCategory,
	showCategoriesDropdown,
	setShowCategoriesDropdown,
}) {
	const [categories, setCategories] = useState([]);

	const loadDataCallback = useCallback(async () => {
		try {
			const db = await getDBConnection();
			await createCategoriesTable(db);
			const storedCategories = await getCategories(db);
			if (storedCategories.length) {
				setCategories(storedCategories);
			}
		} catch (error) {
			console.error(error);
		}
	}, []);

	useEffect(() => {
		loadDataCallback();
	}, [loadDataCallback]);

	const items = categories.map(({name, id}) => {
		return {
			label: name,
			value: id,
		};
	});

	return (
		<DropDown
			mode={'flat'}
			value={category}
			setValue={setCategory}
			list={items}
			visible={showCategoriesDropdown}
			showDropDown={() => setShowCategoriesDropdown(true)}
			onDismiss={() => setShowCategoriesDropdown(false)}
			inputProps={{
				right: <TextInput.Icon name={'menu-down'} />,
				theme: {roundness: 0},
				style: styles.dropdown,
			}}
		/>
	);
}

const styles = StyleSheet.create({
	dropdown: {
		height: 43,
		marginTop: 5,
	},
});

export default CategoriesDropdown;
