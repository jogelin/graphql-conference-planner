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


export const DetailedConferenceQuery = 'TO IMPLEMENT';

export interface DetailedConferenceQueryResponse {
  conference;
  loading;
}
