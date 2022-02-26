
import { useContext } from "react";
import {EcommersContext} from "../context/ecommersContext"

export const HomeContainer = () => {
    const { cart } = useContext(EcommersContext);
    return <h1>Hola, usted tiene ({cart.length}) productos en el carrito</h1>
   
}
export default HomeContainer;