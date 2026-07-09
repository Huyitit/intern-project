import { useEffect, useState } from "react";
import { fetchUsers } from "../services/user.react";
import { toast } from "react-toastify";

// Pagination: 10 records per page
export default function UserList(){
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [sort, setSortBy] = useState("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(false);
  const [users, setUsers] = useState(null); // empty / has values

  type searchOptions = {
    page: number, 
    limit: number,
    keyword:string, 
    sort: string,
    order:string,
  }

// Problems:
/**
 * Before load data, receive a response of token expired having status: 433
 * 
 * I want to print a toast notification + navigate to login page
 * I have: fetch functions returning **response** -> compare status/body
 * current flow: 
 * mount userlist:
 * error: null 
 * loading: true
 * -> fetching 
 * -> fetch functioin return response
 * -> get body of response
 */

  const getUsersData = async (options: searchOptions) => {

    const res = await fetchUsers(options);
    const body = await res.json();
    console.log(res.status);
    
    if(res.ok)
    {
      setError(null);
      return body.data;
    }
    else{
      toast.error("Get data problem");
      setError(true);
    }
    return false;
  }

  //handle sorting on columns
  const handleSortingToggle = (name: string) => {
    if(sort === name)
    {
      setOrder(
        (order) => {
          return order==="desc" ? "asc" : "desc";
        });
    }
    else{
      setSortBy(name);
      setOrder("asc");
    }
  }

  useEffect(()=>{

      setLoading(true);
      
      getUsersData({
        page: page, 
        limit: limit,
        keyword: keyword, 
        sort: sort, 
        order: order,
      }).then(data => {
          setUsers(data);
      }).finally(()=>setLoading(false));

      console.log("done useeffect");
      if(search === true)
      {
        setSearch(false);
      }

  }, [page, limit, search, sort, order]);



  return(
    <>
    <h1>Users</h1>
    
    <form onSubmit = {(e: React.FormEvent)=>{
      e.preventDefault();
      setPage(1);
      setSearch(true);
    }}>

      <label>Search User by username</label>
      <input value={keyword} onChange={(e)=>{setKeyword(e.target.value)}}></input>

      <button type = "submit">Search</button>
    </form>

    {loading ? 
    <p data-testid = "loading">Loading ...</p>
    :
    error ? 
    <p>Some thing wrong</p> 
    :
      <div>
        <table data-testid = "user-table">
          <thead>
            <tr>
              <th onClick = {() => handleSortingToggle("Id")}>
                Id</th>
              <th>Username</th>
            </tr>
          </thead>

          <tbody>
            {
              users.map(user=>(
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                </tr>
              ))
            }
          </tbody>

        </table>
      </div>
    }
    <div>
      {page>1 &&<button data-testid = "prev-button" onClick = {()=>{setPage(page-1)}}>Prev</button>}
      <button data-testid = "next-button" onClick = {()=>{setPage(page+1)}}>Next</button>
    </div>
    </>
  );
}