import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function Legend({name, color}) {
	return (
		<View style={styles.container}>
			<View style={[styles.colorContainer, {backgroundColor: color}]}></View>
			<View style={styles.textContainer}>
				<Text>{name}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	colorContainer: {
		width: 10,
		height: 10,
	},
	textContainer: {
		paddingLeft: 8,
	},
});

export default Legend;
