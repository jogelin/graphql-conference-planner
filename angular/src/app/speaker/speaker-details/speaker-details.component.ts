import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GetSpeakerByIdQuery, GetSpeakerByIdResponse } from '../speaker.apollo-query';
import { chunk, unsubscribeAll } from '../../utils';
import { Subscription } from 'rxjs/Subscription';
import { Speaker } from '../types';
import 'rxjs/add/observable/empty';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'cp-speaker-details',
  templateUrl: './speaker-details.component.html'
})
export class SpeakerDetailsComponent implements OnInit, OnDestroy {

  speaker: Speaker;
  loading;
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private apollo: Apollo) {
    this.getSpeaker = this.getSpeaker.bind(this);
  }

  ngOnInit() {
    const getSpeaker$ = this.route.paramMap
      .map((params: ParamMap) => params.get('id'))
      .switchMap(this.getSpeaker)
      .subscribe(({data}) => {
        this.loading = data.loading;
        this.speaker = this.updateSpeaker(data);
      });

    this.subscriptions = this.subscriptions.concat(getSpeaker$);
  }

  getSpeaker(speakerId: string) {
    return this.apollo.watchQuery<GetSpeakerByIdResponse>({
      query: GetSpeakerByIdQuery,
      variables: {
        id: speakerId
      }
    });
  }

  updateSpeaker(data: GetSpeakerByIdResponse): Speaker {
    return Object.assign({},
      ...data.speaker,
      {
        talks: chunk(data.speaker.talks, 2)
      }
    );
  }


  ngOnDestroy(): void {
    unsubscribeAll(this.subscriptions);
  }
}
