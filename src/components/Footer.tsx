import { useState, useEffect } from 'react';
import { Scale, Circle } from 'lucide-react';

const Footer = () => {
  const [orbPositions, setOrbPositions] = useState([
    { x: 0, y: 0, size: 8 },
    { x: 0, y: 0, size: 12 },
    { x: 0, y: 0, size: 10 },
  ]);

  useEffect(() => {
    const animateOrbs = () => {
      setOrbPositions(prev => 
        prev.map((orb, index) => ({
          ...orb,
          x: Math.sin(Date.now() * 0.001 + index * 2) * 20,
          y: Math.cos(Date.now() * 0.001 + index * 2) * 10,
        }))
      );
    };

    const interval = setInterval(animateOrbs, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-xl mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center space-y-8">
          {/* Animated Scales of Justice */}
          <div className="relative flex justify-center items-center">
            <div className="relative animate-float">
              <Scale className="w-16 h-16 text-primary glow-primary" />
              
              {/* Digital Orbs */}
              <div className="absolute inset-0">
                {orbPositions.map((orb, index) => (
                  <Circle
                    key={index}
                    className={`absolute text-glow-accent animate-pulse`}
                    style={{
                      width: `${orb.size}px`,
                      height: `${orb.size}px`,
                      left: `${50 + orb.x}%`,
                      top: `${50 + orb.y}%`,
                      transform: 'translate(-50%, -50%)',
                      filter: `drop-shadow(0 0 ${orb.size}px currentColor)`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer Content */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold gradient-text">
              Transparent. Secure. Democratic.
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Building the future of decentralized governance with cryptographic privacy and verifiable transparency.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex justify-center space-x-8 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Documentation
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">  
              Security Audit
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Community
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              GitHub
            </a>
          </div>

          <div className="pt-4 border-t border-border/20">
            <p className="text-xs text-muted-foreground">
              © 2024 Confidential DAO. Powered by zero-knowledge governance protocols.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;