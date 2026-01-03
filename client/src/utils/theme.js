import designRef from "../../designRef.json";

export const getThemeColors = (isDark = false) => {
  const theme = isDark ? designRef.colors.dark : designRef.colors.light;

  // primary can be overridden in designRef.colors.dark.primary
  const primary = isDark
    ? (designRef.colors.dark.primary ?? designRef.colors.primary?.[500])
    : (designRef.colors.primary?.[500]);

  const primaryForeground =
    (isDark ? designRef.colors.dark.primaryForeground : undefined) ?? "#ffffff";

  // brand (separate from primary)
  const brand = isDark ? designRef.colors.brand?.dark : designRef.colors.brand?.light;
  const brandForeground = "#ffffff";

  return {
    // Brand (NEW)
    brand,
    brandForeground,

    // Primary
    primary,
    primaryForeground,

    // Backgrounds
    background: theme.background.primary,
    card: theme.background.card,
    popover: theme.background.overlay,
    muted: theme.background.secondary,
    accent: theme.background.tertiary,

    // Text
    foreground: theme.text.primary,
    mutedForeground: theme.text.muted,
    accentForeground: theme.text.secondary,

    // Borders
    border: theme.border.primary,
    input: theme.border.primary,
    ring: primary,

    // Secondary + destructive
    secondary: designRef.colors.secondary?.[200],
    secondaryForeground: designRef.colors.secondary?.[700],
    destructive: designRef.colors.accent.red,
    destructiveForeground: "#ffffff",
    
    shadows: isDark
    ? designRef.shadows.dark
    : designRef.shadows.light,

    // Charts
    chart: {
      1: primary,
      2: designRef.colors.primary?.[400],
      3: designRef.colors.primary?.[600],
      4: designRef.colors.primary?.[300],
      5: designRef.colors.primary?.[700],
    },
  };
};
export const getThemeShadows = () => {
  return designRef.shadows;
};

export const getThemeRadius = () => {
  return designRef.borderRadius;
};

export const getThemeFonts = () => {
  return designRef.typography.fontFamilies;
};

export const getThemeTypography = () => {
  return designRef.typography;
};

export const getThemeSpacing = () => {
  return designRef.spacing;
};

export const getThemeComponents = () => {
  return designRef.components;
};

export const getThemeEffects = () => {
  return designRef.effects;
};

export const getThemeLayout = () => {
  return designRef.layout;
}; 