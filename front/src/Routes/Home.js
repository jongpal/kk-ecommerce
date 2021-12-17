import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import Header from '../Components/Header';
import product from '../mockdata/product';
import { Link } from 'react-router-dom';
import {useState, useEffect} from "react";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [products, setProducts] = useState([]);
  console.log(product);
  // useEffect(()=>{
  //   axios.get('http://localhost:3001/api/products',{withCredentials:true})
  //   .then((response)=>{
  //     if(response.status ===200){
  //       setProducts(response.products);
  //     }else{
  //       alert("products error");
  //     }
  //   }) 
  // });

    return(
      <>
      <Header />
      <div>
        Home
        {product.map((item, index)=>(
          <>
          <Link to={`/buy/${item.title}`}>
          <div key={index}>
          title: {item.title}<br />
          price : {item.price}<br />
          amount: {item.amount}<br />
          provider: {item.userId}<br />
          </div>
          </Link>
          <hr />
          </>
        ))}
        {/* {products.map((item, index)=>(
          <>
          <Link to={`/buy/${item.title}`}>
          <div key={index}>
          title: {item.title}<br />
          price : {item.price}<br />
          amount: {item.amount}<br />
          provider: {item.userId}<br />
          </div>
          </Link>
          <hr />
          </>
        ))} */}
      </div>
      </>
    );
}

export default Home;