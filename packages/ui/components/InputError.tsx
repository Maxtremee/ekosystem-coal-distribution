export default function InputError({
  error,
  className,
}: {
  error?: string;
  className?: string;
}) {
  return error ? (
    <p className={`text-red-600 dark:text-red-500 ${className}`}>{error}</p>
  ) : null;
}
