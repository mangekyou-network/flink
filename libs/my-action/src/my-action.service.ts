import { Injectable } from '@nestjs/common';
import { connect, keyStores, Near, Contract, utils } from 'near-api-js';
import {
    Action as ActionDto,
    ActionMetadata,
    GenerateTransactionParams,
    TransactionInfo,
} from 'src/common/dto';
import { RegistryPlug } from '@action/registry';
import { metadata } from './config';

type FieldTypes = "value" | "token" | "recipient";

@RegistryPlug('buy-me-a-coffee', 'v1')
@Injectable()
export class BuyMeAFuelCanService extends ActionDto<FieldTypes> {
    async getMetadata(): Promise<ActionMetadata<FieldTypes>> {
        return metadata as unknown as ActionMetadata<FieldTypes>;
    }

    async generateTransaction(
        data: GenerateTransactionParams<FieldTypes>,
    ): Promise<TransactionInfo[]> {
        const { additionalData, formData } = data;
        const { chainId, account } = additionalData;
        if (!account) {
            throw new Error('Missing account!');
        }
        const { value, token, recipient } = formData;

        const near = await connect({
            networkId: 'testnet', // hoặc 'mainnet'
            keyStore: new keyStores.InMemoryKeyStore(),
            nodeUrl: 'https://rpc.testnet.near.org',
        });

        const wallet = await near.account(account);

        const amountInYocto = utils.format.parseNearAmount(value);

        let txInfo: TransactionInfo;

        if (token !== '') {
            const contract = new Contract(
                wallet,
                token, 
                {
                    viewMethods: ['ft_balance_of', 'ft_metadata'],
                    changeMethods: ['ft_transfer'],
                    useLocalViewExecution: true
                }
            );

            txInfo = {
                chainId,
                to: token,
                value: '0',
                data: JSON.stringify({
                    method: 'ft_transfer',
                    args: {
                        receiver_id: recipient,
                        amount: amountInYocto,
                    },
                }),
                shouldPublishToChain: true,
            };
        } else {
            txInfo = {
                chainId,
                to: recipient,
                value: amountInYocto || '0',
                data: '',
                shouldPublishToChain: true,
            };
        }

        return [txInfo];
    }
}