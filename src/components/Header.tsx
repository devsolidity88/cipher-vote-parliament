import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Lock, Users, Vote } from 'lucide-react';
import daoLogo from '@/assets/dao-logo.png';

const Header = () => {

  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={daoLogo} 
              alt="DAO Governance Logo" 
              className="w-12 h-12 animate-glow"
            />
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Confidential DAO
              </h1>
              <p className="text-sm text-muted-foreground">
                Fair Governance with Encrypted Votes
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-primary" />
                <span>Encrypted Until Close</span>
              </div>
              <div className="flex items-center space-x-2">
                <Vote className="w-4 h-4 text-accent" />
                <span>1,247 Active Voters</span>
              </div>
            </div>
            
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;