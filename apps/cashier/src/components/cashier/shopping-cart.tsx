import { Trash2, Plus, Minus } from "lucide-react"
import type { CartItem } from "../../types"
import { Button } from "../ui/button"
import { formatCurrency } from "../../utils/formatters"

interface ShoppingCartProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  onCheckout: () => void
}

export function ShoppingCart({ items, onUpdateQuantity, onRemove, onCheckout }: ShoppingCartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  return (
    <div className="flex flex-col h-full">
      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">Cart is empty</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 p-2 bg-secondary rounded border border-border">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(item.price)} x {item.quantity}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1 bg-input rounded border border-border">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="p-1 hover:bg-accent/20 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-accent/20 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => onRemove(item.id)}
                className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Item Total */}
              <div className="text-right">
                <p className="text-sm font-semibold text-accent">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-3 space-y-3">
        {/* Summary */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%):</span>
            <span>{formatCurrency(tax)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-2 border-t border-border">
          <span className="font-semibold text-card-foreground">Total:</span>
          <span className="text-xl font-bold text-accent">{formatCurrency(total)}</span>
        </div>

        {/* Checkout Button */}
        <Button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full py-3"
          size="lg"
        >
          Checkout
        </Button>
      </div>
    </div>
  )
}