import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Workflow,
  Users,
  Store,
  CheckCircle2,
  ArrowRight,
  Settings,
  X,
} from "lucide-react";
import { useLocation } from "wouter";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action: string;
  path: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to QA Automation - AI ToolKit",
    description:
      "Your ultimate automation engine cross-platform. Let's get you started with a quick tour of the key features.",
    icon: Settings,
    action: "Get Started",
    path: "/",
  },
  {
    id: "script",
    title: "Create Your First Script",
    description:
      "Build powerful automation workflows with our visual drag-and-drop editor. No coding required!",
    icon: Workflow,
    action: "Create Script",
    path: "/scripts",
  },
  {
    id: "profile",
    title: "Configure a Profile",
    description:
      "Set up multi-account profiles with proxy support for managing multiple identities and running parallel automations.",
    icon: Users,
    action: "Add Profile",
    path: "/profiles",
  },
  {
    id: "marketplace",
    title: "Explore the Marketplace",
    description:
      "Discover and share automation templates with the community. Publish your own workflows and earn from your creations.",
    icon: Store,
    action: "Browse Templates",
    path: "/marketplace",
  },
  {
    id: "complete",
    title: "You're All Set!",
    description:
      "You've completed the onboarding tour. Start building amazing automations and unlock the full power of your M4 Max.",
    icon: CheckCircle2,
    action: "Start Building",
    path: "/",
  },
];

const ONBOARDING_KEY = "qa_automation_toolkit_onboarding_completed";

export function Onboarding() {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Check if onboarding has been completed
    const hasCompleted = localStorage.getItem(ONBOARDING_KEY);
    if (!hasCompleted) {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    const step = ONBOARDING_STEPS[currentStep];
    if (step && step.id !== "welcome" && step.id !== "complete") {
      // Navigate to the feature page
      setLocation(step.path);
    }

    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setCompleted(true);
    setIsOpen(false);
  };

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
  const step = ONBOARDING_STEPS[currentStep];

  if (!step) return null;

  const StepIcon = step.icon;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl border-border">
        <DialogTitle className="sr-only">{step.title}</DialogTitle>
        <button
          onClick={handleSkip}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Skip</span>
        </button>

        <div className="space-y-6 pt-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <StepIcon className={`h-10 w-10 text-primary ${step.id === 'welcome' ? 'animate-spin-slow' : ''}`} />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-foreground">{step.title}</h2>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Feature highlights for specific steps */}
          {step.id === "script" && (
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary">10+</div>
                <div className="text-xs text-muted-foreground mt-1">Action Types</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-chart-2">Real-time</div>
                <div className="text-xs text-muted-foreground mt-1">Collaboration</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-chart-3">Export</div>
                <div className="text-xs text-muted-foreground mt-1">to Code</div>
              </div>
            </div>
          )}

          {step.id === "profile" && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary">Multi-Account</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Manage unlimited profiles
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-chart-2">Proxy Support</div>
                <div className="text-xs text-muted-foreground mt-1">
                  SOCKS5, HTTP, HTTPS
                </div>
              </div>
            </div>
          )}

          {step.id === "marketplace" && (
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary">100+</div>
                <div className="text-xs text-muted-foreground mt-1">Templates</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-chart-2">Earn</div>
                <div className="text-xs text-muted-foreground mt-1">From Sales</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-chart-3">5★</div>
                <div className="text-xs text-muted-foreground mt-1">Rated Content</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            {currentStep > 0 && currentStep < ONBOARDING_STEPS.length - 1 && (
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex-1"
              >
                Skip Tour
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1"
            >
              {step.action}
              {currentStep < ONBOARDING_STEPS.length - 1 && (
                <ArrowRight className="h-4 w-4 ml-2" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook to reset onboarding (for testing or user request)
export function useResetOnboarding() {
  return () => {
    localStorage.removeItem(ONBOARDING_KEY);
    window.location.reload();
  };
}
