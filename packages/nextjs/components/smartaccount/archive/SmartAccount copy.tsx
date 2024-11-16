// "use client";

// import React, { useEffect } from "react";
// import { encodeFunctionData, parseAbi } from "viem";
// import { useSmartAccount, useSendSponsoredTransaction, useUserOpWait } from "@biconomy/use-aa";

// export const MintNFT: React.FC = () => {
//   const { smartAccountAddress } = useSmartAccount();
//   const {
//     mutate,
//     data: userOpResponse,
//     error,
//     isPending,
//   } = useSendSponsoredTransaction();

//   const {
//     isLoading: waitIsLoading,
//     isSuccess: waitIsSuccess,
//     error: waitError,
//     data: waitData,
//   } = useUserOpWait(userOpResponse);

//   const mintNftTx = () => {
//     if (!smartAccountAddress) {
//       console.error("Smart Account Address not found");
//       return;
//     }

//     mutate({
//       transactions: {
//         to: "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e", // Replace with target contract address
//         data: encodeFunctionData({
//           abi: parseAbi(["function safeMint(address _to)"]),
//           functionName: "safeMint",
//           args: [smartAccountAddress],
//         }),
//       },
//     });
//   };

//   useEffect(() => {
//     if (waitData?.success === "true") {
//       console.log("Transaction Hash:", waitData?.receipt?.transactionHash);
//     }
//   }, [waitData]);

//   return (
//     <div>
//       <button type="button" onClick={mintNftTx} style={{
//           padding: "10px 20px",
//           backgroundColor: "#007BFF",
//           color: "#fff",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}>
//         {waitIsLoading || isPending ? "Executing..." : "Mint an NFT"}
//       </button>
//       {(error || waitError) && (
//         <p style={{ color: "red" }}>
//           Error: {error?.message || waitError?.message}
//         </p>
//       )}
//       {waitIsSuccess && waitData?.receipt?.transactionHash && (
//         <p>
//           Transaction successful! Hash: {waitData.receipt.transactionHash}
//         </p>
//       )}
//     </div>
//   );
// };
