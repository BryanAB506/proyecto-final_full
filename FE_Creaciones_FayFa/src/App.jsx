import Routing from './routes/Routing';
import './App.css'
import { AuthProvider } from './Context/AuthContext';

function App() {

  return (
    <>
      <div>
        <AuthProvider>
          <Routing />
        </AuthProvider>
      </div>
    </>
  )
}

export default App