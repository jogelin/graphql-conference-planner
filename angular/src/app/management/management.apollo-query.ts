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
    $city: String
    $country: String
    $description: String
    $endDate: DateTime
    $logo: String
    $name: String
    $startDate: DateTime
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
export const getAllTalks = gql`
  query($first: Int!, $after: String) {
    talks: allTalks(first: $first, after: $after) {
      ...TalkOverview
    }
    _allTalksMeta {
      count
    }
  }
  ${talkFragments.TalkOverview}
`;

export interface GetAllTalksResponse {
  talks;
  loading;
  _allTalksMeta;
}

export const addTalk = gql`
  mutation(
    $description: String!
    $room: String
    $startsAt: DateTime
    $status: TALK_STATUS
    $title: String!
    $speakerId: ID
    $conferencesIds: [ID!]
    $conferences: [TalkconferencesConference!]
  ) {
    createTalk(
      description: $description
      room: $room
      startsAt: $startsAt
      status: $status
      title: $title
      speakerId: $speakerId
      conferencesIds: $conferencesIds
      conferences: $conferences
    ) {
      ...TalkOverview
    }
  }
  ${talkFragments.TalkOverview}
`;

export const updateTalk = gql`
  mutation(
    $id: ID!
    $description: String
    $room: String
    $startsAt: DateTime
    $status: TALK_STATUS
    $title: String
    $speakerId: ID
    $conferencesIds: [ID!]
    $conferences: [TalkconferencesConference!]
  ) {
    updateTalk(
      id: $id
      description: $description
      room: $room
      startsAt: $startsAt
      status: $status
      title: $title
      speakerId: $speakerId
      conferencesIds: $conferencesIds
      conferences: $conferences
    ) {
      ...TalkOverview
    }
  }
  ${talkFragments.TalkOverview}
`;

export const getTalk = gql`
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


export interface GetTalkResponse {
  loading;
  talk;
  data;
}


export const deleteTalk = gql`
  mutation($id: ID!) {
    deleteTalk(id: $id) {
      id
    } 
  }
`;

export const getSpeakers = gql`
  query {
    speakers: allUsers {
      ...SpeakerOverview
      talks {
        ...TalkOverview
      }
    }
  }
  ${speakerFragments.SpeakerOverview}
  ${talkFragments.TalkOverview}
`;

export interface GetSpeakersResponse {
  speakers;
}


export const updateTalkSpeaker = gql`
  mutation(
    $id: ID!
    $speakerId: ID
  ) {
    updateTalk(
      id: $id
      speakerId: $speakerId
    ) {
      ...TalkOverview
    }
  }
  ${talkFragments.TalkOverview}
`;

export const getTalksOnConference = gql`
  query {
    talks: allTalks {
      ...TalkOverview
    }
  }
  ${talkFragments.TalkOverview}
`;

export interface GetTalksOnConferenceResponse {
  talks;
}


export const updateTalksOnConference = gql`
  mutation(
    $id: ID!
    $talksIds: [ID!]
  ) {
    updateConference(
      id: $id
      talksIds: $talksIds
    ) {
      ...ConferenceOverview
    }
  }
  ${conferenceFragments.ConferenceOverview}
`;




