import React from 'react'

const Layout: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <div className='w-full'>
         <header className='w-full h-[7rem] flex items-center px-[3rem] border border-color-border sm:px-[1.5rem]'>
            <h1 className='text-[2.5rem] font-semibold bg-clip-text text-transparent text-gradient bg-gradient-to-r from-color-dark-blue to-color-light-blue'>Erc20 Token Indexer</h1>
         </header>
      <main> 
        {children}
      </main>
    </div>
  )
}

export default Layout