import { useTheme } from "@/hooks/useTheme";
import { SunIcon, MoonIcon, SystemIcon } from "@/components/icons";
import { Component, createSignal, Show, onCleanup } from "solid-js";

export const ThemeSelector: Component = () => {
  const { theme, updateTheme } = useTheme();
  const [isOpen, setIsOpen] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  const toggleDropdown = () => setIsOpen(!isOpen());

  const handleSelect = (value: string) => {
    updateTheme(value);
    setIsOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen()) {
      setIsOpen(false);
    }
  };

  const setupListeners = () => {
    if (isOpen()) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    }
  };

  const untrack = () => {
    setupListeners();
  };

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("keydown", handleEscape);
  });

  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case "light":
        return <SunIcon />;
      case "dark":
        return <MoonIcon />;
      default:
        return <SystemIcon />;
    }
  };

  const getThemeLabel = (themeName: string) => {
    switch (themeName) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      default:
        return "System";
    }
  };

  return (
    <div class="theme-selector" ref={containerRef}>
      <button
        class="theme-toggle-btn"
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown();
          untrack();
        }}
        aria-label="Select theme"
        aria-expanded={isOpen()}
      >
        <span class="theme-icon">{getThemeIcon(theme())}</span>
        <span class="theme-label">{getThemeLabel(theme())}</span>
        <svg
          class="theme-chevron"
          classList={{ open: isOpen() }}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <Show when={isOpen()}>
        <div class="theme-dropdown">
          <button
            class="theme-option"
            classList={{ active: theme() === "system" }}
            onClick={() => handleSelect("system")}
          >
            <SystemIcon />
            <span>System</span>
          </button>
          <button
            class="theme-option"
            classList={{ active: theme() === "light" }}
            onClick={() => handleSelect("light")}
          >
            <SunIcon />
            <span>Light</span>
          </button>
          <button
            class="theme-option"
            classList={{ active: theme() === "dark" }}
            onClick={() => handleSelect("dark")}
          >
            <MoonIcon />
            <span>Dark</span>
          </button>
        </div>
      </Show>
    </div>
  );
};
