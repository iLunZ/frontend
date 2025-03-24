import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getCookie } from 'cookies-next';

const isDevelopment = process.env.NODE_ENV === 'development';

const httpLink = createHttpLink({
  uri: isDevelopment 
    ? 'http://localhost:4000/graphql'
    : '/api/graphql',
});
const authLink = setContext((_, { headers }) => {
  const token = getCookie('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
