import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  loading: boolean;
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const persistedProducts = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );

      if (persistedProducts) {
        setProducts([...JSON.parse(persistedProducts)]);
      }
      /* const persistedProducts = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );
      let persistedProductsArray: Product[] = [];

      const response = await api.get('products');

      if (response.data && persistedProducts) {
        persistedProductsArray = JSON.parse(persistedProducts);

        const updatedProducts = response.data.map((fetchedProduct: Product) => {
          const findProduct = persistedProductsArray.find(
            (persistedProduct: Product) =>
              persistedProduct.id === fetchedProduct.id,
          );

          if (findProduct) {
            return {
              id: findProduct.id,
              title: fetchedProduct.title,
              image_url: fetchedProduct.image_url,
              price: fetchedProduct.price,
              quantity: findProduct.quantity,
            };
          }

          return null;
        });

        const updatedProductsArray: Product[] = updatedProducts.filter(
          (product: Product) => product !== null,
        );

        // await AsyncStorage.removeItem('@GoMarketplace:products');
        await AsyncStorage.setItem(
          '@GoMarketplace:products',
          JSON.stringify(updatedProductsArray),
        );

        setProducts(updatedProductsArray);
      }
      setLoading(false); */
      setLoading(false);
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const productExists = products.find(
        findProduct => findProduct.id === product.id,
      );

      /* if (productExists) {
        await increment(product.id);
      } else {
        const formattedProduct = {
          id: product.id,
          title: product.title,
          image_url: product.image_url,
          price: product.price,
          quantity: 1,
        };
        // await AsyncStorage.removeItem('@GoMarketplace:products');
        await AsyncStorage.setItem(
          '@GoMarketplace:products',
          JSON.stringify([...products, formattedProduct]),
        );

        setProducts(oldProducts => [...oldProducts, formattedProduct]);
      } */

      if (productExists) {
        setProducts(
          products.map(p =>
            p.id === product.id ? { ...product, quantity: p.quantity + 1 } : p,
          ),
        );
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
      }

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const updatedProducts = products.map(p =>
        p.id === id ? { ...p, quantity: p.quantity + 1 } : p,
      );

      setProducts(updatedProducts);
      /* const updatedProducts = products.map(product => {
        if (product.id === id) {
          product.quantity += 1;
        }
        return product;
      }); */

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(updatedProducts),
      );

      // setProducts(updatedProducts);
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const updatedProducts = products.map(p =>
        p.id === id ? { ...p, quantity: p.quantity - 1 } : p,
      );

      setProducts(updatedProducts);
      /* const updatedProducts = products.map(product => {
        if (product.id === id) {
          product.quantity += 1;
        }
        return product;
      }); */

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(updatedProducts),
      );
      /* const checkProductQuantity = products.filter(
        product => product.id === id,
      );

      let updatedProducts: Product[] = [];

      if (checkProductQuantity[0].quantity > 1) {
        updatedProducts = products.map(product => {
          if (product.id === id) {
            product.quantity -= 1;
          }
          return product;
        });
      } else {
        updatedProducts = products.filter(
          product => product.id !== checkProductQuantity[0].id,
        );
      } */

      /* await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(updatedProducts),
      ); */

      // setProducts(updatedProducts);
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products, loading }),
    [addToCart, increment, decrement, products, loading],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
