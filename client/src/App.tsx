import { Switch, Route } from "wouter";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
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
