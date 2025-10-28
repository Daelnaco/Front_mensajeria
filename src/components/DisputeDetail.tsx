import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  User,
  DollarSign,
  Calendar,
  FileText,
  Download,
  Send,
  Shield,
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatMessageTime } from '../utils/dateUtils';

interface DisputeDetailProps {
  dispute: {
    id: string;
    title: string;
    orderId: string;
    seller: string;
    amount: number;
    status: string;
    description: string;
    createdAt: Date;
    resolvedAt?: Date;
    reason?: string;
    evidence?: Array<{ url: string; name: string; }>;
    supportResponse?: string;
    sellerResponse?: string;
    resolution?: {
      type: string;
      amount?: number;
      description: string;
    };
    timeline?: Array<{
      id: string;
      actor: string;
      actorRole: string;
      description: string;
      timestamp: Date;
    }>;
  };
  onBack: () => void;
}

export function DisputeDetail({ dispute, onBack }: DisputeDetailProps) {
  const [sellerResponse, setSellerResponse] = useState('');
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_verification':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'in_review':
      case 'awaiting_seller':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_verification':
        return 'Pendiente de verificación';
      case 'in_review':
        return 'En revisión por soporte';
      case 'awaiting_seller':
        return 'Esperando respuesta del vendedor';
      case 'resolved':
        return 'Resuelta';
      default:
        return 'Estado desconocido';
    }
  };

  const getDisputeReasonLabel = (reason: string) => {
    const reasons = {
      not_received: 'No recibí el producto',
      damaged_product: 'Producto dañado',
      not_as_described: 'No es como se describe',
      wrong_item: 'Producto incorrecto',
      other: 'Otro motivo',
    };
    return reasons[reason as keyof typeof reasons] || reason;
  };

  const handleSellerResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerResponse.trim()) return;

    setIsSubmittingResponse(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Seller response submitted:', sellerResponse);
      setSellerResponse('');
      alert('Respuesta enviada exitosamente. El equipo de soporte la revisará.');
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Error al enviar la respuesta. Por favor intenta nuevamente.');
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const canRespond = dispute.status === 'awaiting_seller';
  const canCancel = dispute.status === 'pending_verification' || dispute.status === 'in_review';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b bg-card">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1>Disputa #{dispute.id}</h1>
            <p className="text-sm text-muted-foreground">Orden: {dispute.orderId}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(dispute.status)}
            <span>{getStatusText(dispute.status)}</span>
          </div>
        </div>

        {/* Product Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                📦
              </div>
              <div className="flex-1">
                <h3>{dispute.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span>${dispute.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Creada: {formatMessageTime(dispute.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Dispute Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Información de la Disputa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dispute.reason && (
              <div>
                <Label className="text-sm text-muted-foreground">Motivo:</Label>
                <p>{getDisputeReasonLabel(dispute.reason)}</p>
              </div>
            )}
            <div>
              <Label className="text-sm text-muted-foreground">Descripción del problema:</Label>
              <p className="mt-1">{dispute.description}</p>
            </div>

            {/* Participants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Comprador:</Label>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>TU</AvatarFallback>
                  </Avatar>
                  <span>Tú</span>
                  <Badge variant="secondary">Comprador</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Vendedor:</Label>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {dispute.seller.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{dispute.seller}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evidence */}
        {dispute.evidence && dispute.evidence.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Evidencias ({dispute.evidence.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {dispute.evidence.map((evidence, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={evidence.url}
                      alt={evidence.name}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {evidence.name}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Support Response */}
        {dispute.supportResponse && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Respuesta de Soporte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{dispute.supportResponse}</p>
            </CardContent>
          </Card>
        )}

        {/* Seller Response Section */}
        {canRespond && (
          <Card>
            <CardHeader>
              <CardTitle>Tu Respuesta como Vendedor</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSellerResponse} className="space-y-4">
                <div>
                  <Label htmlFor="response">
                    Proporciona tu respuesta a esta disputa *
                  </Label>
                  <Textarea
                    id="response"
                    placeholder="Explica tu punto de vista sobre esta disputa. Incluye cualquier información relevante, propuestas de solución, etc."
                    value={sellerResponse}
                    onChange={(e) => setSellerResponse(e.target.value)}
                    className="min-h-[100px] mt-2"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={!sellerResponse.trim() || isSubmittingResponse}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmittingResponse ? 'Enviando...' : 'Enviar Respuesta'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Seller Response Display */}
        {dispute.sellerResponse && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Respuesta del Vendedor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{dispute.sellerResponse}</p>
            </CardContent>
          </Card>
        )}

        {/* Resolution */}
        {dispute.resolution && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Resolución
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="default">
                  {dispute.resolution.type === 'refund_full' ? 'Reembolso completo' :
                   dispute.resolution.type === 'refund_partial' ? 'Reembolso parcial' :
                   dispute.resolution.type === 'replacement' ? 'Reemplazo' : 'Sin acción'}
                </Badge>
                {dispute.resolution.amount && (
                  <span className="text-sm text-muted-foreground">
                    ${dispute.resolution.amount.toFixed(2)}
                  </span>
                )}
              </div>
              <p>{dispute.resolution.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        {dispute.timeline && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Historial de la Disputa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dispute.timeline.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      {index < dispute.timeline.length - 1 && (
                        <div className="w-px h-8 bg-border mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{item.actor}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.actorRole === 'buyer' ? 'Comprador' :
                           item.actorRole === 'seller' ? 'Vendedor' : 'Soporte'}
                        </Badge>
                        <span className="text-sm text-muted-foreground ml-auto">
                          {formatMessageTime(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {canCancel && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4>¿Quieres cancelar esta disputa?</h4>
                  <p className="text-sm text-muted-foreground">
                    Puedes cancelar la disputa si ya no necesitas asistencia.
                  </p>
                </div>
                <Button variant="outline">
                  Cancelar Disputa
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}