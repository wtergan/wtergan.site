'use client'; // client-side module.

// for hook functionality and creation of supabase client.
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// hooking up supabase for db access.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// type definition for 'Link' obj.
type Link = {
  id: number;
  title: string;
  url: string;
  date: string;
  note?: string;    // ? means this property is optional.
};

/*
function for adding links to page:
  - three useState' vars: 'links' for storing array of 'Link' objs, 'loading' for a boolean flag,
    'searchQuery' for search input.
  - 'useEffect' that fetches all links in the db in descending order:
    -- if db returns error, display error, else set data to 'links' stateVar.
    -- set 'loading' stateVar to 'false'.
    -- execution of code via 'fetchlinks()', followed by empty dep. array since it only run
       once when the component mounts. No cleanup code needed since only fetching data once.
*/ 
const LinksPage = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLinks = async () => {
      const { data, error } = await supabase
        .from('links')
        .select('*')    
        .order('id', { ascending: true });

      if (error) console.error('Error fetching links:', error);
      else setLinks(data);
      setLoading(false);
    };

    fetchLinks();  // runs the async function: mounts the component.
  }, []);    

  /*
  Facilitates real-time search:
    - for each link in the links array, convert desired element to filter to lowercase,
      check if it contains searchQuery.
    - OR operator, so filter returns True if any of the conditions are met.
   */
  const filteredLinks = links.filter(link => 
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.note.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;

  /*
  actual creation of the page:
    - renders a search input that filters links by title, url, note in real-time.
    - each link is displayed as an interactive card w/ title, url, note and read date.
    - clickable/keyboard accessible.
  */
  return (
    <section>
      <div className="flex justify-between items-center w-full mb-4">
        <input
          type="text"
          placeholder="Search links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/3 px-4 py-2 bg-gray-900 text-gray-300 rounded border border-gray-300 focus:outline-none focus:border-blue-400"
        />
      </div>
      <ul className="space-y-0">
        {filteredLinks.map((link) => (
          <li key={link.id}>
            <article
              tabIndex={0}
              aria-label={`${link.title}`}
              onClick={() => window.open(link.url, '_blank')}
              onKeyDown={(e) => {
                if (e.key === "Enter") window.open(link.url, '_blank');
              }}
              className="p-4 bg-gray-900 rounded shadow hover:shadow-md cursur-pointer transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{link.title}</h2>
                  <p className="text-sm">{link.note}</p>
                </div>
                <p className="text-sm text-gray-300">
                  {new Date(link.date).toLocaleDateString('en-US', {
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

export default LinksPage;