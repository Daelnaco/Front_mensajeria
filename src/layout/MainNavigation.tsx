import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { MessagingAndDisputes } from '../views/MessagingAndDisputes';
import { DisputeCenter } from '../views/DisputeCenter';
import { motion } from 'motion/react';
import { useMessages } from '../hooks/useMessages';
import { useDisputes } from '../hooks/useDisputes';

export function MainNavigation() {
  const [activeTab, setActiveTab] = useState('messages');
  
  // Hooks para los contadores
  const { messages } = useMessages(null);
  const messageCount = messages.filter(message => !message.read).length;
  const { disputes } = useDisputes();
  const disputeCount = disputes.length;

  return (
    <div className="h-screen bg-background">
      {/* Cabecera con el logo y el título */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm"
      >
        <div className="px-6 py-4">
        
          {/* --- MODIFICACIÓN PARA EL LOGO --- */}
          <div className="flex items-center gap-3"> 
            <img 
              src="/logo.jpg" // <-- Ruta a tu logo en la carpeta /public
              alt="Logo de la Empresa" 
              className="h-9 w-9" // <-- Ajusta el tamaño aquí
            />
            <div>
              <h1 className="text-green-700">Sistema de Mensajería y Disputas</h1>
              <p className="text-sm text-muted-foreground">
                Gestiona tu comunicación y resuelve disputas de manera eficiente
              </p>
            </div>
          </div>
          {/* --- FIN DE LA MODIFICACIÓN --- */}

        </div>
      </motion.div>

      {/* Navegación por Pestañas (Tabs) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100vh-120px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-6 pt-4"
        >
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            {/* Pestaña Mensajes */}
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Mensajes
              {messageCount > 0 && (
                <Badge className="ml-1 bg-primary text-primary-foreground min-w-[20px] h-5 text-xs">
                  {messageCount}
                </Badge>
              )}
            </TabsTrigger>
            
            {/* Pestaña Disputas */}
            <TabsTrigger value="disputes" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Disputas
              {disputeCount > 0 && (
                <Badge className="ml-1 bg-destructive text-destructive-foreground min-w-[20px] h-5 text-xs">
                  {disputeCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* Contenido de las Pestañas */}
        <div className="px-6 pt-4 h-[calc(100%-80px)]">
          <TabsContent value="messages" className="h-full mt-0">
            <MessagingAndDisputes />
          </TabsContent>
          
          <TabsContent value="disputes" className="h-full mt-0">
            <DisputeCenter />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}