
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, RotateCcw } from 'lucide-react';

export const ProductPriceCalculator = () => {
  const [productCost, setProductCost] = useState<number>(0);
  const [operationalCosts, setOperationalCosts] = useState<number>(0);
  const [profitMarginPercentage, setProfitMarginPercentage] = useState<number>(0);
  const [cardTransactionPercentage, setCardTransactionPercentage] = useState<number>(0);
  const [fixedPaymentCosts, setFixedPaymentCosts] = useState<number>(0);

  const [profitInReais, setProfitInReais] = useState<number>(0);
  const [costInReais, setCostInReais] = useState<number>(0);
  const [finalSalePrice, setFinalSalePrice] = useState<number>(0);

  const calculateProfitInReais = () => {
    const totalBaseCost = productCost + operationalCosts;
    const profit = (totalBaseCost * profitMarginPercentage) / 100;
    return profit;
  };

  const calculateCardTransactionCost = () => {
    const basePrice = productCost + operationalCosts + profitInReais;
    const cardCost = (basePrice * cardTransactionPercentage) / 100;
    return cardCost;
  };

  const calculateFinalPrice = () => {
    const totalCosts = productCost + operationalCosts + profitInReais + costInReais + fixedPaymentCosts;
    return totalCosts;
  };

  const resetCalculation = () => {
    setProductCost(0);
    setOperationalCosts(0);
    setProfitMarginPercentage(0);
    setCardTransactionPercentage(0);
    setFixedPaymentCosts(0);
    setProfitInReais(0);
    setCostInReais(0);
    setFinalSalePrice(0);
  };

  useEffect(() => {
    const profit = calculateProfitInReais();
    setProfitInReais(profit);
  }, [productCost, operationalCosts, profitMarginPercentage]);

  useEffect(() => {
    const cardCost = calculateCardTransactionCost();
    setCostInReais(cardCost);
  }, [productCost, operationalCosts, profitInReais, cardTransactionPercentage]);

  useEffect(() => {
    const finalPrice = calculateFinalPrice();
    setFinalSalePrice(finalPrice);
  }, [productCost, operationalCosts, profitInReais, costInReais, fixedPaymentCosts]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Calculadora de Preço de Produto</span>
          </CardTitle>
          <CardDescription>
            Calcule o preço final de venda considerando custos, margem de lucro e taxas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Custo do produto */}
          <div className="space-y-2">
            <Label htmlFor="productCost" className="text-sm font-medium flex items-center space-x-1">
              <span>Custo do produto</span>
              <div className="w-4 h-4 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center">?</div>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
              <Input
                id="productCost"
                type="number"
                value={productCost || ''}
                onChange={(e) => setProductCost(Number(e.target.value))}
                className="pl-10"
                placeholder="1000"
              />
            </div>
          </div>

          {/* Gastos operacionais */}
          <div className="space-y-2">
            <Label htmlFor="operationalCosts" className="text-sm font-medium flex items-center space-x-1">
              <span>Gastos operacionais por produto</span>
              <div className="w-4 h-4 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center">?</div>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
              <Input
                id="operationalCosts"
                type="number"
                value={operationalCosts || ''}
                onChange={(e) => setOperationalCosts(Number(e.target.value))}
                className="pl-10"
                placeholder="50"
              />
            </div>
          </div>

          {/* Porcentagem de margem de lucro */}
          <div className="space-y-2">
            <Label htmlFor="profitMargin" className="text-sm font-medium">
              Porcentagem de margem de lucro
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              <Input
                id="profitMargin"
                type="number"
                value={profitMarginPercentage || ''}
                onChange={(e) => setProfitMarginPercentage(Number(e.target.value))}
                className="pl-10"
                placeholder="20"
              />
            </div>
          </div>

          {/* Resultado do lucro em reais */}
          <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
            <span className="text-sm font-medium text-blue-900">Lucro em reais:</span>
            <span className="text-lg font-bold text-blue-900">{formatCurrency(profitInReais)}</span>
          </div>

          {/* Tirar custo de transação de cartão */}
          <div className="space-y-2">
            <Label htmlFor="cardTransaction" className="text-sm font-medium flex items-center space-x-1">
              <div className="w-4 h-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">+</div>
              <span>Tirar custo de transação de cartão (%)</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              <Input
                id="cardTransaction"
                type="number"
                value={cardTransactionPercentage || ''}
                onChange={(e) => setCardTransactionPercentage(Number(e.target.value))}
                className="pl-10"
                placeholder="3"
              />
            </div>
          </div>

          {/* Resultado do custo em reais */}
          <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
            <span className="text-sm font-medium text-blue-900">Custo em reais:</span>
            <span className="text-lg font-bold text-blue-900">{formatCurrency(costInReais)}</span>
          </div>

          {/* Custos fixos de meios de pagamento */}
          <div className="space-y-2">
            <Label htmlFor="fixedCosts" className="text-sm font-medium flex items-center space-x-1">
              <div className="w-4 h-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">+</div>
              <span>Adicione custos fixos de meios de pagamento</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
              <Input
                id="fixedCosts"
                type="number"
                value={fixedPaymentCosts || ''}
                onChange={(e) => setFixedPaymentCosts(Number(e.target.value))}
                className="pl-10"
                placeholder="0"
              />
            </div>
          </div>

          {/* Preço de venda final */}
          <div className="bg-blue-600 text-white p-6 rounded-lg flex justify-between items-center">
            <span className="text-lg font-medium">Preço de venda</span>
            <span className="text-2xl font-bold">{formatCurrency(finalSalePrice)}</span>
          </div>

          {/* Botão de novo cálculo */}
          <Button
            onClick={resetCalculation}
            variant="outline"
            className="w-full flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Novo cálculo</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
