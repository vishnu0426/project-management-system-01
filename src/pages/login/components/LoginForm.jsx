import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';
import { isValidEmail } from '../../../utils/validators.js';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setIsLoading(true);
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setErrors(prev => ({ ...prev, general: err?.message || 'Login failed' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto'>
      <div className='bg-card border border-border rounded-lg shadow-enterprise p-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-semibold text-text-primary mb-2'>Welcome Back</h1>
          <p className='text-text-secondary'>Sign in to your Agno WorkSphere account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* General Error */}
          {errors.general && (
            <div className='bg-destructive/10 border border-destructive/20 rounded-md p-3 flex items-start space-x-2'>
              <Icon name='AlertTriangle' className='w-5 h-5 text-destructive mt-0.5' />
              <p className='text-sm text-destructive'>{errors.general}</p>
            </div>
          )}

          {/* Email Field */}
          <div>
            <Input
              label='Email'
              name='email'
              type='email'
              placeholder='Enter your email address'
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div>
            <div className='relative'>
              <Input
                label='Password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                required
                disabled={isLoading}
              />
              <button
                type='button'
                className='absolute right-3 top-9 text-sm text-text-secondary hover:text-text-primary transition-micro'
                onClick={() => setShowPassword(s => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Remember / Forgot */}
          <div className='flex items-center justify-between'>
            <label className='inline-flex items-center space-x-2'>
              <input type='checkbox' className='accent-primary' disabled={isLoading} />
              <span className='text-sm text-text-secondary'>Remember me</span>
            </label>
            <button type='button' className='text-sm text-primary hover:text-primary/80 transition-micro' disabled={isLoading}>
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <Button type='submit' className='w-full' loading={isLoading}>
            Sign In
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className='text-center mt-4'>
        <p className='text-sm text-text-secondary'>
          Don&apos;t have an account?{' '}
          <button className='text-primary hover:text-primary/80' type='button' onClick={() => navigate('/register')}>
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
