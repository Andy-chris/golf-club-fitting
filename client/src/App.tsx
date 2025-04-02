import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import GolfClubFitting from "@/pages/GolfClubFitting";

// Set up route for GitHub Pages compatibility
const isGitHubPages = window.location.hostname.includes('github.io');

function Router() {
  return (
    <Switch>
      <Route path="/" component={GolfClubFitting} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
