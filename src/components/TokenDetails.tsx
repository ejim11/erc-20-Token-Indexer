import { Utils } from 'alchemy-sdk';
import defaultImg from "../assets/def-token.png"
import ReactPaginate from "react-paginate";
import { useState } from 'react';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

interface Result {
    balance: string | any;
    decimals: number;
    symbol: string | null
    logo: string | null
}

const TokenDetails = ({ results, loading }: { results: Result[] | null[], loading: boolean }) => {

    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 10;



    const endOffset = itemOffset + itemsPerPage;
    const currentItems = results && results.slice(itemOffset, endOffset);
    const pageCount = results ? Math.ceil(results.length / itemsPerPage) : 0

    // Invoke when user click to request another page.
    const handlePageClick = (event: any) => {
        const newOffset = (event.selected * itemsPerPage) % results.length;
        setItemOffset(newOffset);
    };


    const paginateNavStyle =
        "block text-color-dark-blue bg-color-white py-1 px-2 rounded-lg  border border-color-dark-blue hover:text-color-white hover:bg-color-dark-blue transition-all tableData-200 ease-in ";

    return (
        <div className='w-[60%] xlg:w-[80%] xmd:w-[95%]  mt-[3rem] pb-[7rem] mx-auto'>
            <p className='text-center capitalize font-semibold mb-[2rem]'>ERC-20 token balances:</p>
            <div className='w-full  overflow-x-auto'>
                <table className='w-full sm:w-[140vw]'>
                    <thead className='bg-color-dark-blue text-color-white '>
                        <tr>
                            {["No", "Symbol", "Balance"].map((text, i) => <th key={i} className={`p-[1rem] text-left `}>{text}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            results && !loading ? currentItems.map((e: any, i: number) => {
                                return (
                                    <tr key={i} className={`${i % 2 === 0 ? "bg-color-white" : " bg-color-border"} `}>
                                        <td className='pl-[1rem]'>{i + 1}</td>
                                        <td className='flex items-center p-[1rem] '>
                                            <img src={e.logo ? e.logo : defaultImg} alt={`${e.symbol}`} className='w-[3rem] h-[3rem] rounded-[50%] mr-[2rem]' />
                                            <p>{e.symbol}</p>
                                        </td>
                                        <td className='p-[1rem] sm:ml-[2rem]' >{Utils.formatUnits(e.balance, e.decimals)}</td>
                                    </tr>
                                );
                            }) : <tr></tr>
                        }
                    </tbody>
                </table>
                {loading && <div className='w-full'>
                    <SkeletonTheme baseColor="#E0E0E0" highlightColor="#eee">
                        <p className="my-[2rem]">
                            <Skeleton count={15} className={` h-[3rem] `} />
                        </p>
                    </SkeletonTheme>
                </div>}
            </div>
            {results && !loading && <div className='mt-[3rem] sm:mt-[5rem] sm:w-full sm:flex'>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel={
                        <p className="flex items-center ">
                            <span className='sm:hidden'>next</span>
                            <MdKeyboardArrowRight className="text-color-current w-[2.5rem] h-[2.5rem]" />
                        </p>
                    }
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={3}
                    pageCount={pageCount}
                    previousLabel={
                        <p className="flex items-center">
                            <MdKeyboardArrowLeft className="text-color-current w-[2.5rem] h-[2.5rem]" />
                            <span className='sm:hidden'>previous</span>
                        </p>
                    }
                    renderOnZeroPageCount={null}
                    containerClassName=" sm:w-max sm:mx-auto flex items-center flex-wrap"
                    previousClassName="mr-[1rem] sm:mb-[1rem]"
                    nextClassName="ml-[1rem] sm:mb-[1rem]"
                    previousLinkClassName={paginateNavStyle}
                    nextLinkClassName={paginateNavStyle}
                    pageLinkClassName="paginate-page-link"
                    activeLinkClassName="paginate-active-page-link"
                />
            </div>}
        </div>
    )
}

export default TokenDetails