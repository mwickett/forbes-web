const Feed = require("feed").Feed;
const data = require("../public/data.json");
const fs = require("fs");
const path = require("path");
const marked = require("marked");

const { blog } = data;

const feed = new Feed({
  title: "Dr. Forbes & Associates Psychology Blog",
  description:
    "The latest news and updates from Dr. Forbes & Associates Psychology",
  id: "https://www.drforbes.ca/",
  link: "https://www.drforbes.ca",
  language: "en",
  feedLinks: {
    json: "https://www.drforbes.ca/json",
    atom: "https://www.drforbes.ca/atom"
  },
  author: {
    name: "Dr. Forbes & Associates Psychology",
    email: "lindsay@drforbes.ca",
    link: "https://www.drforbes.ca"
  }
});

blog.forEach(post => {
  feed.addItem({
    title: post.title,
    id: post.slug,
    link: `https://www.drforbes.ca/blog/${post.slug}`,
    description: marked(post.content).slice(0, 128),
    content: marked(post.content),
    author: {
      name: post.author.name,
      email: post.author.contactEmail
    },
    date: new Date(post.createdAt)
  });
});

const filePath = path.join(__dirname, "../public/feed.xml");

try {
  fs.writeFileSync(filePath, feed.rss2(), "utf-8");
  console.log("Wrote new feed.xml file");
} catch (err) {
  console.error(`There was an error: ${err}`);
}
