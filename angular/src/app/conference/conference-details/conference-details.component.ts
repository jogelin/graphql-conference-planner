import {Component, OnDestroy, OnInit} from '@angular/core';
import {Conference, ConferenceDetails} from '../types';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import {chunk, unsubscribeAll} from '../../utils';
import {Talk} from 'app/talk/types';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import { Apollo } from 'apollo-angular';
import { DetailedConferenceQuery } from 'app/conference/conference.apollo-query';
import { DetailedConferenceQueryResponse } from '../conference.apollo-query';

@Component({
  selector: 'cp-conference-details',
  templateUrl: './conference-details.component.html',
  styles: []
})
export class ConferenceDetailsComponent implements OnInit, OnDestroy {
  loading: boolean;
  conference: ConferenceDetails;

  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private apollo: Apollo) {
    this.getConferenceDetails = this.getConferenceDetails.bind(this);
  }

  ngOnInit() {
    const conferenceDetails$ = this.route.paramMap
      .map((params: ParamMap) => params.get('id'))
      .switchMap(this.getConferenceDetails)
      .map(({data}) => this.formatConference(data.conference))
      .subscribe((conference) => {
        this.conference = conference;
      });

    this.subscriptions = this.subscriptions.concat(conferenceDetails$);
  }

  getConferenceDetails(conferenceId: String) {
    return this.apollo.watchQuery<DetailedConferenceQueryResponse>({
      query: DetailedConferenceQuery,
      variables: {
        id: conferenceId
      }
    });
  }

  formatConference(data: Conference): ConferenceDetails {
    return Object.assign({},
      data,
      {
        speakerCount: data.talks.reduce((acc, talk) => acc + (talk.speaker ? 1 : 0), 0) || 0,
        talks: this.formatArray(data.talks),
        speakers: this.formatArray(this.getSpeakersFromTalks(data.talks)),
      }
    );
  }

  formatArray(array: any[]) {
    return chunk(array, 2);
  }

  getSpeakersFromTalks(talks: Talk[]) {
    return talks
      .map(talk => talk.speaker)
      .filter(speaker => !!speaker);
  }


  ngOnDestroy(): void {
    unsubscribeAll(this.subscriptions);
  }
}
