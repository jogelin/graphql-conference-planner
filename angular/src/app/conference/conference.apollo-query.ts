// We use the gql tag to parse our query string into a query document
import gql from 'graphql-tag';

export const AllConferencesQuery = 'TO IMPLEMENT';

export interface AllConferencesQueryResponse {
  allConferences;
  loading;
}


export const DetailedConferenceQuery = 'TO IMPLEMENT';

export interface DetailedConferenceQueryResponse {
  conference;
  loading;
}
