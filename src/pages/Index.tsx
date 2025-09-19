import Header from '@/components/Header';
import VotingArena from '@/components/VotingArena';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-chamber">
      <Header />
      <main>
        <VotingArena />
      </main>
      <Footer />
    </div>
  );
};

export default Index;