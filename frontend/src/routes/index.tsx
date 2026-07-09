import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminDashboard from '../pages/AdminDashboard';
import UserDashboard from '../pages/UserDashboard';
import UserList from '../pages/UserList';
import ProtectedRoute from './ProtectedRoute';

export default function Router (){
return(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route element={<ProtectedRoute/>}>
            <Route path="/userDashboard" element={<UserDashboard/>}/>
            <Route path="/adminDashboard" element={<AdminDashboard/>}/>
            <Route path="/userlist" element={<UserList/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
)
}