import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, HomeScreen, RegistrationScreen } from '../screens';
import { decode, encode } from 'base-64';
import { auth, firestore } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection } from 'firebase/firestore';

if (!global.btoa) {
    global.btoa = encode;
}
if (!global.atob) {
    global.atob = decode;
}

const Stack = createStackNavigator();

export default function AppNavigator() {
    const [user, setUser] = useState(null);

    const handleUserLogin = (user) => {
        setUser(user);
    };

    useEffect(() => {
        const usersRef = collection(firestore, 'users');

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userDoc = doc(usersRef, user.uid);
                getDoc(userDoc)
                    .then((document) => {
                        const userData = document.data();
                        setUser(userData);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    <Stack.Screen name="Home">
                        {props => <HomeScreen {...props} extraData={user} />}
                    </Stack.Screen>
                ) : (
                    <>
                        <Stack.Screen name="Login">
                            {props => <LoginScreen {...props} onLogin={handleUserLogin} />}
                        </Stack.Screen>
                        <Stack.Screen name="Registration">
                            {props => <RegistrationScreen {...props} onLogin={handleUserLogin} />}
                        </Stack.Screen>
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
