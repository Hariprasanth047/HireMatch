import Button from './Button';

export default function Pagination({ page, totalPages, onPage }) {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <Button variant="secondary" disabled={page === 1} onClick={() => onPage(page - 1)}>Previous</Button>
      {Array.from({ length: totalPages }).map((_, index) => (
        <Button key={index} variant={page === index + 1 ? 'primary' : 'secondary'} onClick={() => onPage(index + 1)}>{index + 1}</Button>
      ))}
      <Button variant="secondary" disabled={page === totalPages} onClick={() => onPage(page + 1)}>Next</Button>
    </nav>
  );
}
