import { Link } from "react-router-dom";


const InfoBarComponent = ({cart, handleKeyUp,children }) => {


  return (
    <div className="bg-white py-4">
      <input type="text" onInput={handleKeyUp} placeholder="ingresar producto" />
      <br/>
      <Link to={'/'}>Ir a Home</Link>
      <br/>
        Elementos en el carrito: {cart.length}
      <children/>
    </div>
  );
};

export default InfoBarComponent;
