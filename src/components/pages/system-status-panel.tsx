"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Alert } from "@/components/retroui/Alert";
import { Badge } from "@/components/retroui/Badge";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import {
  AlertTriangle,
  Compass,
  Home,
  LifeBuoy,
  RefreshCw,
} from "@/components/retroui/icons";
import { useSystemPagesStore } from "@/store/system-pages-store";

type SystemStatusPanelProps = {
  mode: "not-found" | "error";
  onReset?: () => void;
  errorDigest?: string;
};

const tipsByMode = {
  "not-found": [
    "Utilisez la navigation principale pour accéder aux pages actives.",
    "Consultez la page Projets pour explorer les dépôts publics et le code source.",
    "Visitez le Blog pour découvrir les articles d'ingénierie et notes de recherche.",
  ],
  error: [
    "Cliquez sur Réessayer pour tenter de recharger cette route en toute sécurité.",
    "Si l'erreur persiste, signalez-la sur GitHub en joignant le code d'erreur.",
    "Vous pouvez continuer à naviguer sur l'Accueil et les Projets pendant la résolution.",
  ],
} as const;

async function getSystemTips(mode: "not-found" | "error") {
  await new Promise((resolve) => setTimeout(resolve, 160));
  return tipsByMode[mode];
}

export function SystemStatusPanel({
  mode,
  onReset,
  errorDigest,
}: SystemStatusPanelProps) {
  const pathname = usePathname();
  const lastPath = useSystemPagesStore((state) => state.lastPath);
  const retryCount = useSystemPagesStore((state) => state.retryCount);
  const setLastPath = useSystemPagesStore((state) => state.setLastPath);
  const incrementRetryCount = useSystemPagesStore(
    (state) => state.incrementRetryCount,
  );
  const clearRetryCount = useSystemPagesStore((state) => state.clearRetryCount);

  useEffect(() => {
    setLastPath(pathname || "/");
  }, [pathname, setLastPath]);

  const {
    data: tips,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["system-status-tips", mode],
    queryFn: () => getSystemTips(mode),
    staleTime: 5 * 60 * 1000,
  });

  const reportMutation = useMutation({
    mutationKey: ["system-status-report", mode],
    mutationFn: async () =>
      `Route: ${pathname || "/"}${errorDigest ? `; code d'erreur : ${errorDigest}` : ""}`,
  });

  const handleRetry = () => {
    incrementRetryCount();
    if (mode === "error" && onReset) {
      onReset();
      return;
    }

    void refetch();
  };

  return (
    <Card className="w-full border-4 border-black bg-card shadow-retro-lg">
      <Card.Header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="surface"
            size="sm"
            className="border-2 border-black font-black uppercase"
          >
            {mode === "not-found" ? "Route Introuvable" : "Garde d'Exécution"}
          </Badge>
          <Badge
            variant="outline"
            size="sm"
            className="border-2 border-black bg-muted font-black uppercase"
          >
            Tentatives : {retryCount}
          </Badge>
          <Badge
            variant="outline"
            size="sm"
            className="border-2 border-black bg-muted font-black uppercase"
          >
            Chemin : {lastPath}
          </Badge>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl uppercase sm:text-3xl">
            {mode === "not-found"
              ? "Scanner de Route"
              : "Console de Récupération"}
          </h2>
          <p className="text-sm font-semibold leading-relaxed sm:text-base">
            {mode === "not-found"
              ? "Cette adresse n'est pas indexée dans la version actuelle du portfolio."
              : "Une anomalie d'exécution a été interceptée sur cette route."}
          </p>
        </div>
      </Card.Header>

      <Card.Content className="space-y-4 pt-0">
        {mode === "error" ? (
          <Alert
            status="warning"
            className="border-2 border-black bg-accent text-accent-foreground"
          >
            <Alert.Title className="font-black uppercase">
              Détails de l&apos;erreur
            </Alert.Title>
            <Alert.Description className="mt-1 text-sm font-semibold">
              {errorDigest ??
                "Aucun code d'erreur disponible dans cet environnement."}
            </Alert.Description>
          </Alert>
        ) : null}

        <div className="space-y-2 border-4 border-black bg-muted p-3 sm:p-4">
          <p className="font-pixel text-xs uppercase sm:text-sm">
            Conseils de navigation
          </p>
          {isLoading ? (
            <p className="text-sm font-semibold uppercase">
              Chargement des conseils...
            </p>
          ) : (
            <ul className="space-y-2">
              {(tips ?? []).map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 text-sm font-medium"
                >
                  <Compass className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button asChild className="w-full border-4 border-black uppercase">
            <Link href="/">
              <Home className="h-4 w-4" />
              Accueil
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="w-full border-4 border-black uppercase"
          >
            <Link href="/project">
              <Compass className="h-4 w-4" />
              Projets
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full border-4 border-black uppercase"
          >
            <Link href="/blog">
              <LifeBuoy className="h-4 w-4" />
              Blog
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-4 border-black uppercase"
            onClick={handleRetry}
          >
            <RefreshCw className="h-4 w-4" />
            {mode === "not-found" ? "Actualiser" : "Récupérer"}
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            className="border-4 border-black uppercase"
            disabled={reportMutation.isPending}
            onClick={() => {
              reportMutation.reset();
              void reportMutation.mutateAsync();
            }}
          >
            <AlertTriangle className="h-4 w-4" />
            {reportMutation.isPending
              ? "Préparation des détails..."
              : "Préparer les détails techniques"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="border-4 border-black uppercase"
            disabled={retryCount === 0}
            onClick={clearRetryCount}
          >
            Réinitialiser le compteur
          </Button>
        </div>

        {reportMutation.data ? (
          <Alert
            status="success"
            className="border-2 border-black bg-secondary text-secondary-foreground"
          >
            <Alert.Title className="font-black uppercase">
              Détails techniques locaux
            </Alert.Title>
            <Alert.Description className="mt-1 text-sm font-semibold">
              {reportMutation.data}. Aucun rapport externe n&apos;a été envoyé.
              Vous pouvez joindre ces informations lors d&apos;une issue sur
              GitHub.
            </Alert.Description>
          </Alert>
        ) : null}

        {isFetching && !isLoading ? (
          <p className="text-xs font-black uppercase text-muted-foreground">
            Mise à jour des conseils...
          </p>
        ) : null}
      </Card.Content>
    </Card>
  );
}
