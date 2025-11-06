// <-- CAMBIO: Importamos useEffect
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
// <-- CAMBIO: Importamos 'Loader2' para el spinner de carga
import { AlertTriangle, Upload, X, Package, DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateDisputeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // <-- CAMBIO (Opcional): Podrías necesitar el ID del usuario
  // userId: string; 
}

interface OrderInfo {
  orderId: string;
  productName: string;
  seller: string;
  amount: number;
  orderDate: Date; // Asegúrate que la API devuelva un string de fecha (ej. ISO)
  image: string;
}

const disputeReasons = [
  { value: 'not_received', label: 'No recibí el producto' },
  { value: 'damaged_product', label: 'Producto dañado' },
  { value: 'not_as_described', label: 'No es como se describe' },
  { value: 'wrong_item', label: 'Producto incorrecto' },
  { value: 'other', label: 'Otro motivo' },
];

export function CreateDisputeModal({ open, onOpenChange }: CreateDisputeModalProps) {
  // Estados para los pedidos
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [errorLoadingOrders, setErrorLoadingOrders] = useState<string | null>(null);

  // Estados del formulario
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]); // <-- Estado para archivos (ya estaba)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedOrder = orders.find(order => order.orderId === selectedOrderId);

  // Hook para cargar los pedidos
  useEffect(() => {
    if (open && orders.length === 0) {
      const fetchUserOrders = async () => {
        setIsLoadingOrders(true);
        setErrorLoadingOrders(null);
        try {
          // --- ¡DEBES CAMBIAR ESTA LÍNEA! ---
          // Apunta a tu servidor backend (ej. http://localhost:4000)
          const response = await fetch('http://localhost:4000/api/v1/user/orders'); 
          
          if (!response.ok) {
            throw new Error('No se pudieron cargar los pedidos.');
          }

          const data: OrderInfo[] = await response.json();
          const formattedData = data.map(order => ({
            ...order,
            orderDate: new Date(order.orderDate)
          }));

          setOrders(formattedData);

        } catch (error) {
          console.error('Error fetching orders:', error);
          setErrorLoadingOrders('Hubo un error al cargar tus pedidos.');
          toast.error('Error al cargar pedidos', { description: 'Por favor, intenta cerrar y abrir el modal de nuevo.' });
        } finally {
          setIsLoadingOrders(false);
        }
      };

      fetchUserOrders();
    }
  }, [open, orders.length]);

  // <-- FUNCIÓN PARA MANEJAR ARCHIVOS (ya estaba) -->
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setEvidenceFiles(prev => [...prev, ...files]);
  };

  // <-- FUNCIÓN PARA QUITAR ARCHIVOS (ya estaba) -->
  const removeFile = (index: number) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Función para resetear el estado al cerrar
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Resetea el formulario y los pedidos al cerrar
      setSelectedOrderId('');
      setReason('');
      setDescription('');
      setEvidenceFiles([]); // <-- Resetea archivos
      setOrders([]); 
      setErrorLoadingOrders(null);
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !reason || !description.trim()) return;

    setIsSubmitting(true);
    try {
      // Simula la llamada API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Aquí enviarías los datos, incluyendo los archivos
      console.log('Dispute created:', {
        orderId: selectedOrderId,
        reason,
        description,
        evidence: evidenceFiles, // <-- Se incluyen los archivos
      });
      
      handleOpenChange(false);
      toast.success('Disputa creada exitosamente');

    } catch (error) {
      console.error('Error creating dispute:', error);
      toast.error('Error al crear la disputa');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = selectedOrderId && reason && description.trim().length >= 20;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>      
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Crear Nueva Disputa
          </DialogTitle>
          <DialogDescription>
            Complete el formulario para reportar un problema con su pedido y nuestro equipo lo revisará.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Select Order */}
          <div className="space-y-3">
            <Label htmlFor="order">1. Selecciona tu pedido *</Label>
            
            {/* Lógica de carga del Select */}
            {isLoadingOrders ? (
              <div className="flex items-center justify-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cargando tus pedidos...
              </div>
            ) : errorLoadingOrders ? (
              <div className="flex items-center justify-center h-10 w-full rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorLoadingOrders}
              </div>
            ) : (
              <Select value={selectedOrderId} onValueChange={setSelectedOrderId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el pedido para el cual quieres crear una disputa" />
                </SelectTrigger>
                <SelectContent>
                  {orders.length === 0 ? (
                    <SelectItem value="no-orders" disabled>
                      No se encontraron pedidos elegibles para disputa.
                    </SelectItem>
                  ) : (
                    orders.map((order) => (
                      <SelectItem key={order.orderId} value={order.orderId}>
                        <div className="flex items-center gap-3 py-2">
                          <img
                            src={order.image}
                            alt={order.productName}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p>{order.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              Orden: {order.orderId} • ${order.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}

            {/* Order Summary */}
            {selectedOrder && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedOrder.image}
                      alt={selectedOrder.productName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4>{selectedOrder.productName}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          <span>Orden: {selectedOrder.orderId}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>${selectedOrder.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Step 2: Reason */}
          <div className="space-y-3">
            <Label htmlFor="reason">2. ¿Cuál es el problema? *</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el motivo de tu disputa" />
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

          {/* Step 3: Description */}
          <div className="space-y-3">
            <Label htmlFor="description">3. Describe el problema en detalle *</Label>
            <Textarea
              id="description"
              placeholder="Explica con detalle qué problema tienes con tu pedido. Incluye fechas, condición del producto, intentos de contacto con el vendedor, etc. (mínimo 20 caracteres)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/20 caracteres mínimos
            </p>
          </div>

          {/* <-- SECCIÓN DE EVIDENCIAS REINTEGRADA --> */}
          <div className="space-y-3">
            <Label>4. Evidencias (opcional pero recomendado)</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span>Haz clic para subir</span> o arrastra archivos aquí
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, PDF hasta 10MB cada uno
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
                  <h5 className="text-sm">Archivos subidos:</h5>
                  {evidenceFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
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

          {/* <-- SECCIÓN DE NOTAS REINTEGRADA --> */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg space-y-2">
            <h5 className="text-orange-800 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Información importante
            </h5>
            <ul className="text-sm text-orange-800 space-y-1 ml-6 list-disc">
              <li>Una vez enviada, tu disputa será revisada por nuestro equipo de soporte</li>
              <li>El proceso puede tomar 3-7 días hábiles dependiendo de la complejidad</li>
              <li>Te notificaremos por email sobre cualquier actualización</li>
              <li>Proporciona toda la información posible para acelerar el proceso</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creando disputa...' : 'Crear Disputa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}