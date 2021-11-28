import { BrowserRouter, Route } from "react-router-dom";
import { Navigate, Routes } from 'react-router';
import Home from '../Routes/Home';
import Login from '../Routes/Login';
import Buy from '../Routes/Buy';
import Sell from '../Routes/Sell';
import Mypage from '../Routes/Mypage';

export default () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route exact path='/home' element={<Home /> }/>
                <Route exact path='/login' element={<Login />}/>
                <Route exact path='/buy/' element={<Buy />}/>
                <Route exact path='/buy/:id' element={<Buy />}/>
                <Route exact path='/sell' element={<Sell />}/>
                <Route exact path='/mypage/:id' element={<Mypage />}/>
                <Route path='*' element={<Navigate to='/home' />}/>
            </Routes>
        </BrowserRouter>
    );
};