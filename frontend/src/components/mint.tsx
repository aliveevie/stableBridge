"use client";

import { useContext, useState } from "react";
import { UserContext } from "@/components/userContext";
import { standardPrincipalCV } from "@stacks/transactions";
import { STACKS_TESTNET } from "@stacks/network";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const MintPage = () => {
    const { userData, tokens } = useContext(UserContext);
    const [isMinting, setIsMinting] = useState(false);
    const { toast } = useToast();
    const network = STACKS_TESTNET;

    const mint = async () => {
        if (!userData) {
            toast({
                title: "Not Connected",
                description: "Please connect your wallet to mint.",
                variant: "destructive",
            });
            return;
        }

        setIsMinting(true);
        const assetAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
        
        try {
            const functionArgs = [
                standardPrincipalCV(
                    userData.loadUserData().profile.stxAddress.testnet
                ),
            ];

            const options = {
                contractAddress: assetAddress,
                contractName: 'fabulous-frogs',
                functionName: 'mint',
                functionArgs,
                network,
                appDetails: {
                    name: 'Fabulous Frogs',
                    icon: 'https://assets.website-files.com/618b0aafa4afde65f2fe38fe/618b0aafa4afde2ae1fe3a1f_icon-isotipo.svg',
                },
                onFinish: (data: any) => {
                    console.log(data);
                    toast({
                        title: "Minting Successful",
                        description: "Your Fabulous Frog NFT has been minted!",
                    });
                },
            };

            // Here you would typically call a function to execute the transaction
            // For example: await openContractCall(options);
            // This is a placeholder for the actual minting logic
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating minting process

        } catch (error) {
            console.error("Minting failed:", error);
            toast({
                title: "Minting Failed",
                description: "There was an error while minting your NFT. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Fabulous Frogs Minter</CardTitle>
                    <CardDescription>Mint your unique Fabulous Frog NFT!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center mb-6">
                        <img 
                            src="/placeholder.svg?height=200&width=200" 
                            alt="Fabulous Frog NFT" 
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                    {userData ? (
                        <p className="text-sm text-center mb-4">
                            Connected: {userData.loadUserData().profile.stxAddress.testnet.slice(0, 6)}...
                            {userData.loadUserData().profile.stxAddress.testnet.slice(-4)}
                        </p>
                    ) : (
                        <p className="text-sm text-center mb-4">Not connected</p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={mint} disabled={isMinting || !userData}>
                        {isMinting ? "Minting..." : "Mint Fabulous Frog"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default MintPage;

