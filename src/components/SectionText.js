import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {withTheme} from 'react-native-paper';

function SectionText({theme, text}) {
	const {colors, fonts} = theme;

	return (
		<View style={styles.root}>
			<Text
				style={{
					fontSize: fonts.bigger,
					fontWeight: 'bold',
					color: colors.darkGray,
				}}
			>
				{text}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		marginTop: 15,
		marginBottom: 25,
	},
});

export default withTheme(SectionText);
