import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native'

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreetings,
    UserProfile,
    LogoutButton,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LoadContainer
} from './styles'

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
}

interface HighlightData {
    entries: HighlightProps;
    expensives: HighlightProps;
    total: HighlightProps;
}

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);


    async function loadTransactions() {

        const dataKey = '@gofinances: transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
            .map((item: DataListProps) => {
                if (item.type === 'positive') {
                    entriesTotal += Number(item.amount);
                } else {
                    expensiveTotal += Number(item.amount);
                }


                const amount = Number(item.amount).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',

                });

                const date = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date
                }

            });

        setTransactions(transactionsFormatted);

        const total = entriesTotal - expensiveTotal;

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },

            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            }

        });

        setIsLoading(false);

    };

    useEffect(() => {

        loadTransactions();
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));

    return (
        <Container>

            {isLoading ?
                <LoadContainer>
                    < ActivityIndicator
                        size='large'
                    />
                </LoadContainer> :
                <>
                    <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo
                                    source={{ uri: 'https://github.com/ViniciusTheCoder.png' }}
                                />
                                <User>
                                    <UserGreetings>Olá,</UserGreetings>
                                    <UserProfile>Vinícius</UserProfile>
                                </User>
                            </UserInfo>
                            <LogoutButton onPress={() => { }}>
                                <Icon name='power' />
                            </LogoutButton>
                        </UserWrapper>
                    </Header>
                    <HighlightCards>
                        <HighlightCard
                            title="Entradas"
                            amount={highlightData.entries.amount}
                            lastTransaction="Última entrada dia 05 de junho"
                            type="up"
                        />

                        <HighlightCard
                            title="Saídas"
                            amount={highlightData.expensives.amount}
                            lastTransaction="Última saída dia 25 de maio"
                            type="down"
                        />
                        <HighlightCard
                            title="Total"
                            amount={highlightData.total.amount}
                            lastTransaction="25 de maio à 05 de junho"
                            type="total"
                        />
                    </HighlightCards>

                    <Transactions>
                        <Title>
                            Listagem
                        </Title>

                        <TransactionList
                            data={transactions}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => <TransactionCard data={item} />}
                        />

                    </Transactions>
                </>
            }
        </Container>
    )
}
