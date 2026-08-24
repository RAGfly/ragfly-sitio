# Ingesting from Dropbox

RAGfly can read documents **straight from Dropbox's API** — no local sync
client, no downloads, no copying folders to disk.

This guide is for the **workspace administrator** who enables the connector once.
After that, every user in the group just picks a folder and RAGfly indexes it.

> **One-time setup, ~5 minutes.** You do it once per RAGfly group. Your users
> never see any of this.

---

## What you get

- Files are read **directly from Dropbox's API**, including files that live
  only in the cloud and were never downloaded to a computer.
- A built-in **folder browser**: users navigate their Dropbox and pick the
  folder to index (Dropbox has no folder picker of its own, so RAGfly provides
  one).

## Privacy: the file never leaves your browser

This is the same guarantee as loading from a local folder or from Google Drive,
and it is not negotiable:

1. Bytes are downloaded from Dropbox **into your browser's memory (RAM)**.
2. Text extraction runs **in your browser**.
3. Only **encrypted text** is uploaded to RAGfly.

The original file is never stored by RAGfly and never travels to RAGfly Cloud.
RAGfly requests **read-only** permissions (`files.metadata.read` and
`files.content.read`): it can read, never modify or delete.

---

## Before you start

You need:

- A **Dropbox** account — https://www.dropbox.com/developers/apps
- **Administrator** access to your RAGfly group (to edit Group Parameters)
- The **domain** where you use RAGfly: `https://app.ragfly.ai` (or your own)

---

## Part 1 — Create the app in Dropbox

Unlike Google Drive, Dropbox needs **one credential only**: the **App key**.
RAGfly uses OAuth 2.0 with PKCE, a flow designed for browser apps, so the
**App secret is never used** — don't copy it anywhere.

### 1.1 Create the app

Go to https://www.dropbox.com/developers/apps and click **Create app**:

- **API**: **Scoped access**
- **Type of access**: **Full Dropbox** (so users can pick any folder of their
  account; "App folder" would confine them to a single sandbox folder)
- **Name**: anything (e.g. "RAGfly Connector")

### 1.2 Grant the read-only permissions

In the app's **Permissions** tab, check:

- `files.metadata.read` — list folders and files
- `files.content.read` — download file contents

Click **Submit**. Nothing else — RAGfly never asks for write permissions.

> ⚠️ Permissions are baked into each token when the user authorizes. If you
> change them later, users must re-authorize (use **Switch account**).

### 1.3 Register the redirect URI

In the app's **Settings** tab, under **OAuth 2 → Redirect URIs**, add:

```
https://app.ragfly.ai/dropbox-callback
```

One line per environment where you use RAGfly, always ending in
`/dropbox-callback`.

> ⚠️ Miss this step and users get a **redirect URI mismatch** error when they
> try to authorize.

### 1.4 Copy the App key

Still in **Settings**: copy the **App key** (a short lowercase string). Ignore
the App secret — the PKCE flow doesn't use it.

---

## Part 2 — Enable the connector in RAGfly

Sign in to RAGfly as a group administrator and go to **Group Parameters**.

### 2.1 Load the credential

Under **Ingestion connectors**, paste it:

| Parameter | Value |
|---|---|
| `Dropbox — App key` | the App key from step 1.4 |

It is stored **per group**: each customer uses their own Dropbox app, and the
value is shown masked.

### 2.2 Turn the connector on

Under **Feature flags**, switch **`Dropbox connector`** to `true`.

That's it. The connector appears **only** when both conditions are met: the
flag is on **and** the App key is loaded.

---

## Part 3 — Using it (this is what your users do)

In **Documents → Feed documents**:

1. In **Select source**, choose **Dropbox**. A status badge shows whether you
   are connected.
2. Click **Connect folder…**. Dropbox asks you to authorize (read-only), then
   RAGfly opens its folder browser showing **your Dropbox in the cloud**.
3. Navigate and click **Use this folder** on the folder you want. The badge
   turns to **Connected**.
4. Continue as usual: **Load directories**, then **Vectorize**.

**Switching Dropbox accounts**: use **Switch account**. This forgets the
current authorization and lets you pick a different account — the linked folder
is cleared, since it belonged to the previous account.

### The status badge

| Badge | Meaning |
|---|---|
| **Disconnected** | No folder linked yet. Click "Connect folder…". |
| **Needs authorization** | A folder is linked, but the session expired (this happens after reloading the page). You will be prompted when you run. |
| **Connected** | Folder linked and authorization live. |

---

## Troubleshooting

### Redirect URI mismatch when authorizing

The domain you are using is not listed in the app's **Redirect URIs** (step
1.3). Add it exactly, with `https://` and the `/dropbox-callback` path.

### The browser blocked the authorization popup

Allow popups for your RAGfly domain and click **Connect folder…** again.

### The connector doesn't appear at all in the source selector

Both conditions must hold, in Group Parameters:

- the flag `Dropbox connector` is `true`, and
- the `Dropbox — App key` credential is loaded.

If you just changed either one, reload the page.

### "Missing scope" or permission errors when listing folders

The app was authorized before you granted the permissions of step 1.2. Grant
them, then use **Switch account** to re-authorize.

### Some files are skipped

RAGfly ingests documents it can extract text from. Files with no extractable
text (images without OCR, unsupported binaries) are reported as such in the
pipeline, not silently dropped.

---

## Frequently asked

**Does RAGfly store my files?**
No. Bytes are read into your browser, text is extracted there, and only
encrypted text is uploaded. The original file never reaches RAGfly Cloud.

**Can RAGfly modify or delete my Dropbox?**
No. The requested permissions are read-only (`files.metadata.read`,
`files.content.read`).

**Why isn't the App secret needed? Is the App key safe to store?**
RAGfly uses OAuth PKCE, the flow made for browser apps: the secret is never
involved. The App key is a public identifier by design — the real secret is the
access token each user grants in the popup, which lives only in the browser's
memory and is never persisted. Abuse is prevented by the redirect URI
allowlist, not by hiding the key.

**Do I need Dropbox installed on my computer?**
No. Everything goes through Dropbox's API. Files that only exist in the cloud
work fine.

**Can each user connect their own Dropbox?**
Yes. The App key is per group (the app), but each user authorizes their own
Dropbox account and picks their own folder.

**Do I have to repeat this per environment?**
The credential is per group. If you use more than one RAGfly environment, add
each `/dropbox-callback` redirect URI in step 1.3.
