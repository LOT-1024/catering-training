// src/components/cashier/checkout-panel.tsx
import { useState } from "react"
import type { CartItem } from "../../types"
import { ArrowLeft, Check, AlertCircle } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { formatCurrency } from "../../utils/formatters"

interface CheckoutPanelProps {
  cart: CartItem[]
  onCancel: () => void
  onComplete: (paymentMethod: "cash" | "card" | "digital") => Promise<any>
}

export function CheckoutPanel({ cart, onCancel, onComplete }: CheckoutPanelProps) {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "digital">("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  const handlePayment = async () => {
    setIsProcessing(true)
    setError(null)
    
    try {
      await onComplete(paymentMethod)
      setPaymentComplete(true)
      // Auto-complete after 2 seconds
      setTimeout(() => {
        // Navigation is handled in the parent component
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (paymentComplete) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center animate-pulse">
          <Check className="w-8 h-8 text-accent-foreground" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful</h2>
          <p className="text-muted-foreground">Thank you for your purchase!</p>
          <p className="text-xl font-semibold text-primary mt-4">Total: {formatCurrency(total)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              onClick={onCancel}
              disabled={isProcessing}
              variant="secondary"
              size="sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded p-3 flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Order Summary */}
          <div className="space-y-3 bg-secondary p-4 rounded border border-border">
            <h2 className="font-semibold text-card-foreground">Order Summary</h2>
            <div className="space-y-2 text-sm">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-muted-foreground">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax:</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-foreground text-base">
                <span>Total:</span>
                <span className="text-accent">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Payment Method</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "cash", label: "Cash" },
                { id: "card", label: "Card" },
                { id: "digital", label: "Digital" },
              ].map((method) => (
                <Button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  disabled={isProcessing}
                  variant={paymentMethod === method.id ? "default" : "secondary"}
                  className="py-3"
                >
                  {method.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-secondary p-4 rounded border border-border text-sm text-muted-foreground">
            <p className="text-center">
              {paymentMethod === "cash"
                ? "Cash payment will be processed at the counter"
                : `Processing ${paymentMethod === "card" ? "card" : "digital"} payment...`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              disabled={isProcessing}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing || cart.length === 0}
              className="flex-1"
            >
              {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}