
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ContactSection = () => {
  const handleWhatsAppContact = () => {
    const phoneNumber = '554188371053';
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre seus serviços personalizados.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <CardContent className="p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Precisa de algo específico?</h3>
          <p className="text-gray-300 mb-4">
            Entre em contato conosco para serviços personalizados e orçamentos sob medida.
          </p>
          <Button 
            variant="secondary" 
            className="bg-white text-gray-900 hover:bg-gray-100"
            onClick={handleWhatsAppContact}
          >
            Entrar em Contato
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
