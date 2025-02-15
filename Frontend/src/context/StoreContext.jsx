import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(() => {
        // Load from local storage if available
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : {};
    });

    const url = "http://localhost:4000";

    const [token, setToken] = useState(() => {
        // Retrieve token from localStorage if available
        return localStorage.getItem("token") || "";
    });
    const [food_list,setFoodList] = useState([]);

    const addToCart = async (itemId) => {
      if (!cartItems[itemId]) {
          setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
      } else {
          setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }

      if (token) {
          try {
              await axios.post(url+"/api/cart/add", { itemId }, { headers: {token}  });
          } catch (error) {
              console.error("Error adding to cart:", error);
          }
      }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    if (token) {
        try {
            await axios.post(url+"/api/cart/remove", { itemId }, { headers: {token} });
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    }
};

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                const itemInfo = food_list.find((product) => String(product._id) === String(itemId));
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[itemId];
                }
            }
        }
        return totalAmount;
    };
    const fetchFoodList = async() => {
      const response = await axios.get(url+"/api/food/list");
      setFoodList(response.data.data)
    }
   

    const loadCartData = async (token) => {
      try {
          const response = await axios.post(url+"/api/cart/get", {}, { headers: {token}  });
          setCartItems(response.data.cartData);
      } catch (error) {
          console.error("Error loading cart data:", error);
      }
  };

  useEffect(() => {
      async function loadData() {
          await fetchFoodList();
          const storedToken = localStorage.getItem("token");
          if (storedToken) {
              setToken(storedToken);
              await loadCartData(localStorage.getItem("token"));
          }
      }
      loadData();
  }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider; 


