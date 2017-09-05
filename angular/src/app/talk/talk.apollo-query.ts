import gql from 'graphql-tag';


export const talkFragments = {
  TalkOverview: gql`
    fragment TalkOverview on Talk {
      title
      id
      description
      startsAt
      room
    }
  `,
};

export const speakerFragments = {
  SpeakerOverview: gql`
    fragment SpeakerOverview on User {
      id
      email
      bio
      picture
      publicName
      username
      createdAt
    }
  `,
};

export const GetTalkByIdQuery = gql`
  query GetTalkByIdQuery($id: ID!) {
    talk: Talk(id: $id) {
      ...TalkOverview
      speaker {
        ...SpeakerOverview
      }
    }
  }
  ${talkFragments.TalkOverview}
  ${speakerFragments.SpeakerOverview}
`;

export interface GetTalkByIdQueryResponse {
  talk;
  loading;
}
