import { TokenService } from './token.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

const CLIENT_ID = VOTRE_CLIENT_ID;
const CLIENT_SECRET = VOTRE_CLIENT_SECRET;

class Artist {
  id: string;
  name: string;
  image: string;
}

class Album {
  constructor(public id: string, public name: string, public image: string, public songs: Song[] = []) {}
}

class Song {
  constructor(public id: string, public name: string) {}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spotifytest';

  artist: Artist = new Artist();
  albums: Album[] = [];

  artistname = '';

  spotifyToken: string;

  constructor(public http: HttpClient, public tokenService: TokenService) {}

  connect(): void {

    let body = new HttpParams()
      .set('grant_type', 'client_credentials');

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
      })
    };

    this.http.post<any>('https://accounts.spotify.com/api/token', body.toString(), httpOptions)
      .subscribe(res => {
        console.log(res);
        this.tokenService.token = res.access_token;
      });
  }

  getArtist(): void {

    this.http.get<any>('https://api.spotify.com/v1/search?type=artist&offset=0&limit=1&q=' + this.artistname)
      .subscribe(response => {
        console.log(response);
        this.artist.id = response.artists.items[0].id;
        this.artist.name = response.artists.items[0].name;
        this.artist.image = response.artists.items[0].images[0].url;
      });
  }

  getAlbums(): void {

    this.http.get<any>(`https://api.spotify.com/v1/artists/${this.artist.id}/albums?include_groups=album,single`)
      .subscribe(response => {
        this.albums = [];
        console.log(response);
        response.items.forEach(album => {
          this.albums.push(new Album(album.id, album.name, album.images[0].url));
        });
      });
  }

  getSongs(album: Album): void {
    this.http.get<any>(`https://api.spotify.com/v1/albums/${album.id}`)
      .subscribe(response => {
        album.songs = [];
        console.log(response);
        response.tracks.items.forEach(track => {
          album.songs.push(new Song(track.id, track.name));
        });

      });
  }
}
