const getIOSEmojiUrl = (twitterUrl: string): string => {
  const lastPart = twitterUrl.split("/").pop();
  if (!lastPart) return twitterUrl; // fallback to original URL if split/pop fails
  return `https://raw.githubusercontent.com/samuelngs/apple-emoji-linux/refs/heads/ios-17.4/png/160/emoji_u${lastPart.replace(
    ".svg",
    "",
  )}.png`;
};

const replaceEmojis = () => {
  document
    .querySelectorAll('img[src^="https://abs-0.twimg.com/emoji/"]')
    .forEach((img) => {
      if (!(img instanceof HTMLImageElement)) return;
      const iosUrl = getIOSEmojiUrl(img.src);
      img.src = iosUrl;
      img.style.width = "1.2em";
      img.style.height = "1.2em";
    });
};

replaceEmojis();

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      replaceEmojis();
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
