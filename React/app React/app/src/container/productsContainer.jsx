
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardComponent from "../component/CardComponent";
import InfoBarComponent from "../component/InfoBarComponent";
import { EcommersContext } from "../context/ecommersContext";

export const ProductsContainer = () => {
  /* Este es un contenedor, contiene varios componentes entre 
                                        otras cosas como ESTADOS (variables dnamicas que necesitan 
                                        renderizarce al cambiar su valor),Funciones propias, atributos, etc.
                                        */

  const { productsOrig } = useContext(EcommersContext);
  const { products } = useContext(EcommersContext);
  const { cart } = useContext(EcommersContext);
  const { setCart } = useContext(EcommersContext);
  const { fetchData } = useContext(EcommersContext);
  const {busqueda } = useParams();
  const {setProducts} = useContext(EcommersContext);

  const handleKeyUp = (e)=>{ 
    let inputSearch =(e.target.value);
    const productsFilter = productsOrig.filter(element => element.title.toUpperCase().match(inputSearch.toUpperCase()));
    console.log(productsFilter)
    setProducts(productsFilter);
  };
  useEffect(
    //este hook se utiliza en el ciclo de un estado.
    () => {
      //Esto se ejecuta en el montaje del estado
      fetchData(busqueda);
      return ()=>{}
    },
    [busqueda]
  ); /*este es el filtro, el cual indica cuando se ejecutará la funcion al 
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
      <InfoBarComponent cart={cart} handleKeyUp={handleKeyUp} />
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
