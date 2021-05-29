import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Button, FlatList, Platform, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import * as prodActions from '../../store/actions/products';


import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import {vh} from "react-native-expo-viewport-units";

const ProductsRemoveScreen = (props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    let userId = useSelector(state => state.auth.userId);
    let products = useSelector(state => state.products.availableProducts).filter(x => x.ownerId === userId);
    const dispatch = useDispatch();


    const loadProducts = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await dispatch(prodActions.fetchProduct());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError])


    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() => {
            setIsLoading(false);
        });

    }, [dispatch, loadProducts])

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        });
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occured.</Text>
                <Button title="Try again" onPress={loadProducts} color={Colors.primary}/>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary}/>
            </View>
        );
    }

    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products found. Maybe start adding some!</Text>
            </View>
        );
    }

    const deleteProduct = async (id) => {
        await dispatch(prodActions.deleteProduct(id));
        loadProducts().then(() => {
            setIsLoading(false);
        });
    };
    return (
        <>
            <FlatList
                style={{height: vh(80)}}
                onRefresh={loadProducts}
                refreshing={isRefreshing}
                data={products}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <ProductItem
                        image={itemData.item.imageUrl}
                        title={itemData.item.title}
                        price={itemData.item.price}>
                        <Button
                            color="red"
                            title="Delete"
                            onPress={() => {
                                dispatch(prodActions.deleteProduct(itemData.item.id))
                            }}
                        />
                    </ProductItem>
                )}
            />
        </>
    );
};

export const ProductsRemoveScreenOptions = (navData) => {
    return {
        headerTitle: 'Remove products',
        headerLeft: () =>
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title="Menu"
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>,
        headerRight: () =>
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title="Cart"
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress={() => {
                        navData.navigation.navigate('Cart')
                    }}
                />
            </HeaderButtons>
    };
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ProductsRemoveScreen;
