import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      role
      token
    }
  }
`;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: function(data) {
      try {
        localStorage.setItem('token', data.login.token);
        const user = {
          id: data.login.id,
          username: data.login.username,
          role: data.login.role
        };
        localStorage.setItem('user', JSON.stringify(user));
        setTimeout(function() {
          navigate('/dashboard');
        }, 100);
      } catch (err) {
        setError('Login failed: ' + err.message);
      }
    },
    onError: function(error) {
      setError(error.message);
    }
  });

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    login({ variables: { username, password } });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">TMS Login</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={function(e) { setUsername(e.target.value); }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin or employee"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={function(e) { setPassword(e.target.value); }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="password123"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Test Accounts:</p>
          <p>admin / password123</p>
          <p>employee / password123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
