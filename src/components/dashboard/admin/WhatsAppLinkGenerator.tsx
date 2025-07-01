
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Copy, MessageCircle, QrCode, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const WhatsAppLinkGenerator = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const { toast } = useToast();

  const messageTemplates = [
    {
      id: 'order',
      text: 'Olá! Quero fazer um pedido.',
      label: 'Fazer Pedido'
    },
    {
      id: 'catalog',
      text: 'Olá! Pode me enviar o catálogo de produtos?',
      label: 'Solicitar Catálogo'
    },
    {
      id: 'info',
      text: 'Oi! Vim do Instagram e quero mais informações sobre a promoção.',
      label: 'Informações da Promoção'
    },
    {
      id: 'support',
      text: 'Olá! Preciso de ajuda com meu pedido.',
      label: 'Suporte'
    }
  ];

  const formatPhoneNumber = (phone: string): string => {
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Se não começar com 55 (código do Brasil), adiciona
    if (cleaned.length >= 10 && !cleaned.startsWith('55')) {
      return '55' + cleaned;
    }
    
    return cleaned;
  };

  const generateWhatsAppLink = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número de telefone.",
        variant: "destructive",
      });
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    const message = customMessage || selectedTemplate;
    
    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Gera o link do WhatsApp
    const link = `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ''}`;
    
    setGeneratedLink(link);
    
    toast({
      title: "Link Gerado!",
      description: "Seu link do WhatsApp foi criado com sucesso.",
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Link copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setCustomMessage(''); // Limpa mensagem personalizada quando seleciona template
  };

  const clearAll = () => {
    setPhoneNumber('');
    setCustomMessage('');
    setSelectedTemplate('');
    setGeneratedLink('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerador de Link WhatsApp</h1>
        <p className="text-gray-600">
          Crie links personalizados do WhatsApp com mensagens pré-definidas para facilitar o contato com seus clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuração */}
        <Card>
          <CardHeader>
            <CardTitle>Configurar Link</CardTitle>
            <CardDescription>
              Insira os dados para gerar seu link personalizado do WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Número de Telefone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Número de Telefone Celular</Label>
              <Input
                id="phone"
                type="text"
                placeholder="(99) 9999-9999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Formato: (DDD) + Número. Ex: (11) 99999-9999
              </p>
            </div>

            {/* Mensagem Personalizada */}
            <div className="space-y-2">
              <Label htmlFor="message">Insira uma mensagem (opcional)</Label>
              <Textarea
                id="message"
                placeholder="O texto que você deseja compartilhar"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
              />
            </div>

            {/* Templates */}
            <div className="space-y-2">
              <Label>Ou, se preferir, escolha um modelo pronto:</Label>
              <div className="space-y-2">
                {messageTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTemplate === template.text
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => handleTemplateSelect(template.text)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{template.label}</span>
                      <span className="text-xs text-gray-500">13:22 ✓✓</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{template.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex space-x-2 pt-4">
              <Button onClick={generateWhatsAppLink} className="flex-1">
                Gerar link do WhatsApp
              </Button>
              <Button onClick={clearAll} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultado */}
        <Card>
          <CardHeader>
            <CardTitle>Link Gerado</CardTitle>
            <CardDescription>
              Seu link personalizado do WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedLink ? (
              <>
                {/* Link Gerado */}
                <div className="space-y-2">
                  <Label>Link gerado</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={generatedLink}
                      readOnly
                      className="bg-gray-50"
                    />
                    <Button
                      onClick={() => copyToClipboard(generatedLink)}
                      variant="outline"
                      size="icon"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => copyToClipboard(generatedLink)}
                      variant="outline"
                      size="sm"
                    >
                      Copiar
                    </Button>
                    <Button
                      onClick={() => window.open(generatedLink, '_blank')}
                      variant="outline"
                      size="sm"
                    >
                      Novo link do WhatsApp
                    </Button>
                  </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Obtenha o QR Code do seu link
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Baixe a imagem para deixar seu código pronto para usar onde você quiser.
                  </p>
                  <Button variant="outline" size="sm">
                    Baixar QR code
                  </Button>
                </div>

                {/* Próximo Passo */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Próximo Passo</h4>
                  <p className="text-sm text-blue-800">
                    Responda ao quiz e receba uma recomendação gratuita de conteúdos de acordo com a sua necessidade:
                  </p>
                  <Button size="sm" className="mt-2">
                    Responder
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Configure os dados à esquerda e clique em "Gerar link do WhatsApp" para ver o resultado aqui.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
