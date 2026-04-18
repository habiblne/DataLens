type ErrorAlertProps = {
  message: string | null;
};

export default function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100 shadow-soft backdrop-blur">
      <div className="font-semibold text-red-100">Something needs attention</div>
      <div className="mt-1 text-red-200">{message}</div>
    </div>
  );
}
