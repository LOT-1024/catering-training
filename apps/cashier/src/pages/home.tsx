import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Coffee, CreditCard, History } from 'lucide-react'

export function HomePage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Point of Sale System
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A modern and efficient POS system for managing your cafe or retail business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <Coffee className="w-12 h-12 mx-auto text-accent mb-4" />
            <h3 className="text-xl font-semibold text-card-foreground">Cashier</h3>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Process sales, manage orders, and handle customer transactions
            </p>
            <Button asChild>
              <Link to="/cashier">Open Cashier</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CreditCard className="w-12 h-12 mx-auto text-accent mb-4" />
            <h3 className="text-xl font-semibold text-card-foreground">Transactions</h3>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              View sales history and generate reports for your business
            </p>
            <Button variant="secondary" asChild>
              <Link to="/cashier">View History</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <History className="w-12 h-12 mx-auto text-accent mb-4" />
            <h3 className="text-xl font-semibold text-card-foreground">About</h3>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Learn more about our POS system and its features
            </p>
            <Button variant="secondary" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}