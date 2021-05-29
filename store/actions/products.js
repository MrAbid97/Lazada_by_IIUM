import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";


// Fetch Product from server using get
export const fetchProduct = () => {
    return async (dispatch, getState) => {
        try {
            const userId = getState().auth.userId;
            const response = await fetch('https://ecom-c0f34-default-rtdb.asia-southeast1.firebasedatabase.app/products.json')
            if (!response.ok) {
                // handle 400 and 500 status code
                throw new Error('Something went wrong !')
            }
            // if response code if OK then wait for data
            const resData = await response.json();
            const loadedProducts = [];
            // set data in model:product format
            for (const key in resData) {
                loadedProducts.push(new Product(
                    key,
                    resData[key].ownerId,
                    resData[key].title,
                    resData[key].imageUrl,
                    resData[key].description,
                    resData[key].price
                ))
            }
            // dispatch model:product data list
            dispatch({
                type: SET_PRODUCTS,
                products: loadedProducts,
                userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
            })
        } catch (err) {

            throw err;
        }

    };
}

// Deleted Product by Doing Delete request
export const deleteProduct = (productId) => {

    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://ecom-c0f34-default-rtdb.asia-southeast1.firebasedatabase.app/products/${productId}.json?auth=${token}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error("Something went wrong!");
        }
        // if response if OK then Dispatch event with TYPE
        dispatch({
            type: DELETE_PRODUCT,
            pid: productId
        })
    }
};

// Create product by doing Post request
export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        // any async code
        const response = await fetch(`https://ecom-c0f34-default-rtdb.asia-southeast1.firebasedatabase.app/products.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            })
        });
        // if response is ok then wait for data
        const resData = await response.json();
        // After data received dispatch the Data with TYPE
        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                id: resData.name,
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            }
        });
    }
};
