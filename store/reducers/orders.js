import {ADD_ORDER, SET_ORDERS} from "../actions/orders";
import Order from "../../models/order";

// Init Store
const initialState = {
    orders: []
};

// Based on event type define return
const ordersReducer = (state = initialState, action) => {
    switch (action.type) {

        case SET_ORDERS:
            return {
                orders: action.orders
            };

        case ADD_ORDER:
            const newOrder = new Order(
                action.orderData.id,
                action.orderData.items,
                action.orderData.amount,
                action.orderData.date
            );

            return {
                ...state,
                orders: state.orders.concat(newOrder)
            };
    }
    return state;
}


export default ordersReducer;
