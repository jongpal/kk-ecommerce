import { useNavigate } from 'react-router';
import Header from '../Components/Header';
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const MainTitle = styled.h1`
  font-weight:bold;
  font-size:35px;
  color:#b464eb;
`;

function Sell() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);

  const titleChange= (e)=>{
    setTitle(e.target.value);
  }

  const priceChange= (e)=>{
    setPrice(e.target.value);
  }

  const amountChange= (e)=>{
    setAmount(e.target.value);
  }

  const submitClick = async()=>{
    // if(title.length>0 && price>0 && amount>0){
    //   console.log(`title=${title}`);
    //   console.log(`price=${price}`);
    //   console.log(`amount=${amount}`);
    //   await axios.post('https://localhost:3000/api/products',{
    //     title : title,
    //     price : price,
    //     description : amount
    // },{withCredentials:true})
    // .then((response)=>{
    //   if(response.status ===201){
    //     alert("등록 완료");
    //     navigate('/home');
    //   }else{
    //     alert("login error");
    //   }
    // });
    //   alert("등록 완료");
    // }
    if(title.length>0 && price>0 && amount>0){
      console.log(`title=${title}`);
      console.log(`price=${price}`);
      console.log(`amount=${amount}`);
      alert("등록 완료");
    }else{
      alert("정확한 값을 입력해 주세요");
    }
  }

  return(
    <>
    <Header />
    <MainTitle>판매 등록</MainTitle>
    <div>
        Sell<br />
        title<br />
        <input onChange={titleChange}></input><br />
        price<br />
        <input type='number' onChange={priceChange}></input><br />
        amount<br />
        <input type='number' onChange={amountChange}></input><br />
        <button onClick={submitClick}>Submit</button>
    </div>
    </>
    );
}

export default Sell;