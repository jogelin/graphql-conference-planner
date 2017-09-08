import { conferenceFragments } from 'app/conference/conference.apollo-query';
import gql from 'graphql-tag';
import { speakerFragments, talkFragments } from '../talk/talk.apollo-query';

export const getAllConferences = gql`
  query($first: Int!, $after: String) {
    conferences: allConferences(first: $first, after: $after) {
      ...ConferenceOverview
    }
    _allConferencesMeta {
      count
    }
  }
  ${conferenceFragments.ConferenceOverview}
`;

export interface GetAllConferencesResponse {
  conferences;
  loading;
  _allConferencesMeta;
}

export const addConference = gql`
  mutation(
    $city: String!
    $country: String!
    $description: String!
    $endDate: DateTime!
    $logo: String!
    $name: String!
    $startDate: DateTime!
    $website: String
    $attendeesIds: [ID!]
    $sponsorsIds: [ID!]
    $sponsors: [ConferencesponsorsSponsor!]
    $talksIds: [ID!]
    $talks: [ConferencetalksTalk!]
  ) {
    createConference(
      city: $city
      country: $country
      description: $description
      endDate: $endDate
      logo: $logo
      name: $name
      startDate: $startDate
      website: $website      
      attendeesIds: $attendeesIds     
      sponsorsIds: $sponsorsIds     
      sponsors: $sponsors
      talksIds: $talksIds     
      talks: $talks
    ) {
      ...ConferenceOverview
    }
  }
  ${conferenceFragments.ConferenceOverview}
`;

export const updateConference = gql`
  mutation(
    $id: ID!
    $city: String!
    $country: String!
    $description: String!
    $endDate: DateTime!
    $logo: String!
    $name: String!
    $startDate: DateTime!
    $website: String
    $attendeesIds: [ID!]
    $sponsorsIds: [ID!]
    $sponsors: [ConferencesponsorsSponsor!]
    $talksIds: [ID!]
    $talks: [ConferencetalksTalk!]
  ) {
    updateConference(
      id: $id
      city: $city
      country: $country
      description: $description
      endDate: $endDate
      logo: $logo
      name: $name
      startDate: $startDate
      website: $website      
      attendeesIds: $attendeesIds     
      sponsorsIds: $sponsorsIds     
      sponsors: $sponsors
      talksIds: $talksIds     
      talks: $talks
    ) {
      ...ConferenceOverview
    }
  }
  ${conferenceFragments.ConferenceOverview}
`;

export const getConference = gql`
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


export const deleteConference = gql`
  mutation($id: ID!) {
    deleteConference(id: $id) {
      id
    } 
  }
`;

export interface GetConferenceResponse {
  loading;
  conference;
  data;
}

// Talks

export const getAllTalks = 'TO IMPLEMENT';

export const addTalk = 'TO IMPLEMENT';

export const updateTalk = 'TO IMPLEMENT';

export const getTalk = 'TO IMPLEMENT';

export interface getAllTalksResponse {
  talks;
  loading;
  _allTalksMeta;
}

export const deleteTalk = 'TO IMPLEMENT';

export const getSpeakers = 'TO IMPLEMENT';


export interface getTalkResponse {
  loading;
  talk;
  data;
}

export const updateTalkSpeaker = 'TO IMPLEMENT';

export const getTalksOnConference = 'TO IMPLEMENT';

export interface getSpeakersResponse {
  speakers;
}

export const updateTalksOnConference = 'TO IMPLEMENT';

export interface GetTalksOnConferenceResponse {
  talks;
}


