"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Moon, Sun, Github } from "lucide-react";
import { useTheme } from "next-themes";
import Topic from "@/components/Research/Topic";
import ResearchCapabilities from "@/components/Research/ResearchCapabilities";
import { Button } from "@/components/Internal/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function TopicWithParams() {
  const searchParams = useSearchParams();

  const urlGeneSymbol = searchParams.get('gene') || searchParams.get('geneSymbol') || undefined;
  const urlOrganism = searchParams.get('organism') || searchParams.get('organismName') || undefined;

  return (
    <Topic
      urlGeneSymbol={urlGeneSymbol}
      urlOrganism={urlOrganism}
    />
  );
}

function Header() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b mb-8">
      <div className="max-lg:max-w-screen-md max-w-screen-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              🧬 Deep Research Platform
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("header.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  {i18n.language === "zh-CN" ? "🇨🇳 中文" : "🇺🇸 English"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => i18n.changeLanguage("zh-CN")}>
                  🇨🇳 中文
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => i18n.changeLanguage("en-US")}>
                  🇺🇸 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Switcher */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* GitHub Link */}
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <a
                href="https://github.com/awaragml00029-debug/deepmerge"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t mt-16 py-8">
      <div className="max-lg:max-w-screen-md max-w-screen-lg mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-2">{t("footer.about")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("footer.aboutText")}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{t("footer.links")}</h3>
            <ul className="text-sm space-y-1">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  {t("footer.documentation")}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/awaragml00029-debug/deepmerge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{t("footer.version")}</h3>
            <p className="text-sm text-muted-foreground">
              v1.0.0 - 2025-11-11
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t("footer.poweredBy")}
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-lg:max-w-screen-md max-w-screen-lg mx-auto px-4 pb-8">
          <ResearchCapabilities />

          <Suspense fallback={
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
          }>
            <TopicWithParams />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
