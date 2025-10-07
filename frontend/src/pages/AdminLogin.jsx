import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Color theme matching the main app
const colors = {
  primary: '#4361ee',
  secondary: '#3a0ca3',
  accent: '#7209b7',
  success: '#4cc9f0',
  warning: '#f72585',
  background: '#f8f9fa',
  text: '#2b2d42',
  lightText: '#8d99ae',
  white: '#ffffff',
  cardBg: '#ffffff',
  border: '#e9ecef',
  inputBg: '#ffffff'
};

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get admin credentials from environment variables
  const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

  // ✅ Redirect if already logged in
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin === 'true') {
      navigate('/admin-dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      setError('Admin configuration error. Please contact support.');
      return;
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setLoading(true);
      // Simulate loading for better UX
      setTimeout(() => {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminEmail', email);
        navigate('/admin-dashboard');
        setLoading(false);
      }, 1000);
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: colors.white,
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: `linear-gradient(135deg, ${colors.accent}, ${colors.warning})`,
          borderRadius: '50%',
          opacity: 0.1
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '100px',
          height: '100px',
          background: `linear-gradient(135deg, ${colors.success}, ${colors.primary})`,
          borderRadius: '50%',
          opacity: 0.1
        }}></div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px', position: 'relative' }}>
          <div style={{
            width: '70px',
            height: '70px',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 10px 20px rgba(67, 97, 238, 0.3)'
          }}>
            <span style={{ 
              fontSize: '28px', 
              color: colors.white,
              fontWeight: 'bold'
            }}>
              🔐
            </span>
          </div>
          <h2 style={{ 
            color: colors.text, 
            margin: '0 0 8px 0',
            fontSize: '2em',
            fontWeight: '700'
          }}>
            Admin Access
          </h2>
          <p style={{ 
            color: colors.lightText, 
            margin: 0,
            fontSize: '1em'
          }}>
            Enter admin credentials to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: colors.text,
              marginBottom: '8px',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter admin email"
              style={{
                width: '100%',
                padding: '15px',
                background: colors.inputBg,
                border: `2px solid ${colors.border}`,
                borderRadius: '10px',
                fontSize: '16px',
                color: colors.text,
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              color: colors.text,
              marginBottom: '8px',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter admin password"
              style={{
                width: '100%',
                padding: '15px',
                background: colors.inputBg,
                border: `2px solid ${colors.border}`,
                borderRadius: '10px',
                fontSize: '16px',
                color: colors.text,
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#fff5f5',
              border: `1px solid ${colors.warning}`,
              color: colors.warning,
              padding: '12px 15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '16px' }}>⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? colors.border : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              color: colors.white,
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 20px rgba(67, 97, 238, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  display: 'inline-block',
                  width: '18px',
                  height: '18px',
                  border: '2px solid transparent',
                  borderTop: '2px solid currentColor',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '10px'
                }}></div>
                Verifying...
              </>
            ) : (
              '🔑 Access Dashboard'
            )}
          </button>
        </form>

        {/* Security Note */}
        <div style={{
          textAlign: 'center',
          marginTop: '25px',
          paddingTop: '20px',
          borderTop: `1px solid ${colors.border}`,
          color: colors.lightText,
          fontSize: '12px'
        }}>
          <p style={{ margin: 0 }}>
            ⚠️ Restricted access. Authorized personnel only.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        input::placeholder {
          color: ${colors.lightText};
          opacity: 0.7;
        }

        input:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}