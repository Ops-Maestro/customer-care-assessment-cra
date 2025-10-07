import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Color theme matching the main app
const colors = {
  primary: '#4361ee',
  secondary: '#3a0ca3',
  accent: '#7209b7',
  success: '#4cc9f0',
  warning: '#f72585',
  danger: '#e63946',
  background: '#f8f9fa',
  text: '#2b2d42',
  lightText: '#8d99ae',
  white: '#ffffff',
  cardBg: '#ffffff',
  border: '#e9ecef',
  tableHeader: '#3a0ca3',
  tableStriped: '#f8f9fa'
};

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [errorUsers, setErrorUsers] = useState('');
  const [errorSubs, setErrorSubs] = useState('');
  const navigate = useNavigate();

  // ✅ Protect route: redirect if not admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      alert('Access denied. Admins only.');
      navigate('/admin-login');
    }
  }, [navigate]);

  // ✅ Fetch users and submissions using our api service
  useEffect(() => {
    api.get('/api/users')
      .then(res => {
        setUsers(res.data);
        setErrorUsers('');
      })
      .catch((error) => {
        console.error('Users fetch error:', error);
        setErrorUsers(`Failed to load users: ${error.response?.data?.error || error.message}`);
      })
      .finally(() => setLoadingUsers(false));

    api.get('/api/submissions')
      .then(res => {
        setSubmissions(res.data);
        setErrorSubs('');
      })
      .catch((error) => {
        console.error('Submissions fetch error:', error);
        setErrorSubs(`Failed to load submissions: ${error.response?.data?.error || error.message}`);
      })
      .finally(() => setLoadingSubs(false));
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    navigate('/admin-login');
  };

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.background}, ${colors.white})`,
      padding: '20px'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          padding: '30px',
          borderRadius: '20px 20px 0 0',
          color: colors.white,
          marginBottom: '0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '2.2em',
                fontWeight: '700'
              }}>
                Admin Dashboard
              </h1>
              <p style={{ 
                margin: '10px 0 0', 
                opacity: 0.9,
                fontSize: '1.1em'
              }}>
                Monitor user activity and test submissions
              </p>
            </div>
            <button 
              onClick={handleLogout}
              style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.2)',
                color: colors.white,
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🚪 Logout
            </button>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: 'flex',
            gap: '20px',
            marginTop: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              flex: '1',
              minWidth: '200px'
            }}>
              <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{users.length}</div>
              <div style={{ opacity: 0.9 }}>Total Users</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              flex: '1',
              minWidth: '200px'
            }}>
              <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{submissions.length}</div>
              <div style={{ opacity: 0.9 }}>Test Submissions</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              flex: '1',
              minWidth: '200px'
            }}>
              <div style={{ fontSize: '2em', fontWeight: 'bold' }}>
                {users.filter(u => new Date(u.lastLogin) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
              </div>
              <div style={{ opacity: 0.9 }}>Active Today</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{
          background: colors.white,
          borderRadius: '0 0 20px 20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Users Section */}
          <section style={{ padding: '40px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '25px'
            }}>
              <div style={{
                width: '4px',
                height: '30px',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                borderRadius: '2px'
              }}></div>
              <h3 style={{ 
                color: colors.text, 
                margin: 0,
                fontSize: '1.5em',
                fontWeight: '600'
              }}>
                Registered Users
              </h3>
              <span style={{
                background: colors.primary,
                color: colors.white,
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {users.length}
              </span>
            </div>

            {loadingUsers ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: colors.lightText
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: `3px solid ${colors.border}`,
                  borderTop: `3px solid ${colors.primary}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 15px'
                }}></div>
                Loading users...
              </div>
            ) : errorUsers ? (
              <div style={{
                background: '#fff5f5',
                border: `1px solid ${colors.danger}`,
                color: colors.danger,
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                ⚠️ {errorUsers}
              </div>
            ) : users.length === 0 ? (
              <div style={{
                background: colors.background,
                padding: '40px',
                borderRadius: '10px',
                textAlign: 'center',
                color: colors.lightText
              }}>
                <div style={{ fontSize: '3em', marginBottom: '10px' }}>👥</div>
                <h4 style={{ color: colors.text, margin: '0 0 10px 0' }}>No Users Found</h4>
                <p>No users have registered yet.</p>
              </div>
            ) : (
              <div style={{
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
              }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{
                      background: `linear-gradient(135deg, ${colors.tableHeader}, ${colors.secondary})`,
                      color: colors.white
                    }}>
                      <th style={{ 
                        padding: '16px 20px', 
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '15px'
                      }}>
                        Name
                      </th>
                      <th style={{ 
                        padding: '16px 20px', 
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '15px'
                      }}>
                        Email
                      </th>
                      <th style={{ 
                        padding: '16px 20px', 
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '15px'
                      }}>
                        Last Login
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, index) => (
                      <tr key={u.email} style={{
                        background: index % 2 === 0 ? colors.white : colors.tableStriped,
                        borderBottom: `1px solid ${colors.border}`,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = colors.background;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = index % 2 === 0 ? colors.white : colors.tableStriped;
                      }}>
                        <td style={{ 
                          padding: '16px 20px',
                          color: colors.text,
                          fontWeight: '500'
                        }}>
                          {u.name || (
                            <span style={{ color: colors.lightText, fontStyle: 'italic' }}>
                              Not provided
                            </span>
                          )}
                        </td>
                        <td style={{ 
                          padding: '16px 20px',
                          color: colors.text
                        }}>
                          {u.email}
                        </td>
                        <td style={{ 
                          padding: '16px 20px',
                          color: colors.lightText,
                          fontSize: '13px'
                        }}>
                          {formatDate(u.lastLogin)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Submissions Section */}
          <section style={{ 
            padding: '40px',
            borderTop: `1px solid ${colors.border}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '25px'
            }}>
              <div style={{
                width: '4px',
                height: '30px',
                background: `linear-gradient(135deg, ${colors.success}, ${colors.accent})`,
                borderRadius: '2px'
              }}></div>
              <h3 style={{ 
                color: colors.text, 
                margin: 0,
                fontSize: '1.5em',
                fontWeight: '600'
              }}>
                Test Submissions
              </h3>
              <span style={{
                background: colors.success,
                color: colors.white,
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {submissions.length}
              </span>
            </div>

            {loadingSubs ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: colors.lightText
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: `3px solid ${colors.border}`,
                  borderTop: `3px solid ${colors.success}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 15px'
                }}></div>
                Loading submissions...
              </div>
            ) : errorSubs ? (
              <div style={{
                background: '#fff5f5',
                border: `1px solid ${colors.danger}`,
                color: colors.danger,
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                ⚠️ {errorSubs}
              </div>
            ) : submissions.length === 0 ? (
              <div style={{
                background: colors.background,
                padding: '40px',
                borderRadius: '10px',
                textAlign: 'center',
                color: colors.lightText
              }}>
                <div style={{ fontSize: '3em', marginBottom: '10px' }}>📝</div>
                <h4 style={{ color: colors.text, margin: '0 0 10px 0' }}>No Submissions Yet</h4>
                <p>No test submissions have been recorded.</p>
              </div>
            ) : (
              <div style={{
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
              }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{
                      background: `linear-gradient(135deg, ${colors.success}, #38b2ac)`,
                      color: colors.white
                    }}>
                      <th style={{ 
                        padding: '16px 20px', 
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '15px'
                      }}>
                        User Email
                      </th>
                      <th style={{ 
                        padding: '16px 20px', 
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '15px'
                      }}>
                        Submission Time
                      </th>
                      <th style={{ 
                        padding: '16px 20px', 
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '15px'
                      }}>
                        Answers Summary
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub, index) => (
                      <tr key={index} style={{
                        background: index % 2 === 0 ? colors.white : colors.tableStriped,
                        borderBottom: `1px solid ${colors.border}`,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = colors.background;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = index % 2 === 0 ? colors.white : colors.tableStriped;
                      }}>
                        <td style={{ 
                          padding: '16px 20px',
                          color: colors.text,
                          fontWeight: '500'
                        }}>
                          {sub.user}
                        </td>
                        <td style={{ 
                          padding: '16px 20px',
                          color: colors.lightText,
                          fontSize: '13px'
                        }}>
                          {formatDate(sub.submittedAt)}
                        </td>
                        <td style={{ 
                          padding: '16px 20px',
                          color: colors.text
                        }}>
                          <div style={{ maxWidth: '300px' }}>
                            {Object.entries(sub.answers)
                              .slice(0, 3)
                              .map(([qId, ans]) => (
                                <div key={qId} style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  marginBottom: '4px',
                                  fontSize: '13px'
                                }}>
                                  <span style={{
                                    background: ans ? colors.success : colors.warning,
                                    color: colors.white,
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: '600'
                                  }}>
                                    Q{qId}
                                  </span>
                                  <span style={{
                                    color: ans ? colors.success : colors.warning,
                                    fontWeight: '500'
                                  }}>
                                    {ans || 'Skipped'}
                                  </span>
                                </div>
                              ))}
                            {Object.keys(sub.answers).length > 3 && (
                              <div style={{
                                color: colors.lightText,
                                fontSize: '12px',
                                fontStyle: 'italic',
                                marginTop: '5px'
                              }}>
                                +{Object.keys(sub.answers).length - 3} more answers
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}