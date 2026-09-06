export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {icon && <span className="text-4xl">{icon}</span>}
      <h3 className="text-lg font-semibold">{title ?? "Nothing here yet"}</h3>
      {description && <p className="text-sm text-zinc-500">{description}</p>}
      {action && action}
    </div>
  );
}
