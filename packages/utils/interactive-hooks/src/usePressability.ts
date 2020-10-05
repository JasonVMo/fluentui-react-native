/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import { PressabilityConfig, PressabilityEventHandlers } from './Pressability/Pressability.types';
import { Pressability } from './Pressability/Pressability';
import { useEffect, useRef } from 'react';

export function usePressability(config: PressabilityConfig): PressabilityEventHandlers {
  const pressabilityRef = useRef<Pressability>(null);
  if (config != null && pressabilityRef.current == null) {
    pressabilityRef.current = new Pressability(config);
  }
  const pressability = pressabilityRef.current;

  // On the initial mount, this is a no-op. On updates, `pressability` will be
  // re-configured to use the new configuration.
  useEffect(() => {
    if (config != null && pressability != null) {
      pressability.configure(config);
    }
  }, [config, pressability]);

  // On unmount, reset pending state and timers inside `pressability`. This is
  // a separate effect because we do not want to reset when `config` changes.
  useEffect(() => {
    return pressability != null
      ? () => {
          pressability.reset();
        }
      : null;
  }, [pressability]);

  return pressability == null ? null : pressability.getEventHandlers();
}
