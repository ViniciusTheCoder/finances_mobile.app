import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
    useEffect
} from "react";

import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

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
    signInGoogle(): Promise<void>;
    signInApple(): Promise<void>;
}

interface AuthorizationResponse {
    params: {
        acess_token: string;
    },
    type: string;
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderprops) {
    const [user, setUser] = useState<User>({} as User);
    const [userStorageLoading, setUserStorageLoading] = useState(true);

    const userStorageKey = '@gofinances:user';

    async function signInGoogle() {
        try {
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email');

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            const { type, params } = await AuthSession
                .startAsync({ authUrl }) as AuthorizationResponse;

            if (type === 'sucess') {
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.acess_token}`)
                const userInfo = await response.json();

                const userLoggedIn = {
                    id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.given_name,
                    photo: userInfo.picture
                };

                setUser(userLoggedIn);
                AsyncStorage.setItem(userStorageKey, JSON.stringify(userLoggedIn));
            }

        } catch (error) {
            throw new Error(error);

        }
    }

    async function signInApple() {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ]
            });

            if (credential) {
                const userLogged = {
                    id: String(credential.user),
                    email: credential.email,
                    name: credential.fullName!.givenName!,
                };

                setUser(userLogged)
                await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged));
            }


        } catch (error) {
            throw new Error(error);
        }
    }

    useEffect(() => {
        async function loadUserStorageData() {
            const userStorage = await AsyncStorage.getItem(userStorageKey);

            if (userStorage) {
                const userLogged = JSON.parse(userStorage) as User;
                setUser(userLogged);
            }

            setUserStorageLoading(false);
        }

        loadUserStorageData();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            signInGoogle,
            signInApple
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

