import AirportState from './AirportState'
import Footer from './Footer'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <header >
        <h1 className="p-4 font-mono text-5xl">LHR NET</h1>
      </header>
      <div className="flex-grow flex justify-center items-center w-screen">
        <AirportState />
      </div>
      <Footer />
    </div >
  )
}

export default App
