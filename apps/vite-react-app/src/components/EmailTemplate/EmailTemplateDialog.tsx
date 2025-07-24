import React, { useState, useEffect } from 'react';
import { useToast } from '@workspace/ui/components/sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { Label } from '@workspace/ui/components/label';
import { Badge } from '@workspace/ui/components/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { 
  EmailTemplate, 
  EmailTemplateCreateRequest, 
  EmailTemplateUpdateRequest,
  EMAIL_VARIABLES 
} from '@/services/emailTemplate/types';
import { emailTemplateService } from '@/services/emailTemplate';
import { Eye, Edit, Plus, Loader2 } from 'lucide-react';

interface EmailTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'view' | 'create' | 'edit';
  template?: EmailTemplate | null;
  onSave: () => void;
}

export const EmailTemplateDialog: React.FC<EmailTemplateDialogProps> = ({
  open,
  onOpenChange,
  mode,
  template,
  onSave,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [subjectTemplate, setSubjectTemplate] = useState('');
  const [bodyTemplate, setBodyTemplate] = useState('');
  const [activeTab, setActiveTab] = useState('editor');

  // Reset form when dialog opens/closes or template changes
  useEffect(() => {
    if (open) {
      if (template && (mode === 'edit' || mode === 'view')) {
        setName(template.name);
        setSubjectTemplate(template.subject_template);
        setBodyTemplate(template.body_template);
      } else if (mode === 'create') {
        setName('');
        setSubjectTemplate('');
        setBodyTemplate('');
      }
      setActiveTab('editor');
    }
  }, [open, template, mode]);

  const handleSave = async () => {
    if (!name.trim() || !subjectTemplate.trim() || !bodyTemplate.trim()) {
      toast({
        title: 'Error',
        description: 'Semua field harus diisi.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      if (mode === 'create') {
        const createData: EmailTemplateCreateRequest = {
          name: name.trim(),
          subject_template: subjectTemplate.trim(),
          body_template: bodyTemplate.trim()
        };
        await emailTemplateService.createTemplate(createData);
        toast({
          title: 'Template Dibuat',
          description: 'Template email berhasil dibuat.',
          variant: 'default'
        });
      } else if (mode === 'edit' && template) {
        const updateData: EmailTemplateUpdateRequest = {
          name: name.trim(),
          subject_template: subjectTemplate.trim(),
          body_template: bodyTemplate.trim()
        };
        await emailTemplateService.updateTemplate(template.id, updateData);
        toast({
          title: 'Template Diperbarui',
          description: 'Template email berhasil diperbarui.',
          variant: 'default'
        });
      }
      onSave();
    } catch (error) {
      console.error('Failed to save template:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan template. Silakan coba lagi.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const insertVariable = (variable: string, field: 'subject' | 'body') => {
    const variableText = `{{${variable}}}`;
    
    if (field === 'subject') {
      setSubjectTemplate(prev => prev + variableText);
    } else {
      setBodyTemplate(prev => prev + variableText);
    }
  };


  const getPreview = () => {
    return emailTemplateService.previewTemplate(subjectTemplate, bodyTemplate);
  };

  const getDialogTitle = () => {
    switch (mode) {
      case 'create':
        return 'Buat Template Email';
      case 'edit':
        return 'Edit Template Email';
      case 'view':
        return 'Lihat Template Email';
      default:
        return 'Template Email';
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-7xl max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'create' && <Plus className="h-5 w-5" />}
            {mode === 'edit' && <Edit className="h-5 w-5" />}
            {mode === 'view' && <Eye className="h-5 w-5" />}
            {getDialogTitle()}
            {template?.is_active && (
              <Badge variant="default" className="ml-2">
                Aktif
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' && 'Buat template email baru untuk laporan hasil evaluasi.'}
            {mode === 'edit' && 'Edit template email yang sudah ada.'}
            {mode === 'view' && 'Lihat detail template email.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Nama Template</Label>
                    <Input
                      id="template-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama template"
                      disabled={isReadOnly}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject-template">Subject Template</Label>
                    <div className="space-y-2">
                      <Textarea
                        id="subject-template"
                        value={subjectTemplate}
                        onChange={(e) => setSubjectTemplate(e.target.value)}
                        placeholder="Masukkan subject email dengan variabel {{nama_variabel}}"
                        disabled={isReadOnly}
                        rows={3}
                        className="w-full"
                      />
                      {!isReadOnly && (
                        <div className="flex flex-wrap gap-1">
                          {EMAIL_VARIABLES.slice(0, 5).map((variable) => (
                            <Button
                              key={variable.key}
                              variant="outline"
                              size="sm"
                              onClick={() => insertVariable(variable.key, 'subject')}
                              className="text-xs"
                            >
                              + {variable.key}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="body-template">Body Template</Label>
                    <div className="space-y-2">
                      <Textarea
                        id="body-template"
                        value={bodyTemplate}
                        onChange={(e) => setBodyTemplate(e.target.value)}
                        placeholder="Masukkan body email dengan variabel {{nama_variabel}}"
                        disabled={isReadOnly}
                        rows={20}
                        className="w-full font-mono text-sm"
                      />
                      {!isReadOnly && (
                        <div className="flex flex-wrap gap-1">
                          {EMAIL_VARIABLES.map((variable) => (
                            <Button
                              key={variable.key}
                              variant="outline"
                              size="sm"
                              onClick={() => insertVariable(variable.key, 'body')}
                              className="text-xs"
                            >
                              + {variable.key}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="preview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[60vh] pr-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Preview Template</CardTitle>
                    <CardDescription>
                      Preview template dengan data contoh.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Subject:</Label>
                      <div className="mt-1 p-3 bg-muted rounded border">
                        <p className="text-sm">{getPreview().subject}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium">Body:</Label>
                      <div className="mt-1 p-4 bg-muted rounded border">
                        <pre className="text-sm whitespace-pre-wrap font-sans">
                          {getPreview().body}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex-shrink-0 flex justify-between items-center pt-4 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            {template && (
              <span>
                Dibuat: {new Date(template.created_at).toLocaleDateString('id-ID')}
                {template.updated_at && (
                  <> • Diperbarui: {new Date(template.updated_at).toLocaleDateString('id-ID')}</>
                )}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {isReadOnly ? 'Tutup' : 'Batal'}
            </Button>
            {!isReadOnly && (
              <Button onClick={handleSave} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {mode === 'create' ? 'Buat Template' : 'Simpan Perubahan'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};