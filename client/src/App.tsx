import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import RestaurantPage from "@/pages/restaurant";
import NotFound from "@/pages/not-found";
import { queryClient } from "@/lib/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Switch>
          <Route path="/" component={() => <RestaurantPage restaurantId={1} />} />
          <Route path="/restaurant/:id">
            {(params) => <RestaurantPage restaurantId={parseInt(params.id)} />}
          </Route>
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;