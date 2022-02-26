const INIT_STATE = {
    cart: []
};

export const cartReducer= (state = INIT_STATE, action)=> {

    switch(action.type){
        case "PUSH NEW PRODUCT":
            //hace algo
            return {
                ...state,
                cart: [...state.cart,action.payload]
             };
        default:
                 return INIT_STATE;
    }

};