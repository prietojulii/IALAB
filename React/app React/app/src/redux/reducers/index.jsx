
import { combineReducers } from "@reduxjs/toolkit";
import { cartReducer } from "./cartReducer";

//importe como default por lo que se exporta sin nombre, lo cual cunado lo 
//buquemos como Reducers/*** */, buscara este
export const Reducers =combineReducers({cartReducer: cartReducer}); //combina todos los reducer