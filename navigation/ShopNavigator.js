import React from 'react';
import {Button, Platform, SafeAreaView, View} from 'react-native';
import Colors from '../constants/Colors';
import {Ionicons} from '@expo/vector-icons';

import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator, DrawerItemList} from '@react-navigation/drawer';

import ProductsOverviewScreen, {screenOptions as productsOverviewScreenOptions} from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen, {screenOptions as productDetailScreenOptions} from '../screens/shop/ProductDetailScreen';
import CartScreen, {screenOptions as cartScreenOptions} from '../screens/shop/CartScreen';
import OrdersScreen, {screenOptions as ordersScreenOptions} from '../screens/shop/OrdersScreen';
import AuthScreen, {screenOptions as authScreenOptions} from '../screens/user/AuthScreen';

import {useDispatch} from 'react-redux';
import * as authActions from '../store/actions/auth';
import UserDetailScreen, {UserDetailScreenOptions} from "../screens/user/UserDetailScreen";
import UserDetailEditScreen, {UserDetailEditScreenOptions} from "../screens/user/UserDetailEditScreen";
import EditProductScreen, {EditProductScreenOptions} from "../screens/user/EditProductScreen";
import ProductsRemoveScreen, {ProductsRemoveScreenOptions} from "../screens/user/RemoveProductScreen";


const defaultNavOptions = {
    headerStyle: {
        backgroundColor: "#F72585"
    },
    headerTitle: {
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    },
    headerTintColor: Colors.primary
};


const ProductsStackNavigator = createStackNavigator();

const ProductsNavigator = () => {
    return (
        <ProductsStackNavigator.Navigator
            screenOptions={defaultNavOptions}
        >
            <ProductsStackNavigator.Screen
                name="ProductsOverview"
                component={ProductsOverviewScreen}
                options={productsOverviewScreenOptions}
            />
            <ProductsStackNavigator.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={productDetailScreenOptions}
            />
            <ProductsStackNavigator.Screen
                name="Cart"
                component={CartScreen}
                options={cartScreenOptions}
            />
        </ProductsStackNavigator.Navigator>
    );
};


const OrdersStackNavigator = createStackNavigator();

const OrdersNavigator = () => {
    return (
        <OrdersStackNavigator.Navigator
            screenOptions={defaultNavOptions}
        >
            <OrdersStackNavigator.Screen
                name="Orders"
                component={OrdersScreen}
                options={ordersScreenOptions}
            />
        </OrdersStackNavigator.Navigator>
    );
};


const ProductRemoveStackNavigator = createStackNavigator();

const ProductRemoveNavigator = () => {
    return (
        <ProductRemoveStackNavigator.Navigator
            screenOptions={defaultNavOptions}
        >
            <ProductRemoveStackNavigator.Screen
                name="Remove Product"
                component={ProductsRemoveScreen}
                options={ProductsRemoveScreenOptions}
            />
        </ProductRemoveStackNavigator.Navigator>
    );
};


const AddProductStackNavigator = createStackNavigator();

const AddProductNavigator = () => {
    return (
        <AddProductStackNavigator.Navigator
            screenOptions={defaultNavOptions}
        >
            <AddProductStackNavigator.Screen
                name="AddProduct"
                component={EditProductScreen}
                options={EditProductScreenOptions}
            />
        </AddProductStackNavigator.Navigator>
    );
};


const AdminStackNavigator = createStackNavigator();

const AdminNavigator = () => {
    return (
        <AdminStackNavigator.Navigator screenOptions={defaultNavOptions}>
            <AdminStackNavigator.Screen
                name="UserDetail"
                component={UserDetailScreen}
                options={UserDetailScreenOptions}
            />
            <AdminStackNavigator.Screen
                name="UserDetailEdit"
                component={UserDetailEditScreen}
                options={UserDetailEditScreenOptions}
            />

        </AdminStackNavigator.Navigator>
    );
};

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {
    const dispatch = useDispatch();
    return (
        <ShopDrawerNavigator.Navigator
            drawerContent={props => {
                return (
                    <View style={{flex: 1, paddingTop: 30}}>
                        <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                            <DrawerItemList {...props} />
                            <Button
                                title="Logout"
                                color={Colors.primary}
                                onPress={() => {
                                    dispatch(authActions.logout());
                                }}
                            />
                        </SafeAreaView>
                    </View>
                );
            }}
            drawerContentOptions={{activeTintColor: Colors.primary}}>
            <ShopDrawerNavigator.Screen
                name="Products"
                component={ProductsNavigator}
                options={{
                    drawerIcon: (props) => (
                        <Ionicons
                            name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
                            size={23}
                            color={props.color}
                        />
                    )
                }}
            />
            <ShopDrawerNavigator.Screen
                name="Orders"
                component={OrdersNavigator}
                options={{
                    drawerIcon: (props) => (
                        <Ionicons
                            name={Platform.OS === "android" ? "md-list" : "ios-list"}
                            size={23}
                            color={props.color}
                        />
                    )
                }}
            />
            <ShopDrawerNavigator.Screen
                name="Settings"
                component={AdminNavigator}
                options={{
                    drawerIcon: (props) => (
                        <Ionicons
                            name={Platform.OS === "android" ? "md-create" : "ios-create"}
                            size={23}
                            color={props.color}
                        />
                    )
                }}
            />
            <ShopDrawerNavigator.Screen
                name="Add Product"
                component={AddProductNavigator}
                options={{
                    drawerIcon: (props) => (
                        <Ionicons
                            name={Platform.OS === "android" ? "md-add" : "ios-add"}
                            size={23}
                            color={props.color}
                        />
                    )
                }}
            />
            <ShopDrawerNavigator.Screen
                name="Remove Product"
                component={ProductRemoveNavigator}
                options={{
                    drawerIcon: (props) => (
                        <Ionicons
                            name={Platform.OS === "android" ? "md-remove" : "ios-remove"}
                            size={23}
                            color={props.color}
                        />
                    )
                }}
            />
        </ShopDrawerNavigator.Navigator>
    );
};


const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
    return (
        <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
            <AuthStackNavigator.Screen
                name="Auth"
                component={AuthScreen}
                options={authScreenOptions}
            />
        </AuthStackNavigator.Navigator>
    );
}

