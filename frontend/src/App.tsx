import Router from './routes'
import {ToastContainer, toast} from 'react-toastify'
import {createContext, useState} from 'react';


export const UserContext = createContext(null);


function App() {
  const [user, setUser] = useState(null);
  
  return (
    <UserContext.Provider value={{user, setUser}}>
      <Router/>
      <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      />
    </UserContext.Provider>
    
  )
}

export default App;
