import gql from 'graphql-tag';

export interface LoginResponse {
  signinUser;
}

export const LoginMutation = gql`
  mutation($email: AUTH_PROVIDER_EMAIL!) {
    signinUser(email: $email) {
      token,
      user {
        publicName
      }
    }
  }
`;

export const RegisterUserMutation = gql`
  mutation(
    $username: String!
    $publicName: String!
    $picture: String!
    $bio: String!
    $authProvider: AuthProviderSignupData!
  ) {
    createUser(
      username: $username
      publicName: $publicName
      picture: $picture
      bio: $bio
      authProvider: $authProvider
    ) {
      publicName
    } 
  }
`;
