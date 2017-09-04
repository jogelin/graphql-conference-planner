import gql from 'graphql-tag';

export const GetSpeakerByIdQuery = gql`
  query GetSpeakerByIdQuery($id: ID!) {
    speaker: User(id: $id) {
      id
      email
      bio
      picture
      publicName
      username
      createdAt
      talks {
        title
        id
        description
        startsAt
        room
      }
    }
  }
`;

export interface GetSpeakerByIdResponse {
  speaker;
  loading;
}
