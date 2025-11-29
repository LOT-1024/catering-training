import { ArrowLeft, Download, Printer } from "lucide-react"
import type { Transaction } from "../../types"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { formatCurrency, formatDate } from "../../utils/formatters"
import { printReceipt, downloadReceiptPDF, downloadReceiptTextPDF } from "../../utils/receipt-generator"

interface TransactionHistoryProps {
  transactions: Transaction[]
  onBack: () => void
}

export function TransactionHistory({ transactions, onBack }: TransactionHistoryProps) {
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0)

  const handleDownload = async (transaction: Transaction) => {
    try {
      // Use the advanced PDF generation
      await downloadReceiptPDF(transaction)
    } catch (error) {
      console.error('PDF generation failed, using fallback:', error)
      // Fallback to simple text PDF
      downloadReceiptTextPDF(transaction)
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center gap-4">
        <Button onClick={onBack} variant="secondary" size="sm">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Transaction History</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {transactions.length} transactions • Total: {formatCurrency(totalRevenue)}
          </p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex-1 overflow-y-auto p-6">
        {transactions.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="p-4 space-y-3">
                {/* Transaction Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-card-foreground">{transaction.id}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(transaction.timestamp)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-accent">{formatCurrency(transaction.total)}</p>
                    <p className="text-xs text-muted-foreground capitalize">{transaction.paymentMethod}</p>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="bg-secondary p-3 rounded border border-border space-y-1 text-sm">
                  <p className="font-medium text-card-foreground mb-2">
                    {transaction.items.length} item{transaction.items.length !== 1 ? "s" : ""}
                  </p>
                  {transaction.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-muted-foreground text-xs">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  {transaction.items.length > 3 && (
                    <p className="text-muted-foreground text-xs mt-2">+{transaction.items.length - 3} more items</p>
                  )}
                </div>

                {/* Summary */}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div>
                    <span>Subtotal: {formatCurrency(transaction.subtotal)}</span>
                    <span className="mx-3">•</span>
                    <span>Tax: {formatCurrency(transaction.tax)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => printReceipt(transaction)}
                    variant="secondary"
                    className="flex-1"
                    size="sm"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </Button>
                  <Button
                    onClick={() => handleDownload(transaction)}
                    variant="secondary"
                    className="flex-1"
                    size="sm"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}