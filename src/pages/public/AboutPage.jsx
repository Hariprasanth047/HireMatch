import Card from '../../components/common/Card';

export default function AboutPage() {
  return <div className="mx-auto max-w-4xl px-4 py-12"><Card className="p-8"><h1 className="text-3xl font-bold">About HireMatch</h1><p className="mt-4 text-slate-600 dark:text-slate-300">HireMatch is a production-style frontend for a smart recruitment platform. This phase uses mock data, local state, localStorage, and a demo matching utility so the full UI can be reviewed before backend integration.</p></Card></div>;
}
