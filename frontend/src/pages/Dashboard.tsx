import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.full_name}!</p>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Logout</button>
      <hr />
      <p>No contracts yet. Upload feature coming soon.</p>
    </div>
  );
}