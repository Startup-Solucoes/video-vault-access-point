
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, RefreshCw, CheckCircle, XCircle, Info, Sparkles } from 'lucide-react';
import { useAutomaticThumbnails } from '@/hooks/useAutomaticThumbnails';

export const AutomaticThumbnailGenerator = () => {
  const { isGenerating, lastResult, generateAllAutomaticThumbnails } = useAutomaticThumbnails();

  const handleGenerateAutomaticThumbnails = async () => {
    await generateAllAutomaticThumbnails();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="h-5 w-5 mr-2" />
          Gerador Automático de Thumbnails
        </CardTitle>
        <CardDescription>
          Gere thumbnails automáticas com a logo da plataforma para todos os vídeos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Esta ferramenta cria thumbnails personalizadas com a cor da plataforma e sua logo no centro.
            </p>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-gray-500">
                Thumbnails são geradas automaticamente para novos vídeos
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Plataformas suportadas: YouTube, Vimeo, ScreenPal e outras
            </p>
          </div>
          <Button 
            onClick={handleGenerateAutomaticThumbnails}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Palette className="h-4 w-4" />
            )}
            {isGenerating ? 'Gerando...' : 'Gerar Thumbnails'}
          </Button>
        </div>

        {lastResult && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Último Resultado
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  Total
                </Badge>
                <div className="text-2xl font-bold text-gray-700">
                  {lastResult.total}
                </div>
                <div className="text-xs text-gray-500">vídeos processados</div>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2 text-green-600 border-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Sucesso
                </Badge>
                <div className="text-2xl font-bold text-green-600">
                  {lastResult.success}
                </div>
                <div className="text-xs text-gray-500">thumbnails geradas</div>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2 text-red-600 border-red-600">
                  <XCircle className="h-3 w-3 mr-1" />
                  Falhas
                </Badge>
                <div className="text-2xl font-bold text-red-600">
                  {lastResult.failed}
                </div>
                <div className="text-xs text-gray-500">não processadas</div>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
          <strong>Como funciona:</strong> As thumbnails são geradas com a cor característica de cada plataforma 
          (vermelho para YouTube, azul para Vimeo, verde para ScreenPal) e a logo correspondente no centro.
        </div>
      </CardContent>
    </Card>
  );
};
