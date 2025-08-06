import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileSpreadsheet, Download, Zap, BarChart3, Split, Merge, ArrowLeft, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

type ProcessingFunction = 'split' | 'merge' | 'analyze' | 'format';

interface ProcessingConfig {
  split: {
    rowsPerFile: number;
    keepHeaders: boolean;
  };
  merge: {
    includeSource: boolean;
    removeHeaders: boolean;
  };
  analyze: {
    generateReport: boolean;
  };
  format: {
    outputFormat: 'xlsx' | 'csv';
  };
}

export const ExcelWizardView = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'configure' | 'results'>('upload');
  const [selectedFunction, setSelectedFunction] = useState<ProcessingFunction>('split');
  const [config, setConfig] = useState<ProcessingConfig>({
    split: { rowsPerFile: 1000, keepHeaders: true },
    merge: { includeSource: false, removeHeaders: true },
    analyze: { generateReport: true },
    format: { outputFormat: 'xlsx' }
  });
  const [processedFiles, setProcessedFiles] = useState<{ name: string; blob: Blob }[]>([]);

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

  const readExcelFile = async (file: File): Promise<XLSX.WorkBook> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          resolve(workbook);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const splitSpreadsheet = async (file: File): Promise<{ name: string; blob: Blob }[]> => {
    const workbook = await readExcelFile(file);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    const headers = jsonData[0] as any[];
    const dataRows = jsonData.slice(1);
    const { rowsPerFile, keepHeaders } = config.split;
    
    const files: { name: string; blob: Blob }[] = [];
    const totalChunks = Math.ceil(dataRows.length / rowsPerFile);
    
    for (let i = 0; i < totalChunks; i++) {
      const startRow = i * rowsPerFile;
      const endRow = Math.min(startRow + rowsPerFile, dataRows.length);
      const chunkData = dataRows.slice(startRow, endRow);
      
      const finalData = keepHeaders ? [headers, ...chunkData] : chunkData;
      const newWorksheet = XLSX.utils.aoa_to_sheet(finalData as any[][]);
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Sheet1");
      
      const fileName = `${file.name.split('.')[0]}_parte_${i + 1}.xlsx`;
      const buffer = XLSX.write(newWorkbook, { type: 'array', bookType: 'xlsx' });
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      files.push({ name: fileName, blob });
    }
    
    return files;
  };

  const mergeSpreadsheets = async (files: File[]): Promise<{ name: string; blob: Blob }[]> => {
    let allData: any[] = [];
    let headers: any[] | null = null;
    const { includeSource, removeHeaders } = config.merge;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const workbook = await readExcelFile(file);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (i === 0) {
        headers = jsonData[0] as any[];
        if (includeSource) {
          headers.push('Arquivo_Origem');
        }
        allData.push(headers);
      }
      
      const dataRows = removeHeaders ? jsonData.slice(1) : jsonData;
      const processedRows = includeSource 
        ? dataRows.map(row => [...(row as any[]), file.name])
        : dataRows;
      
      allData.push(...processedRows);
    }
    
    const newWorksheet = XLSX.utils.aoa_to_sheet(allData);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Planilha_Unificada");
    
    const buffer = XLSX.write(newWorkbook, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    return [{ name: 'planilha_unificada.xlsx', blob }];
  };

  const analyzeSpreadsheets = async (files: File[]): Promise<{ name: string; blob: Blob }[]> => {
    const analysis: any[] = [['Arquivo', 'Planilhas', 'Total_Linhas', 'Total_Colunas', 'Tamanho_KB']];
    
    for (const file of files) {
      const workbook = await readExcelFile(file);
      let totalRows = 0;
      let maxCols = 0;
      
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        totalRows += jsonData.length;
        const cols = Math.max(...jsonData.map(row => (row as any[]).length));
        maxCols = Math.max(maxCols, cols);
      });
      
      analysis.push([
        file.name,
        workbook.SheetNames.length,
        totalRows,
        maxCols,
        Math.round(file.size / 1024)
      ]);
    }
    
    const worksheet = XLSX.utils.aoa_to_sheet(analysis);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Análise");
    
    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    return [{ name: 'análise_planilhas.xlsx', blob }];
  };

  const formatSpreadsheets = async (files: File[]): Promise<{ name: string; blob: Blob }[]> => {
    const { outputFormat } = config.format;
    const convertedFiles: { name: string; blob: Blob }[] = [];
    
    for (const file of files) {
      const workbook = await readExcelFile(file);
      const fileName = file.name.split('.')[0];
      
      if (outputFormat === 'csv') {
        // Converter cada planilha para CSV
        workbook.SheetNames.forEach((sheetName, index) => {
          const worksheet = workbook.Sheets[sheetName];
          const csv = XLSX.utils.sheet_to_csv(worksheet);
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const name = workbook.SheetNames.length > 1 
            ? `${fileName}_${sheetName}.csv`
            : `${fileName}.csv`;
          convertedFiles.push({ name, blob });
        });
      } else {
        // Manter como XLSX
        const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        convertedFiles.push({ name: `${fileName}.xlsx`, blob });
      }
    }
    
    return convertedFiles;
  };

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
      let results: { name: string; blob: Blob }[] = [];
      let totalProcessedRows = 0;
      
      switch (selectedFunction) {
        case 'split':
          if (selectedFiles.length > 1) {
            toast({
              title: "Atenção",
              description: "Para dividir planilha, selecione apenas um arquivo",
              variant: "destructive"
            });
            return;
          }
          results = await splitSpreadsheet(selectedFiles[0]);
          // Calcular linhas processadas
          const workbook = await readExcelFile(selectedFiles[0]);
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          totalProcessedRows = jsonData.length - 1; // Excluir cabeçalho
          break;
          
        case 'merge':
          if (selectedFiles.length < 2) {
            toast({
              title: "Atenção",
              description: "Para unificar planilhas, selecione pelo menos 2 arquivos",
              variant: "destructive"
            });
            return;
          }
          results = await mergeSpreadsheets(selectedFiles);
          // Calcular total de linhas de todos os arquivos
          for (const file of selectedFiles) {
            const wb = await readExcelFile(file);
            const ws = wb.Sheets[wb.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            totalProcessedRows += data.length - 1;
          }
          break;
          
        case 'analyze':
          results = await analyzeSpreadsheets(selectedFiles);
          totalProcessedRows = selectedFiles.length;
          break;
          
        case 'format':
          results = await formatSpreadsheets(selectedFiles);
          for (const file of selectedFiles) {
            const wb = await readExcelFile(file);
            const ws = wb.Sheets[wb.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            totalProcessedRows += data.length;
          }
          break;
      }
      
      setProcessedFiles(results);
      setProcessedData({
        totalRows: totalProcessedRows,
        totalFiles: selectedFiles.length,
        outputFiles: results.length,
        processedAt: new Date().toLocaleString(),
        functionUsed: selectedFunction
      });
      
      setCurrentStep('results');

      toast({
        title: "Sucesso",
        description: `${selectedFiles.length} arquivo(s) processado(s) com sucesso!`,
      });
    } catch (error) {
      console.error('Erro no processamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar arquivos. Verifique se os arquivos são válidos.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = (file: { name: string; blob: Blob }) => {
    saveAs(file.blob, file.name);
  };

  const downloadAllFiles = () => {
    processedFiles.forEach(file => {
      downloadFile(file);
    });
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setProcessedData(null);
    setProcessedFiles([]);
    setCurrentStep('upload');
  };

  const nextStep = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione pelo menos um arquivo antes de continuar",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep('configure');
  };

  const functionOptions = [
    { value: 'split', label: 'Dividir Planilha', icon: Split, description: 'Quebra planilhas grandes em arquivos menores' },
    { value: 'merge', label: 'Unificar Planilhas', icon: Merge, description: 'Combina múltiplas planilhas em uma única' },
    { value: 'analyze', label: 'Analisar Planilhas', icon: BarChart3, description: 'Gera relatório com estatísticas dos arquivos' },
    { value: 'format', label: 'Converter Formato', icon: FileSpreadsheet, description: 'Converte entre formatos XLSX e CSV' }
  ];

  if (currentStep === 'configure') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCurrentStep('upload')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Configurar Processamento</h1>
            <p className="text-muted-foreground">
              Escolha a funcionalidade e configure os parâmetros
            </p>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Selecione a Funcionalidade</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {functionOptions.map((option) => (
                  <div 
                    key={option.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedFunction === option.value 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedFunction(option.value as ProcessingFunction)}
                  >
                    <div className="flex items-start space-x-3">
                      <option.icon className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-medium">{option.label}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedFunction === 'split' && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium">Configurações de Divisão</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rowsPerFile">Linhas por arquivo</Label>
                    <Input
                      id="rowsPerFile"
                      type="number"
                      value={config.split.rowsPerFile}
                      onChange={(e) => setConfig({
                        ...config,
                        split: { ...config.split, rowsPerFile: parseInt(e.target.value) || 1000 }
                      })}
                      min="1"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <input
                      type="checkbox"
                      id="keepHeaders"
                      checked={config.split.keepHeaders}
                      onChange={(e) => setConfig({
                        ...config,
                        split: { ...config.split, keepHeaders: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <Label htmlFor="keepHeaders">Manter cabeçalho em todos os arquivos</Label>
                  </div>
                </div>
              </div>
            )}

            {selectedFunction === 'merge' && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium">Configurações de Unificação</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeSource"
                      checked={config.merge.includeSource}
                      onChange={(e) => setConfig({
                        ...config,
                        merge: { ...config.merge, includeSource: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <Label htmlFor="includeSource">Incluir coluna com nome do arquivo origem</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="removeHeaders"
                      checked={config.merge.removeHeaders}
                      onChange={(e) => setConfig({
                        ...config,
                        merge: { ...config.merge, removeHeaders: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <Label htmlFor="removeHeaders">Remover cabeçalhos dos arquivos adicionais</Label>
                  </div>
                </div>
              </div>
            )}

            {selectedFunction === 'format' && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium">Configurações de Conversão</h4>
                <div>
                  <Label htmlFor="outputFormat">Formato de saída</Label>
                  <Select 
                    value={config.format.outputFormat} 
                    onValueChange={(value: 'xlsx' | 'csv') => setConfig({
                      ...config,
                      format: { ...config.format, outputFormat: value }
                    })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xlsx">XLSX (Excel)</SelectItem>
                      <SelectItem value="csv">CSV (Texto separado por vírgulas)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep('upload')}>
                Voltar
              </Button>
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
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (currentStep === 'results') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold">Resultados do Processamento</h1>
            <p className="text-muted-foreground">
              Arquivos processados com sucesso
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {processedData.totalRows.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Linhas Processadas</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {processedData.totalFiles}
            </div>
            <div className="text-sm text-muted-foreground">Arquivos de Entrada</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {processedData.outputFiles}
            </div>
            <div className="text-sm text-muted-foreground">Arquivos Gerados</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm font-medium text-orange-600">
              Processado em
            </div>
            <div className="text-sm text-muted-foreground">{processedData.processedAt}</div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Arquivos Gerados</h3>
          <div className="space-y-3 mb-6">
            {processedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-muted/30 p-3 rounded">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button size="sm" onClick={() => downloadFile(file)}>
                  <Download className="h-4 w-4 mr-1" />
                  Baixar
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-3">
            <Button onClick={downloadAllFiles} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Baixar Todos os Arquivos
            </Button>
            <Button variant="outline" onClick={clearFiles}>
              Processar Novos Arquivos
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Step 1: Upload
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
              <Button onClick={nextStep}>
                Próximo: Configurar Processamento
              </Button>
              <Button variant="outline" onClick={clearFiles}>
                Limpar
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {functionOptions.map((option) => (
          <Card key={option.value} className="p-6 text-center">
            <option.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">{option.label}</h3>
            <p className="text-sm text-muted-foreground">
              {option.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};