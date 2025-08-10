import React from "react";
import AirportState from './AirportState';
import Footer from './Footer';

function App() {

  const [userIsANerd, setUserIsANerd] = React.useState<boolean>(false)
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <header className="flex justify-between items-center">
        <h1 className="p-4 font-mono text-5xl">LHR NET</h1>
        <label className="inline-flex items-center cursor-pointer p-4">
          {/* Based on an example from https://flowbite.com/docs/forms/toggle/ */}
          <span className="px-3 text-md font-mono text-gray-900 dark:text-gray-300">STATS-FOR-NERDS</span>
          <input type="checkbox" className="sr-only peer" onChange={event => setUserIsANerd(event.target.checked)} />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 
            dark:peer-focus:ring-fuchsia-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full 
            rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute
            after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5
            after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-fuchsia-600 dark:peer-checked:bg-fuchsia-400"></div>
        </label>
      </header>
      <div className="flex-grow flex justify-center items-center w-screen">
        <AirportState enableStatsForNerds={userIsANerd} />
      </div>
      <Footer />
    </div >
  )
}

export default App
