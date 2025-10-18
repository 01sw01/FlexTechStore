import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CheckCircle, Search } from "lucide-react";
import type { Order } from "@shared/schema";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "shipped":
      return <Truck className="h-5 w-5 text-blue-500" />;
    default:
      return <Package className="h-5 w-5 text-yellow-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "shipped":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "processing":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export default function OrderTracking() {
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);

  const mockOrders: Order[] = [
    {
      id: "1",
      userId: "user-1",
      status: "delivered",
      total: "299.99",
      shippingAddress: "123 Main St, Apt 4B",
      paymentMethod: null,
      createdAt: new Date("2024-10-10"),
      updatedAt: new Date("2024-10-10"),
      trackingNumber: "TRK123456789"
    },
    {
      id: "2",
      userId: "user-1",
      status: "shipped",
      total: "549.99",
      shippingAddress: "123 Main St, Apt 4B",
      paymentMethod: null,
      createdAt: new Date("2024-10-15"),
      updatedAt: new Date("2024-10-15"),
      trackingNumber: "TRK987654321"
    },
    {
      id: "3",
      userId: "user-1",
      status: "processing",
      total: "199.99",
      shippingAddress: "123 Main St, Apt 4B",
      paymentMethod: null,
      createdAt: new Date("2024-10-16"),
      updatedAt: new Date("2024-10-16"),
      trackingNumber: "TRK456789123"
    }
  ];

  const handleSearch = () => {
    const order = mockOrders.find(o => o.trackingNumber === trackingNumber);
    setSearchedOrder(order || null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8" data-testid="text-page-title">Order Tracking</h1>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Track Your Order</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Enter tracking number..."
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              data-testid="input-tracking"
            />
            <Button onClick={handleSearch} data-testid="button-track">
              <Search className="h-4 w-4 mr-2" />
              Track
            </Button>
          </div>

          {searchedOrder && (
            <div className="mt-6 p-4 bg-muted rounded-md" data-testid="order-result">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(searchedOrder.status)}
                  <span className="font-semibold">Order #{searchedOrder.id}</span>
                </div>
                <Badge className={getStatusColor(searchedOrder.status)}>
                  {searchedOrder.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Tracking: {searchedOrder.trackingNumber}
              </p>
            </div>
          )}
        </Card>

        <h2 className="text-2xl font-bold mb-6">Your Orders</h2>

        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id} className="p-6" data-testid={`order-card-${order.id}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <h3 className="font-semibold" data-testid={`text-order-id-${order.id}`}>
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(order.status)} data-testid={`badge-status-${order.id}`}>
                  {order.status.toUpperCase()}
                </Badge>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tracking Number:</span>
                  <span className="font-medium" data-testid={`text-tracking-${order.id}`}>
                    {order.trackingNumber}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping Address:</span>
                  <span className="font-medium">{String(order.shippingAddress)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold text-lg" data-testid={`text-total-${order.id}`}>
                    ${order.total}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" data-testid={`button-details-${order.id}`}>
                  View Details
                </Button>
                {order.status === "delivered" && (
                  <Button variant="outline" size="sm" data-testid={`button-review-${order.id}`}>
                    Write Review
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
