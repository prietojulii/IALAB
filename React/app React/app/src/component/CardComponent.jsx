const CardComponent = ({addToCart, product }) => { //Este es un componente, 
                                                 // Importante empieza con mayúscula 
                                                 // y retorna html

  return (
    <div className="card">
      <img src={product.thumbnail} className="card-img-top" alt="Card cap" />
      <div className="card-body">
        <h5 className="card-title">{product.title}</h5>
        <p className="card-text">
        ${product.price}
        </p>
        <button className="btn btn-primary" onClick={(event)=>{addToCart(event,product)}}>
          agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default CardComponent; //NO olvidar exportarlo para poder usarlo desde otro archivo del codigo
