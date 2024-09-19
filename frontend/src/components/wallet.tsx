import { useAuth } from '@micro-stacks/react';
import { Button } from './ui/button';
import { ClientProvider } from '@micro-stacks/react'; 


export const WalletConnectButton = () => {
  const { openAuthRequest, isRequestPending, signOut, isSignedIn } = useAuth();
  const label = isRequestPending ? 'Loading...' : isSignedIn ? 'Sign out' : 'Connect wallet';
  return (
    <>
      <ClientProvider 
        appName="Nextjs + Microstacks"
        appIconUrl="/vercel.png"
      >
        <Button className="hidden md:inline-flex"
        onClick={async () => {
          if (isSignedIn) await signOut();
          else await openAuthRequest();
        }}
      >
        {label}
    </Button>
      </ClientProvider>
    </>
  
  );
};