import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export function About() {
  return (
    <main className="view-page">
      <div className="view-copy">
        <p className="view-kicker">About</p>
        <h1>Design-minded engineering for focused products.</h1>
        <p>
          I work across product design and software engineering, turning
          complex workflows into interfaces that feel calm, clear, and durable.
        </p>
      </div>

      <Button asChild variant="outline">
        <Link to="/">
          <ArrowLeft />
          Home
        </Link>
      </Button>
    </main>
  );
}
