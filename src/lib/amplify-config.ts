import { Amplify } from 'aws-amplify';
import { ResourcesConfig } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';

let isConfigured = false;

export const configureAmplify = async () => {
  if (isConfigured || typeof window === 'undefined') {
    return;
  }

  const config: ResourcesConfig = {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID as string,
        userPoolClientId: process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID as string,
        signUpVerificationMethod: 'link',
      }
    },
    API: {
      REST: {
        'api': {
          endpoint: process.env.NEXT_PUBLIC_AWS_API_GATEWAY_URL as string,
          region: process.env.NEXT_PUBLIC_AWS_REGION as string
        }
        
      },
    },
  };


  try {
    await Amplify.configure(config, {
      API: {
        REST: {
          headers: async () => {
            const session = await fetchAuthSession();
            return {Authorization: `${session.tokens?.idToken?.toString()}`};
          },  
        }
      }
    });
    isConfigured = true;
    console.log('Amplify configured successfully');
  } catch (error) {
    console.error('Error configuring Amplify:', error);
    throw error;
  }
}; 