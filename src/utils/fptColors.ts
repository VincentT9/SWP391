// FPT Brand Colors - Centralized color constants
export const FPT_COLORS = {
  // Primary Brand Colors
  primary: {
    main: '#2980b9',      // FPT Blue - Main brand color
    light: '#5dade2',     // Light variant
    dark: '#1b4f72',      // Dark variant
    contrast: '#ffffff',  // Text color on primary background
  },
  
  secondary: {
    main: '#f19936',      // FPT Orange - Secondary brand color
    light: '#f4b350',     // Light variant
    dark: '#d68910',      // Dark variant
    contrast: '#ffffff',  // Text color on secondary background
  },
  
  accent: {
    main: '#2ecc71',      // FPT Green - Success/accent color
    light: '#58d68d',     // Light variant
    dark: '#27ae60',      // Dark variant
    contrast: '#ffffff',  // Text color on accent background
  },
  
  // Semantic Colors
  success: '#2ecc71',     // FPT Green
  warning: '#f39c12',     // FPT Orange variant
  error: '#e74c3c',       // FPT Red
  info: '#2980b9',        // FPT Blue
  
  // Neutral Colors
  text: {
    primary: '#2c3e50',   // Dark text
    secondary: '#7f8c8d', // Secondary text
    disabled: '#bdc3c7',  // Disabled text
  },
  
  background: {
    default: '#f8f9fa',   // Clean light background
    paper: '#ffffff',     // Card/paper backgrounds
    disabled: '#ecf0f1',  // Disabled backgrounds
  },
  
  border: {
    main: '#ecf0f1',      // Default border
    light: 'rgba(41, 128, 185, 0.08)', // Light border with FPT blue tint
    focus: '#2980b9',     // Focus border
  },
  
  // Alpha variants for consistent blue theme
  alpha: {
    primary: 'rgba(41, 128, 185, 0.05)',      // Very light blue background
    primaryMedium: 'rgba(41, 128, 185, 0.08)', // Light blue background  
    primaryStrong: 'rgba(41, 128, 185, 0.12)', // Medium blue background
    primaryBold: 'rgba(41, 128, 185, 0.15)',   // Strong blue background
    secondary: 'rgba(241, 153, 54, 0.1)',      // Orange accent (rarely used)
    success: 'rgba(46, 204, 113, 0.1)',        // Green accent (rarely used)
    error: 'rgba(231, 76, 60, 0.1)',           // Red accent (rarely used)
    warning: 'rgba(243, 156, 18, 0.1)',        // Warning accent (rarely used)
  }
};

// Helper function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

// Gradient helpers
export const FPT_GRADIENTS = {
  primary: `linear-gradient(135deg, ${FPT_COLORS.primary.main} 0%, ${FPT_COLORS.primary.dark} 100%)`,
  secondary: `linear-gradient(135deg, ${FPT_COLORS.secondary.main} 0%, ${FPT_COLORS.secondary.dark} 100%)`,
  accent: `linear-gradient(135deg, ${FPT_COLORS.accent.main} 0%, ${FPT_COLORS.accent.dark} 100%)`,
};

export default FPT_COLORS;
