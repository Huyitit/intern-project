import {Navigate, Outlet} from "react-router-dom";
import {jwtDecode} from 'jwt-decode';

const isTokenExpired = () => {
  const token = localStorage.getItem('token');

  if(!token)
  {
    return true;
  }

  const currentTime = Date.now() / 1000;
  const decodedToken = jwtDecode(token);

  return decodedToken.exp < currentTime;
}

export default function ProtectedRoute() {
  try {

    const user = JSON.parse(localStorage.getItem('user'));
    if(!user || isTokenExpired())
    {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return < Navigate to="/login" replace />
    }

  }
  catch (error) {
    return < Navigate to="/login" replace />  
  }

  return <Outlet />;
}