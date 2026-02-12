import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import ScriptBuilder from "./pages/ScriptBuilder";
import Profiles from "./pages/Profiles";
import CodeGenerator from "./pages/CodeGenerator";
import Recorder from "./pages/Recorder";
import DockerManager from "./pages/DockerManager";
import SocialTemplates from "./pages/SocialTemplates";
import BDDIntegration from "./pages/BDDIntegration";
import LiveMonitor from "./pages/LiveMonitor";
import MacOSIntegration from "./pages/MacOSIntegration";
import Collaboration from "./pages/Collaboration";
import Marketplace from "./pages/Marketplace";
import Documentation from "./pages/Documentation";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/scripts" component={ScriptBuilder} />
        <Route path="/profiles" component={Profiles} />
        <Route path="/codegen" component={CodeGenerator} />
        <Route path="/recorder" component={Recorder} />
        <Route path="/docker" component={DockerManager} />
        <Route path="/templates" component={SocialTemplates} />
        <Route path="/bdd" component={BDDIntegration} />
        <Route path="/collaboration" component={Collaboration} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/documentation" component={Documentation} />
        <Route path="/monitor" component={LiveMonitor} />
        <Route path="/macos" component={MacOSIntegration} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
