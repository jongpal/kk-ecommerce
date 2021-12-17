import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router';
import styled from 'styled-components';
import axios from 'axios';
import Header from '../Components/Header';
//import product from '../mockdata/product';

const MainTitle = styled.h1`
  font-weight:bold;
  font-size:35px;
  color:#b464eb;
`;

const Line = styled.div`
font-size:20px;
font-weight:bold;
color:#5C3FBF;
`;

function Buy() {
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const location = useLocation();
  const productNum = location.pathname.split('/')[2];
  const [showProduct, setshowPro] = useState([]);

  //productNum으로 API접근해서 해당하는 상품 가져와서 setshowPro
  useEffect(()=>{
    axios.get('http://localhost:3000/api/users/currentuser',{withCredentials:true})
    .then((response)=>{
      if(response.currentUser){
        console.log(response.currentUser);
      }else{
        alert("user error");
      }
    }) 

    axios.get(`http://localhost:3000/api/products/${productNum}`,{withCredentials:true})
    .then((response)=>{
      if(response.status ===200){
        setshowPro(response.product);
      }else{
        alert("products error");
      }
    })
  });
  
  const [num, setNum] = useState(1);
  const numChange= (e)=>{
    setNum(e.target.value);
  }

  const buying=()=>{
    if((num>0) && productNum>=num){//productNum은 showProduct의 amount로
      console.log(`${num}개 구매`);
      axios.post(`http://localhost:3000/api/orders`,{
        amount:num,
        productId : {
          productNum
        },
      },{withCredentials:true})
      .then((response)=>{
        if(response.status === 201){
          alert("success");
        }else{
          alert("error");
        }
      })
    } else{
      alert("구매할 수 없습니다.");
    }
  }

    return(
      <>
      <Header />
      <MainTitle>상품 구매</MainTitle>
      <div>
        {/* productNum은 다 showProduct로 바꿔야됨 */}
        <Line>품목명 : {productNum}</Line>
        <Line>현재 수량 : {productNum}</Line>
        <Line><input placeholder='0' type="number" onChange={numChange} /></Line>
        <Line><button disabled={!state.isLoggedIn} onClick={buying}>Buy</button></Line>
      </div>
      {/* <div>
        title : {showProduct.title}<br />
        price : {showProduct.price}<br />
        userId : {showProduct.userId}<br />
        description : {showProduct.description}<br />
        <input placeholder='1' type="number" onChange={numChange} />
        <button disabled={!state.isLoggedIn} onClick={buying}>Buy</button>
      </div> */}
      </>
    );
}

export default Buy;