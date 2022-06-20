import React, { createContext, ReactNode, useContext } from "react";

import * as AuthSession from 'expo-auth-session';

interface AuthProviderprops {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface AuthContextData {
    user: User;
    signInGoogle(): Promise<void>
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderprops) {
    const user = {
        id: '1234567',
        name: 'Vinícius',
        email: 'vinícius@email.com',
    };


    async function signInGoogle() {
        try {
            const CLIENT_ID = '988795451486-rsit7ud843r59a88o7l9q825160gm26c.apps.googleusercontent.com';
            const REDIRECT_URI = 'https://auth.expo.io/@viniciusthecoder/gofinances';
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email');

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope${SCOPE}`;

            const response = await AuthSession.startAsync({ authUrl });
            console.log(response)

        } catch (error) {
            throw new Error(error);

        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            signInGoogle
        }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext)

    return context;
}

export { AuthProvider, useAuth }

