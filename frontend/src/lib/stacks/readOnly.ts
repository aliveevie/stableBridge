import { ClarityValue, cvToHex, parseReadOnlyResponse } from '@stacks/transactions';

type CallReadOnlyArgs = {
  nodeApiUrl: string;
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  sender: string;
};

export async function callReadOnlyFunction({
  nodeApiUrl,
  contractAddress,
  contractName,
  functionName,
  functionArgs,
  sender,
}: CallReadOnlyArgs): Promise<ClarityValue> {
  const url = `${nodeApiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      sender,
      arguments: functionArgs.map(cvToHex),
    }),
  });

  if (!res.ok) {
    throw new Error(`Stacks node call-read failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as any;
  return parseReadOnlyResponse(json);
}

