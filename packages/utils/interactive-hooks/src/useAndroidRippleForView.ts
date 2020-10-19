/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

/**
 * Note that this code is temporarily adapted to run in here until we can be on 0.63 officially. This will then be routed to the official representation
 */

'use strict';

import invariant from 'invariant';
import { Platform, View, processColor, NativeModules, findNodeHandle } from 'react-native';
import * as React from 'react';
import { PressEvent } from './Pressability/CoreEventTypes';

type NativeBackgroundProp = {
  type: 'RippleAndroid';
  color?: number;
  borderless: boolean;
  rippleRadius?: number;
};

export type RippleConfig = {
  color?: string;
  borderless?: boolean;
  radius?: number;
};

let viewCommands: any = undefined;

function getCommands(): any {
  viewCommands = viewCommands || NativeModules.UIManager.getViewManagerConfig('RCTView');
  return viewCommands;
}

function setPressed(target: React.ElementRef<typeof View>, pressed?: boolean): void {
  NativeModules.UIManager.dispatchViewManagerCommand(findNodeHandle(target), getCommands().setPressed, pressed);
}

function hotspotUpdate(target: React.ElementRef<typeof View>, X: number, Y: number): void {
  NativeModules.UIManager.dispatchViewManagerCommand(findNodeHandle(target), getCommands().hotspotUpdate, X, Y);
}

/**
 * Provides the event handlers and props for configuring the ripple effect on
 * supported versions of Android.
 */
export default function useAndroidRippleForView(
  rippleConfig: RippleConfig,
  viewRef: { current: null | React.ElementRef<typeof View> },
): {
  onPressIn: (event: PressEvent) => void;
  onPressMove: (event: PressEvent) => void;
  onPressOut: (event: PressEvent) => void;
  viewProps: {
    nativeBackgroundAndroid: NativeBackgroundProp;
  };
} {
  const { color, borderless, radius } = rippleConfig ?? {};

  return React.useMemo(() => {
    if (Platform.OS === 'android' && Platform.Version >= 21 && (color != null || borderless != null || radius != null)) {
      const processedColor = processColor(color);
      invariant(processedColor == null || typeof processedColor === 'number', 'Unexpected color given for Ripple color');

      return {
        viewProps: {
          // Consider supporting `nativeForegroundAndroid`
          nativeBackgroundAndroid: {
            type: 'RippleAndroid',
            color: processedColor,
            borderless: borderless === true,
            rippleRadius: radius,
          },
        },
        onPressIn(event: PressEvent): void {
          const view = viewRef.current;
          if (view != null) {
            setPressed(view, true);
            hotspotUpdate(view, event.nativeEvent.locationX ?? 0, event.nativeEvent.locationY ?? 0);
          }
        },
        onPressMove(event: PressEvent): void {
          const view = viewRef.current;
          if (view != null) {
            hotspotUpdate(view, event.nativeEvent.locationX ?? 0, event.nativeEvent.locationY ?? 0);
          }
        },
        onPressOut(/* event: PressEvent */): void {
          const view = viewRef.current;
          if (view != null) {
            setPressed(view, false);
          }
        },
      };
    }
    return null;
  }, [color, borderless, radius, viewRef]);
}
