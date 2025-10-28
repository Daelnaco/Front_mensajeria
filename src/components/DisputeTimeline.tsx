import { Dispute } from '../data/mockData';
import { format, es } from '../utils/dateUtils';
import { AlertCircle, CheckCircle, Clock, User } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface DisputeTimelineProps {
  dispute: Dispute;
}

export function DisputeTimeline({ dispute }: DisputeTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in_review':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'resolved_buyer':
      case 'resolved_seller':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in_review':
        return 'En revisión';
      case 'resolved_buyer':
        return 'Resuelta a favor del comprador';
      case 'resolved_seller':
        return 'Resuelta a favor del vendedor';
      default:
        return 'Desconocido';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'in_review':
        return 'default';
      case 'resolved_buyer':
      case 'resolved_seller':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(dispute.status)}
            Disputa #{dispute.id.slice(-6)}
          </CardTitle>
          <Badge variant={getStatusVariant(dispute.status)}>
            {getStatusText(dispute.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Información de la disputa */}
        <div className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">Motivo:</span>
            <p>{dispute.reason === 'damaged_product' ? 'Producto dañado' : 
                dispute.reason === 'not_received' ? 'No recibido' :
                dispute.reason === 'not_as_described' ? 'No es como se describe' :
                dispute.reason === 'wrong_item' ? 'Producto incorrecto' : 'Otro'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Descripción:</span>
            <p>{dispute.description}</p>
          </div>
        </div>

        {/* Evidencias */}
        {dispute.evidence.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm text-muted-foreground">Evidencias:</h4>
            <div className="grid grid-cols-2 gap-2">
              {dispute.evidence.map((evidence, index) => (
                <div key={index} className="relative group">
                  <img
                    src={evidence.url}
                    alt={evidence.name}
                    className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-3">
          <h4 className="text-sm text-muted-foreground">Historial:</h4>
          <div className="space-y-3">
            {dispute.timeline.map((item, index) => (
              <div key={item.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  {index < dispute.timeline.length - 1 && (
                    <div className="w-px h-6 bg-border mt-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{item.actor}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(item.timestamp, 'dd MMM, HH:mm', { locale: es })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}