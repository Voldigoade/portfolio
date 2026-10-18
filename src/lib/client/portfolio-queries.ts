"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  BlogPost,
  GitHubOverviewPayload,
  GithubRepo,
  HackatimePayload,
  Web3FormsSubmissionValues,
} from "@/lib/portfolio-types";
import { submitContactAction } from "@/lib/server/contact-actions";

export type { Web3FormsSubmissionValues };

const TWELVE_HOURS_MS = 1000 * 60 * 60 * 12;

async function submitContactForm(values: Web3FormsSubmissionValues) {
  const result = await submitContactAction(values);
  if (!result.success) throw new Error(result.message);
  return result;
}

export function usePortfolioReposQuery(initialData?: GithubRepo[]) {
  return useQuery({
    queryKey: ["portfolio", "repos"],
    queryFn: async (): Promise<GithubRepo[]> => {
      const res = await fetch("/api/portfolio/repos");
      if (!res.ok) throw new Error("Failed to fetch repos");
      return res.json() as Promise<GithubRepo[]>;
    },
    staleTime: TWELVE_HOURS_MS,
    refetchOnMount: false,
    refetchOnReconnect: false,
    initialData,
  });
}

export function usePortfolioPostsQuery(initialData?: BlogPost[]) {
  return useQuery({
    queryKey: ["portfolio", "posts"],
    queryFn: async (): Promise<BlogPost[]> => {
      const res = await fetch("/api/portfolio/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json() as Promise<BlogPost[]>;
    },
    staleTime: TWELVE_HOURS_MS,
    refetchOnMount: false,
    refetchOnReconnect: false,
    initialData,
  });
}

export function usePortfolioHackatimeQuery(
  initialData?: HackatimePayload | null,
) {
  return useQuery({
    queryKey: ["portfolio", "hackatime"],
    queryFn: async (): Promise<HackatimePayload | null> => {
      const res = await fetch("/api/portfolio/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json() as Promise<HackatimePayload | null>;
    },
    staleTime: TWELVE_HOURS_MS,
    refetchOnMount: false,
    refetchOnReconnect: false,
    initialData,
  });
}

export function usePortfolioGitHubOverviewQuery(
  initialData?: GitHubOverviewPayload | null,
) {
  return useQuery({
    queryKey: ["portfolio", "github-overview"],
    queryFn: async (): Promise<GitHubOverviewPayload | null> => {
      const res = await fetch("/api/portfolio/github-overview");
      if (!res.ok) throw new Error("Failed to fetch github overview");
      return res.json() as Promise<GitHubOverviewPayload | null>;
    },
    staleTime: TWELVE_HOURS_MS,
    refetchOnMount: false,
    refetchOnReconnect: false,
    initialData,
  });
}

export function useContactSubmissionMutation() {
  return useMutation({
    mutationKey: ["portfolio", "contact-submit"],
    mutationFn: submitContactForm,
  });
}
