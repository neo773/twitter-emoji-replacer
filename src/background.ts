/// <reference types="chrome"/>

const { HeaderOperation, RuleActionType, ResourceType } =
  chrome.declarativeNetRequest;

chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: [1],
  addRules: [
    {
      id: 1,
      priority: 1,
      action: {
        type: RuleActionType.MODIFY_HEADERS,
        responseHeaders: [
          {
            header: "content-security-policy",
            operation: HeaderOperation.REMOVE,
          },
        ],
      },
      condition: {
        urlFilter: "|https://twitter.com/*|https://x.com/*",
        resourceTypes: [ResourceType.MAIN_FRAME, ResourceType.SUB_FRAME],
      },
    },
  ],
});
