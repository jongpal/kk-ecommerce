import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { goLogout } from '../Reducers/user';
import styled from 'styled-components';
import axios from 'axios';
import {useState, useEffect} from "react";

  const Wrapper = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
  `;

  const Btn = styled.button`
    margin:10px;
    height:25px;
    width:100px;
    border:1px solid #5C3FBF;
    border-radius:5px;
    background-color:white;
    &:hover{
        background-color:#5C3FBF;
        border:none;
        cursor:pointer;
        color:white;
    }
  `;
  
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState([]);
  const state = useSelector((state) => state);

  useEffect(()=>{
    axios.get('http://localhost:3000/api/users/currentuser',{withCredentials:true})
    .then((response)=>{
      if(response.currentUser){

      }else{
        alert("user error");
      }
    }) 
  });

  function GoHome() {
    navigate('/home');
  };
  
  function GoLogin() {
    navigate('/login');
  };


  async function GoLogout() {
    await axios.post('http://localhost:3000/api/users/signout',{
      withCredentials:true
    });
      dispatch(goLogout());
      navigate('/home');
    };
  
  function GoMy() {
    navigate(`/mypage/${state.userId}`);
  };
  
  function GoSell() {
    navigate('/sell');
  };

  return (
    <Wrapper>
      <Btn onClick={GoHome}>Home</Btn>
      {state.isLoggedIn ?
      <>
      <Btn onClick={GoSell}>Sell</Btn>
      <Btn onClick={GoMy}>Mypage</Btn>
      </>
      :
      <></> }
      {state.isLoggedIn ?
      <Btn onClick={GoLogout}>Logout</Btn>
      :
      <Btn onClick={GoLogin}>Login</Btn>}
    </Wrapper> 
  )
}

export default Header;