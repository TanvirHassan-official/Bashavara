import StatusBadge from "./StatusBadge";

export default function RequestRow({ request }) {
  return (
    <tr>
      <td>{request?.listingTitle ?? "—"}</td>
      <td>{request?.requesterName ?? "—"}</td>
      <td>
        <StatusBadge status={request?.status} />
      </td>
      <td>{/* TODO: actions */}</td>
    </tr>
  );
}
