import { Component, inject, OnInit } from '@angular/core';
import { Post } from 'src/app/interfaces/interfaces';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  private postsService = inject(PostsService);

  posts: Post[] = [];
  
  constructor() {}

  ngOnInit(): void {
    this.postsService.getPosts().subscribe((res) => {
      console.log(res);
      this.posts.push(...res.posts)
    });
  }

}
