"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PrimaryButton, TabButton } from "./Button";
import { useEffect, useState } from "react";
import { TokenWithBalance, useTokens } from "../api/hooks/useTokens";
import { TokenList } from "./TokenList";
import { Swap } from "./Swap";
import { TokenDetails } from "../lib/tokens";

//8fCXUDCkvhEQkYNyMbsWgYsaqikorojdv2hgfezfvbdD
type Tab = "tokens" | "send" | "add_funds" | "swap" | "withdraw"
const tabs: {id:Tab, name: string}[] = [{id:"tokens", name:"Tokens"},{ id:"send", name:"Send"}, {id:"add_funds",name: "Add Funds"}, {id:"withdraw", name:"Withdraw"}, {id:"swap", name:"Swap"}]

export const ProfileCard = ({publicKey}: {
    publicKey : string
}) =>{
    console.log("ProfileCard publicKey:", publicKey);
    const session = useSession();
    const router = useRouter();
    const [selectedtab, setSelectedTab] = useState<Tab>("tokens")
    const {tokenBalances, loading} = useTokens(publicKey)
    if(session.status === "loading"){
        return<div>
            Loading...
        </div>
    }
    if(!session.data?.user){
        router.push("/");
        return null 
    }
    return <div className="pt-8 flex justify-center">
        <div className="max-w-4xl bg-white rounded shadow w-full">
            <Greeting image={session.data?.user?.image ?? ""} name={session.data?.user?.name ?? ""}/>
            <div className="w-full flex px-10">
            {tabs.map(tab => <TabButton active = {tab.id === selectedtab} onClick = {() => {
                setSelectedTab(tab.id)
            }}>{tab.name}</TabButton>)}
            </div>
            <div className={`${selectedtab === "tokens" ? "visible" : "hidden"}`}><Assets tokenBalances={tokenBalances} loading={loading} publicKey={publicKey}/></div>
            <div className={`${selectedtab === "swap" ? "visible" : "hidden"}`}><Swap tokenBalances={tokenBalances} publicKey={publicKey}/></div>

            
        </div>
        
        
    </div>
}
function Assets({publicKey, tokenBalances, loading}:{
    publicKey: string,
    tokenBalances: {
        totalBalance: number,
        tokens: TokenWithBalance[]
    } | null,
    loading: boolean
}){
    console.log("Assets publicKey:", publicKey)
    const [copied, setCopied] = useState(false);
    
    useEffect(() =>{
        if(copied){
            let timeout = setTimeout(() =>{
                setCopied(false)
            }, 5000)
            return () =>{
                clearTimeout(timeout)
            }
        }
    }, [copied])
    if(loading){ 
        return <div>
            Loading...
        </div>
    }

    return <div className= "text-slate-500">
        <div className="mx-12 py-2">
        Account Assests
        </div>
        <div className="flex justify-between mx-12">
            <div className="flex">
                <div className="text-5xl font-bold text-black">
                    ${tokenBalances?.totalBalance}
                </div>
                <div className="text-slate-600 font-bold text-3xl flex flex-col justify-end  pl-2">
                    USD
                </div>
            </div>
            <div>
                <PrimaryButton onClick={() => {
                    navigator.clipboard.writeText(publicKey)
                    console.log(publicKey)
                    setCopied(true)
                }}>{copied ? "copied" : "Your Wallet address"}</PrimaryButton>
            </div>
        </div>
        <div className="pt-4 bg-slate-50 p-12 mt-4">
            <TokenList tokens={tokenBalances?.tokens || []} />
        </div>
    </div>
}

function Greeting({image, name}:{
    image: string,
    name: string
}){
    return <div className="flex p-12">
        <img src={image} className="rounded-full w-16 h-16 mr-4" />
        <div className="text-xl font-semibold flex flex-col justify-center">
            Welcome back, {name}
        </div>
    </div>
}