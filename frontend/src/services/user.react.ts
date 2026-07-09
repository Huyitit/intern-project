import { apiFetch } from "./apiClient";


function setSortingValues(sortBy: string, order: string){
    if(sortBy === "" || sortBy === null)
    {
        sortBy = "id";
    }
    if(order === "" || order === null)
    {
        sortBy = "asc";
    }
}

export const fetchUsers = async (options: {page: number, limit: number, keyword: string, sort: string, order: string}) => {   
    
    const token = localStorage.getItem("token");
    setSortingValues(options.sort, options.order);

    const fetch_URL = `http://localhost:3006/api/users?page=${options.page}&limit=${options.limit}&keyword=${options.keyword}`;


    try {
        const response = await apiFetch(fetch_URL ,{
            method: 'GET',
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })

        return response;
    } catch (error) {
        console.log(error);
    }

}