---
name: Update `cspell.json` to accept the text ${textToInsert}
about: Instructions for adding text exceptions to `cspell.json`
title: Update `cspell.json` to accept the text ${textToInsert}
labels: 'Template Labels'
milestone: 8
assignees: ''
---

### Prerequisites
1. Be a member of Hack for LA. (There are no fees to join.) If you have not joined yet, please follow the steps on our [Getting Started](https://www.hackforla.org/getting-started) page.
2. Before you claim or start working on an issue, please make sure you have read our [How to Contribute to Hack for LA](https://github.com/hackforla/website/blob/7f0c132c96f71230b8935759e1f8711ccb340c0f/CONTRIBUTING.md) guide.

### Overview
We need to update the Code Spell Checker configuration file `cspell.json` with false positive terms so that they are no longer marked as errors. 

### Action Items
- [ ] You must use VS Code as your local text editor and install the Code Spell Checker extension. Code Spell Checker can be installed either using the VS Code text editor[^1] or the VS Code Marketplace website[^2].
- [ ] Do not change any configuration settings or make any spell corrections.
- [ ] Open the file `cspell.json` and locate the list / array named `"${listToAppend}"`.  

You are adding a new term to the end of this list, therefore:
- [ ] **_Add a comma_** (important!) to the last item in the existing `"${listToAppend}"`, then
- [ ] **_Add_** the text `"${textToInsert}"` at the end of the list `"${listToAppend}"`:
```
      "${textToInsert}"
```
- [ ] To reiterate, you are adding a new term to the end of the list. Do not remove or replace any of the other terms. Do not add a comma to the term you just added (The Code Spell Checker does not like this).
- [ ] Save `cspell.json` and then test the change by opening `${fileName}` and confirming that no Code Spell Checker errors/messages are displayed for this file.  
- [ ] Docker testing is not required. Create a Pull Request in the usual manner, with changes only to `cspell.json`.

### Resources
[^1]: [Installing Code Spell Checker from the VS Code text editor](https://code.visualstudio.com/learn/get-started/extensions)
[^2]:[Code Spell Checker - VS Marketplace](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
- This issue was created as part of #5312
