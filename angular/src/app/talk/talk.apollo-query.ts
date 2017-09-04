import gql from 'graphql-tag';

export const GetTalkByIdQuery = gql`
  query GetTalkByIdQuery($id: ID!) {
    talk: Talk(id: $id) {
      title
      id
      description
      startsAt
      room
      speaker {
        id
        email
        bio
        picture
        publicName
        username
        createdAt
      }
    }
  }
`;

export interface GetTalkByIdQueryResponse {
  talk;
  loading;
}
