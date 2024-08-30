import { Connection } from "@solana/web3.js"
import axios from "axios";
import { SUPPORTED_TOKENS } from "./tokens";

let LAST_UPDATED: number | null = null;
let prices: {[key:string]:{
    price: string
}} = { }
const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000 ;



export const connection = new Connection("https://api.mainnet-beta.solana.com");

export async function getSupportedToken(){
    if(!LAST_UPDATED || new Date().getTime() - LAST_UPDATED < TOKEN_PRICE_REFRESH_INTERVAL){
        try{
            
            const response = await axios.get("https://price.jup.ag/v6/price?ids=SOL,USDC,USDT");
            prices = response.data.data;
            LAST_UPDATED = new Date().getTime()
        }catch(e){
            console.log(e);
        }
    }
    return SUPPORTED_TOKENS.map(s => ({
        ...s,
        price: prices[s.name].price
    }))
}
getSupportedToken();