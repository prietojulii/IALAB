import { createContext, useEffect, useState } from "react";

export const EcommersContext = createContext(); //creamos el contexto

//creamos el provedor
export const EcommersProvider = ({children}) => {
  const [products, setProducts] = useState([]);
  
  const [cart, setCart] = useState([]); /*este es un hook (useStete) 
                                            que indica que es un estado y se inicializa 
                                            como en arreglo vacio y dvuelve la variable 
                                            estado y la funcion de seteo la cual 
                                            renderizará la vista al usarse con el fin de 
                                            actualizar el estado*/

  useEffect(
    //este hook se utiliza en el ciclo de un estado.
    () => {
      //Esto se ejecuta en el montaje del estado
      async function fetchData() {
        //PEDIMO LOS DATOS DE DIRECTAMENTE MEDIANTE UNA API de mercado libre.
        let data = await fetch(
          "https://api.mercadolibre.com/sites/MLA/search?q=mac"
        );
        let dataRequest = await data.json();
        setProducts(dataRequest.results);
      }
      fetchData();
    },
    []
  ); /*este es el filtro, el cual indica cuando se ejecutará la funcion al 
        cambiar alguno de esos PROPS. Importante agregAR EL ARREGLo aunque este 
        esté vacio ya que sino podemos generar bucles. (por defecto es cundo cualquier cosa del contenedor cambie)
        */

  return (
    <EcommersContext.Provider value={{products,cart,setCart}}>
      {children}
    </EcommersContext.Provider>
  );
};
