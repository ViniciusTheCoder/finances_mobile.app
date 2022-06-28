import React, { useContext, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";

import { ActivityIndicator, Alert, Platform } from "react-native";

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { useAuth } from "../../hooks/auth";

import { SignInSocialButton } from "../../components/SignInSocialButton";

import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper
} from './styles';


import { useTheme } from "styled-components/native";

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const { signInGoogle, signInApple } = useAuth();
    const theme = useTheme

    async function handleSignInGoogle() {
        try {
            setIsLoading(true);
            return await signInGoogle();

        } catch (error) {
            Alert.alert('Não foi possível conectar a conta Google')
            console.log(error)
            setIsLoading(false);
        }
    }

    async function handleSignInApple() {
        try {
            setIsLoading(true);
            return await signInApple();

        } catch (error) {
            Alert.alert('Não foi possível conectar a conta Apple')
            console.log(error)
            setIsLoading(false);
        }
    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />

                    <Title>
                        Controle suas {'\n'}
                        finanças de forma {'\n'}
                        muito simples
                    </Title>
                </TitleWrapper>

                <SignInTitle>
                    Faça seu login com {'\n'}
                    uma das contas abaixo
                </SignInTitle>
            </Header>

            <Footer>
                <FooterWrapper>
                    <SignInSocialButton
                        title='Entrar com Google'
                        svg={GoogleSvg}
                        onPress={handleSignInGoogle}
                    />
                    {
                        Platform.OS === 'ios' &&
                        <SignInSocialButton
                            title='Entrar com Apple'
                            svg={AppleSvg}
                            onPress={handleSignInApple}
                        />
                    }
                </FooterWrapper>

                {isLoading && <ActivityIndicator color={"#FFF"} />}

            </Footer>

        </Container>
    );
}