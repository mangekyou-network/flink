import { Provider, Wallet, Contract, bn, JsonAbi } from 'fuels';
import contractIds from './sway-api/contract-ids.json';
import { Injectable } from '@nestjs/common';
import {
    Action as ActionDto,
    ActionMetadata,
    GenerateTransactionParams,
    TransactionInfo,
} from 'src/common/dto';
import {
    TransactionResult,
    browserConfig,
    metadata,
    providerConfig,
} from './config';
import { RegistryPlug } from '@action/registry';

type FormName = 'amount' | 'tokenAddress' | 'to';

@RegistryPlug('buy-a-fuel-can', 'v1')
@Injectable()
export class BuyMeAFuelCanService extends ActionDto<FormName> {
    async getMetadata(): Promise<ActionMetadata<FormName>> {
        return metadata as unknown as ActionMetadata<FormName>;
    }

    async generateTransaction(
        data: GenerateTransactionParams<FormName>,
    ): Promise<TransactionInfo[]> {
        const { additionalData, formData } = data;
        const { chainId, account } = additionalData;
        if (!account) {
            throw new Error('Missing account!');
        }
        const { amount, tokenAddress, to } = formData;

        const provider = await Provider.create('http://127.0.0.1:4000/graphql');
        const wallet = Wallet.fromPrivateKey(account, provider);

        // Đảm bảo rằng bạn có ABI cho contract này
        const _abi: JsonAbi = {
            specVersion: "0.1.0",
            encodingVersion: "0.1.0",
            programType: "Contract",
            concreteTypes: [],
            metadataTypes: [],
            "functions": [
                {
                    "inputs": [],
                    "name": "counter",
                    "output": "",
                    "attributes": [
                        {
                            "name": "storage",
                            "arguments": [
                                "read"
                            ]
                        }
                    ]
                },
                {
                    "inputs": [],
                    "name": "increment",
                    "output": "",
                    "attributes": [
                        {
                            "name": "storage",
                            "arguments": [
                                "read",
                                "write"
                            ]
                        }
                    ]
                }
            ],
            "loggedTypes": [],
            "messagesTypes": [],
            "configurables": []
        }
        const contract = new Contract(contractIds.testContract, _abi, wallet);

        // const decimalsResult = await contract.functions.decimals().call();
        // const decimals = decimalsResult.value as number;
        const amountToSend = bn(amount).mul(bn(10).pow(18));

        let transferTx: { to: string; data: string };

        if (tokenAddress !== '') {
            const transferResponse = await contract.functions.transfer(to, amountToSend).call();
            transferTx = { to, data: transferResponse.transactionId };
        } else {
            transferTx = { to, data: '' };
        }

        const txInfo: TransactionInfo = {
            chainId: provider.getChainId(),
            to: transferTx.to,
            value: tokenAddress === '' ? bn(amount).toString() : '0',
            data: transferTx.data,
            shouldPublishToChain: true,
        };

        return [txInfo];
    }
}