import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

const CartItem = (props) => {
    return (
        <View style={styles.cartItem}>
            <View style={styles.itemData}>
                <Text style={styles.quantity}>{props.quantity}</Text>
                <Text style={styles.mainText}>{props.title}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.mainText}>RM {props.amount.toFixed(2)}</Text>
                {props.deletable && (
                    // making views respond properly to touches. On press down, the opacity of the wrapped view is decreased, dimming it.
                    <TouchableOpacity onPress={props.onRemove} style={styles.deleteButton}>
                        {/* Icon Plugins */}
                        <Ionicons
                            name={Platform.OS === 'android' ? "md-trash" : "ios-trash"}
                            size={23}
                            color="red"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cartItem: {
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20
    },
    itemData: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantity: {
        fontFamily: 'open-sans',
        color: '#888',
        fontSize: 16,
        paddingHorizontal: 10,
    },
    mainText: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    deleteButton: {
        marginLeft: 20,

    }

});

export default CartItem;
