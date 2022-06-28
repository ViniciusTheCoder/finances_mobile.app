import React, { ReactNode, useCallback, useEffect, useState } from "react";
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
    LogoutButon,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LoadContainer
} from './styles'

import { useAuth } from "../../hooks/auth";

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightProps;
    expansives: HighlightProps;
    total: HighlightProps;
}

export function Dashboard() {

    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const { signOut, user } = useAuth();

    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative') {

        const collectionFiltered = collection
            .filter(transaction => transaction.type === type);

        if (collectionFiltered.length === 0)
            return 0;

        const lastTransaction = new Date(
            Math.max.apply(Math, collectionFiltered
                .map((transaction) => new Date(transaction.date).getTime())));

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {
            month: 'long'
        }
        )}`;

    }


    async function loadTransactions() {

        const dataKey = `@gofinances: transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expansiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
            .map((item: DataListProps) => {
                if (item.type === 'positive') {
                    entriesTotal += Number(item.amount);
                } else {
                    expansiveTotal += Number(item.amount);
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

        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionExpansives = getLastTransactionDate(transactions, 'negative');
        const totalInterval = lastTransactionExpansives === 0 ?
            'Não há transações'
            : `01 a ${lastTransactionExpansives}`;


        const total = entriesTotal - expansiveTotal;

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),

                lastTransaction: lastTransactionEntries === 0 ?
                    'Não há transações'
                    : `Última entrada dia ${lastTransactionEntries}`,
            },
            expansives: {
                amount: expansiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),

                lastTransaction: lastTransactionExpansives === 0 ?
                    'Não há transações'
                    : `Última saída dia ${lastTransactionExpansives}`,
            },

            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }),

                lastTransaction: totalInterval
            },

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
                                    source={{ uri: user.photo }}
                                />
                                <User>
                                    <UserGreetings>Olá,</UserGreetings>
                                    <UserProfile>{user.name}</UserProfile>
                                </User>
                            </UserInfo>
                            <LogoutButon onPress={signOut}>
                                <Icon name='power' />
                            </LogoutButon>
                        </UserWrapper>
                    </Header>
                    <HighlightCards>
                        <HighlightCard
                            title="Entradas"
                            amount={highlightData.entries.amount}
                            lastTransaction={highlightData.entries.lastTransaction}
                            type="up"
                        />

                        <HighlightCard
                            title="Saídas"
                            amount={highlightData.expansives.amount}
                            lastTransaction={highlightData.expansives.lastTransaction}
                            type="down"
                        />
                        <HighlightCard
                            title="Total"
                            amount={highlightData.total.amount}
                            lastTransaction={highlightData.total.lastTransaction}
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
