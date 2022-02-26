import {createStore} from '@reduxjs/toolkit';
import {Reducers} from "../reducers/index";
export const Store = createStore(Reducers); 
//aca viene la logica