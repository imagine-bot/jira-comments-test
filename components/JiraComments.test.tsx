import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import JiraComments from './JiraComments'

test('renders JiraComments and checks for comments', async () => {
  render(<JiraComments issueKey="TEST-123" />)

  const fetchCommentsButton = screen.getByText(/Fetch Comments/i)
  fireEvent.click(fetchCommentsButton)

  await waitFor(() => screen.getByText(/No comments yet./i))

  expect(screen.getByText(/No comments yet./i)).toBeInTheDocument()
})

test('handles error when fetching comments', async () => {
  render(<JiraComments issueKey="INVALID-KEY" />)

  const fetchCommentsButton = screen.getByText(/Fetch Comments/i)
  fireEvent.click(fetchCommentsButton)

  await waitFor(() => screen.getByText(/Error:/i))

  expect(screen.getByText(/Error:/i)).toBeInTheDocument()
})