import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);

// Helper to create a template
async function createTemplate(template) {
  const [result] = await connection.execute(
    `INSERT INTO marketplace_templates 
    (name, description, category, platform, creatorId, status, price, downloads, reviewCount, nodes, edges, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      template.name,
      template.description,
      template.category,
      template.platform,
      1, // creator_id (admin)
      'published',
      template.price || 0,
      Math.floor(Math.random() * 500) + 50, // Random downloads 50-550
      Math.floor(Math.random() * 30) + 5, // Random review count 5-35
      JSON.stringify(template.nodes),
      JSON.stringify(template.edges)
    ]
  );
  console.log(`✓ Created template: ${template.name}`);
  return result.insertId;
}

// Template definitions with realistic node/edge configurations
const templates = [
  // ========== INSTAGRAM TEMPLATES ==========
  {
    name: "Instagram Story Scheduler",
    description: "Automatically post stories at optimal times with custom stickers and polls. Schedule a week's worth of content in advance.",
    category: "Content Management",
    platform: "instagram",
    price: 15,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://instagram.com", label: "Open Instagram" }, position: { x: 100, y: 100 } },
      { id: "2", type: "click", data: { selector: "[aria-label='New story']", label: "Click Story Button" }, position: { x: 100, y: 200 } },
      { id: "3", type: "type", data: { selector: "input[type='file']", text: "{{story_image}}", label: "Upload Story Image" }, position: { x: 100, y: 300 } },
      { id: "4", type: "wait", data: { duration: 2000, label: "Wait for Upload" }, position: { x: 100, y: 400 } },
      { id: "5", type: "click", data: { selector: "[aria-label='Share']", label: "Publish Story" }, position: { x: 100, y: 500 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" }
    ]
  },
  {
    name: "Instagram DM Auto-Responder",
    description: "Automatically respond to DMs with personalized messages based on keywords. Perfect for customer service and engagement.",
    category: "Engagement",
    platform: "instagram",
    price: 25,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://instagram.com/direct/inbox", label: "Open DMs" }, position: { x: 100, y: 100 } },
      { id: "2", type: "loop", data: { iterations: 10, label: "Check New Messages" }, position: { x: 100, y: 200 } },
      { id: "3", type: "condition", data: { condition: "{{has_unread}}", label: "Has Unread?" }, position: { x: 100, y: 300 } },
      { id: "4", type: "click", data: { selector: ".unread-message", label: "Open Message" }, position: { x: 100, y: 400 } },
      { id: "5", type: "type", data: { selector: "textarea", text: "{{auto_reply}}", label: "Send Reply" }, position: { x: 100, y: 500 } },
      { id: "6", type: "click", data: { selector: "button[type='submit']", label: "Send" }, position: { x: 100, y: 600 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" }
    ]
  },
  {
    name: "Instagram Follower Engagement Bot",
    description: "Like and comment on posts from your followers to boost engagement. Includes smart comment templates and rate limiting.",
    category: "Engagement",
    platform: "instagram",
    price: 20,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://instagram.com/{{username}}/followers", label: "Open Followers" }, position: { x: 100, y: 100 } },
      { id: "2", type: "loop", data: { iterations: 20, label: "Iterate Followers" }, position: { x: 100, y: 200 } },
      { id: "3", type: "click", data: { selector: ".follower-link", label: "Visit Profile" }, position: { x: 100, y: 300 } },
      { id: "4", type: "click", data: { selector: ".post-thumbnail:first", label: "Open Latest Post" }, position: { x: 100, y: 400 } },
      { id: "5", type: "click", data: { selector: "[aria-label='Like']", label: "Like Post" }, position: { x: 100, y: 500 } },
      { id: "6", type: "type", data: { selector: "textarea", text: "{{comment_template}}", label: "Add Comment" }, position: { x: 100, y: 600 } },
      { id: "7", type: "wait", data: { duration: 5000, label: "Rate Limit" }, position: { x: 100, y: 700 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" },
      { id: "e6-7", source: "6", target: "7" }
    ]
  },
  {
    name: "Instagram Hashtag Research",
    description: "Analyze top hashtags in your niche, track performance, and discover trending tags. Export data to CSV.",
    category: "Analytics",
    platform: "instagram",
    price: 18,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://instagram.com/explore/tags/{{hashtag}}", label: "Search Hashtag" }, position: { x: 100, y: 100 } },
      { id: "2", type: "screenshot", data: { selector: ".top-posts", label: "Capture Top Posts" }, position: { x: 100, y: 200 } },
      { id: "3", type: "loop", data: { iterations: 9, label: "Analyze Posts" }, position: { x: 100, y: 300 } },
      { id: "4", type: "click", data: { selector: ".post-item", label: "Open Post" }, position: { x: 100, y: 400 } },
      { id: "5", type: "wait", data: { duration: 1000, label: "Load Metrics" }, position: { x: 100, y: 500 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" }
    ]
  },

  // ========== TIKTOK TEMPLATES ==========
  {
    name: "TikTok Video Uploader",
    description: "Bulk upload TikTok videos with captions, hashtags, and scheduling. Supports multiple accounts.",
    category: "Content Management",
    platform: "tiktok",
    price: 22,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://tiktok.com/upload", label: "Open Upload Page" }, position: { x: 100, y: 100 } },
      { id: "2", type: "type", data: { selector: "input[type='file']", text: "{{video_path}}", label: "Select Video" }, position: { x: 100, y: 200 } },
      { id: "3", type: "wait", data: { duration: 5000, label: "Wait for Upload" }, position: { x: 100, y: 300 } },
      { id: "4", type: "type", data: { selector: "textarea[placeholder='Caption']", text: "{{caption}}", label: "Add Caption" }, position: { x: 100, y: 400 } },
      { id: "5", type: "type", data: { selector: "input[placeholder='Hashtags']", text: "{{hashtags}}", label: "Add Hashtags" }, position: { x: 100, y: 500 } },
      { id: "6", type: "click", data: { selector: "button[type='submit']", label: "Post Video" }, position: { x: 100, y: 600 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" }
    ]
  },
  {
    name: "TikTok Comment Moderator",
    description: "Automatically filter and respond to comments. Delete spam, reply to questions, and highlight positive feedback.",
    category: "Engagement",
    platform: "tiktok",
    price: 20,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://tiktok.com/@{{username}}", label: "Open Profile" }, position: { x: 100, y: 100 } },
      { id: "2", type: "click", data: { selector: ".video-item:first", label: "Open Latest Video" }, position: { x: 100, y: 200 } },
      { id: "3", type: "loop", data: { iterations: 50, label: "Check Comments" }, position: { x: 100, y: 300 } },
      { id: "4", type: "condition", data: { condition: "{{is_spam}}", label: "Is Spam?" }, position: { x: 100, y: 400 } },
      { id: "5", type: "click", data: { selector: ".delete-button", label: "Delete Comment" }, position: { x: 200, y: 500 } },
      { id: "6", type: "click", data: { selector: ".reply-button", label: "Reply to Comment" }, position: { x: 100, y: 500 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e4-6", source: "4", target: "6" }
    ]
  },
  {
    name: "TikTok Trend Analyzer",
    description: "Track trending sounds, hashtags, and challenges. Get daily reports on what's going viral in your niche.",
    category: "Analytics",
    platform: "tiktok",
    price: 25,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://tiktok.com/discover", label: "Open Discover" }, position: { x: 100, y: 100 } },
      { id: "2", type: "screenshot", data: { selector: ".trending-section", label: "Capture Trends" }, position: { x: 100, y: 200 } },
      { id: "3", type: "loop", data: { iterations: 10, label: "Analyze Trends" }, position: { x: 100, y: 300 } },
      { id: "4", type: "click", data: { selector: ".trend-item", label: "Open Trend" }, position: { x: 100, y: 400 } },
      { id: "5", type: "wait", data: { duration: 2000, label: "Load Data" }, position: { x: 100, y: 500 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" }
    ]
  },

  // ========== YOUTUBE TEMPLATES ==========
  {
    name: "YouTube Video Uploader Pro",
    description: "Upload videos with custom thumbnails, descriptions, tags, and playlists. Schedule releases and manage monetization.",
    category: "Content Management",
    platform: "youtube",
    price: 30,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://studio.youtube.com", label: "Open YouTube Studio" }, position: { x: 100, y: 100 } },
      { id: "2", type: "click", data: { selector: "#upload-icon", label: "Click Upload" }, position: { x: 100, y: 200 } },
      { id: "3", type: "type", data: { selector: "input[type='file']", text: "{{video_file}}", label: "Select Video" }, position: { x: 100, y: 300 } },
      { id: "4", type: "wait", data: { duration: 10000, label: "Wait for Upload" }, position: { x: 100, y: 400 } },
      { id: "5", type: "type", data: { selector: "#textbox[aria-label='Title']", text: "{{title}}", label: "Add Title" }, position: { x: 100, y: 500 } },
      { id: "6", type: "type", data: { selector: "#textbox[aria-label='Description']", text: "{{description}}", label: "Add Description" }, position: { x: 100, y: 600 } },
      { id: "7", type: "type", data: { selector: "input[type='file'][accept='image/*']", text: "{{thumbnail}}", label: "Upload Thumbnail" }, position: { x: 100, y: 700 } },
      { id: "8", type: "click", data: { selector: "#done-button", label: "Publish Video" }, position: { x: 100, y: 800 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" },
      { id: "e6-7", source: "6", target: "7" },
      { id: "e7-8", source: "7", target: "8" }
    ]
  },
  {
    name: "YouTube Comment Manager",
    description: "Moderate comments across all videos. Auto-reply to common questions, pin top comments, and filter spam.",
    category: "Engagement",
    platform: "youtube",
    price: 22,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://studio.youtube.com/channel/{{channel_id}}/comments", label: "Open Comments" }, position: { x: 100, y: 100 } },
      { id: "2", type: "loop", data: { iterations: 30, label: "Check Comments" }, position: { x: 100, y: 200 } },
      { id: "3", type: "condition", data: { condition: "{{needs_reply}}", label: "Needs Reply?" }, position: { x: 100, y: 300 } },
      { id: "4", type: "click", data: { selector: ".reply-button", label: "Reply" }, position: { x: 100, y: 400 } },
      { id: "5", type: "type", data: { selector: "textarea", text: "{{reply_text}}", label: "Type Reply" }, position: { x: 100, y: 500 } },
      { id: "6", type: "click", data: { selector: ".submit-reply", label: "Send Reply" }, position: { x: 100, y: 600 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" }
    ]
  },
  {
    name: "YouTube Analytics Dashboard",
    description: "Track views, watch time, subscribers, and revenue. Generate weekly reports with charts and insights.",
    category: "Analytics",
    platform: "youtube",
    price: 28,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://studio.youtube.com/channel/{{channel_id}}/analytics", label: "Open Analytics" }, position: { x: 100, y: 100 } },
      { id: "2", type: "screenshot", data: { selector: ".analytics-overview", label: "Capture Overview" }, position: { x: 100, y: 200 } },
      { id: "3", type: "click", data: { selector: "#reach-tab", label: "Open Reach Tab" }, position: { x: 100, y: 300 } },
      { id: "4", type: "screenshot", data: { selector: ".reach-metrics", label: "Capture Reach" }, position: { x: 100, y: 400 } },
      { id: "5", type: "click", data: { selector: "#engagement-tab", label: "Open Engagement" }, position: { x: 100, y: 500 } },
      { id: "6", type: "screenshot", data: { selector: ".engagement-metrics", label: "Capture Engagement" }, position: { x: 100, y: 600 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" }
    ]
  },
  {
    name: "YouTube Playlist Organizer",
    description: "Automatically organize videos into playlists based on keywords, topics, or upload date. Keep your channel tidy.",
    category: "Content Management",
    platform: "youtube",
    price: 15,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://studio.youtube.com/channel/{{channel_id}}/videos", label: "Open Videos" }, position: { x: 100, y: 100 } },
      { id: "2", type: "loop", data: { iterations: 20, label: "Process Videos" }, position: { x: 100, y: 200 } },
      { id: "3", type: "click", data: { selector: ".video-checkbox", label: "Select Video" }, position: { x: 100, y: 300 } },
      { id: "4", type: "click", data: { selector: "#add-to-playlist", label: "Add to Playlist" }, position: { x: 100, y: 400 } },
      { id: "5", type: "click", data: { selector: ".playlist-option", label: "Select Playlist" }, position: { x: 100, y: 500 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" }
    ]
  },

  // ========== TWITTER TEMPLATES ==========
  {
    name: "Twitter Thread Scheduler",
    description: "Schedule and post Twitter threads with optimal timing. Supports images, polls, and auto-retweets.",
    category: "Content Management",
    platform: "twitter",
    price: 18,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://twitter.com/compose/tweet", label: "Open Composer" }, position: { x: 100, y: 100 } },
      { id: "2", type: "loop", data: { iterations: 5, label: "Post Thread" }, position: { x: 100, y: 200 } },
      { id: "3", type: "type", data: { selector: "textarea[aria-label='Tweet text']", text: "{{tweet_text}}", label: "Type Tweet" }, position: { x: 100, y: 300 } },
      { id: "4", type: "click", data: { selector: "[aria-label='Add another Tweet']", label: "Add to Thread" }, position: { x: 100, y: 400 } },
      { id: "5", type: "wait", data: { duration: 1000, label: "Wait" }, position: { x: 100, y: 500 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" }
    ]
  },
  {
    name: "Twitter Engagement Bot",
    description: "Auto-like, retweet, and reply to tweets from specific accounts or hashtags. Boost your Twitter presence.",
    category: "Engagement",
    platform: "twitter",
    price: 20,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://twitter.com/search?q={{hashtag}}", label: "Search Hashtag" }, position: { x: 100, y: 100 } },
      { id: "2", type: "loop", data: { iterations: 15, label: "Engage with Tweets" }, position: { x: 100, y: 200 } },
      { id: "3", type: "click", data: { selector: "[aria-label='Like']", label: "Like Tweet" }, position: { x: 100, y: 300 } },
      { id: "4", type: "click", data: { selector: "[aria-label='Retweet']", label: "Retweet" }, position: { x: 100, y: 400 } },
      { id: "5", type: "wait", data: { duration: 3000, label: "Rate Limit" }, position: { x: 100, y: 500 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" }
    ]
  },
  {
    name: "Twitter DM Campaign Manager",
    description: "Send personalized DMs to new followers or specific user lists. Track responses and manage conversations.",
    category: "Engagement",
    platform: "twitter",
    price: 25,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://twitter.com/messages", label: "Open Messages" }, position: { x: 100, y: 100 } },
      { id: "2", type: "click", data: { selector: "[aria-label='New message']", label: "New Message" }, position: { x: 100, y: 200 } },
      { id: "3", type: "type", data: { selector: "input[placeholder='Search people']", text: "{{username}}", label: "Search User" }, position: { x: 100, y: 300 } },
      { id: "4", type: "click", data: { selector: ".user-result:first", label: "Select User" }, position: { x: 100, y: 400 } },
      { id: "5", type: "type", data: { selector: "textarea[placeholder='Start a message']", text: "{{dm_text}}", label: "Type Message" }, position: { x: 100, y: 500 } },
      { id: "6", type: "click", data: { selector: "[aria-label='Send']", label: "Send DM" }, position: { x: 100, y: 600 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" }
    ]
  },

  // ========== FACEBOOK TEMPLATES ==========
  {
    name: "Facebook Page Post Scheduler",
    description: "Schedule posts to your Facebook page with images, videos, and links. Optimal timing for maximum reach.",
    category: "Content Management",
    platform: "facebook",
    price: 20,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://facebook.com/{{page_id}}", label: "Open Page" }, position: { x: 100, y: 100 } },
      { id: "2", type: "click", data: { selector: "[aria-label='Create a post']", label: "Create Post" }, position: { x: 100, y: 200 } },
      { id: "3", type: "type", data: { selector: "textarea[placeholder=\"What's on your mind?\"]", text: "{{post_text}}", label: "Type Post" }, position: { x: 100, y: 300 } },
      { id: "4", type: "click", data: { selector: "[aria-label='Photo/Video']", label: "Add Media" }, position: { x: 100, y: 400 } },
      { id: "5", type: "type", data: { selector: "input[type='file']", text: "{{media_path}}", label: "Upload Media" }, position: { x: 100, y: 500 } },
      { id: "6", type: "click", data: { selector: "[aria-label='Post']", label: "Publish Post" }, position: { x: 100, y: 600 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" }
    ]
  },
  {
    name: "Facebook Group Auto-Poster",
    description: "Post to multiple Facebook groups simultaneously. Perfect for community managers and marketers.",
    category: "Content Management",
    platform: "facebook",
    price: 22,
    nodes: [
      { id: "1", type: "loop", data: { iterations: 5, label: "Post to Groups" }, position: { x: 100, y: 100 } },
      { id: "2", type: "navigate", data: { url: "https://facebook.com/groups/{{group_id}}", label: "Open Group" }, position: { x: 100, y: 200 } },
      { id: "3", type: "click", data: { selector: "[aria-label='Write something...']", label: "Create Post" }, position: { x: 100, y: 300 } },
      { id: "4", type: "type", data: { selector: "textarea", text: "{{post_content}}", label: "Type Content" }, position: { x: 100, y: 400 } },
      { id: "5", type: "click", data: { selector: "[aria-label='Post']", label: "Publish" }, position: { x: 100, y: 500 } },
      { id: "6", type: "wait", data: { duration: 5000, label: "Wait Between Posts" }, position: { x: 100, y: 600 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" }
    ]
  },
  {
    name: "Facebook Comment Responder",
    description: "Automatically respond to comments on your posts. Filter spam and engage with your audience.",
    category: "Engagement",
    platform: "facebook",
    price: 18,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://facebook.com/{{page_id}}", label: "Open Page" }, position: { x: 100, y: 100 } },
      { id: "2", type: "click", data: { selector: ".post:first", label: "Open Latest Post" }, position: { x: 100, y: 200 } },
      { id: "3", type: "loop", data: { iterations: 20, label: "Check Comments" }, position: { x: 100, y: 300 } },
      { id: "4", type: "condition", data: { condition: "{{needs_response}}", label: "Needs Response?" }, position: { x: 100, y: 400 } },
      { id: "5", type: "click", data: { selector: ".reply-button", label: "Reply" }, position: { x: 100, y: 500 } },
      { id: "6", type: "type", data: { selector: "textarea", text: "{{reply_text}}", label: "Type Reply" }, position: { x: 100, y: 600 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" }
    ]
  },

  // ========== MULTI-PLATFORM TEMPLATES ==========
  {
    name: "Cross-Platform Content Publisher",
    description: "Post the same content to Instagram, Twitter, Facebook, and TikTok simultaneously. Save hours of manual work.",
    category: "Content Management",
    platform: "multi",
    price: 35,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://instagram.com", label: "Post to Instagram" }, position: { x: 100, y: 100 } },
      { id: "2", type: "click", data: { selector: "[aria-label='New post']", label: "Create IG Post" }, position: { x: 100, y: 200 } },
      { id: "3", type: "type", data: { selector: "input[type='file']", text: "{{media}}", label: "Upload Media" }, position: { x: 100, y: 300 } },
      { id: "4", type: "navigate", data: { url: "https://twitter.com/compose/tweet", label: "Post to Twitter" }, position: { x: 300, y: 100 } },
      { id: "5", type: "type", data: { selector: "textarea", text: "{{content}}", label: "Tweet Content" }, position: { x: 300, y: 200 } },
      { id: "6", type: "navigate", data: { url: "https://facebook.com", label: "Post to Facebook" }, position: { x: 500, y: 100 } },
      { id: "7", type: "type", data: { selector: "textarea", text: "{{content}}", label: "FB Content" }, position: { x: 500, y: 200 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e6-7", source: "6", target: "7" }
    ]
  },
  {
    name: "Unified Social Media Analytics",
    description: "Collect analytics from all platforms in one dashboard. Track followers, engagement, and growth across channels.",
    category: "Analytics",
    platform: "multi",
    price: 40,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://instagram.com/{{username}}", label: "Get IG Stats" }, position: { x: 100, y: 100 } },
      { id: "2", type: "screenshot", data: { selector: ".profile-stats", label: "Capture IG Stats" }, position: { x: 100, y: 200 } },
      { id: "3", type: "navigate", data: { url: "https://twitter.com/{{username}}", label: "Get Twitter Stats" }, position: { x: 300, y: 100 } },
      { id: "4", type: "screenshot", data: { selector: ".profile-stats", label: "Capture Twitter Stats" }, position: { x: 300, y: 200 } },
      { id: "5", type: "navigate", data: { url: "https://youtube.com/channel/{{channel_id}}", label: "Get YT Stats" }, position: { x: 500, y: 100 } },
      { id: "6", type: "screenshot", data: { selector: ".subscriber-count", label: "Capture YT Stats" }, position: { x: 500, y: 200 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e5-6", source: "5", target: "6" }
    ]
  },
  {
    name: "Multi-Platform Influencer Outreach",
    description: "Find and contact influencers across Instagram, YouTube, and TikTok. Automate collaboration requests.",
    category: "Engagement",
    platform: "multi",
    price: 30,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://instagram.com/explore/tags/{{niche}}", label: "Search IG Influencers" }, position: { x: 100, y: 100 } },
      { id: "2", type: "loop", data: { iterations: 10, label: "Find Influencers" }, position: { x: 100, y: 200 } },
      { id: "3", type: "click", data: { selector: ".profile-link", label: "Visit Profile" }, position: { x: 100, y: 300 } },
      { id: "4", type: "condition", data: { condition: "{{has_email}}", label: "Has Contact?" }, position: { x: 100, y: 400 } },
      { id: "5", type: "click", data: { selector: ".message-button", label: "Send DM" }, position: { x: 100, y: 500 } },
      { id: "6", type: "type", data: { selector: "textarea", text: "{{outreach_message}}", label: "Send Outreach" }, position: { x: 100, y: 600 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" }
    ]
  },
  {
    name: "Social Media Backup & Archive",
    description: "Automatically backup all your posts, stories, and media from Instagram, Twitter, and Facebook.",
    category: "Analytics",
    platform: "multi",
    price: 25,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://instagram.com/{{username}}", label: "Open IG Profile" }, position: { x: 100, y: 100 } },
      { id: "2", type: "loop", data: { iterations: 50, label: "Download Posts" }, position: { x: 100, y: 200 } },
      { id: "3", type: "screenshot", data: { selector: ".post-image", label: "Save Post" }, position: { x: 100, y: 300 } },
      { id: "4", type: "navigate", data: { url: "https://twitter.com/{{username}}", label: "Open Twitter" }, position: { x: 300, y: 100 } },
      { id: "5", type: "loop", data: { iterations: 50, label: "Download Tweets" }, position: { x: 300, y: 200 } },
      { id: "6", type: "screenshot", data: { selector: ".tweet", label: "Save Tweet" }, position: { x: 300, y: 300 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" }
    ]
  },

  // ========== SPECIALIZED TEMPLATES ==========
  {
    name: "E-commerce Product Promotion",
    description: "Promote products across social media with automated posts, stories, and ads. Track conversions.",
    category: "E-commerce",
    platform: "multi",
    price: 45,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://instagram.com", label: "Post Product on IG" }, position: { x: 100, y: 100 } },
      { id: "2", type: "click", data: { selector: "[aria-label='New post']", label: "Create Post" }, position: { x: 100, y: 200 } },
      { id: "3", type: "type", data: { selector: "input[type='file']", text: "{{product_image}}", label: "Upload Product" }, position: { x: 100, y: 300 } },
      { id: "4", type: "type", data: { selector: "textarea", text: "{{product_description}}", label: "Add Description" }, position: { x: 100, y: 400 } },
      { id: "5", type: "click", data: { selector: "[aria-label='Tag products']", label: "Tag Product" }, position: { x: 100, y: 500 } },
      { id: "6", type: "click", data: { selector: "[aria-label='Share']", label: "Publish" }, position: { x: 100, y: 600 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" }
    ]
  },
  {
    name: "Event Promotion Campaign",
    description: "Promote events across all platforms with countdown posts, reminders, and live updates.",
    category: "Marketing",
    platform: "multi",
    price: 35,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://facebook.com/events", label: "Create FB Event" }, position: { x: 100, y: 100 } },
      { id: "2", type: "click", data: { selector: "[aria-label='Create event']", label: "New Event" }, position: { x: 100, y: 200 } },
      { id: "3", type: "type", data: { selector: "input[name='name']", text: "{{event_name}}", label: "Event Name" }, position: { x: 100, y: 300 } },
      { id: "4", type: "type", data: { selector: "textarea[name='description']", text: "{{event_description}}", label: "Description" }, position: { x: 100, y: 400 } },
      { id: "5", type: "click", data: { selector: "[aria-label='Create']", label: "Create Event" }, position: { x: 100, y: 500 } },
      { id: "6", type: "navigate", data: { url: "https://twitter.com/compose/tweet", label: "Tweet Event" }, position: { x: 300, y: 100 } },
      { id: "7", type: "type", data: { selector: "textarea", text: "{{event_tweet}}", label: "Tweet About Event" }, position: { x: 300, y: 200 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e6-7", source: "6", target: "7" }
    ]
  },
  {
    name: "Competitor Monitoring System",
    description: "Track competitors' posts, engagement, and growth across all platforms. Get daily alerts on their activity.",
    category: "Analytics",
    platform: "multi",
    price: 38,
    nodes: [
      { id: "1", type: "navigate", data: { url: "https://instagram.com/{{competitor}}", label: "Check IG Competitor" }, position: { x: 100, y: 100 } },
      { id: "2", type: "screenshot", data: { selector: ".profile-stats", label: "Capture Stats" }, position: { x: 100, y: 200 } },
      { id: "3", type: "click", data: { selector: ".post:first", label: "Check Latest Post" }, position: { x: 100, y: 300 } },
      { id: "4", type: "screenshot", data: { selector: ".post-engagement", label: "Capture Engagement" }, position: { x: 100, y: 400 } },
      { id: "5", type: "navigate", data: { url: "https://twitter.com/{{competitor}}", label: "Check Twitter" }, position: { x: 300, y: 100 } },
      { id: "6", type: "screenshot", data: { selector: ".profile-stats", label: "Capture Twitter Stats" }, position: { x: 300, y: 200 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e5-6", source: "5", target: "6" }
    ]
  }
];

console.log(`\n🌟 Seeding ${templates.length} marketplace templates...\n`);

for (const template of templates) {
  await createTemplate(template);
}

console.log(`\n✅ Successfully seeded ${templates.length} templates to the marketplace!\n`);

await connection.end();
