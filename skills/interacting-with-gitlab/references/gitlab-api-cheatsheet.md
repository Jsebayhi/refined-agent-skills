# GitLab API Cheatsheet for MR Discussions

## Discussion APIs

### Post a New Line Comment (Discussion)
**Endpoint:** `POST /projects/:id/merge_requests/:iid/discussions`
**Key Payload Fields:**
*   `body`: (string) The content of the comment.
*   `position`: (object)
    *   `base_sha`: (string) The SHA of the branch being merged into.
    *   `head_sha`: (string) The SHA of the branch being merged.
    *   `start_sha`: (string) The SHA of the common ancestor.
    *   `position_type`: (string) Must be `"text"` for line comments.
    *   `new_path`: (string) The file path in the new version.
    *   `new_line`: (integer) The line number in the new version.

### Reply to an Existing Discussion
**Endpoint:** `POST /projects/:id/merge_requests/:iid/discussions/:discussion_id/notes`
**Key Payload Fields:**
*   `body`: (string) The content of the reply.

### List Discussions
**Endpoint:** `GET /projects/:id/merge_requests/:iid/discussions`
**Notes:** Used to find `discussion_id` and the context of existing threads.

## Common Error Codes

| Status | Meaning | Solution |
| :--- | :--- | :--- |
| `400 Bad Request` | Invalid payload or missing fields. | Check `position` object and SHAs. |
| `401 Unauthorized` | Invalid or missing `GITLAB_TOKEN`. | Run `glab auth login` or check env vars. |
| `403 Forbidden` | Insufficient permissions for the MR. | Verify user access to the project. |
| `404 Not Found` | MR IID or Discussion ID not found. | Verify IID and Discussion ID. |
| `409 Conflict` | Outdated SHAs for line comment. | Re-fetch SHAs for the latest version of the MR. |

## SHA Discovery Tips
The SHAs can be found by querying the MR details:
`glab api projects/:id/merge_requests/:iid | jq '{diff_refs: .diff_refs}'`
- `base_sha`: `.diff_refs.base_sha`
- `head_sha`: `.diff_refs.head_sha`
- `start_sha`: `.diff_refs.start_sha`
