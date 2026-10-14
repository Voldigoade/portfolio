import { spoorConfig } from './config';
import { HttpSpoorClient } from './HttpSpoorClient';
import { MockSpoorClient } from './demo/MockSpoorClient';
import type { DemoScene } from './demo/fixtures';
import type { SpoorClient } from './types';

export function createSpoorClient(scene?: DemoScene): SpoorClient {
  if (import.meta.env.DEV && scene) return new MockSpoorClient(scene);
  return new HttpSpoorClient(spoorConfig.basePath);
}
