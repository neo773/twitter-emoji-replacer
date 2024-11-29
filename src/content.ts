const EMOJI_CONFIG = {
  TWITTER_EMOJI_SELECTOR: 'img[src^="https://abs-0.twimg.com/emoji/"]',
  IOS_EMOJI_BASE_URL:
    "https://raw.githubusercontent.com/samuelngs/apple-emoji-linux/refs/heads/ios-17.4/png/160",
  EMOJI_DIMENSIONS: "1.2em",
  DEFAULT_SKIN_TONE: "1f3fb",
} as const;

/**
 * Converts a Twitter emoji URL to its corresponding iOS emoji URL
 * @param twitterUrl - The original Twitter emoji URL
 * @returns The corresponding iOS emoji URL
 */
const convertToIOSEmojiUrl = (twitterUrl: string): string => {
  const emojiId = twitterUrl.split("/").pop()?.replace(".svg", "");
  if (!emojiId) return twitterUrl;

  return `${EMOJI_CONFIG.IOS_EMOJI_BASE_URL}/emoji_u${emojiId}.png`;
};

/**
 * Handles emoji loading errors by inserting skin tone modifiers that are required in iOS emoji URLs but missing in Twitter URLs
 * @param img - The image element that failed to load
 *
 * Skin Tone Handling:
 *
 * ┌──────────────────────────────────────────────────┐
 * │ Twitter: 1f468_200d_1f3a4  (no skin tone)        │
 * │ iOS:     1f468_1f3fb_200d_1f3a4  (with tone)     │
 * │                                                  │
 * │ Skin Tone Codes:                                 │
 * │ 1f3fb = Light skin tone                          │
 * │ 1f3fc = Medium-light skin tone                   │
 * │ 1f3fd = Medium skin tone                         │
 * │ 1f3fe = Medium-dark skin tone                    │
 * │ 1f3ff = Dark skin tone                           │
 * └──────────────────────────────────────────────────┘
 */
const handleEmojiLoadError = (img: HTMLImageElement): void => {
  const fileName = img.src.split("/").pop();
  if (!fileName) return;

  const baseEmoji = fileName.replace(".png", "").replace("emoji_u", "");
  const emojiParts = baseEmoji.split(/[-_]/);

  // Reconstruct emoji with correct skin tone order
  const reorderedEmoji = [
    emojiParts[0],
    EMOJI_CONFIG.DEFAULT_SKIN_TONE,
    ...emojiParts.slice(1),
  ]
    .filter(Boolean)
    .join("_");

  img.src = img.src.replace(baseEmoji, reorderedEmoji);
};

const styleEmojiImage = (img: HTMLImageElement): void => {
  img.style.width = EMOJI_CONFIG.EMOJI_DIMENSIONS;
  img.style.height = EMOJI_CONFIG.EMOJI_DIMENSIONS;
};

const replaceTwitterEmojis = (): void => {
  const emojiImages = document.querySelectorAll<HTMLImageElement>(
    EMOJI_CONFIG.TWITTER_EMOJI_SELECTOR
  );

  emojiImages.forEach((img) => {
    if (!(img instanceof HTMLImageElement)) return;

    img.src = convertToIOSEmojiUrl(img.src);
    styleEmojiImage(img);
    img.onerror = () => handleEmojiLoadError(img);
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
  });
};

initializeEmojiReplacement();
