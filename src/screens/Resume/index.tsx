import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";

import { HistoryCard } from "../../components/HistoryCard";

import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer
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

    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    async function loadData() {
        const dataKey = '@gofinances: transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expansives = responseFormatted
            .filter((expansive: TransactionData) => expansive.type === 'negative');

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
    }, []);


    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>

            <Content>

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