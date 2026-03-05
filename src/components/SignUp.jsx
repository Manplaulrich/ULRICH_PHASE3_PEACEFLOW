


 import { Link } from "react-router-dom"
export default function Login() {
  return (
    <>
      <nav className="bg-amber-700 px-6 py-4">
        <div className="text-white text-2xl font-bold">
          Peace-flow
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">

        <div className="bg-white shadow-lg h-120 rounded-xl p-8 w-full max-w-md">

          <h1 className="text-2xl font-bold text-center mb-6">
            Create an Account
          </h1>

          <form className="space-y-4">
             <div>
              <label className="block mb-1 font-medium">
                Name
              </label>

              <input
                type="text"
                placeholder="name..."
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Email
              </label>

              <input
                type="email"
                placeholder="email..."
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Password
              </label>

              <input
                type="password"
                placeholder="password..."
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            
            <button
              type="submit"
              className="w-full bg-amber-700 text-white py-2 rounded-md hover:bg-amber-800 transition"
            >
              Login
            </button>

          </form>
           <div className=" mt-5 flex justify-center">
             Already have an account ? <Link className="ml-2 text-xl text-amber-900" to='/login'>Login</Link>
           </div>
        </div>

      </div>
    </>
  )
}