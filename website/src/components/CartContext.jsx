    import React, { createContext, useContext, useState, useEffect } from 'react';

    const CartContext = createContext();

    export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        // Look up cached cart items on browser initialization loops
        const savedCart = localStorage.getItem('grey_textiles_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('grey_textiles_cart', JSON.stringify(cart));
    }, [cart]);

    // Adds an item with a specific selected color parameter smoothly
    const addToCart = (product, colorName) => {
        setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex(
            (item) => item.id === product.id && item.selectedColor === colorName
        );

        if (existingItemIndex > -1) {
            const newCart = [...prevCart];
            newCart[existingItemIndex].quantity += 100; // Defaulting to an industrial block volume size tier
            return newCart;
        }
        return [...prevCart, { ...product, selectedColor: colorName, quantity: 100 }];
        });
    };

    const updateQuantity = (itemId, colorName, newQty) => {
        if (newQty <= 0) {
        removeFromCart(itemId, colorName);
        return;
        }
        setCart((prevCart) =>
        prevCart.map((item) =>
            item.id === itemId && item.selectedColor === colorName
            ? { ...item, quantity: Number(newQty) }
            : item
        )
        );
    };

    const removeFromCart = (itemId, colorName) => {
        setCart((prevCart) =>
        prevCart.filter((item) => !(item.id === itemId && item.selectedColor === colorName))
        );
    };

    const clearCart = () => setCart([]);

    const getCartTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, getCartTotalItems }}>
        {children}
        </CartContext.Provider>
    );
    };

    export const useCart = () => useContext(CartContext);
