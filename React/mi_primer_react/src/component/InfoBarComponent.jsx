

const InfoBarComponent = ({cart }) => {

  return (
    <div className="bg-white py-4">
        Elementos en el carrito: {cart.length}
    </div>
  );
};

export default InfoBarComponent;
