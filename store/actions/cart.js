export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

// Add to card action that return type with data for reducer
export const addToCart = product => {
    return {
        type: ADD_TO_CART,
        product: product
    };
};
// Remove to card action that return type with data for reducer
export const removeFromCart = productId => {
    return {
        type: REMOVE_FROM_CART,
        pid: productId
    };
};
