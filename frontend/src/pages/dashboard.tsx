import { useAtom } from "jotai";
import { userAtom } from "../store/authStore";

export default function Dashboard() {
  const [user] = useAtom(userAtom);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-slate-600">
            This is your dashboard. Start searching for your favorite content!
          </p>
        </div>
      </div>
    </div>
  );
}
