import Badge from './Badge';

export default function StatusBadge({ status }) {
  const tone = {
    Applied: 'blue',
    Shortlisted: 'green',
    Interview: 'amber',
    Rejected: 'rose',
    Hired: 'green',
    Active: 'green',
    Closed: 'rose',
    Draft: 'amber',
  }[status] || 'slate';
  return <Badge tone={tone}>{status}</Badge>;
}
