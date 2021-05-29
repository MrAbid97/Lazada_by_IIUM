import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import CartItem from './CartItem';
import Colors from '../../constants/Colors';
import Card from '../UI/Card';

const OrderItem = (props) => {

    const [showDetails, setShowDetails] = useState(false);

    return (

        <Card style={styles.orderItem}>
            <View style={styles.summary}>
                <Text style={styles.totalAmount}>RM {props.amount.toFixed(2)} </Text>
                <Text style={styles.date}> {props.date} </Text>
            </View>
            {/* Button for show and how details */}
            <Button
                color={Colors.primary}
                title={showDetails ? "Hide Details" : "Show Details"}
                onPress={() => {
                    setShowDetails((prevState) => !prevState)
                }}
            />

            {showDetails && (
                <View style={styles.detailItems}>
                    <Text stype={{padding: 10, marginTop: 40}}>ShipAddress:</Text>
                    <Text style={styles.address}>{props.address}</Text>
                    {props.items.map(cartItem => (
                        // Component shop/CartItem
                        <CartItem
                            key={cartItem.productId}
                            quantity={cartItem.quantity}
                            amount={cartItem.sum}
                            title={cartItem.productTitle}
                            deletable={false}
                        />
                    ))}
                </View>
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    orderItem: {
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    address: {
        paddingBottom: 10,
        fontSize: 20,
        alignItems: 'center'
    },
    summary: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 15

    },
    totalAmount: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    date: {
        fontSize: 16,
        fontFamily: 'open-sans',
        color: "#888"
    },

    detailItems: {
        padding: 10,
        width: "100%"
    }
});

export default OrderItem;
