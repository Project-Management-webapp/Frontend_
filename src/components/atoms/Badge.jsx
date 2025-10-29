import React from "react";

/**
 * A generic, reusable badge component.
 *
 * @param {object} props
 * @param {string} props.value - The value to look up (e.g., "open", "high").
 * @param {object} props.configMap - The object mapping values to styles.
 * @param {string} props.defaultKey - The key in configMap to use as a fallback.
 * @param {string} [props.className=""] - Optional additional CSS classes (e.g., "text-sm").
 */
const Badge = ({ value, configMap, defaultKey, className = "" }) => {
    const config = configMap[value?.toLowerCase()] ?? configMap[defaultKey];
    const classes = `
    inline-block px-3 py-1 rounded-full font-medium
    ${config.bg}
    ${config.text}
    ${className}
  `;

    return (
        <span className={classes.replace(/\s+/g, ' ').trim()}>
            {config.label}
        </span>
    );
};

export default Badge;