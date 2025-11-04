import { MainNavigation } from './layout/MainNavigation';
import { Toaster } from "./components/ui/sonner"; // <-- 1. IMPORTA EL TOASTER

export default function App() {
  return (
    <div className="size-full">
      <MainNavigation />
      
      <Toaster richColors position="top-right" /> {/* <-- 2. AÑADE ESTA LÍNEA */}
    </div>
  );
}