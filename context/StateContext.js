// file to manage the entire state of the application
//import react hooks
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'; //imported toast for pop up notification when item is added to cart
import product from '../sanity-backend/schemas/product';

const Context = createContext(); //call as hook
export const StateContext = ( { children } ) => {
    //create the states
    const [showCart, setShowCart] = useState(false); //manage the state of the cart if it's being shown or not
    const [cartItems, setCartItems] = useState([]); //to know what items are in the cart. Will be filled with data coming from local storage
    //when user leaves site, the items will no get erased.
    const [totalPrice, setTotalPrice] = useState(0); //keep track of the total price 
    const [totalQuantities, setTotalQuantities] = useState(0); //to know the quantities of the items you are working with
    const [qty, setqty] = useState(1);

    
    let foundProduct; //product in cart
    let index;// index of product in cart

    // return ContextProvider wrapping the values(state fields) that will be passed in the entire application
    //The values passed can be accessed from any of the componentsci

    //function to add products to cart when add to cart button is clicked
    const onAdd = (product, quantity) => {
        //check if the product being added is already in the cart
        const checkProductInCart = cartItems.find((item) => item._id === product._id);
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity)
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity)

        //this will be executed if trying to add an item that already exists in the cart
        if(checkProductInCart) {

            const updatedcartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })
            //allows adding of the same product but not adding a duplicated
            //the code tells that the item is already available in the cart
            //,instead it increments the quantity
            //number and total price
            setCartItems(updatedcartItems);
        }else{
            //item does not exist in the cart
            //i)Update the products quantity
            product.quantity = quantity;
            setCartItems([...cartItems, { ...product }]);
        }
        toast.success(`${qty} ${product.name} added to the cart`);
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const currCartItems = cartItems.filter((item) => item._id !== product._id)

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity)
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity)
        setCartItems(currCartItems)
    }

    //function to increment/decrement number of the select product in cart
    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id);
        //filter method to keep the items and not the one being updated  
        const currCartItems = cartItems.filter((item) => item._id !== id)
        
        if(value === 'inc'){
            //updating the cartItems with the current cartItems adding one element to it 
            //then spreading the properties and increasing the quantity by one.
            currCartItems.splice(index, 0, {...foundProduct, quantity: foundProduct.quantity+1})
            setCartItems(currCartItems)

            //setting the new price after adding item
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price) 
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
        } else if(value === 'dec'){
            if(foundProduct.quantity > 1){
                currCartItems.splice(index, 0, {...foundProduct, quantity: foundProduct.quantity-1})
                setCartItems(currCartItems)    
                //setting the new price after reducing the number of items
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price) 
                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
            }
        }
    }
 
    //dynamic update quantity function to manage incrementing items 
    const incQty = () => {
        setqty(( prevQty ) => prevQty + 1);
    }
    const decQty = () => {
        setqty((prevQty) => {
            if(prevQty - 1 < 1) return 1;

            return prevQty -1;
        });
    }
    return (
        <Context.Provider
        value={{
            showCart,
            setShowCart,
            cartItems,
            totalPrice,
            totalPrice,
            totalQuantities,
            qty,
            incQty,
            decQty,
            onAdd,
            toggleCartItemQuantity,
            onRemove,
            setCartItems,
            setTotalPrice,
            setTotalQuantities
        }}
        >  
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);