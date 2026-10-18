import Link from "next/link";
import { Button } from "@/components/retroui/Button";
import { Github } from "@/components/retroui/icons";
import { githubUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function SignInButton({ className = "" }: { className?: string }) {
  return (
    <Button
      asChild
      className={cn(
        "bg-primary text-primary-foreground border-4 border-black font-black uppercase shadow-retro-sm",
        className,
      )}
    >
      <Link
        href={githubUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-2"
        aria-label="Voldigoade on GitHub"
      >
        <Github className="h-4 w-4" />
        <span>GitHub</span>
      </Link>
    </Button>
  );
}
