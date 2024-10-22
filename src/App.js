import React, { useState } from 'react';
import { ShoppingCart, Package, X } from 'lucide-react';
import './styles.css';

// Dummy products data
const DUMMY_PRODUCTS = [
  {
    id: '64c2fc901c2f8b4f68b2ef66',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 79.99,
    image: '',
  },
  {
    id: '64c2fca01c2f8b4f68b2ef67',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitoring',
    price: 149.99,
    image: '',
  },
  {
    id: '64c2fcb01c2f8b4f68b2ef68',
    name: 'Bluetooth Speaker',
    description: 'Portable speaker with deep bass and long battery life',
    price: 89.99,
    image: '',
  },
];

const App = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [orderStatus, setOrderStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add to cart function
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.productId === product.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevCart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  // Remove from cart function
  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  // Calculate total amount
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Handle shipping address change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle order submission
  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Validate shipping address
    for (const field in shippingAddress) {
      if (!shippingAddress[field]) {
        alert(`Please fill in the ${field} field`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        'https://ecommerce-backend-b0af.onrender.com/api/orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: '64c2fc801c2f8b4f68b2ef65',
            items: cart.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
            totalAmount: totalAmount,
            shippingAddress,
          }),
        }
      );

      console.log('reached');

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      setOrderStatus({
        success: true,
        message: `Order created successfully! Order ID: ${data.id}`,
      });
      setCart([]);
      setShippingAddress({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      });
    } catch (error) {
      setOrderStatus({
        success: false,
        message: 'Failed to create order. Please try again.',
      });
      console.error('Error creating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">E-commerce Store</h1>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative p-2 text-gray-600 hover:text-gray-900"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Order Status Message */}
        {orderStatus && (
          <div
            className={`mb-4 p-4 rounded ${
              orderStatus.success
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {orderStatus.message}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DUMMY_PRODUCTS.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow p-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded"
                    >
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Shipping Address Form */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Shipping Address
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleAddressChange}
                      placeholder="Street Address"
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      placeholder="City"
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      placeholder="State"
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleAddressChange}
                      placeholder="ZIP Code"
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleAddressChange}
                      placeholder="Country"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                {/* Total and Checkout */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
