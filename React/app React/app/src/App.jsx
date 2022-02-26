import "./App.css";
import {React} from 'react';
import {addElementToCart} from './redux/action/cartAction.jsx';
import { EcommersProvider } from "./context/ecommersContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {ProductsContainer} from "./container/productsContainer";
import {HomeContainer} from "./container/homeContainer";
import { useDispatch, useSelector } from "react-redux";
const App = () => {
  
  const STATE = useSelector(state => state.cartReducer);//guarda el estado general de storage
  console.log(STATE);
  const dispatch = useDispatch;
  return(
  <div className="App">
    <button onClick={()=>{dispatch(addElementToCart({id:0,name:'remera',price:100}))}}>agregar</button>
    <BrowserRouter>
      <EcommersProvider>
        <Routes>
          <Route exact path="/" element={<HomeContainer/>}/>
          <Route exact path="/productos" element= {<ProductsContainer/>} />
          <Route path="/productos/:busqueda" element= {<ProductsContainer/>} />
        </Routes>
      </EcommersProvider>
    </BrowserRouter>
  </div>
);
}

export default App;
