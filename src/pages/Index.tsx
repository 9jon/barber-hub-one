import { Header } from '@/components/sharks/Header';
import { Hero } from '@/components/sharks/Hero';
import { Servicos } from '@/components/sharks/Servicos';
import { Depoimentos } from '@/components/sharks/Depoimentos';
import { Calendario } from '@/components/sharks/Calendario';
import { Contato } from '@/components/sharks/Contato';
import { Footer } from '@/components/sharks/Footer';
import { AdminModal } from '@/components/sharks/AdminModal';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Servicos />
        <Depoimentos />
        <Calendario />
        <Contato />
      </main>
      <Footer />
      <AdminModal />
    </div>
  );
};

export default Index;
