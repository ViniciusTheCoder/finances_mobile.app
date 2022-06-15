import React, { createContext, ReactNode, useContext } from "react";

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
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderprops) {
    const user = {
        id: '1234567',
        name: 'Vinícius',
        email: 'vinícius@email.com',
    };

    return (
        <AuthContext.Provider value={{
            user
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

