export type Web3FormsSubmissionValues = {
  name: string;
  email: string;
  country: string;
  phone?: string;
  businessInquiry: string;
  projectDetails: string;
  expectedStartDate?: string;
  expectedEndDate?: string;
};

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
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

export type WritingType =
  | "Article"
  | "Write-up"
  | "Research"
  | "Note"
  | "Project Log";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  url: string;
  type: WritingType;
  source?: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  draft?: boolean;
  cover?: string;
  canonical?: string;
}

export interface HackatimePayload {
  totalHours: string | null;
  last7DaysTotalHours: string;
  dailyAverage: string;
  dailyAverageHours: number;
  todayHours: string;
  todaySeconds: number;
  activeDaysLast7: number;
  topLanguages: Array<{ name: string; hours: number }>;
  last7Days: Array<{ day: string; hours: number }>;
  hasActivity: boolean;
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
