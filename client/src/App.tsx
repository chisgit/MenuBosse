import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import RestaurantPage from "@/pages/restaurant";
import NotFound from "@/pages/not-found";
import { queryClient } from "@/lib/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800">
        <Switch>
          <Route path="/" component={() => <RestaurantPage restaurantId={1} />} />
          <Route path="/restaurant/:id">
{(params) => <RestaurantPage restaurantId={parseInt(params.id.split(":")[0])} />}
          </Route>
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
