import { authConfig } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db"
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";


export async function POST(req: NextRequest){
    const connection = new Connection("https://api.mainnet-beta.solana.com")
    const data:{
        quoteResponse:any
    } = await req.json();

    const  session = await getServerSession(authConfig); 
    if(!session?.user){
        return NextResponse.json({
            message: "You are not Logged in"
        },{
            status: 401
        })
    }
    
    const solWallet = await db.solWallet.findFirst({
        where:{
            userId: session.user.uid
        }
    })
    if(!solWallet){
        return NextResponse.json({
            message: "Couldnt find associated solana wallet"
        },{
            status: 401
        })
    }

    const { swapTransaction } = await (
        await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // quoteResponse from /quote api
            quoteResponse: data.quoteResponse,
            // user public key to be used for the swap
            userPublicKey: solWallet.publicKey,
            // auto wrap and unwrap SOL. default is true
            wrapAndUnwrapSol: true,
            // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
            // feeAccount: "fee_account_public_key"
        })
        })
    ).json();

    // deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    const privateKey = getPrivateKeyFromDb(solWallet.privatKey)
    transaction.sign([privateKey]);

    // get the latest block hash
    const latestBlockHash = await connection.getLatestBlockhash();

    // Execute the transaction
    const rawTransaction = transaction.serialize()
    const txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    maxRetries: 2
    });
    await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: txid
    });
    
    console.log(`https://solscan.io/tx/${txid}`);
    return NextResponse.json({
        txid
    })


}

function getPrivateKeyFromDb(privatKey: string){
    const arr = privatKey.split(",").map(x => Number(x));
    const privatKeyUIntArr = Uint8Array.from(arr);
    const keyPair =Keypair.fromSecretKey(privatKeyUIntArr);
    return keyPair
}