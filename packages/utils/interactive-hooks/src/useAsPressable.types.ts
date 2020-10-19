import { ViewProps } from 'react-native';
import { BlurEvent, LayoutEvent, PressEvent } from './Pressability/CoreEventTypes';
import { RectOrSize } from './Pressability/InternalTypes';
import { PressabilityConfig, PressabilityEventHandlers } from './Pressability/Pressability.types';
import { RippleConfig } from './useAndroidRippleForView';

export type IPressState = {
  pressed?: boolean;
};

export type IFocusState = {
  focused?: boolean;
};

export type IHoverState = {
  hovered?: boolean;
};

export type IPressableState = IPressState & IFocusState & IHoverState;

export type IPressableOptions = PressabilityConfig & {
  onStateChange?: (state: IPressableState) => void;
};

export type IWithPressableOptions<T extends object> = T & IPressableOptions;

export type IWithPressableEvents<T extends object> = T & PressabilityEventHandlers;

export type IPressableHooks<T extends object> = {
  props: IWithPressableEvents<T>;
  state: IPressableState;
};

/** Adapted from the props in the 0.63 pressable component */
export interface UsePressableProps extends ViewProps {
  focusable?: boolean;

  /**
   * Duration (in milliseconds) from `onPressIn` before `onLongPress` is called.
   */
  delayLongPress?: number;

  /**
   * Whether the press behavior is disabled.
   */
  disabled?: boolean;

  /**
   * Additional distance outside of this view in which a touch is considered a
   * press before `onPressOut` is triggered.
   */
  pressRetentionOffset?: RectOrSize;

  /**
   * Called when a long-tap gesture is detected.
   */
  onLongPress?: (event: PressEvent) => void;

  /**
   * Called when a single tap gesture is detected.
   */
  onPress?: (event: PressEvent) => void;

  /**
   * Called when a touch is engaged before `onPress`.
   */
  onPressIn?: (event: PressEvent) => void;

  /**
   * Called when a touch is released before `onPress`.
   */
  onPressOut?: (event: PressEvent) => void;

  /**
   * Called after the element loses focus.
   */
  onBlur?: (event: BlurEvent) => any;

  /**
   * Called after the element is focused.
   */
  onFocus?: (event: FocusEvent) => any;

  /**
   * Called when the hover is activated to provide visual feedback.
   */
  onHoverIn?: (event: MouseEvent) => any;

  /**
   * Called when the hover is deactivated to undo visual feedback.
   */
  onHoverOut?: (event: MouseEvent) => any;

  /**
   * If true, doesn't play system sound on touch.
   */
  android_disableSound?: boolean;

  /**
   * Enables the Android ripple effect and configures its color.
   */
  android_ripple?: RippleConfig;

  /**
   * Used only for documentation or testing (e.g. snapshot testing).
   */
  testOnly_pressed?: boolean;

  /**
   * Duration to wait after press down before calling `onPressIn`.
   */
  unstable_pressDelay?: number;
}
