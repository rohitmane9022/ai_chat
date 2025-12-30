
import './App.css'
import {Chat} from './components/Chat'

function App() {
  

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
    <div className="max-w-2xl mx-auto h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)]">
      <Chat />
    </div>
  </div>
  )
}

export default App
