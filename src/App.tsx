import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { createRoot } from 'react-dom/client';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { ApolloProvider, useMutation, useQuery } from '@apollo/client/react';
import { HttpLink } from '@apollo/client/link/http';
import { useState, useEffect } from 'react';

// GraphQL Client
const httpLink = new HttpLink({
  uri: 'http://localhost:3333/api/graphql',
  credentials: 'include', // Include cookies in requests
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

type MeQuery = {
  me: {
    id: string;
  };
};

type MeQueryVariables = {};

type LoginMutation = {
  login: {
    id: string;
  };
};

type LoginMutationVariables = {
  privyToken: string;
};

type LogoutMutation = {
  logout: boolean;
};

type LogoutMutationVariables = {};

// GraphQL Mutations and Queries
const LOGIN_MUTATION = gql`
  mutation Login($privyToken: String!) {
    login(privyToken: $privyToken) {
      id
      displayName
      username
      profilePictureUrl
      bio
      createdAt
      updatedAt
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

const ME_QUERY = gql`
  query Me {
    me {
      id
      displayName
      username
      profilePictureUrl
      bio
      createdAt
      updatedAt
    }
  }
`;

function App() {
  return (
    <ApolloProvider client={client}>
      <PrivyProvider
        appId={
          process.env.BUN_PUBLIC_PRIVY_APP_ID || 'cmhou2nji01ysk10cgn4q7ztx'
        }
        config={{
          loginMethods: ['email', 'wallet'],
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
          },
        }}
      >
        <AuthComponent />
      </PrivyProvider>
    </ApolloProvider>
  );
}

function AuthComponent() {
  const {
    login,
    logout,
    authenticated,
    user: privyUser,
    ready,
    getAccessToken,
  } = usePrivy();

  const [backendUser, setBackendUser] = useState<any>(null);
  const [loginMutation, { loading: loginLoading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION);
  const [logoutMutation] = useMutation<LogoutMutation, LogoutMutationVariables>(
    LOGOUT_MUTATION
  );
  const { data: meData } = useQuery<MeQuery, MeQueryVariables>(ME_QUERY, {
    skip: !backendUser,
  });

  // When Privy authenticates, call backend login mutation
  useEffect(() => {
    async function handleBackendLogin() {
      if (authenticated && !backendUser) {
        try {
          const accessToken = await getAccessToken();
          if (accessToken) {
            const result = await loginMutation({
              variables: { privyToken: accessToken },
            });

            console.log('result', result);

            if (result.data?.login) {
              setBackendUser(result.data.login);
              console.log('✅ Backend login successful:', result.data.login);
            }
          }
        } catch (error) {
          console.error('❌ Backend login failed:', error);
        }
      }
    }

    handleBackendLogin();
  }, [authenticated, backendUser, getAccessToken, loginMutation]);

  if (!ready) {
    return (
      <div
        style={{
          padding: '40px',
          maxWidth: '800px',
          margin: '0 auto',
          fontFamily: 'system-ui',
          textAlign: 'center',
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'system-ui',
      }}
    >
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>
          🚀 SuperColony Authentication
        </h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>Bun + Privy</p>
      </div>

      {!authenticated ? (
        <div>
          <p style={{ marginBottom: '16px' }}>Sign in to continue</p>
          <button
            onClick={login}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#676FFF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </div>
      ) : (
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>
            Welcome! 🎉
          </h2>

          {loginLoading && (
            <div style={{ marginBottom: '16px', color: '#666' }}>
              Connecting to backend...
            </div>
          )}

          {backendUser && (
            <div
              style={{
                backgroundColor: '#f8f9fa',
                padding: '24px',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '1px solid #e9ecef',
              }}
            >
              <h3
                style={{ marginTop: 0, fontSize: '18px', marginBottom: '16px' }}
              >
                📊 Backend User Profile
              </h3>
              <div style={{ marginBottom: '12px' }}>
                <strong>User ID:</strong> {backendUser.id}
              </div>
              {backendUser.email && (
                <div style={{ marginBottom: '12px' }}>
                  <strong>Email:</strong> {backendUser.email}
                </div>
              )}
              {backendUser.displayName && (
                <div style={{ marginBottom: '12px' }}>
                  <strong>Display Name:</strong> {backendUser.displayName}
                </div>
              )}
              {backendUser.username && (
                <div style={{ marginBottom: '12px' }}>
                  <strong>Username:</strong> {backendUser.username}
                </div>
              )}
              {backendUser.bio && (
                <div style={{ marginBottom: '12px' }}>
                  <strong>Bio:</strong> {backendUser.bio}
                </div>
              )}
              <div style={{ marginBottom: '12px' }}>
                <strong>Created:</strong>{' '}
                {new Date(backendUser.createdAt).toLocaleString()}
              </div>
            </div>
          )}

          {privyUser && (
            <div
              style={{
                backgroundColor: '#fff3e0',
                padding: '24px',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '1px solid #ffe0b2',
              }}
            >
              <h3
                style={{ marginTop: 0, fontSize: '18px', marginBottom: '16px' }}
              >
                🔐 Privy Account Info
              </h3>
              <div style={{ marginBottom: '12px' }}>
                <strong>Privy ID:</strong> {privyUser.id}
              </div>
              {privyUser.wallet && (
                <div style={{ marginBottom: '12px' }}>
                  <strong>Wallet:</strong>{' '}
                  {privyUser.wallet.address.slice(0, 6)}...
                  {privyUser.wallet.address.slice(-4)} (
                  {privyUser.wallet.chainType || 'ethereum'})
                </div>
              )}
              {privyUser.email && (
                <div style={{ marginBottom: '12px' }}>
                  <strong>Email:</strong> {privyUser.email.address}
                </div>
              )}
              {privyUser.linkedAccounts &&
                privyUser.linkedAccounts.length > 0 && (
                  <div>
                    <strong>Linked Accounts:</strong>
                    <ul style={{ marginTop: '8px', marginBottom: 0 }}>
                      {privyUser.linkedAccounts.map(
                        (account: any, idx: number) => (
                          <li key={idx}>
                            {account.type}:{' '}
                            {account.email?.address ||
                              account.address ||
                              account.username ||
                              'N/A'}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>
          )}

          <button
            onClick={async () => {
              try {
                // Call backend logout mutation first
                await logout();
                // Then logout from Privy
                console.log('✅ Privy logout successful');
                const result = await logoutMutation();
                console.log(
                  '✅ Backend logout successful:',
                  result.data?.logout
                );

                // Clear local state
                setBackendUser(null);
              } catch (error) {
                console.error('❌ Logout failed:', error);
              }
            }}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

// Mount the app to the DOM
const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<App />);
}

export default App;
