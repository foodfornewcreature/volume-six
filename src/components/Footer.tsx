import { ArrowLeft, ArrowRight, Home, Minus, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFontSize } from "@/context/FontSizeContext";
import { useNavigate } from "react-router-dom";

interface FooterProps {
  onPrev?: () => void;
  onNext?: () => void;
}

export function Footer({ onPrev, onNext }: FooterProps) {
  const { increaseFontSize, decreaseFontSize } = useFontSize();
  const navigate = useNavigate();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-[100] border-t footer-safe">
      <div className="container flex h-16 items-center justify-around">
        <Button variant="ghost" size="icon" onClick={onPrev} disabled={!onPrev}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <Home className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => navigate('/search')}>
          <Search className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={decreaseFontSize}>
          <Minus className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={increaseFontSize}>
          <Plus className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onNext} disabled={!onNext}>
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </footer>
  );
}