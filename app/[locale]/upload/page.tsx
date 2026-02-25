'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useCallback, useState } from 'react';

export default function UploadPage() {
  const t = useTranslations('upload');
  const locale = useLocale();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  }, []);

  // Placeholder recent uploads
  const recentUploads = [
    { name: 'invoice-aws-feb.pdf', date: '2026-02-24', status: 'processed', amount: 'AED 1,200' },
    { name: 'receipt-adobe-feb.png', date: '2026-02-20', status: 'processed', amount: 'AED 450' },
    { name: 'invoice-rent-feb.pdf', date: '2026-02-15', status: 'pending', amount: 'AED 8,000' },
  ];

  const statusIcon = (status: string) => {
    switch (status) {
      case 'processed': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-amber-500" />;
      default: return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('description')}</p>
      </div>

      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle>{t('uploadZone')}</CardTitle>
          <CardDescription>{t('uploadZoneDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
              transition-colors duration-200
              ${isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
              }
            `}
          >
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">{t('dragDrop')}</p>
            <p className="text-sm text-muted-foreground mb-4">{t('supportedFormats')}</p>
            <label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button variant="outline" asChild>
                <span>{t('browseFiles')}</span>
              </Button>
            </label>
          </div>

          {/* Selected files */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <Button size="sm">{t('process')}</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recentUploads')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUploads.map((upload, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{upload.name}</p>
                    <p className="text-xs text-muted-foreground">{upload.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{upload.amount}</span>
                  <Badge variant={upload.status === 'processed' ? 'default' : 'secondary'}>
                    <span className="flex items-center gap-1">
                      {statusIcon(upload.status)}
                      {upload.status}
                    </span>
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
