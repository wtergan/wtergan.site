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
  note?: string;    // ? means this property is optional.\
  desc?: string;
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
        .order('date', { ascending: false });  // descending order

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
    - a tooltip that displays a brief description of a link when hovered over.
  */
  return (
    <section>
      <div className="flex justify-between items-center w-full mb-4">
        <input
          type="text"
          placeholder="Search links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>
      <ul className="space-y-0">
        {filteredLinks.map((link) => (
          <li key={link.id} className="relative group">
            <article
              tabIndex={0}
              aria-label={`${link.title}`}
              onClick={() => window.open(link.url, '_blank')}
              onKeyDown={(e) => {
                if (e.key === "Enter") window.open(link.url, '_blank');
              }}
              className="entry-card"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold truncate">{link.title}</h2>
                  <p className="text-xs">{link.note}</p>
                </div>
                <p className="text-xs text-gray-300 min-w-[80px] text-right">
                  {new Date(link.date + 'T00:00:00Z').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'utc'
                  })}
                </p>
              </div>
            </article>  
            {/* tooltip for the hover */}
            <div className="tooltip">
              {link.desc || "No description available"}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LinksPage;