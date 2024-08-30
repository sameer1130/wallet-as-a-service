



export interface TokenDetails {
    name: string,
    mint: string,
    native: boolean,
    price: string,
    image: string,
    decimals: number
}

export const SUPPORTED_TOKENS: TokenDetails[] = [{
    name:"SOL",
    mint: "So11111111111111111111111111111111111111112",
    native: true,
    price: "180",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Solana_cryptocurrency_two.jpg",
    decimals: 9
},{
    name: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    native: false,
    price: "1",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJdHkdSZa8MT2A0okTSklwwkDDsyAFKf10Tw&s",
    decimals:6
},{
    name:"USDT",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    native: false,
    price: "1",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGcttVBhyCMnl1e_iNaaK7Z6GRz5WZTlDc3g&s",
    decimals:6
}
]