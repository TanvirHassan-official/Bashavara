export default function RoommateCard({ profile }) {
  // TODO: avatar, budget, sleep schedule, compatibility score
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title">{profile?.name ?? "Roommate"}</h2>
        <p className="text-sm text-zinc-500">{profile?.department ?? "Department"}</p>
      </div>
    </div>
  );
}
