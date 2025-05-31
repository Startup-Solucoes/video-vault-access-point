
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image, RefreshCw, CheckCircle, XCircle, Info } from 'lucide-react';
import { useThumbnailGeneration } from '@/hooks/useThumbnailGeneration';

export const ThumbnailGenerator = () => {
  const { isGenerating, lastResult, generateAllThumbnails } = useThumbnailGeneration();

  const handleGenerateThumbnails = async () => {
    await generateAllThumbnails();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Image className="h-5 w-5 mr-2" />
          Gerador de Thumbnails
        </CardTitle>
        <CardDescription>
          Gere thumbnails automaticamente para vídeos que não possuem imagem de capa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Esta ferramenta busca vídeos sem thumbnail e tenta gerar automaticamente baseado na URL do vídeo.
            </p>
            <p className="text-xs text-gray-500">
              Suporta: ScreenPal, YouTube e Vimeo
            </p>
          </div>
          <Button 
            onClick={handleGenerateThumbnails}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Image className="h-4 w-4" />
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
          <strong>Dica:</strong> Esta ferramenta só processa vídeos que não possuem thumbnail. 
          Vídeos que já possuem thumbnail não serão modificados.
        </div>
      </CardContent>
    </Card>
  );
};
