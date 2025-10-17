import { Switch, Route } from "wouter";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetails from "@/pages/ProductDetails";
import CategoryPage from "@/pages/CategoryPage";
import Deals from "@/pages/Deals";
import Favorites from "@/pages/Favorites";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:slug" component={ProductDetails} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/deals" component={Deals} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <Provider store={store}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </Provider>
  );
}

export default App;
