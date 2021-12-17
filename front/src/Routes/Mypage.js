import { useNavigate } from 'react-router';
import Header from '../Components/Header';
import { useSelector, useDispatch } from "react-redux";
import payment from '../mockdata/payment';

function Mypage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  console.log(state);
    return(
      <>
      <Header />
      <div>
          {state.userId}<br />
          주문 내역
          {payment.map((item, index)=>(
          <>
          <div key={index}>
          orderId: {item.orderId}<br />
          amount : {item.amount}<br />
          stripeId: {item.stripeId}<br />
          </div>
          <hr />
          </>
        ))}
      </div>
      </>
    );
}

export default Mypage;