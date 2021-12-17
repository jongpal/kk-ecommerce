import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import styled from 'styled-components';
import Header from '../Components/Header';
import product from '../mockdata/product';
import { Link } from 'react-router-dom';
import {useState, useEffect} from "react";

const MainTitle = styled.h1`
  font-weight:bold;
  font-size:35px;
  color:#b464eb;
`;

const BLink = styled(Link)`
  color:black;
  text-decoration:none;
  &:visited{
    background-color:#5C3FBF;
    border:none;
    cursor:pointer;
    color:black;
    text-decoration:none;
}
`;

const SubWrapper = styled.div`
  display:flex;
`;

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [products, setProducts] = useState([]);
  console.log(products);
  useEffect(()=>{
    axios.get('http://localhost:3000/api/users/currentuser',{withCredentials:true})
    .then((response)=>{
      if(response.currentUser){
        console.log(response.currentUser);
      }else{
        alert("user error");
      }
    }) 

    axios.get('http://localhost:3000/api/products',{withCredentials:true})
    .then((response)=>{
      if(response.status ===200){
        console.log(response);
        setProducts(response.products);
        console.log(products);
      }else{
        alert("products error");
      }
    }) 
  });

    return(
      <>
      <Header />
      <MainTitle>메인 화면</MainTitle>
      <SubWrapper>
        {product.map((item, index)=>(
          <>
          <BLink to={`/buy/${item.title}`}>
          <div key={index}>
          품목명: {item.title}<br />
          가격 : {item.price}<br />
          남은 수량: {item.amount}<br />
          판매자: {item.userId}<br />
          </div>
          </BLink>
          <hr />
          </>
        ))}
        {products.map((item)=>(
          <>
          <BLink to={`/buy/${item.title}`}>
          <div>
          title: {item.title}<br />
          price : {item.price}<br />
          amount: {item.amount}<br />
          provider: {item.userId}<br />
          </div>
          </BLink>
          <hr />
          </>
        ))}
      </SubWrapper>
      </>
    );
}

export default Home;