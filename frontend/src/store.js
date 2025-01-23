import { configureStore } from "@reduxjs/toolkit";

import { paymentReducer } from "./services/Reducers/paymentReducer.js";


// Configure the store
const store = configureStore({
  reducer: {
  
    payment: paymentReducer
    
  },
});

export default store;
