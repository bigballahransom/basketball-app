import React from 'react'

const page = () => {
  return (
    <main className=" mt-5 sm:px-5 flex justify-center">
      {/* <section className='hidden md:inline md:col-span-2'>
        <UserInformation posts={posts}/>
      </section> */}
      <section className="col-span-full md:col-span-6 xl:col-span-4 max-w-xl mx-auto w-full px-1">
      <div className="flex flex-col justify-center items-center bg-white rounded-lg border py-4 mb-2">
      <div className="text-center text-xl font-bold">
        <p className='text-purple-500'>Pickup Monster</p> Tournaments Coming Soon...
      </div>
    </div>
      </section>
    </main>
  )
}

export default page
