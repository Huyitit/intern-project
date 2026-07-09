import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

    const navigate = useNavigate();
    
    const resUser = JSON.parse(localStorage.getItem("user"));
    
    return(
        <div>
            <h1>Admin</h1>
            <h2>
                Hello {resUser.full_name}
            </h2>
            <button onClick={()=>{navigate('/userlist')}}>View User</button>
        </div>
    )
}