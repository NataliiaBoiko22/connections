export interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
}

export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}

export interface Snippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
        default: Thumbnail;
        medium: Thumbnail;
        high: Thumbnail;
        standard: Thumbnail;
        maxres: Thumbnail;
    };
    channelTitle: string;
    tags: string[];
    categoryId: string;
    liveBroadcastContent: string;
    localized: {
        title: string;
        description: string;
    };
    defaultAudioLanguage: string;
}

export interface VideoItem {
    kind: string;
    etag: string;
    id: string;
    snippet: Snippet;
    statistics: {
        viewCount: string;
        likeCount: string;
        dislikeCount: string;
        favoriteCount: string;
        commentCount: string;
    };
}

export interface VideoListResponse {
    kind: string;
    etag: string;
    pageInfo: PageInfo;
    items: VideoItem[];
}
