import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router';
import axios from 'axios';
import Header from '../Components/Header';
//import product from '../mockdata/product';

function Buy() {
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const location = useLocation();
  const productNum = location.pathname.split('/')[2];
  const [showProduct, setshowPro] = useState([]);
//productNum으로 API접근해서 해당하는 상품 가져와서 setshowPro
  // useEffect(()=>{
  //   axios.get(`http://localhost:3001/api/products/${productNum}`,{withCredentials:true})
  //   .then((response)=>{
  //     if(response.status ===200){
  //       setshowPro(response.product);
  //     }else{
  //       alert("products error");
  //     }
  //   })
  // });
  
  const [num, setNum] = useState(1);
  const numChange= (e)=>{
    setNum(e.target.value);
  }

  const buying=()=>{
    if((num>0) && productNum>=num){//productNum은 showProduct의 amount로
      console.log(`${num}개 구매`);
    }  
  }

    return(
      <>
      <Header />
      <div>
        {/* productNum은 다 showProduct로 바꿔야됨 */}
        title : {productNum}<br />
        amount : {productNum}<br />
        <input placeholder='1' type="number" onChange={numChange} />
        <button disabled={!state.isLoggedIn} onClick={buying}>Buy</button>
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