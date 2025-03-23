import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';
import { useMutation, useQuery, gql } from '@apollo/client';
import { User, AuthContextType, AuthResponse } from '../types/auth';

// GraphQL mutations
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      name
      email
    }
  }
`;

// Create context
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = getCookie('token');

  // Login mutation
  const [loginMutation] = useMutation<{ login: AuthResponse }>(LOGIN_MUTATION);
  
  // Register mutation
  const [registerMutation] = useMutation<{ register: AuthResponse }>(REGISTER_MUTATION);

  // Use useQuery for fetching current user
  const { loading: userLoading } = useQuery(GET_CURRENT_USER, {
    skip: !token || !!user?.id, // Skip the query if there's no token
    context: {
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data && data.getCurrentUser) {
        if(!data.getCurrentUser.id) {
          deleteCookie('token');
          setUser(null);
        }
        setUser(data.getCurrentUser);
      }
      setLoading(false);
    },
    onError: (error) => {
      console.error('Failed to fetch user data:', error);
      deleteCookie('token');
      setUser(null);
      setLoading(false);
    }
  });

  // Update loading state based on userLoading
  useEffect(() => {
    if (!token || !userLoading) {
      setLoading(false);
    }
  }, [token, userLoading]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });
      
      if (!data?.login) {
        return { success: false, message: 'Login failed' };
      }
      
      const { token, user } = data.login;     
      setCookie('token', token);
      setUser(user);     
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      const { data } = await registerMutation({
        variables: { name, email, password },
      });
      
      if (!data?.register) {
        return { success: false, message: 'Registration failed' };
      }
      
      const { token, user } = data.register;
      
      setCookie('token', token);     
      setUser(user);     
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    deleteCookie('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user || !!token,
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
