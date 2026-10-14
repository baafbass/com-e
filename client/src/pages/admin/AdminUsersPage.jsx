import toast from 'react-hot-toast';
import { adminApi } from '../../api';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { getErrorMessage } from '../../utils/errors';
import { formatDate } from '../../utils/format';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { data: users, isLoading, error, reload, setData } = useAsync(() => adminApi.listUsers(), []);

  const changeRole = async (user, role) => {
    try {
      const updated = await adminApi.updateUserRole(user.id, role);
      setData((current) => current.map((item) => (item.id === user.id ? { ...item, role: updated.role } : item)));
      toast.success(`${user.name} is now ${role === 'admin' ? 'an admin' : 'a customer'}`);
    } catch (roleError) {
      toast.error(getErrorMessage(roleError));
    }
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">{users?.length ?? 0} registered users</p>
        </div>
      </header>

      <div className="card">
        {isLoading && <Spinner />}
        {error && <ErrorMessage message={error} onRetry={reload} />}
        {users && (
          <div className="table-wrapper">
            <table className="table" id="admin-users-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Joined</th>
                  <th scope="col">Orders</th>
                  <th scope="col">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = user.id === currentUser.id;
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="table__product">
                          <span className="avatar avatar--sm" aria-hidden="true">
                            {user.name[0]}
                          </span>
                          <strong>{user.name}</strong>
                          {isSelf && <span className="badge badge--processing">You</span>}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>{user.orderCount}</td>
                      <td>
                        <label htmlFor={`user-role-${user.id}`} className="visually-hidden">
                          Role of {user.name}
                        </label>
                        <select
                          id={`user-role-${user.id}`}
                          name="role"
                          className="input select"
                          value={user.role}
                          disabled={isSelf}
                          title={isSelf ? 'You cannot change your own role' : undefined}
                          onChange={(event) => changeRole(user, event.target.value)}
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
