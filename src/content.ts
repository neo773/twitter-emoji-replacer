const EMOJI_CONFIG = {
  TWITTER_EMOJI_SELECTOR: 'img[src^="https://abs-0.twimg.com/emoji/"]',
} as const;

const createEmojiSpan = (emojiAlt: string): HTMLSpanElement => {
  const span = document.createElement("span");
  Object.assign(span.style, {
    fontSize: "1.1em",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    lineHeight: "1",
    verticalAlign: "middle",
  });

  span.setAttribute("aria-label", emojiAlt);
  span.textContent = emojiAlt;
  return span;
};

const replaceTwitterEmojis = (): void => {
  const emojiImages = document.querySelectorAll<HTMLImageElement>(
    EMOJI_CONFIG.TWITTER_EMOJI_SELECTOR
  );

  emojiImages.forEach((img) => {
    if (!(img instanceof HTMLImageElement)) return;
    const emojiSpan = createEmojiSpan(img.alt);
    img.parentNode?.replaceChild(emojiSpan, img);
  });
};

const initializeEmojiReplacement = (): void => {
  replaceTwitterEmojis();

  const observer = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes.length > 0)) {
      replaceTwitterEmojis();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributeFilter: ["src"],
  });
};

initializeEmojiReplacement();
