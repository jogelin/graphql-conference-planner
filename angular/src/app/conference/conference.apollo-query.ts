// We use the gql tag to parse our query string into a query document
import gql from 'graphql-tag';
import { talkFragments, speakerFragments } from '../talk/talk.apollo-query';

export const conferenceFragments = {
  ConferenceOverview: gql`
    fragment ConferenceOverview on Conference {
      id
      name
      startDate
      logo
      _attendeesMeta {
        count
      }
      city
      country
      description
    }
  `,
};

export const AllConferencesQuery = gql`
  {
    allConferences {
      ...ConferenceOverview
    }
  }
  ${conferenceFragments.ConferenceOverview}
`;

export interface AllConferencesQueryResponse {
  allConferences;
  loading;
}


export const DetailedConferenceQuery = gql`
  query Conference($id: ID!) {
    conference: Conference(id: $id) {
      ...ConferenceOverview
      _sponsorsMeta {
        count
      }
      sponsors {
        id
        type
      }
      talks {
        ...TalkOverview
        speaker {
          ...SpeakerOverview
        }
      }
    }
  }
  ${conferenceFragments.ConferenceOverview}
  ${talkFragments.TalkOverview}
  ${speakerFragments.SpeakerOverview}
`;

export interface DetailedConferenceQueryResponse {
  conference;
  loading;
}
