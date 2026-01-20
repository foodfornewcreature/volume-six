import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { searchAllChapters } from "@/lib/book-data";
import { SearchResult } from "@/types/book";
import { Skeleton } from "@/components/ui/skeleton";
import { PageNavigator } from "@/components/PageNavigator";

const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-300 dark:bg-yellow-500 rounded-md px-1">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

const SearchResultCard = ({ result, query }: { result: SearchResult; query: string }) => {
  const paragraphText = result.paragraph.content
    .filter((c) => c.type === "text")
    .map((c) => ("value" in c ? (c as { value: string }).value : ""))
    .join(" ");

  return (
    <Card>
      <CardContent className="p-4">
        <Link to={`/chapter/${result.chapterId}?highlight=${result.paragraph.id}&term=${query}`} className="block mb-4">
          <p className="mb-2 text-sm text-muted-foreground font-tiro-tamil search-chapter-title">{result.chapterTitle}</p>
          <p className="text-foreground font-tiro-tamil">
            <HighlightedText text={paragraphText} highlight={query} />
          </p>
        </Link>
        <div className="flex gap-2 flex-wrap">
          {result.tamilPage && (
            <Link to={`/chapter/${result.chapterId}?page=${result.tamilPage}`}>
              <Badge variant="outline" className="hover:bg-accent transition-colors">Tamil Page {result.tamilPage}</Badge>
            </Link>
          )}
          {result.englishPage && (
            <Link to={`/chapter/${result.chapterId}?page=${result.englishPage}`}>
              <Badge variant="outline" className="hover:bg-accent transition-colors">English Page {result.englishPage}</Badge>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchQuery(query);
    if (query) {
      setLoading(true);
      searchAllChapters(query).then(data => {
        setResults(data);
        setLoading(false);
      });
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <form onSubmit={handleSearch} className="rounded-lg border bg-card p-3 md:p-4">
          <div className="relative">
            <svg className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <Input
              type="search"
              placeholder="Type Keyword"
              className="w-full pl-8 pr-20 h-9 search-input font-tiro-tamil"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              aria-label="Search"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              Search
            </button>
          </div>
        </form>
        
        <PageNavigator />
        {!loading && results.length > 0 && (
          <div className="text-center mb-4">
            <p className="text-lg font-medium">{results.length} results found for "{query}"</p>
          </div>
        )}
        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <SearchResultCard key={`${result.chapterId}-${result.paragraph.id}-${index}`} result={result} query={query} />
            ))
          ) : (
            query && <p className="text-center text-muted-foreground">No results found for "{query}".</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
