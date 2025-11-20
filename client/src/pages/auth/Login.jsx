import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';

export default function Login() {
  const [tab, setTab] = useState('seeker');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    roleId: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const role = tab === 'seeker' ? 'jobseeker' : tab;

      const response = await authService.login(
        formData.email.trim().toLowerCase(),
        formData.password,
        role,
        formData.roleId.trim().toUpperCase()
      );

      if (response && response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));

        const redirectPath =
          response.user.role === 'jobseeker' ? '/student' : `/${response.user.role}`;
        navigate(redirectPath);
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-app section grid place-items-center">
      <div className="w-full max-w-lg card p-6 md:p-8 card-hover">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="text-gray-600 mt-1">Sign in to your account to continue</p>

        {/* Tabs */}
        <div className="mt-6 grid grid-cols-3 rounded-xl bg-gray-100 p-1 text-sm">
          {['seeker', 'employer', 'admin'].map((roleType) => (
            <button
              key={roleType}
              type="button"
              onClick={() => setTab(roleType)}
              className={`px-4 py-2 rounded-lg transition ${
                tab === roleType
                  ? 'bg-white shadow-sm font-medium'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {roleType === 'seeker'
                ? 'Job Seeker'
                : roleType.charAt(0).toUpperCase() + roleType.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="label">
              {tab === 'seeker'
                ? 'Job Seeker ID'
                : tab === 'employer'
                ? 'Employer ID'
                : 'Admin ID'}
            </label>
            <input
              className="input"
              name="roleId"
              placeholder="Enter your ID"
              required
              value={formData.roleId}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                className="input pr-10 w-full"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 my-auto h-8 px-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn w-full bg-blue-600 hover:bg-blue-500 text-white flex justify-center items-center disabled:bg-gray-400"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-gray-700">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
