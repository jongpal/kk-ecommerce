import { useNavigate } from 'react-router';
import Header from '../Components/Header';
import { useSelector, useDispatch } from "react-redux";
import payment from '../mockdata/payment';
import styled from 'styled-components';
import {useState, useEffect} from "react";
import axios from 'axios';

const MainTitle = styled.h1`
  font-weight:bold;
  font-size:35px;
  color:#b464eb;
`;

function Mypage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  console.log(state);
  const [payMents, setPayments] = useState([]);
  
  useEffect(()=>{
    axios.get('http://localhost:3000/api/orders',{withCredentials:true})
    .then((response)=>{
      if(response.status ===200){
        console.log(response);
        setPayments(response.payMents);
        console.log(payMents);
      }else{
        alert("products error");
      }
    }) 

    axios.get('http://localhost:3000/api/orders',{withCredentials:true})
    .then((response)=>{
      if(response.status ===200){
        console.log(response);
        setPayments(response.payMents);
        console.log(payMents);
      }else{
        alert("products error");
      }
    })
  });
    return(
      <>
      <Header />
      <MainTitle>주문 내역</MainTitle>
      <div>
          {state.userId}<br />
          주문 내역
          {payment.map((item, index)=>(
          <>
          <div key={index}>
          주문자 ID : {item.orderId}<br />
          수량 : {item.amount}<br />
          판매자 ID : {item.stripeId}<br />
          </div>
          <hr />
          </>
        ))}
      </div>
            <hr />
      <div>
          {state.userId}<br />
          주문 내역
          {payMents.map((item, index)=>(
          <>
          <div key={index}>
          주문자 ID : {item.orderId}<br />
          수량 : {item.amount}<br />
          판매자 ID : {item.stripeId}<br />
          </div>
          <hr />
          </>
        ))}
      </div>
      </>
    );
}

export default Mypage;