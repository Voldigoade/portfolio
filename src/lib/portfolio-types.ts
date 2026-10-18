export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  description_en?: string | null;
  language: string | null;
  private?: boolean;
  fork?: boolean;
  archived?: boolean;
  stargazers_count?: number;
  forks_count?: number;
  watchers_count?: number;
  html_url: string;
  homepage: string | null;
  topics: string[];
  updated_at?: string;
}

export type WritingLocale = "fr" | "en";

export interface BlogPost {
  id: string;
  slug: string;
  locale: WritingLocale;
  title: string;
  excerpt: string;
  url: string;
  category?: string;
  series?: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  eventDate?: string;
  readingMinutes: number;
  readingTimeText: string;
  draft?: boolean;
  cover?: string;
  canonical?: string;
  frenchVersion?: string;
  translationSlug?: string;
}

export interface GitHubOverviewPayload {
  username: string;
  followers: number | null;
  following: number | null;
  publicRepos: number | null;
  totalRepositories: number;
  projects: Array<{ name: string; url: string; language: string | null }>;
  totalStars: number | null;
  totalForks: number | null;
  totalWatchers: number | null;
  topRepositories: Array<{ name: string; stars: number }>;
  languages: Array<{ language: string; repos: number }>;
  monthlyActivity: Array<{ month: string; repos: number }>;
  updateDates: string[];
  commitHistory: Array<{ date: string; commits: number }>;
}
