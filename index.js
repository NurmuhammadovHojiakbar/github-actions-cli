#!/usr/bin/node

const getGithubLink = (username) =>
  `https://api.github.com/users/${username}/events`;

const getGithubEvents = async (link) => {
  try {
    console.log("> Started collecting last events of user...");
    const res = await fetch(link, {
      method: "Get",
    });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.log(error);
  }
};

const [, , username, event_type] = process.argv;

if (!username) {
  console.log("To log recent actions of user in github, use this command:");
  console.log("");
  console.log("> github-action <username> [event_type]");
  return;
}

getGithubEvents(getGithubLink(username)).then((data) => {
  const filtered =
    data?.filter((event) => (event_type ? event.type === event_type : true)) ??
    [];
  if (filtered.length === 0) {
    console.log("----- There is no events yet! -----");
    return;
  }
  console.log("Output: ");
  console.log("");

  filtered.forEach((event) => {
    switch (event.type) {
      case "PushEvent": {
        console.log(
          `- Pushed ${event.payload.commits.length} to ${event.repo.name}`
        );
        break;
      }
      case "PullRequestEvent": {
        console.log(`- Made pull request to ${event.repo.name}`);
        break;
      }
      case "IssueCommentEvent": {
        console.log(`- Opened a new issue in ${event.repo.name}`);
        break;
      }
      case "WatchEvent":
        console.log(`- Starred ${event.repo.name}`);
        break;
      case "ForkEvent":
        console.log(`- Forked ${event.repo.name}`);
        break;
      case "CreateEvent":
        console.log(
          `- Created ${event.payload.ref_type} in ${event.repo.name}`
        );
        break;
      default: {
        break;
      }
    }
  });
});
