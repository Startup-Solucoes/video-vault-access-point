import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, Download, Zap, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const ExcelWizardView = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<any>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const extension = file.name.toLowerCase().split('.').pop();
      return ['xlsx', 'xls', 'csv'].includes(extension || '');
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Atenção",
        description: "Apenas arquivos XLSX, XLS e CSV são aceitos",
        variant: "destructive"
      });
    }

    setSelectedFiles(validFiles);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const validFiles = files.filter(file => {
      const extension = file.name.toLowerCase().split('.').pop();
      return ['xlsx', 'xls', 'csv'].includes(extension || '');
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Atenção",
        description: "Apenas arquivos XLSX, XLS e CSV são aceitos",
        variant: "destructive"
      });
    }

    setSelectedFiles(validFiles);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const processFiles = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um arquivo para processar",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProcessedData({
        totalRows: Math.floor(Math.random() * 10000) + 1000,
        totalFiles: selectedFiles.length,
        processedAt: new Date().toLocaleString()
      });

      toast({
        title: "Sucesso",
        description: `${selectedFiles.length} arquivo(s) processado(s) com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar arquivos",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setProcessedData(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FileSpreadsheet className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Excel Wizard</h1>
          <p className="text-muted-foreground">
            Transforme suas planilhas com operações em massa inteligentes
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <Card className="p-8">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer"
        >
          <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Arraste seus arquivos aqui</h3>
            <p className="text-muted-foreground mb-4">
              Ou clique para selecionar arquivos XLSX, XLS ou CSV
            </p>
            <input
              type="file"
              multiple
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button variant="outline" className="cursor-pointer">
                Selecionar Arquivos
              </Button>
            </label>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-medium">Arquivos Selecionados ({selectedFiles.length}):</h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-muted/30 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}
            </div>
            <div className="flex space-x-3">
              <Button onClick={processFiles} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Processar Arquivos
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={clearFiles}>
                Limpar
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Results */}
      {processedData && (
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold">Resultados do Processamento</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {processedData.totalRows.toLocaleString()}
              </div>
              <div className="text-sm text-green-600/80">Linhas Processadas</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {processedData.totalFiles}
              </div>
              <div className="text-sm text-blue-600/80">Arquivos Processados</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
              <div className="text-sm font-medium text-purple-600">
                Processado em
              </div>
              <div className="text-sm text-purple-600/80">{processedData.processedAt}</div>
            </div>
          </div>

          <Button className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Baixar Resultado
          </Button>
        </Card>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <Upload className="h-8 w-8 mx-auto mb-3 text-blue-500" />
          <h3 className="font-semibold mb-2">Múltiplos Formatos</h3>
          <p className="text-sm text-muted-foreground">
            Suporte completo para XLSX, XLS e CSV
          </p>
        </Card>
        
        <Card className="p-6 text-center">
          <Zap className="h-8 w-8 mx-auto mb-3 text-green-500" />
          <h3 className="font-semibold mb-2">Processamento Rápido</h3>
          <p className="text-sm text-muted-foreground">
            Processe milhares de linhas em segundos
          </p>
        </Card>
        
        <Card className="p-6 text-center">
          <BarChart3 className="h-8 w-8 mx-auto mb-3 text-purple-500" />
          <h3 className="font-semibold mb-2">Análise Inteligente</h3>
          <p className="text-sm text-muted-foreground">
            Detecte padrões e formatações automaticamente
          </p>
        </Card>
      </div>
    </div>
  );
};