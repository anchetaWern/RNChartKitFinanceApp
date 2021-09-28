import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {withTheme} from 'react-native-paper';

function FieldLabel({text, theme}) {
	const {fonts, colors} = theme;

	return (
		<View style={styles.root}>
			<Text style={{fontSize: fonts.regular, color: colors.darkGray}}>
				{text}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		marginBottom: 5,
	},
});

export default withTheme(FieldLabel);
