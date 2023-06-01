import React, { useState } from 'react'
import { Network, Alchemy } from "alchemy-sdk"
import TokenDetails from './TokenDetails';




const IndexerForm = () => {

    const config = {
        network: Network.ETH_MAINNET,
        apiKey: "pCgztJQYuRFexRNH-aV_BOnRPeSkRZPG"
    }

    const alchemy = new Alchemy(config);

    const [inputAddr, setInputAddr] = useState<string>("")
    const [results, setResults] = useState<any>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("");


    const inputAddrChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputAddr(e.target.value)
      
            setErrorMsg("")
        
    }

    const submitFormHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!inputAddr){
            setErrorMsg("Please enter an address")
            return
        }
        
        setLoading(true)
        try {
            const data = await alchemy.core.getTokenBalances(inputAddr);

            const tokenDataPromises = [];

            for (let i = 0; i < data.tokenBalances.length; i++) {
                const tokenData = alchemy.core.getTokenMetadata(
                    data.tokenBalances[i].contractAddress
                );
                tokenDataPromises.push(tokenData);
            }

            const objs = await Promise.all(tokenDataPromises)

            const newarr = []

            for (let i = 0; i < data.tokenBalances.length; i++) {
                newarr.push({
                    symbol: objs[i].symbol,
                    logo: objs[i].logo,
                    decimals: objs[i].decimals,
                    balance: data.tokenBalances[i].tokenBalance
                })
            }

            setInputAddr("")
            setResults(newarr)
            setLoading(false)
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }


    return (
        <>
            <form onSubmit={submitFormHandler} className='mt-[3rem] w-[70%] flex border border-color-border p-[2rem] xlg:w-[80%] xmd:w-[90%] xsm:flex-col xsm:p-0 sm:w-[92%] xsm:border-0  rounded-lg mx-auto'>
                <div className='flex-1  xsm:w-full'>
                <input type="text" name="address" id="address" value={inputAddr} placeholder='Input address...' onChange={inputAddrChangeHandler} className={`w-full py-[1rem] px-[2rem] border outline-0 ring-0 rounded-lg ${errorMsg? "border-color-red": "border-color-border"}`} minLength={42}/>
                {errorMsg && <small className='text-[1.4rem] mt-[1rem] text-color-red'>{errorMsg}</small>}
                </div>
               
                <button type="submit" className='bg-color-dark-blue text-color-white px-[2rem] rounded-lg ml-[2rem] capitalize font-semibold hover:text-color-dark-blue hover:bg-color-white transition-all duration-200 ease-in border border-color-dark-blue xsm:w-full xsm:ml-0 xsm:mt-[2rem] py-[1rem] self-start'> Check ERC-20 Token Balances</button>
            </form>
            <TokenDetails results={results} loading={loading} />
        </>
    )
}

export default IndexerForm