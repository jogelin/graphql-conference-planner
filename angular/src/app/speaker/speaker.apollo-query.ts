import gql from 'graphql-tag';
import { speakerFragments, talkFragments } from '../talk/talk.apollo-query';

console.log(speakerFragments);



export const GetSpeakerByIdQuery = gql`
  query GetSpeakerByIdQuery($id: ID!) {
    speaker: User(id: $id) {
      ...SpeakerOverview
      talks {
        ...TalkOverview
      }
    }
  }
  ${speakerFragments.SpeakerOverview}
  ${talkFragments.TalkOverview}
`;

export interface GetSpeakerByIdResponse {
  speaker;
  loading;
}
