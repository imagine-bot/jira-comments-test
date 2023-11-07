import React, { useState, useEffect } from 'react';
import JiraApi from 'jira-client';

// Initialize Jira client
let jira = new JiraApi({
  protocol: 'https',
  host: 'your-jira-instance.atlassian.net',
  username: 'username',
  password: 'password',
  apiVersion: '2',
  strictSSL: true
});

interface JiraCommentsProps {
  issueKey: string;
}

// Define a type for the comments
interface Comment {
  body: string;
  author: {
    displayName: string;
  };
}

const JiraComments: React.FC<JiraCommentsProps> = ({ issueKey }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchComments();
  }, [issueKey]);

  const fetchComments = async () => {
    try {
      const issue = await jira.findIssue(issueKey);
      setComments(issue.fields.comment.comments || []);
    } catch (err) {
      setError(err as Error);
    }
  };

  const addComment = async () => {
    try {
      const comment = await jira.addComment(issueKey, 'New comment');
      setComments([...comments, comment]);
    } catch (err) {
      setError(err as Error);
    }
  };

  return (
    <div className="p-4 rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-2">Comments</h2>
      {error && <div className="text-red-500">{error.message}</div>}
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment, index) => (
          <div key={index} className="border-b pb-2 mb-2">
            <p className="text-sm">{comment.body}</p>
            <p className="text-xs text-gray-500">{comment.author.displayName}</p>
          </div>
        ))
      )}
      <button className="mr-2 py-1 px-3 rounded bg-blue-500 text-white" onClick={fetchComments}>Fetch Comments</button>
      <button className="py-1 px-3 rounded bg-green-500 text-white" onClick={addComment}>Add Comment</button>
    </div>
  );
};

export default JiraComments;