const STATUS_STYLES = {
  pending: "badge-warning",
  accepted: "badge-success",
  declined: "badge-error",
};

export default function StatusBadge({ status = "pending" }) {
  return (
    <span className={`badge ${STATUS_STYLES[status] ?? "badge-ghost"}`}>
      {status}
    </span>
  );
}
