/**
 * Fetches recent posts and reels from a public Instagram profile.
 * Runs at build time (in CI) so there are no CORS issues.
 * Output: public/instagram-feed.json
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const USERNAME = 'decode.smile';
const OUTPUT = join(__dirname, '..', 'public', 'instagram-feed.json');
const MAX_POSTS = 3;
const MAX_REELS = 3;

async function fetchInstagramFeed() {
  try {
    console.log(`Fetching Instagram feed for @${USERNAME}...`);

    const res = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${USERNAME}`,
      {
        headers: {
          'x-ig-app-id': '936619743392459',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Instagram API returned ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    const user = json?.data?.user;

    if (!user) {
      throw new Error('Could not find user data in response');
    }

    // Extract regular posts (non-video) and reels (video)
    const timelineEdges = user.edge_owner_to_timeline_media?.edges || [];

    const posts = [];
    const reels = [];

    for (const edge of timelineEdges) {
      const node = edge.node;
      const item = {
        shortcode: node.shortcode,
        caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
        timestamp: node.taken_at_timestamp,
        thumbnail: node.thumbnail_src || node.display_url,
      };

      if (node.is_video || node.__typename === 'GraphVideo') {
        if (reels.length < MAX_REELS) reels.push(item);
      } else {
        if (posts.length < MAX_POSTS) posts.push(item);
      }

      if (posts.length >= MAX_POSTS && reels.length >= MAX_REELS) break;
    }

    // Also check dedicated reels tab if we need more reels
    if (reels.length < MAX_REELS) {
      const reelEdges = user.edge_felix_video_timeline?.edges || [];
      for (const edge of reelEdges) {
        const node = edge.node;
        // Skip if already captured from timeline
        if (reels.some((r) => r.shortcode === node.shortcode)) continue;
        reels.push({
          shortcode: node.shortcode,
          caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
          timestamp: node.taken_at_timestamp,
          thumbnail: node.thumbnail_src || node.display_url,
        });
        if (reels.length >= MAX_REELS) break;
      }
    }

    const feed = {
      username: USERNAME,
      fetchedAt: new Date().toISOString(),
      posts,
      reels,
    };

    writeFileSync(OUTPUT, JSON.stringify(feed, null, 2));
    console.log(
      `Saved ${posts.length} posts and ${reels.length} reels to instagram-feed.json`
    );
  } catch (err) {
    console.warn('Instagram fetch failed (non-fatal):', err.message);
    // Write empty feed so the app still builds
    const emptyFeed = {
      username: USERNAME,
      fetchedAt: new Date().toISOString(),
      posts: [],
      reels: [],
      error: err.message,
    };
    writeFileSync(OUTPUT, JSON.stringify(emptyFeed, null, 2));
    console.log('Wrote empty instagram-feed.json (fallback)');
  }
}

fetchInstagramFeed();
