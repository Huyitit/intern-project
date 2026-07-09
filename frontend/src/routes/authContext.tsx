import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
        id: number,
        full_name: string,
        username: string,
        phone: string,
        email: string,
        role: string
}

type AuthContextType = {
  user: User | null,
  token: string | null,
  login: (user: object, token: string) => void,
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(null);

export function AuthProvider({children}:{children:React.ReactNode}){
  
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  function login(user:User, token: string){
    setUser(user);

    setToken(token);

    localStorage.setItem("token", token);
    localStorage.setUser("user", JSON.stringify(user));

    if(user.role === "admin")
    {
      navigate('/adminDashboard');
    }
    if(user.role === "user")
    {
      navigate('/uesrDashboard');
    }

    function logout(){
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      navigate('/login');
    }

    return(
      <AuthContext.Provider value={{user, token, login, logout}}>
        {children}
      </AuthContext.Provider>
    )
  }
}

export function useAuth(){
  return useContext(AuthContext);
}