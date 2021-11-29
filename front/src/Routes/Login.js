import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { goLogin } from '../Reducers/user';
import Header from '../Components/Header';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const [Id, setId] = useState("");
  const [Pw, setPw] = useState("");

  const IdChange= (e)=>{
    setId(e.target.value);
  }

  const PwChange= (e)=>{
    setPw(e.target.value);
  }

  const loginClick =async()=>{
    await axios.post('http://35.200.45.35/api/users/signin',{
      email:Id,
      password:Pw
    },{withCredentials:true})
    .then((response)=>{
      if(response.status ===200){
        dispatch(goLogin(Id));
        navigate('/home');
      }else{
        alert("login error");
      }
    });
    // dispatch(goLogin(Id));
    // navigate('/home');
  }

  const signinClick = async()=>{
    await axios.post('http://35.200.45.35/api/users/signup',{
      email:Id,
      password:Pw
    },{withCredentials:true})
    .then((response)=>{
      if(response.status ===201){
        alert("successed");
      }else{
        alert("signup error");
      }
    });
    navigate('/home');
  }

  return(
    <>
    <Header />
    <div>
      ID
      <input onChange = {IdChange}></input>
      PW
      <input onChange = {PwChange} type='password'></input>
      <button onClick = {loginClick}>login</button>
      <button onClick = {signinClick}>signUp</button>
    </div>
    </>
    );
}

export default Login;