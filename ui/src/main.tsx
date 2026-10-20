import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { LibraryProvider } from "@/lib/library-context";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme-context";
import App from "./App";
import { FirstRunBackupFolder } from "@/components/backup-folder/backup-folder";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <I18nProvider>
        <ThemeProvider>
          <LibraryProvider>
            <App />
            <FirstRunBackupFolder />
            <Toaster position="bottom-right" />
          </LibraryProvider>
        </ThemeProvider>
      </I18nProvider>
    </HashRouter>
  </StrictMode>
);

