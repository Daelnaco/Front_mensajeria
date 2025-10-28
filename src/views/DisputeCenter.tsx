import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';
import { DisputeDetail } from '../components/DisputeDetail';
import { CreateDisputeModal } from '../components/CreateDisputeModal';
import { Clock, AlertTriangle, CheckCircle, Plus, Eye, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useDisputes } from '../hooks/useDisputes';
import { formatMessageTime } from '../utils/dateUtils';
import type { CreateDisputePayload } from '../types';

export function DisputeCenter() {
  const { disputes, loading, error, createDispute } = useDisputes();
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [creating, setCreating] = useState(false);

  const selectedDispute = disputes.find(d => d.id === selectedDisputeId);

  const getDisputesByStatus = (status: string) => {
    if (status === 'pending') {
      return disputes.filter(d => d.status === 'pending_verification');
    }
    if (status === 'in_review') {
      return disputes.filter(d => d.status === 'in_review' || d.status === 'waiting_seller');
    }
    if (status === 'resolved') {
      return disputes.filter(d => d.status === 'resolved');
    }
    return [];
  };

  const handleCreateDispute = async (payload: CreateDisputePayload) => {
    try {
      setCreating(true);
      await createDispute(payload);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating dispute:', err);
    } finally {
      setCreating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_verification': return <Clock className="h-4 w-4" />;
      case 'in_review': 
      case 'awaiting_seller': return <AlertTriangle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_verification': return 'Pendiente verificación';
      case 'in_review': return 'En revisión';
      case 'awaiting_seller': return 'Esperando vendedor';
      case 'resolved': return 'Resuelta';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_verification': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'in_review': 
      case 'awaiting_seller': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'resolved': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const pendingCount = getDisputesByStatus('pending').length;
  const reviewCount = getDisputesByStatus('in_review').length;
  const resolvedCount = getDisputesByStatus('resolved').length;

  if (selectedDispute) {
    return (
      <DisputeDetail 
        dispute={selectedDispute} 
        onBack={() => setSelectedDisputeId(null)} 
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2>Centro de Disputas</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona y resuelve disputas con vendedores
          </p>
        </div>
        
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Disputa
        </Button>
      </div>

      {/* Dispute Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pendientes
            {pendingCount > 0 && (
              <Badge className="ml-1 bg-yellow-500 text-white min-w-[20px] h-5 text-xs">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="in_review" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            En Revisión
            {reviewCount > 0 && (
              <Badge className="ml-1 bg-orange-500 text-white min-w-[20px] h-5 text-xs">
                {reviewCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Resueltas
            {resolvedCount > 0 && (
              <Badge className="ml-1 bg-green-500 text-white min-w-[20px] h-5 text-xs">
                {resolvedCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {getDisputesByStatus('pending').map((dispute, index) => (
            <motion.div
              key={dispute.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(dispute.status)}
                      <div>
                        <CardTitle className="text-base">{dispute.title}</CardTitle>
                        <CardDescription>
                          Orden #{dispute.orderId} • {dispute.seller}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(dispute.status)}>
                        {getStatusText(dispute.status)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDisputeId(dispute.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {dispute.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Creada {formatMessageTime(dispute.createdAt)}</span>
                    <span className="font-medium text-foreground">${dispute.amount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {getDisputesByStatus('pending').length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground"
            >
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3>No hay disputas pendientes</h3>
              <p className="text-sm">Las nuevas disputas aparecerán aquí</p>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="in_review" className="space-y-4">
          {getDisputesByStatus('in_review').map((dispute, index) => (
            <motion.div
              key={dispute.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(dispute.status)}
                      <div>
                        <CardTitle className="text-base">{dispute.title}</CardTitle>
                        <CardDescription>
                          Orden #{dispute.orderId} • {dispute.seller}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(dispute.status)}>
                        {getStatusText(dispute.status)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDisputeId(dispute.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {dispute.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Creada {formatMessageTime(dispute.createdAt)}</span>
                    <span className="font-medium text-foreground">${dispute.amount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {getDisputesByStatus('in_review').length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground"
            >
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3>No hay disputas en revisión</h3>
              <p className="text-sm">Las disputas en proceso aparecerán aquí</p>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {getDisputesByStatus('resolved').map((dispute, index) => (
            <motion.div
              key={dispute.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(dispute.status)}
                      <div>
                        <CardTitle className="text-base">{dispute.title}</CardTitle>
                        <CardDescription>
                          Orden #{dispute.orderId} • {dispute.seller}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(dispute.status)}>
                        {getStatusText(dispute.status)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDisputeId(dispute.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {dispute.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Resuelta {formatMessageTime(dispute.resolvedAt || dispute.createdAt)}</span>
                    <span className="font-medium text-foreground">${dispute.amount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {getDisputesByStatus('resolved').length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground"
            >
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3>No hay disputas resueltas</h3>
              <p className="text-sm">Las disputas completadas aparecerán aquí</p>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      <CreateDisputeModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
    </motion.div>
  );
}