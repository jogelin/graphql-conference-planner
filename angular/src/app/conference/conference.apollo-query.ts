// We use the gql tag to parse our query string into a query document
import gql from 'graphql-tag';

export const AllConferencesQuery = gql`
  {
    allConferences {
      id
      name
      startDate
      logo
      _attendeesMeta {
        count
      }
      city
      country
    }
  }
`;

export interface AllConferencesQueryResponse {
  allConferences;
  loading;
}


export const DetailedConferenceQuery = gql`
  query Conference($id: ID!) {
    conference: Conference(id: $id) {
      id
      name
      startDate
      logo
      _sponsorsMeta {
        count
      }
      city
      country
      description
      _attendeesMeta {
        count
      }
      sponsors {
        id
        type
      }
      talks {
        title
        id
        description
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
  }
`;

export interface DetailedConferenceQueryResponse {
  conference;
  loading;
}
