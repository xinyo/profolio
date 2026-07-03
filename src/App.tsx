import { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import { BrowserRouter, Link, Route, Routes } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import { About } from "@/views/about";
import { Explore } from "@/views/explore";

import heroImg from "./assets/logo.webp";
import "./App.css";

function HomePage() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);

  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored !== null ? stored === "dark" : true;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} alt="Hero" className="logo" />
        </div>
        <div>
          <h1>{t("get_started")}</h1>
          <p>
            <Trans i18nKey="intro">
              Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
            </Trans>
          </p>
        </div>

        <div className="button-group">
          <Button asChild size="lg" onClick={() => setCount((count) => count + 1)}>
            <Link to="/about">
              {t("hero_primary_btn", { count })}
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/explore">
              {t("hero_secondary_btn")}
              <ChevronRight />
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsDark((d) => !d)}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "\u2600" : "\u2601"}
          </Button>
        </div>
      </section>

      <div className="ticks"></div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
