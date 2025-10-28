import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { AlertTriangle, Upload, X } from 'lucide-react';
import { disputeReasons } from '../data/mockData';

interface DisputeModalProps {
  children: React.ReactNode;
  onSubmit: (disputeData: {
    reason: string;
    description: string;
    evidence: File[];
  }) => void;
}

export function DisputeModal({ children, onSubmit }: DisputeModalProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setEvidenceFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !description.trim()) return;

    onSubmit({
      reason,
      description,
      evidence: evidenceFiles,
    });

    // Reset form
    setReason('');
    setDescription('');
    setEvidenceFiles([]);
    setOpen(false);
  };

  const isFormValid = reason && description.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Iniciar Disputa
          </DialogTitle>
          <DialogDescription>
            Inicia una disputa para resolver un problema con tu pedido.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Motivo de la disputa */}
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo de la disputa *</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un motivo" />
              </SelectTrigger>
              <SelectContent>
                {disputeReasons.map((disputeReason) => (
                  <SelectItem key={disputeReason.value} value={disputeReason.value}>
                    {disputeReason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción del problema *</Label>
            <Textarea
              id="description"
              placeholder="Describe detalladamente el problema que tienes con este producto o transacción..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              Mínimo 10 caracteres ({description.length}/10)
            </p>
          </div>

          {/* Carga de evidencias */}
          <div className="space-y-2">
            <Label>Evidencias (opcional)</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Subir imágenes o documentos
                    </p>
                  </div>
                  <Input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {/* Lista de archivos subidos */}
              {evidenceFiles.length > 0 && (
                <div className="space-y-2">
                  {evidenceFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                          {file.type.startsWith('image/') ? '🖼️' : '📄'}
                        </div>
                        <div>
                          <p className="text-sm truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nota informativa */}
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Nota:</strong> Una vez que envíes la disputa, será revisada por nuestro equipo de soporte. 
              Te notificaremos sobre cualquier actualización.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
              className="flex-1"
            >
              Enviar Disputa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}