// src/pages/cashier.tsx
import { useState } from "react";
import { ProductCatalog } from "../components/cashier/product-catalog";
import { ShoppingCart } from "../components/cashier/shopping-cart";
import { CheckoutPanel } from "../components/cashier/checkout-panel";
import { TransactionHistory } from "../components/cashier/transaction-history";
import { useCart } from "../hooks/use-cart";
import { useTransactions } from "../hooks/use-transactions";
import { Button } from "../components/ui/button";
import { History, X } from "lucide-react";

export function CashierPage() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCart();
  const { transactions, addTransaction, loading, error } = useTransactions();

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handlePaymentComplete = async (
    paymentMethod: "cash" | "card" | "digital"
  ) => {
    try {
      const transaction = await addTransaction(cart, paymentMethod);
      clearCart();
      setShowCheckout(false);
      return transaction;
    } catch (err) {
      console.error("Payment failed:", err);
      throw err;
    }
  };

  if (showHistory) {
    return (
      <TransactionHistory
        transactions={transactions}
        onBack={() => setShowHistory(false)}
      />
    );
  }

  if (showCheckout) {
    return (
      <CheckoutPanel
        cart={cart}
        onCancel={() => setShowCheckout(false)}
        onComplete={handlePaymentComplete}
      />
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Product Catalog - Left Side */}
      <div className="flex-1 overflow-hidden border-r border-border flex flex-col">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">POS System</h1>
          <div className="flex items-center gap-2">
            {loading && (
              <span className="text-xs text-muted-foreground mr-2">
                Syncing...
              </span>
            )}
            {error && (
              <span className="text-xs text-destructive mr-2">Sync error</span>
            )}
            <Button
              onClick={() => setShowHistory(true)}
              variant="secondary"
              size="sm"
              disabled={loading}
            >
              <History className="w-4 h-4" />
              <span className="ml-2">History</span>
            </Button>
          </div>
        </div>
        <ProductCatalog onAddToCart={addToCart} />
      </div>

      {/* Shopping Cart - Right Side */}
      <div className="w-96 flex flex-col bg-card border-l border-border">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-card-foreground">Cart</h2>
          {cart.length > 0 && (
            <Button onClick={clearCart} variant="secondary" size="sm">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <ShoppingCart
          items={cart}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}
