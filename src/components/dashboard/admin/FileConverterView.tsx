
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, FileImage, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { FileUploadZone } from './file-converter/FileUploadZone';
import { FileConverter } from './file-converter/FileConverter';

export const FileConverterView = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const supportedFormats = [
    { value: 'jpg', label: 'JPG', description: 'Formato de imagem com compressão' },
    { value: 'png', label: 'PNG', description: 'Formato de imagem sem perda' },
    { value: 'webp', label: 'WebP', description: 'Formato moderno e otimizado' },
    { value: 'pdf', label: 'PDF', description: 'Documento portátil' },
    { value: 'png-no-bg', label: 'PNG (Sem Fundo)', description: 'Remove fundo automaticamente' },
  ];

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setConvertedFile(null);
    setProgress(0);
  }, []);

  const handleConvert = async () => {
    if (!selectedFile || !outputFormat) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo e formato de saída",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);

    try {
      const converter = new FileConverter();
      
      const progressCallback = (progress: number) => {
        setProgress(progress);
      };

      const result = await converter.convert(selectedFile, outputFormat, progressCallback);
      
      setConvertedFile(result);
      setProgress(100);
      
      toast({
        title: "Sucesso!",
        description: "Arquivo convertido com sucesso",
      });
    } catch (error) {
      console.error('Erro na conversão:', error);
      toast({
        title: "Erro na conversão",
        description: "Ocorreu um erro ao converter o arquivo",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedFile || !selectedFile) return;

    const url = URL.createObjectURL(convertedFile);
    const a = document.createElement('a');
    a.href = url;
    
    const originalName = selectedFile.name.split('.')[0];
    const extension = outputFormat === 'png-no-bg' ? 'png' : outputFormat;
    a.download = `${originalName}_converted.${extension}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download iniciado",
      description: "O arquivo convertido está sendo baixado",
    });
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setOutputFormat('');
    setConvertedFile(null);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Conversor de Arquivos</h2>
        <p className="text-gray-600">
          Converta seus arquivos entre diferentes formatos e remova fundos automaticamente
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload do Arquivo</span>
            </CardTitle>
            <CardDescription>
              Suporte para: JPG, PNG, WebP, PDF (máx. 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploadZone onFileSelect={handleFileSelect} selectedFile={selectedFile} />
          </CardContent>
        </Card>

        {/* Format Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileImage className="h-5 w-5" />
              <span>Formato de Saída</span>
            </CardTitle>
            <CardDescription>
              Escolha o formato desejado para conversão
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={outputFormat} onValueChange={setOutputFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent>
                {supportedFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    <div>
                      <div className="font-medium">{format.label}</div>
                      <div className="text-xs text-gray-500">{format.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={handleConvert}
              disabled={!selectedFile || !outputFormat || isConverting}
              className="w-full"
            >
              {isConverting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Convertendo...
                </>
              ) : (
                <>
                  <FileImage className="h-4 w-4 mr-2" />
                  Converter Arquivo
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Download */}
      {(isConverting || convertedFile) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {convertedFile ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Loader2 className="h-5 w-5 animate-spin" />
              )}
              <span>
                {convertedFile ? 'Conversão Concluída' : 'Convertendo Arquivo'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isConverting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {convertedFile && (
              <div className="flex space-x-3">
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Arquivo Convertido
                </Button>
                <Button onClick={resetConverter} variant="outline">
                  Novo Arquivo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
