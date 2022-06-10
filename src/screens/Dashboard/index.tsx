import React from "react";
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
    TransactionList
} from './styles'

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard() {
    const data: DataListProps[] = [
        {
            id: '1',
            type: 'positive',
            title: 'Desenvolvimento do site',
            amount: 'R$ 12.000,00',
            category: {
                name: 'Vendas',
                icon: 'dollar-sign'
            },
            date: '05/06/2022',
        },
        {
            id: '2',
            type: 'negative',
            title: 'Opte pizzaria',
            amount: 'R$ 59,00',
            category: {
                name: 'Alimentação',
                icon: 'coffee'
            },
            date: '01/06/2022',
        },
        {
            id: '3',
            type: 'negative',
            title: 'Aluguel do apartamento',
            amount: 'R$ 1.200,00',
            category: {
                name: 'Casa',
                icon: 'shopping-bag'
            },
            date: '03/06/2022',
        }
    ];

    return (
        <Container>
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
                    amount="R$ 17.400,00"
                    lastTransaction="Última entrada dia 05 de junho"
                    type="up"
                />

                <HighlightCard
                    title="Saídas"
                    amount="R$ 1.259,00"
                    lastTransaction="Última saída dia 25 de maio"
                    type="down"
                />
                <HighlightCard
                    title="Total"
                    amount="R$ 16.141,00"
                    lastTransaction="25 de maio à 05 de junho"
                    type="total"
                />
            </HighlightCards>

            <Transactions>
                <Title>
                    Listagem
                </Title>

                <TransactionList
                    data={data}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />

            </Transactions>

        </Container>
    )
}
