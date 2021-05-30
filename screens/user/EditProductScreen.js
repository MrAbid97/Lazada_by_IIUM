import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import {useDispatch, useSelector} from 'react-redux';

import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';


const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';


const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidities
        };
    }
    return state;
}


const EditProductScreen = props => {


    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [image, setImage] = useState(null);

    // const prodId = props.navigation.getParam('productId');
    const prodId = props.route.params ? props.route.params.productId : null;
    const editedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === prodId));

    const dispatch = useDispatch();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        setImage(result.base64);

    };

    const [formState, dispatchFormState] = useReducer(
        formReducer,
        {
            inputValues: {
                title: editedProduct ? editedProduct.title : '',
                description: editedProduct ? editedProduct.description : '',
                price: ''
            },
            inputValidities: {
                title: !!editedProduct,
                description: !!editedProduct,
                price: !!editedProduct
            },
            formIsValid: !!editedProduct
        }
    );


    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{text: 'Okay'}])
        }
    }, [error])


    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert(
                'Wrong input!',
                'Please check the errors in the form.',
                [
                    {text: 'Okay'}
                ]
            );
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            if (editedProduct) {
                // Edit product
                setImage("");
                await dispatch(
                    productsActions.updateProduct(
                        prodId,
                        formState.inputValues.title,
                        formState.inputValues.description,
                        image
                    )
                );
            } else {
                setImage("");
                // Add New Product
                await dispatch(
                    productsActions.createProduct(
                        formState.inputValues.title,
                        formState.inputValues.description,
                        image,
                        parseInt(formState.inputValues.price)
                    )
                );
            }
            props.navigation.goBack();
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false)

    }, [dispatch, prodId, formState]);

    useEffect(() => {
        props.navigation.setOptions({
            headerLeft: () =>
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item
                        title="Menu"
                        iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                        onPress={() => {
                            props.navigation.toggleDrawer();
                        }}
                    />
                </HeaderButtons>,
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item
                        title="Save"
                        iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                        onPress={submitHandler}
                    />
                </HeaderButtons>
            )
        });
    }, [submitHandler]);

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState]);


    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary}/>
            </View>
        );
    }


    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
        >
            <ScrollView>
                <View style={styles.form}>
                    <Input
                        id='title'
                        label='Title'
                        errorText='Please enter a valid title!'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        required
                    />
                    <Button color={Colors.primary} title="Pick Image" onPress={pickImage}/>
                    {image != null ? (
                        <Image style={{width: 100, height: 100}} source={{uri: `data:image/png;base64,${image}`}}/>
                    ) : null}
                    <Input
                        id='price'
                        label='Price'
                        errorText='Please enter a valid price!'
                        keyboardType='decimal-pad'
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        required
                        min={0.1}
                    />
                    <Input
                        id='description'
                        label='Description'
                        errorText='Please enter a valid description!'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        multiline
                        numberOfLines={1}
                        onInputChange={inputChangeHandler}
                        required
                        minLength={1}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    image: {
        height: 100,
        width: 100,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

});

export const EditProductScreenOptions = (navData) => {

    // const submitFn = navData.route.params ? navData.route.params.submit : null;
    const routeParams = navData.route.params ? navData.route.params : {};
    return {
        headerTitle: routeParams.productId ? 'Edit Product' : 'Add Product',

    }
}

export default EditProductScreen;
