import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { HostListener } from "@angular/core";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  //declare variables.
  private bbcActiveClass: String;
  private cbnActiveClass: String;
  private yahooActiveClass: String;
  private selectedFeedItem: String;
  private feedList: Array<any>;
  private singleFeed: Object;
  private displayLoader: String;
  private feedSearch: String;
  private tempFeedList: Array<any>;
  private showMobile: boolean;
  private showDesktop: boolean;

  //listens for resize window event.
  @HostListener('window:resize', ['$event'])
  resize(event) {
    this.setDisplay(window.innerWidth);
  }

  //initialize variables.
  constructor(private http: Http) {
    this.bbcActiveClass = "";
    this.cbnActiveClass = "";
    this.yahooActiveClass = "";
    this.selectedFeedItem = "";
    this.feedList = [];
    this.singleFeed = {};
    this.displayLoader = "none";
    this.feedSearch = "";
    this.tempFeedList = [];
  }

  //triggers on page load.
  ngOnInit() {
    this.bbcActiveClass = "navOptionsActive";
    this.getFeedList("bbc");
    this.selectFeedItem(this.singleFeed);
    this.setDisplay(window.innerWidth);
  }

  //sets mobile or desktop display
  setDisplay(width) {
    if (width < 992) {
      this.showMobile = true;
      this.showDesktop = false;
    } else {
      this.showMobile = false;
      this.showDesktop = true;
    }
  }

  //sets a selected item from the feed list.
  selectFeedItem(item) {
    this.selectedFeedItem = item;
  }

  //returns true if selected item is clicked.
  isActiveFeedItem(item) {
    return this.selectedFeedItem === item;
  }

  //sets active class to each nav item selected.
  setNavActive(feedProvider) {
    if (feedProvider == "bbc") {
      this.bbcActiveClass = "navOptionsActive";
      this.yahooActiveClass = "";
      this.cbnActiveClass = "";
    } else if (feedProvider == "cbn") {
      this.cbnActiveClass = "navOptionsActive";
      this.yahooActiveClass = "";
      this.bbcActiveClass = "";
    } else if (feedProvider == "yahoo") {
      this.yahooActiveClass = "navOptionsActive";
      this.bbcActiveClass = "";
      this.cbnActiveClass = "";
    }
    this.getFeedList(feedProvider);
  }

  //gets feed data from the server using the php script that makes an api call.
  getFeedList(feedProvider) {
    this.singleFeed = {};
    this.feedList = [];
    this.feedSearch = "";
    this.displayLoader = "block";
    let formData = new FormData();

    //makes an http request to a php script.
    formData.append("feedProvider", feedProvider);
    this.http.post("http://localhost/RSS-Reader/src/assets/phpScripts/getFeedData.php", formData)
      .subscribe((data) => {
        this.feedList = data.json();
        this.tempFeedList = data.json();
        this.displayLoader = "none";
      }, (error) => {
        console.log(error.json());
      })
  }

  //displays each feed clicked.
  displayEachFeed(feedId) {
    this.feedList.forEach(feed => {
      if (feed.link == feedId) {
        this.singleFeed = feed;
      }
    });
  }

  //takes a search input and display an array of results.
  searchFeed() {
    let tempArray = [];

    //checks if the search string is present in feed data.
    this.feedList.forEach(feed => {
      if (this.feedSearch && (feed.title.toUpperCase().includes(this.feedSearch.toUpperCase()) || feed.description.toUpperCase().includes(this.feedSearch.toUpperCase()) || feed.pubDate.toUpperCase().includes(this.feedSearch.toUpperCase()) || feed.link.toUpperCase().includes(this.feedSearch.toUpperCase()))) {
        tempArray.push(feed);
      }
    });
    if (this.feedSearch) {
      this.feedList = tempArray;
    } else {
      this.feedList = this.tempFeedList;
    }
    this.displayLoader = "none";
  }
}
