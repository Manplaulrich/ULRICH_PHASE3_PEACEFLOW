
import backimg2 from '../assets/backimg2.jpg'
import grid1 from '../assets/grid1.jpg'
import grid2 from '../assets/gird2.jpg'
import grid5 from '../assets/grid5.jpg'
import { Link } from 'react-router-dom'

export default function Homepage() {
  return (
    <> 
        <header className='bg-amber-700  text-white p-6 shadow-lg shadow-amber-900/20'>
          <nav className='flex justify-between'>
            <span className='text-3xl font-bold '>Peace-flow</span>
             <div className='mr-10 flex gap-3'>
               <Link className='text-2xl text-amber-700 font-bold bg-white p-2 border-2 border-amber-950 rounded-4xl  transition duration-500 ease-in  transform hover:scale-110 hover:border-2' to='/login'>Login</Link>
               <Link className='text-2xl  bg-amber-900 p-2  rounded-3xl border-2 border-white font-bold transition duration-500 ease-in-out transform hover:scale-110 hover:opacity-80' to='/signup'>SignUp</Link>
             </div>
          </nav>
        </header>
      <div className='w-full h-[90vh] relative '>
          <img className='w-full h-full object-cover object-center relative rounded-b-4xl' src={backimg2} alt="background image" />
           
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
  
  <h1 className="text-3xl md:text-5xl lg:text-6xl mb-6 font-bold">
    Welcome to <span>Peace-flow</span>
  </h1>

  <p className="text-lg md:text-2xl lg:text-3xl bg-amber-100 text-amber-950 rounded-3xl p-3 max-w-3xl">
    Automatically track raw materials and production. <br />
    Save time, reduce waste, and plan better for your small business.
  </p>

</div>
      </div>
       <div className=' mx-15 py-20 grid md:grid-cols-3 gap-10 shadow-md rounded-lg' >
         <div className='shadow-2xl rounded-4xl  w-full overflow-hidden transform hover:scale-105 transition hover:ease-out duration-500'>
          <img  src={grid1} alt="img1" className='object-center object-cover w-full' />
             <div className='mx-10 flex flex-col'>
             <span className='text-4xl font-bold text-center mt-5 text-gray-700'>Track Materials</span> 
          <p className='text-3xl mt-4 mb-4 text-center text-gray-500'>Easily manage your raw materials <br /> inventory</p>
            </div>

          </div>
          <div className='shadow-2xl rounded-4xl w-full overflow-hidden transform hover:scale-105 transition hover:ease-out duration-500'>
          <img src={grid2} alt="img2" className='object-center object-cover w-full' />
             <div className='mx-10 flex flex-col'>
             <span className='text-4xl font-bold text-center mt-5 text-gray-700'>Production Recipes</span>
          <p className='text-3xl mt-4 mb-4 text-center text-gray-500'>Set up recipes and automatically <br /> calculate usage</p>
             </div>
           
          </div>
          <div className='shadow-2xl rounded-4xl w-full  overflow-hidden transform hover:scale-105 transition hover:ease-out duration-500'>
          <img src={grid5} alt="img3" className='object-center object-cover w-full'/>
               <div className='mx-10 flex flex-col'>
             <span className='text-4xl font-bold text-center mt-5 text-gray-700'>Stock Alerts</span>
          <p className='text-3xl mt-4 mb-4 text-center text-gray-500'>Get notified when stock runs low</p>
               </div>
          </div>
       </div>
        <div className='w-full h-50 flex bg-amber-950 items-center justify-center text-6xl text-white font-serif'>
            Peace-flow
        </div>
    </>
  )
}
