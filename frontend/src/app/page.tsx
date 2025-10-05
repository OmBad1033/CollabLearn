import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export default function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white 
    dark:bg-black text-black dark:text-white transition-all duration 300"
    >
      <div className="max-w-3xl text-center space-y-10">
        <h1 className="text-6xl font-semibold">Collab Learn dark and light modes</h1>
        <p>In TypeScript (ESM modules), you can’t use the CommonJS require() syntax — it’s not valid in ES module contexts.
        Since your tailwind.config.ts is using export default, it’s treated as an ES module, and TypeScript disallows require().</p>
        <div className="space-x-2">
          <Button> Light</Button>
          <Button variant="secondary"> Dark</Button>
        </div>
        <ThemeToggle/>
      </div>
    </div>
  );
}
