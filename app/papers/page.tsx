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
  desc?: string;
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
        .order('date', { ascending: false });  // descending order
      
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
    - a tooltip that displays a brief description of a page when hovered over.
  */
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <input 
          type="text"
          placeholder="Seach papers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>
      <ul className="space-y-0">
        {filteredPapers.map((paper) => (
          <li key={paper.id} className="relative group">
            <article
              tabIndex={0}
              aria-label={`${paper.title} by ${paper.authors}`}
              onClick={() => window.open(paper.url, '_blank')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') window.open(paper.url, '_blank');
              }}
              className="entry-card"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold truncate">{paper.title}</h2>
                  <p className="text-xs">{paper.authors}</p>
                  <p className="text-xs text-gray-300">{paper.year}</p>
                </div>
                <p className="text-xs text-gray-300 min-w-[80px] text-right">
                {new Date(paper.date + 'T00:00:00Z').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </article>
            {/* tooltip for the hover */}
            <div className="tooltip">
              {paper.desc || "No description available"}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PapersPage;