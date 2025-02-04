'use client';  // client-side module.

// for hook functionality and creation of supabase client.
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// hooking up supabase for db access.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// type definition for 'Paper' obj.
type Paper = {
  id: number;
  title: string;
  authors: string;
  url: string;
  year: number;
  date: string;
};

/*
function for adding papers to the page:
  - three 'useState' vars: 'papers' for storing array of 'Paper' objs, 'loading' for a boolean flag,
    'searchQuery' for search input.
  - 'useEffect' that fetches all links in the db in descending order:
    -- if db returns error, display error, else set data to 'papers' stateVar.
    -- set 'loading' stateVar to 'false'.
    -- execution of code via 'fetchPapers()', follwed by empty dep. array since it only run
       once when the component mounts. No cleanup code needed since only fetching data once.
 */
const PapersPage = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPapers = async () => {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .order('id', { ascending: true });

      if (error) console.error('Error fetching papers:', error);
      else setPapers(data);
      setLoading(false);
    };

    fetchPapers();   // runs the async function: mounts the component.
  }, []);

  /*
  Facilitates real-time search:
    - for each paper in the papers array, convert desired element to filter to lowercase,
      check if it contains searchQuery.
    - OR operator, so filter returns True ifany of the conditions are met.
   */
  const filteredPapers = papers.filter(paper =>
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.year.toString().includes(searchQuery)
  );

  if (loading) return <p>Loading...</p>;

  /*
  actual creation of the page:
    - renders a search input that filters papers by title, authors, or year in real time.
    - each paper is displayed as an interactive card w/ title, authors, year, and read date.
    - clickable/keyboard accessible.
  */
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">papers</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search papers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-gray-900 text-gray-300 rounded border border-gray-300 focus:outline-none focus:border-blue-400"
          />
          <h2 className="text-xl font-bold">Date Read</h2>
        </div>
      </div>
      <ul className="space-y-0">
        {filteredPapers.map((paper) => (
          <li key={paper.id}>
            <article
              tabIndex={0}
              aria-label={`${paper.title} by ${paper.authors}`}
              onClick={() => window.open(paper.url, '_blank')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') window.open(paper.url, '_blank');
              }}
              className="p-4 bg-gray-900 rounded shadow hover:shadow-md cursor-pointer transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{paper.title}</h2>
                  <p className="text-sm">{paper.authors}</p>
                  <p className="text-sm text-gray-300">{paper.year}</p>
                </div>
                <p className="text-sm text-gray-300">
                  {new Date(paper.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PapersPage;