import { useAuth } from '@micro-stacks/react';
import { Button } from './ui/button';
 
export const WalletConnectMobile = () => {
  const { openAuthRequest, isRequestPending, signOut, isSignedIn } = useAuth();
  const label = isRequestPending ? 'Loading...' : isSignedIn ? 'Sign out' : 'Connect wallet';
  return (
    <Button className="w-full"
      onClick={async () => {
        if (isSignedIn) await signOut();
        else await openAuthRequest();
      }}
    >
      {label}
    </Button>
  );
};