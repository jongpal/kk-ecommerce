import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { goLogout } from '../Reducers/user';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  function GoHome() {
    navigate('/home');
    };
  
    function GoLogin() {
      navigate('/login');
    }

    async function GoLogout() {
      await axios.post('https://35.200.45.35/api/users/signout',{
        withCredentials:true
      });
      // .then((response)=>{
      //   if(response.status ===200){
      //     dispatch(goLogout());
      //     navigate('/home');
      //   }else{
      //     alert("logout error");
      //   }
      // });
      dispatch(goLogout());
      navigate('/home');
    }
  
    function GoMy() {
      navigate(`/mypage/${state.userId}`);
    }
  
    function GoSell() {
      navigate('/sell');
    }

  return (
    <div>
      <button onClick={GoHome}>Home</button>
      {state.isLoggedIn ?
      <button onClick={GoLogout}>Logout</button>
      :
      <button onClick={GoLogin}>Login</button>}
      {state.isLoggedIn ?
      <>
      <button onClick={GoSell}>Sell</button>
      <button onClick={GoMy}>Mypage</button>
      </>
      :
      <></> }
    </div> 
  )
}

export default Header;