import React from 'react';

interface ListHeaderCompositeProps {
  title: string;
  subtitle?: string;
  className?: string;
  onAdd?: () => void;
  addLabel?: string;
}

const ListHeaderComposite: React.FC<ListHeaderCompositeProps> = ({
  title,
  subtitle,
  className = "",
  onAdd,
  addLabel
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            {addLabel || "Add"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ListHeaderComposite;