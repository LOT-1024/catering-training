import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
  const selectClasses = "w-full bg-secondary border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div>
      {label && (
        <label className="text-sm font-medium text-foreground block mb-2">
          {label}
        </label>
      )}
      <select className={`${selectClasses} ${className}`} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-card">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};