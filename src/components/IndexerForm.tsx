import React, { useState } from 'react'
import { Network, Utils, Alchemy } from "alchemy-sdk"
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
    const [tokenDataObjects, setTokenDataObjects] = useState<any>([])


    const inputAddrChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputAddr(e.target.value)
    }

    const submitFormHandler = async (e: React.FormEvent) => {
        e.preventDefault();
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
            setTokenDataObjects(await Promise.all(tokenDataPromises));
            setLoading(false)
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }


    return (
        <>
            <form onSubmit={submitFormHandler} className='mt-[3rem] w-[70%] flex border border-color-border p-[2rem] xlg:w-[80%] xmd:w-[90%] xsm:flex-col xsm:p-0 sm:w-[92%] xsm:border-0  rounded-lg mx-auto'>
                <input type="text" name="address" id="address" value={inputAddr} placeholder='Input address...' onChange={inputAddrChangeHandler} className='flex-1 py-[1rem] px-[2rem] border border-color-border rounded-lg xsm:w-full' />
                <button type="submit" className='bg-color-dark-blue text-color-white px-[2rem] rounded-lg ml-[2rem] capitalize font-semibold hover:text-color-dark-blue hover:bg-color-white transition-all duration-200 ease-in border border-color-dark-blue xsm:w-full xsm:ml-0 xsm:mt-[2rem] xsm:py-[1rem]'> Check ERC-20 Token Balances</button>
            </form>
            <TokenDetails results={results} loading={loading} />
        </>
    )
}

export default IndexerForm