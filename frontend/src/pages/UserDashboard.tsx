
export default function UserDashboard() {

    console.log(localStorage.getItem("user"));
    
    const resUser = JSON.parse(localStorage.getItem("user"));
    
    return(
        <div>
            <h1>Dashboard</h1>
            <h2>
                {resUser.token}
            </h2>
        </div>
    )
}