import type { NextApiRequest, NextApiResponse } from 'next'
import JiraApi from 'jira-client';

let jira = new JiraApi({
  protocol: 'https',
  host: 'your-jira-instance.atlassian.net',
  username: 'username',
  password: 'password',
  apiVersion: '2',
  strictSSL: true
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { issueKey, comment } = req.body;

  try {
    if (req.method === 'POST' && comment) {
      const newComment = await jira.addComment(issueKey, comment);
      res.status(200).json(newComment);
    } else {
      const issue = await jira.findIssue(issueKey);
      res.status(200).json(issue.fields.comment.comments || []);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred.' });
    }
  }
}