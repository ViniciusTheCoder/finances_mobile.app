import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";


import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { HistoryCard } from "../../components/HistoryCard";

import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    Month,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon
} from "./styles";

import { categories } from "../../utils/categories";


interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string
}

export function Resume() {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    function handleDateChange(action: 'next' | 'prev') {
        if (action === 'next') {
            setSelectedDate(addMonths(selectedDate, 1));
        } else {
            setSelectedDate(subMonths(selectedDate, 1));
        }

    }

    async function loadData() {
        const dataKey = '@gofinances: transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expansives = responseFormatted
            .filter((expansive: TransactionData) =>
                expansive.type === 'negative' &&
                new Date(expansive.date).getMonth() === selectedDate.getMonth() &&
                new Date(expansive.date).getFullYear() === selectedDate.getFullYear()
            );

        const expansivesTotal = expansives
            .reduce((acumullator: number, expansive: TransactionData) => {
                return acumullator + Number(expansive.amount);
            }, 0);

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expansives.forEach((expansive: TransactionData) => {
                if (expansive.category === category.key) {
                    categorySum += Number(expansive.amount)
                }
            });

            if (categorySum > 0) {
                const totalFormatted = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })

                const percent = `${(categorySum / expansivesTotal * 100).toFixed(0)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormatted,
                    percent
                });
            }
        });

        setTotalByCategories(totalByCategory);

    }

    useEffect(() => {
        loadData();
    }, [selectedDate]);


    return (

        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>

            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingBottom: useBottomTabBarHeight(),
                }}
            >

                <MonthSelect>

                    <MonthSelectButton onPress={() => handleDateChange('prev')}>
                        <MonthSelectIcon name="chevron-left" />
                    </MonthSelectButton>


                    <Month>
                        {format(selectedDate, 'MMMM, yyy', { locale: ptBR })}
                    </Month>

                    <MonthSelectButton onPress={() => handleDateChange('next')}>
                        <MonthSelectIcon name="chevron-right" />
                    </MonthSelectButton >
                </MonthSelect>

                <ChartContainer>

                    <VictoryPie
                        data={totalByCategories}
                        colorScale={totalByCategories.map(category => category.color)}
                        style={{
                            labels: {
                                fontSize: RFValue(18),
                                fontWeight: 'bold',
                                fill: '#FFF'
                            }
                        }}
                        labelRadius={55}
                        x={'percent'}
                        y={'total'}
                    />

                </ChartContainer>

                {
                    totalByCategories.map(item => (
                        <HistoryCard
                            key={item.key}
                            title={item.name}
                            amount={item.totalFormatted}
                            color={item.color}
                        />
                    ))
                }

            </Content>
        </Container>
    )
}

