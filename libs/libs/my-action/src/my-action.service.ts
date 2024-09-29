import { Provider, Wallet, Contract, bn } from 'fuels';
import contractIds from './sway-api/contract-ids.json';
import { TokenContractAbi, TokenContractAbi__factory } from '/sway-api'; // Assuming your Fuel contract ABI is here
import { useState, useEffect } from 'react';
import { useAccount, useFuel } from '@fuels/react';

export default function BuyMeAFuelCanService() {
    const [contract, setContract] = useState<TokenContractAbi>();
    const { account } = useAccount();
    const { fuel } = useFuel();
    const [transactionInfo, setTransactionInfo] = useState<any>(null);

    // Initialize provider and contract
    useEffect(() => {
        (async () => {
            if (account && fuel) {
                const provider = await Provider.create('http://127.0.0.1:4000/graphql');
                const wallet = Wallet.fromPrivateKey('YOUR_PRIVATE_KEY', provider); // Replace with actual private key
                const contract = TokenContractAbi__factory.connect(contractIds.tokenContract, wallet);
                setContract(contract);
            }
        })();
    }, [account, fuel]);

    // Function to generate a transaction on Fuel
    const generateTransaction = async (formData: { recipient: string, token: string, value: string }) => {
        if (!contract) return;

        const provider = new Provider('http://127.0.0.1:4000/graphql');
        const decimals = await contract.functions.decimals().call();

        const amountToSend = bn(formData.value).mul(bn(10).pow(decimals.value));
        let transferTx = { to: formData.recipient, data: '' };

        if (formData.token !== '') {
            const transferResponse = await contract.functions.transfer(formData.recipient, amountToSend).call();
            transferTx = { to: formData.recipient, data: transferResponse.transactionHash };
        }

        const txInfo = {
            chainId: provider.chainId,
            to: transferTx.to,
            value: formData.token === '' ? bn(formData.value).toString() : '0',
            data: transferTx.data,
            shouldPublishToChain: true,
        };

        setTransactionInfo(txInfo);
        return txInfo;
    };

    // Function to parse transaction
    const parseTransaction = async (txHash: string, chainId: number) => {
        const provider = new Provider(`http://127.0.0.1:4000/graphql`);
        const receipt = await provider.getTransaction(txHash);

        if (!receipt) {
            throw new Error('Transaction receipt not found');
        }

        let tokenAddress: string | undefined;
        let value: bigint | undefined;
        let toAddress: string | undefined;

        for (const log of receipt.logs) {
            if (log.type === 'Transfer') {
                tokenAddress = log.contractId;
                toAddress = log.recipient;
                value = BigInt(log.amount);
                console.log(`Fuel Token Transfer: from ${log.sender} to ${toAddress}, amount ${value} at ${tokenAddress}`);
                return {
                    toAddress,
                    tokenAddress,
                    value: bn(value).toString(),
                    txHash,
                    chainId,
                };
            }
        }

        throw new Error('Transaction parsing failed');
    };

    // Example of invoking generateTransaction and parseTransaction
    const onTestTransaction = async () => {
        const formData = {
            recipient: 'fuel1recipient...', // Replace with actual recipient address
            token: '', // If not using a token, keep this empty
            value: '100', // Example value to send
        };

        const tx = await generateTransaction(formData);
        console.log('Generated Transaction:', tx);

        if (tx) {
            const parsedTx = await parseTransaction(tx.data, tx.chainId);
            console.log('Parsed Transaction:', parsedTx);
        }
    };
}
