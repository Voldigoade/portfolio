import { spoorConfig } from './config';
import { SpoorError } from './types';

export async function fetchResponse(
  url: string,
  signal: AbortSignal,
  options: RequestInit = {},
  timeoutMs: number = spoorConfig.requestTimeoutMs,
): Promise<Response> {
  const deadline = AbortSignal.timeout(timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.any([signal, deadline]),
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      cache: 'no-store',
    });
    if (response.ok && !(response.status === 202 && options.method !== 'POST'))
      return response;
    const data = await response.json().catch(() => ({}));
    const code = data?.code;
    const retry = Number(
      response.headers.get('Retry-After') || data?.retry_after,
    );
    const problem =
      response.status === 429
        ? 'rateLimited'
        : code === 'invalid_target'
          ? 'invalidTarget'
          : response.status === 404
            ? 'notFound'
            : [202, 409].includes(response.status) ||
                ['in_progress', 'report_not_ready'].includes(code)
              ? 'notReady'
              : 'provider';
    throw new SpoorError(
      problem,
      retry > 0 ? retry : undefined,
      response.status >= 500,
    );
  } catch (error) {
    if (signal.aborted) throw error;
    if (error instanceof SpoorError) throw error;
    throw new SpoorError(deadline.aborted ? 'timeout' : 'network');
  }
}
