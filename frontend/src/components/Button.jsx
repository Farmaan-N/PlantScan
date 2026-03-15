import { motion } from 'framer-motion';

/**
 * Button Component
 * Reusable premium button with variants: primary, secondary, danger
 */
function Button({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  fullWidth = false,
  noShimmer = false,
}) {
  const classes = {
    primary: `btn-premium ${noShimmer ? '' : 'shimmer'}`,
    secondary: `btn-premium-outline ${noShimmer ? '' : 'shimmer'}`,
    danger: `bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 rounded-full px-6 py-3 font-semibold transition-all duration-300 ${noShimmer ? '' : 'shimmer'}`,
  };

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${classes[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}

export default Button;
