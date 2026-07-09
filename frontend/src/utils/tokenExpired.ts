import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";


export function isTokenExpired(res: Response){
  const navigate = useNavigate();
  console.log(res);
  if(res.status === 433)
  {
    toast.error("Token expired");
    
    navigate("/login");
  }
}
