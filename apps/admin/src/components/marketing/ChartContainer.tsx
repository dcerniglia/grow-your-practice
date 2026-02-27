import { Tooltip } from './Tooltip';

type Props = {
  title: string;
  children?: React.ReactNode;
  className?: string;
  unavailable?: boolean;
  tooltip?: string;
};

export function ChartContainer({ title, children, className = '', unavailable, tooltip }: Props) {
  return (
    <div className={`rounded-card border border-border bg-surface p-5 ${className}`}>
      <h3 className="mb-4 text-sm font-semibold text-text">
        {title}
        {tooltip && <Tooltip content={tooltip} />}
      </h3>
      {unavailable ? (
        <div className="flex h-48 items-center justify-center text-sm text-text-muted">
          Not connected — add API keys to enable
        </div>
      ) : (
        children
      )}
    </div>
  );
}
