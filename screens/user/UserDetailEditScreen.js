import React from 'react';
import {Button, Platform, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {useSelector} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import {vw} from "react-native-expo-viewport-units";


const UserDetailEditScreen = props => {

    const token = useSelector(state => state.auth.token);
    let [name, setName] = React.useState('name');
    let [email, setEmail] = React.useState('email');
    let [address, setAddress] = React.useState('unconfirmed');
    let [password, setPassword] = React.useState('**********');
    let [loadDone, setLoadDone] = React.useState(true);
    let [error, setError] = React.useState("");
    if (loadDone) {
        fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyD480eQzY9RTRTmRSTBhSKYqQlmhmEJBKM', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({idToken: token})
        })
            .then(response => response.json())
            .then(response => {
                const data = response['users'][0];
                if (data.displayName) {
                    setName(data.displayName);
                } else {
                    setName("New User");
                }
                setAddress(data.photoUrl);
                setEmail(data.email);
                setLoadDone(false);
            });
    }
    const updateData = () => {
        let data = {idToken: token, email: email, displayName: name, photoUrl: address};
        if (password !== '**********') {
            if (password.length < 5) {
                setError('Password is too short');
            } else {
                data['password'] = password;
            }
        }

        fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyD480eQzY9RTRTmRSTBhSKYqQlmhmEJBKM',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.error) {
                    setError(response.error.message);
                } else {
                    // props.navigation.pop(3);
                    props.navigation.replace('UserDetail');
                    // props.navigation.render();
                    // props.navigation.goBack();
                }
            })
    };

    return (
        <>
            <ScrollView style={{
                alignText: 'center',
                flexWrap: 'wrap',
                display: 'flex',
                flex: 1,
                padding: 40,
            }}>
                <View style={{margin: 10}}>
                    <Text>Email</Text>
                    <TextInput
                        style={styles.inputStyle}
                        keyboardType='default'
                        placeholder="email"
                        onChangeText={(text) => setEmail(text)}
                    />
                    <Text>{email}</Text>
                </View>

                <View style={{margin: 10}}>
                    <Text>Name</Text>
                    <TextInput
                        style={styles.inputStyle}
                        keyboardType='default'
                        placeholder="username"
                        onChangeText={(text) => setName(text)}
                        initialvalue={name}
                    />
                    <Text>{name}</Text>
                </View>

                <View style={{margin: 10}}>
                    <Text>Address</Text>
                    <TextInput
                        style={styles.inputStyle}
                        keyboardType='default'
                        placeholder="Address"
                        onChangeText={(text) => setAddress(text)}
                        initialvalue={name}
                    />
                    <Text>{address}</Text>
                </View>


                <View style={{margin: 10}}>
                    <Text>Password</Text>
                    <TextInput
                        style={styles.inputStyle}
                        keyboardType='default'
                        placeholder="password"
                        onChangeText={(text) => setPassword(text)}
                        initialvalue={password}
                    />
                    <Text>{password}</Text>
                    <Text style={{color: 'red', width: '100%', fontSize: 10}}>{error}</Text>
                </View>
                <Button
                    onPress={updateData}
                    title="SAVE"
                    color="#841584"
                />

            </ScrollView>
        </>
    );

}

export const screenOptions = (navData) => {
    return {
        headerTitle: 'Edit Your Info',
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

        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title="Edit"
                    iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                    onPress={() => {
                        navData.navigation.navigate('EditProduct');
                    }}
                />
            </HeaderButtons>
        )

    }
}


export const UserDetailEditScreenOptions = (navData) => {

    return {
        headerTitle: 'Update Info',
    }
}


export default UserDetailEditScreen;

const styles = StyleSheet.create({
    form: {},
    inputStyle: {
        width: vw(75),
        backgroundColor: '#fefefe',
        marginTop: 0,
        padding: 3,
        fontSize: 24
    },
});
