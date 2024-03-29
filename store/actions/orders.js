import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

// Fetch Order from the Server
export const fetchOrders = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch(`https://ecom-c0f34-default-rtdb.asia-southeast1.firebasedatabase.app/orders/${userId}.json`)

            if (!response.ok) {
                // handle 400 and 500 status code
                throw new Error('Something went wrong !')
            }

            const resData = await response.json();
            const loadedOrders = [];
            // Set all the product in model:order
            for (const key in resData) {
                loadedOrders.push(new Order(
                    key,
                    resData[key].cartItems,
                    resData[key].totalAmount,
                    new Date(resData[key].date)
                ))
            }
            // Dispatch the list model:order
            dispatch({
                type: SET_ORDERS,
                orders: loadedOrders
            });

        } catch (err) {
            throw err;
        }


    }
}

// Action to Add item to Order list
export const addOrder = (cartItems, totalAmount) => {
    // make post requests to to add item to OrderList
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const date = new Date();
        const response = await fetch(`https://ecom-c0f34-default-rtdb.asia-southeast1.firebasedatabase.app/orders/${userId}.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartItems,
                totalAmount,
                date: date.toISOString()
            })
        });
        // if response Not Ok Show the error
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        // if response OK the wait for data
        const resData = await response.json();
        // After data receive dispatch
        dispatch({
            type: ADD_ORDER,
            orderData: {
                id: resData.name,
                items: cartItems,
                amount: totalAmount,
                date: date
            }
        });
    };
};
