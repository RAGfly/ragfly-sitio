# Ingesting from Google Drive

RAGfly can read documents **straight from Google Drive** — no local sync, no
downloads, no copying folders to disk.

This guide is for the **workspace administrator** who enables the connector once.
After that, every user in the group just picks a folder and RAGfly indexes it.

> **One-time setup, ~10 minutes.** You do it once per RAGfly group. Your users
> never see any of this.

---

## What you get

- Files are read **directly from Drive's API**, including files that live only
  in the cloud and were never downloaded to a computer.
- **Google Docs, Sheets and Slides work too.** They have no bytes on disk;
  RAGfly exports them on the fly to extract their text.
- **Shared drives** are supported.

## Privacy: the file never leaves your browser

This is the same guarantee as loading from a local folder, and it is not
negotiable:

1. Bytes are downloaded from Drive **into your browser's memory (RAM)**.
2. Text extraction runs **in your browser**.
3. Only **encrypted text** is uploaded to RAGfly.

The original file is never stored by RAGfly and never travels to RAGfly Cloud.
RAGfly requests the **`drive.readonly`** scope: it can read, never modify or
delete.

---

## Before you start

You need:

- A **Google Cloud** account (free) — https://console.cloud.google.com
- **Administrator** access to your RAGfly group (to edit Group Parameters)
- The **domain** where you use RAGfly: `https://app.ragfly.ai` (or your own)

---

## Part 1 — Create the credentials in Google Cloud

You will create two things: an **OAuth Client ID** (asks the user for permission)
and an **API Key** (powers the folder picker). You need both.

### 1.1 Create or pick a project

Go to https://console.cloud.google.com and create a project (e.g. "RAGfly
Connector"), or select an existing one. Everything below happens inside it.

### 1.2 Enable the two APIs

Go to **APIs & Services → Library** and enable:

- **Google Drive API** — reads folders and files
- **Google Picker API** — the window where the user picks a folder

Search each by name and click **Enable**.

### 1.3 Configure the consent screen

Go to **APIs & Services → OAuth consent screen**. This is what your users see
when they authorize RAGfly.

- **User type**: choose **Internal** if everyone belongs to your Google
  Workspace organization (simplest — no verification needed). Choose **External**
  otherwise.
- Fill in app name, support email and developer email.
- **Scopes**: add `https://www.googleapis.com/auth/drive.readonly` (read-only).
- If you chose **External**, add your users under **Test users** while the app
  is unpublished.

### 1.4 Create the OAuth Client ID

Go to **APIs & Services → Credentials → Create credentials → OAuth client ID**.

- **Application type**: **Web application**
- **Name**: anything (e.g. "RAGfly Web")
- **Authorized JavaScript origins**: add the origin where you use RAGfly:

  ```
  https://app.ragfly.ai
  ```

  Add one line per environment you use. **Origin only** — no trailing slash, no
  path. If you also use a test or internal environment, add those too.

- **Authorized redirect URIs**: leave empty. RAGfly uses Google's token model,
  which returns the token to the page itself.

Click **Create** and copy the **Client ID** (ends in
`.apps.googleusercontent.com`).

> ⚠️ Miss this step and users get **`Error 400: origin_mismatch`** when they try
> to authorize. See [Troubleshooting](#troubleshooting).

### 1.5 Create the API Key

Still under **Credentials → Create credentials → API key**. Copy the key, then
click **Edit API key** to restrict it (never leave a key unrestricted):

- **Application restrictions → Websites**: add your domain with a wildcard path:

  ```
  https://app.ragfly.ai/*
  ```

  Note the `/*` — unlike the OAuth origin, this one **does** take a path pattern.

- **API restrictions → Restrict key**: select **Google Picker API**.

Click **Save**.

> ⏱️ **Google takes a few minutes to apply these changes** (sometimes longer).
> If something still fails right after saving, wait and retry before debugging.

---

## Part 2 — Enable the connector in RAGfly

Sign in to RAGfly as a group administrator and go to **Group Parameters**.

### 2.1 Load the credentials

Under **Ingestion connectors**, paste what you copied:

| Parameter | Value |
|---|---|
| `Google Drive — OAuth Client ID` | the Client ID from step 1.4 |
| `Google Drive — API Key` | the API key from step 1.5 |

These are normally stored as a **group override**: each customer can use its own
Google project, and credentials are shown masked. A RAGfly platform operator can
instead set a general value inherited by groups; a non-empty group value takes
precedence over that default.

### 2.2 Confirm the source is enabled

There is **no Google Drive feature flag**. The connector appears when:

- the **Google Drive** ingestion source is enabled for the group, and
- both credentials above are available (from the group override or a general
  inherited value).

New groups normally receive the source already enabled. If it is absent after
you save the credentials and reload, ask your RAGfly platform operator to enable
the **Google Drive** source for the group.

---

## Part 3 — Using it (this is what your users do)

In **Documents → Feed documents**:

1. In **Select source**, choose **Google Drive**. A status badge shows whether
   you are connected.
2. Click **Connect folder…**. Google asks you to authorize (read-only), then
   opens the picker showing **your Drive in the cloud**.
3. Pick a folder. The badge turns to **Connected**.
4. Continue as usual: **Load directories**, then **Vectorize**.

**Switching Google accounts**: use **Switch account**. This forgets the current
authorization and lets you pick a different account — the linked folder is
cleared, since it belonged to the previous account.

### The status badge

| Badge | Meaning |
|---|---|
| **Disconnected** | No folder linked yet. Click "Connect folder…". |
| **Needs authorization** | A folder is linked, but the session expired (this happens after reloading the page). You will be prompted when you run. |
| **Connected** | Folder linked and authorization live. |

---

## Troubleshooting

### `Error 400: origin_mismatch`

The domain you are using is not listed in the OAuth Client's **Authorized
JavaScript origins** (step 1.4). Add it exactly as the browser shows it, with
`https://` and no trailing slash.

### The picker doesn't open, or fails right after authorizing

The **API key** is rejecting the domain. Check the website restrictions in step
1.5 — the entry needs the `/*` suffix. Remember Google takes a few minutes to
apply changes.

### The connector doesn't appear at all in the source selector

The **Google Drive** source must be enabled for the group and both credentials
must be available. First reload the page after saving. If it is still absent,
ask your RAGfly platform operator to enable the source or verify its inherited
credentials; there is no feature flag to switch on.

### "This app is blocked" / verification warning

Your consent screen is **External** and unpublished. Either add the user under
**Test users**, or switch to **Internal** if everyone is in your Workspace
organization.

### Some files are skipped

RAGfly ingests documents it can extract text from. Files with no extractable
text (images without OCR, unsupported binaries) are reported as such in the
pipeline, not silently dropped.

---

## Frequently asked

**Does RAGfly store my files?**
No. Bytes are read into your browser, text is extracted there, and only
encrypted text is uploaded. The original file never reaches RAGfly Cloud.

**Can RAGfly modify or delete my Drive?**
No. The requested scope is `drive.readonly`.

**Do I need Google Drive installed on my computer?**
No. Everything goes through Drive's API — that's the point. Files that only
exist in the cloud work fine.

**Can each user connect their own Drive?**
Yes. Credentials are per group (the app), but each user authorizes their own
Google account and picks their own folder.

**Do I have to repeat this per environment?**
The credentials are per group. If you use more than one RAGfly environment, add
each origin in step 1.4 and each website in step 1.5.
