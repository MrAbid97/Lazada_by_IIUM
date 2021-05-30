import React from 'react';
import {Image, Platform, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View} from 'react-native';
import Card from '../UI/Card';

const ProductItem = (props) => {
    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <Card style={{padding: 10, marginTop: 50, margin:10}}>
            {/* this make component work as button */}
            <TouchableCmp onPress={props.onSelect} useForeground>
                <View>
                    <View style={styles.imageContainer}>
                        {/* we are using BASE64 IMAGE */}
                        <Image style={styles.image} source={{uri: `data:image/png;base64,${props.image}`}}/>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.title}>{props.title}</Text>
                        <Text style={styles.price}>
                            {/* Fixed 12.8909 => 12.89 */}
                            RM {props.price.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.actions}>
                        {props.children}
                    </View>
                </View>
            </TouchableCmp>
        </Card>
    )
}

const styles = StyleSheet.create({
    product: {
        padding: 20,
        height: 500,
    },
    imageContainer: {
        width: '100%',
        height: 'auto',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: "100%",
        height: 400,
    },
    details: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        padding: 10
    },
    title: {
        display: 'flex',
        fontSize: 18,
        marginVertical: 2,
        fontFamily: 'open-sans-bold'
    },
    price: {
        display: 'flex',
        fontSize: 14,
        color: '#888',
        fontFamily: 'open-sans'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    }

});

export default ProductItem;
