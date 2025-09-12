import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-soothing flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-ambient opacity-20" />
      
      <Card className="glass-card p-8 text-center max-w-md mx-auto relative z-10">
        <div className="text-6xl font-bold text-primary mb-4">404</div>
        <h1 className="text-2xl font-playfair font-semibold text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="btn-ambient">
          <a href="/">Return to SafeSpace</a>
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;
