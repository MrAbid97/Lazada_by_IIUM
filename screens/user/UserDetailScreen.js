import React from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Firebase from "../../firebaseConfig";


const UserDetailScreen = props => {
    const token = useSelector(state => state.auth.token);
    let [name, setName] = React.useState('Name');
    let [email, setEmail] = React.useState('Email');
    let [address, setAddress] = React.useState('Address');

    const forgetPassword = () => {
        Firebase.auth().sendPasswordResetEmail(email).then(_ => alert("A Email has been send to your email"))
    }


    fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyD480eQzY9RTRTmRSTBhSKYqQlmhmEJBKM', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({idToken: token})
    }).then(response => response.json())
        .then(response => {
            const data = response['users'][0];
            if (data.displayName) {
                setName(data.displayName);
            } else {
                setName("New User");
            }
            if (data.photoUrl) {
                setAddress(data.photoUrl);
            } else {
                setAddress("No Address");
            }
            setEmail(data.email);
        })
    return (
        <>
            <View style={{padding: 20}}>
                <Text>User Name</Text>
                <Text style={styles.header}>{name}</Text>
                <Text>Email</Text>
                <Text style={styles.header}>{email}</Text>
                <Text>Address</Text>
                <Text style={styles.header}>{address}</Text>
                <View style={styles.header}>
                    <Button onPress={forgetPassword} title={"Reset Password"}>Reset
                        Password</Button>
                </View>

            </View>
        </>
    );

};

export const UserDetailScreenOptions = (navData) => {
    return {
        headerTitle: 'Your Info',
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
                    title="Add"
                    iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                    onPress={() => {
                        navData.navigation.navigate('UserDetailEdit');
                    }}
                />
            </HeaderButtons>
        )

    }
}
export default UserDetailScreen;

const styles = StyleSheet.create({
    header: {
        paddingTop: 30,
        textAlign: 'center',
        fontSize: 27
    },
    email: {
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 20
    },
});
