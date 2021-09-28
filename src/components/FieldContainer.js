import React from 'react';
import {View, StyleSheet} from 'react-native';

function FieldContainer({children}) {
	return <View style={styles.root}>{children}</View>;
}

const styles = StyleSheet.create({
	root: {
		marginBottom: 20,
	},
});

export default FieldContainer;
