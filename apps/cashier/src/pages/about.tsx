export function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">About Our POS System</h1>
        <p className="text-xl text-muted-foreground">
          Modern point of sale solution for modern businesses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Features</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              Fast and intuitive product catalog
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              Real-time cart management
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              Multiple payment methods
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              Transaction history
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              Receipt generation
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Technology</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              Built with React and TypeScript
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              Modern UI components
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              Responsive design
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              Local state management
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-secondary rounded-lg p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4">Getting Started</h2>
        <p className="text-muted-foreground">
          Navigate to the Cashier page to start processing orders. You can add products to the cart,
          adjust quantities, and complete transactions with various payment methods.
        </p>
      </div>
    </div>
  )
}