"use server";
import { NextRequest, NextResponse } from 'next/server';

import { createCollection } from '@metaplex-foundation/mpl-core';
import { addConfigLines, fetchCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';
import { create as createCandyMachine } from "@metaplex-foundation/mpl-core-candy-machine";

import { createGenericFile, dateTime, generateSigner, sol, some, transactionBuilder } from '@metaplex-foundation/umi';

import { TransactionError } from '@metaplex-foundation/umi';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { createNFT } from '@/db/queries';
import { NewNFT } from '@/db/schema';
import { initializeUmi } from '@/lib/utils/umi';

export async function POST(request: NextRequest) {
    try {

        const umi = await initializeUmi();
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = formData.get('price') as string;
        const stock = formData.get('stock') as string;
        const file = formData.get('assets') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, message: 'No file provided' },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const genericFile = createGenericFile(buffer, file.name, { contentType: file.type });
        const uriUploadArray = await umi.uploader.upload([genericFile]);

        const metadata = {
            name: name!,
            description: description!,
            image: uriUploadArray[0],
            animation_url: "",
            external_url: "",
            attributes: [
                { trait_type: "price", value: price! },
                { trait_type: "stock", value: stock! }
            ],
            properties: {
                files: [
                    { uri: uriUploadArray[0], type: file.type }
                ],
                category: "image"
            },
        };

        const metadataUri = await umi.uploader.uploadJson(metadata);
        console.log("metadataUri", metadataUri);

        const collectionSigner = generateSigner(umi);
        const collectionTx = await createCollection(umi, {
            collection: collectionSigner,
            name: name,
            uri: metadataUri,
        }).sendAndConfirm(umi);
        console.log("collectionTx", collectionTx);

        const candyMachine = generateSigner(umi);

        const instruction = await createCandyMachine(umi, {
            candyMachine,
            collection: collectionSigner.publicKey,
            collectionUpdateAuthority: umi.identity,
            itemsAvailable: Number(stock),
            authority: umi.identity.publicKey,
            guards: {
                botTax: some({ lamports: sol(0.01), lastInstruction: true }),
                solPayment: some({ lamports: sol(1.5), destination: umi.identity.publicKey }), //treasury
                startDate: some({ date: dateTime(new Date().toISOString()) }),
            },
            configLineSettings: some({
                prefixName: name,
                nameLength: (name.length + stock.toString().length + 1),
                prefixUri: '',
                uriLength: metadataUri.length,
                isSequential: false,
            }),
        });
        console.log("instruction", instruction)
        try {
            const candyMachineTx = await transactionBuilder()
                .add(instruction)
                .sendAndConfirm(umi, { send: { skipPreflight: true } });
            const candyMachineSignature = base58.deserialize(candyMachineTx.signature);


            const addItemsConfig = [];
            for (let i = 1; i <= Number(stock); i++) {
                addItemsConfig.push({ name: i.toString(), uri: metadataUri });
            }
            const addItems = await addConfigLines(umi, {
                candyMachine: candyMachine.publicKey,
                index: 0,
                configLines: addItemsConfig,
            }).sendAndConfirm(umi, { send: { skipPreflight: true } });
            console.log("addItems", addItems);
            const candyMachineAccount = await fetchCandyMachine(umi, candyMachine.publicKey)
            console.log("candyMachineAccount", candyMachineAccount);
            const newNFT: NewNFT = {
                name: name,
                stock: parseInt(stock),
                description: description,
                price: parseFloat(price),
                tokenId: collectionSigner.publicKey,
                owner: umi.identity.publicKey,
                metadataUri: metadataUri,
                assetUri: uriUploadArray[0],
                tokenUri: candyMachineAccount.publicKey
            };
            await createNFT(newNFT);
            return NextResponse.json({
                success: true,
                status: "Success",
                message: "Programmable NFT created successfully!",
                assetURI: uriUploadArray[0],
                transactionHash: candyMachineSignature,
                metadataURI: metadataUri,
            });
        } catch (error) {

            console.error("Transaction Error Details:");
            console.error("Error Message:", (error as TransactionError));

            return NextResponse.json(
                {
                    success: false,
                    status: "Error",
                    message: [instruction, error],

                },
                { status: 500 }
            );

        }









    } catch (error) {
        console.error("Error creating pNFT:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';


        return NextResponse.json(
            {
                success: false,
                status: "Error",
                message: errorMessage,

            },
            { status: 500 }
        );
    }
}

