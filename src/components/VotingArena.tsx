import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useContract } from '@/hooks/useContract';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { 
  Lock, 
  Unlock, 
  CheckCircle, 
  XCircle, 
  MinusCircle,
  Clock,
  Eye,
  EyeOff,
  Vote,
  Users
} from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  timeLeft: string;
  encrypted: boolean;
}

const VotingArena = () => {
  const { address, isConnected } = useAccount();
  const { castEncryptedVote, isLoading, isPending, isSuccess, error } = useContract();
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: '1',
      title: 'Protocol Upgrade v2.1',
      description: 'Implement cross-chain governance and enhanced privacy features for the next protocol iteration.',
      status: 'active',
      votesFor: 0,
      votesAgainst: 0,
      votesAbstain: 0,
      timeLeft: '2d 14h 32m',
      encrypted: true
    },
    {
      id: '2', 
      title: 'Treasury Allocation',
      description: 'Allocate 500,000 tokens for ecosystem development and community rewards program.',
      status: 'active',
      votesFor: 0,
      votesAgainst: 0,
      votesAbstain: 0,
      timeLeft: '4d 8h 15m',
      encrypted: true
    },
    {
      id: '3',
      title: 'Validator Rewards Update',
      description: 'Increase validator rewards by 15% to improve network security and decentralization.',
      status: 'completed',
      votesFor: 847,
      votesAgainst: 203,
      votesAbstain: 97,
      timeLeft: 'Completed',
      encrypted: false
    }
  ]);

  const [userVotes, setUserVotes] = useState<{[key: string]: 'for' | 'against' | 'abstain' | null}>({});

  const handleVote = async (proposalId: string, vote: 'for' | 'against' | 'abstain') => {
    if (!isConnected) {
      toast.error('Please connect your wallet to vote');
      return;
    }

    try {
      // Cast encrypted vote on blockchain
      await castEncryptedVote(parseInt(proposalId), vote);
      
      // Update local state
      setUserVotes(prev => ({
        ...prev,
        [proposalId]: prev[proposalId] === vote ? null : vote
      }));
      
      toast.success('Vote cast successfully! Your vote is encrypted and secure.');
    } catch (err) {
      console.error('Vote casting error:', err);
      toast.error('Failed to cast vote. Please try again.');
    }
  };

  const renderVoteButton = (proposalId: string, voteType: 'for' | 'against' | 'abstain', icon: any, label: string) => {
    const Icon = icon;
    const isSelected = userVotes[proposalId] === voteType;
    const proposal = proposals.find(p => p.id === proposalId);
    
    if (proposal?.status === 'completed') return null;

    return (
      <Button
        variant={isSelected ? "default" : "outline"}
        size="sm"
        onClick={() => handleVote(proposalId, voteType)}
        disabled={isLoading || isPending}
        className={`
          ${isSelected ? 'glow-primary' : ''} 
          ${voteType === 'for' ? 'hover:border-vote-active hover:text-vote-active' : ''}
          ${voteType === 'against' ? 'hover:border-vote-against hover:text-vote-against' : ''}
          ${voteType === 'abstain' ? 'hover:border-vote-abstain hover:text-vote-abstain' : ''}
        `}
      >
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </Button>
    );
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 gradient-text">
          Parliament Chamber
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Cast your votes in the encrypted governance chamber. All proposals remain confidential until voting concludes.
        </p>
        {isLoading && (
          <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-primary font-medium">Encrypting your vote and submitting to blockchain...</p>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive font-medium">Vote submission failed. Please try again.</p>
          </div>
        )}
      </div>

      <div className="grid gap-8">
        {proposals.map((proposal) => (
          <Card 
            key={proposal.id} 
            className={`
              relative overflow-hidden bg-gradient-proposal border-border/50 backdrop-blur-sm
              ${proposal.status === 'active' ? 'animate-glow' : ''}
            `}
          >
            <div className="absolute inset-0 bg-gradient-glow opacity-20"></div>
            
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CardTitle className="text-xl text-foreground">
                    {proposal.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {proposal.encrypted ? (
                      <>
                        <Lock className="w-4 h-4 text-primary" />
                        <Badge variant="secondary" className="glow-secondary">
                          Encrypted
                        </Badge>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 text-accent" />
                        <Badge variant="outline">
                          Results Visible
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{proposal.timeLeft}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                {proposal.description}
              </p>

              {proposal.status === 'active' ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <EyeOff className="w-4 h-4" />
                    <span>Vote counts hidden until voting closes</span>
                  </div>
                  
                  <div className="flex space-x-4">
                    {renderVoteButton(proposal.id, 'for', CheckCircle, 'Support')}
                    {renderVoteButton(proposal.id, 'against', XCircle, 'Oppose')}  
                    {renderVoteButton(proposal.id, 'abstain', MinusCircle, 'Abstain')}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-foreground">
                    <Eye className="w-4 h-4" />
                    <span>Final Results</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-vote-active/10 border border-vote-active/20">
                      <CheckCircle className="w-6 h-6 text-vote-active mx-auto mb-2" />
                      <div className="font-bold text-vote-active">{proposal.votesFor}</div>
                      <div className="text-sm text-muted-foreground">Support</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-vote-against/10 border border-vote-against/20">
                      <XCircle className="w-6 h-6 text-vote-against mx-auto mb-2" />
                      <div className="font-bold text-vote-against">{proposal.votesAgainst}</div>
                      <div className="text-sm text-muted-foreground">Oppose</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-vote-abstain/10 border border-vote-abstain/20">
                      <MinusCircle className="w-6 h-6 text-vote-abstain mx-auto mb-2" />
                      <div className="font-bold text-vote-abstain">{proposal.votesAbstain}</div>
                      <div className="text-sm text-muted-foreground">Abstain</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VotingArena;