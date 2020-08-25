import { ViewProps } from 'react-native';
import { IBorderTokens, FontTokens } from '@fluentui-react-native/tokens';

/**
 * Note that this component is designed to be as similar as possible to the components that are part of the react-flex package from fluentui
 */

/**
 * Defines a type made by the union of the different values that the align-items and justify-content flexbox
 * properties can take.
 */
export type Alignment = 'auto' | 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'baseline' | 'stretch';

/**
 * This is the set of tokens which are available for usage directly in props
 */
export interface FlexTokenProps {
  /**
   * Defines if container should be rendered as an inline block element or as a regular block element.
   */
  inline?: boolean;
  /**
   * Sets vertical flow direction.
   */
  column?: boolean;
  /**
   * Defines whether the content inside of `Flex` wraps when trying to extend beyond its boundaries.
   */
  wrap?: boolean;
  /**
   * Defines how to align the children horizontally (along the x-axis).
   */
  horizontalAlign?: Alignment;
  /**
   * Defines how to align the children vertically (along the y-axis).
   */
  verticalAlign?: Alignment;
  /**
   * Defines whether to render the children in the opposite direction.
   */
  reverse?: boolean;
  /**
   * Defines whether the children should not shrink to fit the available space.
   */
  disableShrink?: boolean;
  /**
   * Defines whether the container should take up 100% of the height of its parent.
   */
  fluid?: boolean;
  /**
   * Defines the padding to be applied to the Flex contents relative to its border.
   */
  padding?: string;
  /**
   * Defines the spacing between the children.
   */
  gap?: string;
}

/**
 * Flex props add a subset of tokens to the base ViewProps
 */
export type FlexProps = FlexTokenProps & ViewProps;

/**
 * Customizeable token values for the Flex component
 */
export interface FlexTokens extends FlexTokenProps, FontTokens, IBorderTokens {
  /**
   * background color for the flex component
   */
  backgroundColor?: string;
}

/**
 * Flex slot props
 */
export interface FlexSlotProps {
  root: ViewProps;
  inner: ViewProps;
}

export interface FlexType {
  props: FlexProps;
  tokens: FlexTokens;
  slotProps: FlexSlotProps;
}
