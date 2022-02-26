import { createContext, useState } from "react";

export const EcommersContext = createContext(); //creamos el contexto

//creamos el provedor
export const EcommersProvider = ({children}) => {
  const [productsOrig, setProductsOrig] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); /*este es un hook (useStete) 
                                            que indica que es un estado y se inicializa 
                                            como en arreglo vacio y dvuelve la variable 
                                            estado y la funcion de seteo la cual 
                                            renderizará la vista al usarse con el fin de 
                                            actualizar el estado*/

  async function fetchData(searchQueary) {
    //PEDIMO LOS DATOS DE DIRECTAMENTE MEDIANTE UNA API de mercado libre.
    let data = await fetch(
      "https://api.mercadolibre.com/sites/MLA/search?q="+searchQueary
    );
    let dataRequest = await data.json();
    setProducts(dataRequest.results);
    setProductsOrig(dataRequest.results);
  }
  

  return (
    <EcommersContext.Provider value={{ productsOrig,cart,setCart,fetchData,products, setProducts}}>
      {children}
    </EcommersContext.Provider>
  );
};
