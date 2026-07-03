import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Explore() {
  return (
    <main className="view-page">
      <div className="view-copy">
        <p className="view-kicker">Explore</p>
        <h1>Concepts, systems, and product experiments.</h1>
        <p>
          A space for collected ideas, interface studies, and engineering notes
          that connect strategy, usability, and implementation detail.
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
