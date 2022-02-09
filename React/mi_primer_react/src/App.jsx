import "./App.css";
import {React} from 'react'
import { EcommersProvider } from "./context/ecommersContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {ProductsContainer} from "./container/productsContainer";
import {HomeContainer} from "./container/homeContainer";
const App = () => (
  <div className="App">
    <BrowserRouter>
      <EcommersProvider>
        <Routes>
          <Route exact path="/" element={<HomeContainer/>}/>
          <Route exact path="/productos" element= {<ProductsContainer/>} />
        </Routes>
      </EcommersProvider>
    </BrowserRouter>
  </div>
);

export default App;
