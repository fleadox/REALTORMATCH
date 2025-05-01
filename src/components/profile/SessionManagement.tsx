import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Session } from '../../types/user';
import { toast } from 'react-hot-toast';

const SessionManagement: React.FC = () => {
  const { getSessions, revokeSession } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast.error('Failed to load active sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async (sessionId: string, isCurrent: boolean) => {
    if (isCurrent && !window.confirm('Are you sure you want to end your current session? You will be logged out.')) {
      return;
    }

    if (!isCurrent && !window.confirm('Are you sure you want to end this session?')) {
      return;
    }

    try {
      setIsLoading(true);
      const success = await revokeSession(sessionId);
      
      if (success) {
        if (isCurrent) {
          // Redirect to login page if current session is revoked
          window.location.href = '/auth/login';
        } else {
          await loadSessions();
          toast.success('Session revoked successfully');
        }
      }
    } catch (error) {
      console.error('Failed to revoke session:', error);
      toast.error('Failed to revoke session');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return '📱';
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return '📱';
    }
    return '💻';
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Active Sessions</h2>
        <button
          onClick={loadSessions}
          disabled={isLoading}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No active sessions found
        </p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between p-4 border rounded-lg ${
                session.is_current ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl" role="img" aria-label="device">
                  {getDeviceIcon(session.user_agent)}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {session.user_agent}
                    </h3>
                    {session.is_current && (
                      <span className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full">
                        Current Session
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    IP: {session.ip_address}
                  </p>
                  <p className="text-sm text-gray-500">
                    Last active: {formatDate(session.last_active_at)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Started: {formatDate(session.created_at)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRevoke(session.id, session.is_current)}
                disabled={isLoading}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                End Session
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Security Tips</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Review your active sessions regularly</li>
          <li>• End sessions you don't recognize</li>
          <li>• Use strong, unique passwords</li>
          <li>• Enable two-factor authentication if available</li>
        </ul>
      </div>
    </div>
  );
};

export default SessionManagement; 