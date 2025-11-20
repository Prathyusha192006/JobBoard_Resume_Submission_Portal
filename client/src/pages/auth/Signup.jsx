import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';

export default function Signup() {
  const [tab, setTab] = useState('seeker');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleId: '',
    password: '',
    confirmPassword: ''
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const role = tab === 'seeker' ? 'jobseeker' : tab;

      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        roleId: formData.roleId
      });

      if (response && response.token && response.user) {
        const redirectPath = response.user.role === 'jobseeker' ? '/student' : `/${response.user.role}`;
        navigate(redirectPath);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-app section grid place-items-center">
      <div className="w-full max-w-lg card p-6 md:p-8 card-hover">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Create your account</h1>
        <p className="text-gray-600 mt-1">Start your journey to finding the perfect job</p>

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
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input
            className="input"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            className="input"
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            className="input"
            name="roleId"
            placeholder={
              tab === 'seeker'
                ? 'e.g., JSK123'
                : tab === 'employer'
                ? 'e.g., EMP123'
                : 'e.g., ADM123'
            }
            required
            value={formData.roleId}
            onChange={handleInputChange}
          />

          <div className="relative">
            <input
              className="input pr-10 w-full"
              type={showPwd ? 'text' : 'password'}
              name="password"
              placeholder="Create a strong password"
              required
              minLength="6"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={() => setShowPwd(s => !s)}
              className="absolute inset-y-0 right-2 my-auto h-8 px-2 text-gray-500 hover:text-gray-700"
            >
              {showPwd ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="relative">
            <input
              className="input pr-10 w-full"
              type={showPwd2 ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Re-enter password"
              required
              minLength="6"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={() => setShowPwd2(s => !s)}
              className="absolute inset-y-0 right-2 my-auto h-8 px-2 text-gray-500 hover:text-gray-700"
            >
              {showPwd2 ? '🙈' : '👁️'}
            </button>
          </div>

          <button
            type="submit"
            className="btn w-full bg-blue-600 hover:bg-blue-500 text-white flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-700">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
