import { useContext, useEffect } from "react";
import CardComponent from "../component/CardComponent";
import InfoBarComponent from "../component/InfoBarComponent";
import { EcommersContext } from "../context/ecommersContext";

export const ProductsContainer = () => {
  /* Este es un contenedor, contiene varios componentes entre 
                                        otras cosas como ESTADOS (variables dnamicas que necesitan 
                                        renderizarce al cambiar su valor),Funciones propias, atributos, etc.
                                        */
  const { products } = useContext(EcommersContext);
  const { cart } = useContext(EcommersContext);
  const { setCart } = useContext(EcommersContext);
  
  useEffect(() => {
    return () => {};
  }, []); /*este es el filtro, el cual indica cuando se ejecutará la funcion al 
            cambiar alguno de esos PROPS. Importante agregAR EL ARREGLo aunque este 
            esté vacio ya que sino podemos generar bucles. (por defecto es cundo cualquier cosa del contenedor cambie)
            */

  const AddToCart = (event, prod) => {
    cart.push(prod);
    setCart([...cart]);
    console.log(event, cart);
  };

  return (
    <div className="container bg-warning">
      <InfoBarComponent cart={cart} />
      <div className="row px-2 py-2">
        {
          //las llaves permiten escribir codigo js en html
          products.map((product, index) => {
            //La funcion map es como un foreach pero retorna algo por cada elemento
            return (
              <span key={index}>
                <CardComponent addToCart={AddToCart} product={product} />
              </span>
            );
          })
        }
      </div>
    </div>
  );
};

export default ProductsContainer;
