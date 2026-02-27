type Props = {
  name: string;
  connected: boolean;
};

export function ServiceStatusBadge({ name, connected }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        connected
          ? 'bg-green-50 text-green-700'
          : 'bg-gray-100 text-text-muted'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-400'}`}
      />
      {name}
    </span>
  );
}
