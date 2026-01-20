import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getChaptersMetadata } from "@/lib/book-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { PageNavigator } from "@/components/PageNavigator";

interface ChapterMetadata {
  id: string;
  title: string;
  summary: string;
}

const ChaptersGrid = () => {
  const [chapters, setChapters] = useState<ChapterMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapters = async () => {
      const metadata = await getChaptersMetadata();
      setChapters(metadata);
      setLoading(false);
    };
    fetchChapters();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-0 overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full w-[60px] flex items-center justify-center bg-muted/50">
              <Skeleton className="h-10 w-10 rounded-full font-anek-tamil" />
            </div>
            <CardHeader className="py-3 pl-[70px]">
              <Skeleton className="h-5 w-1/2" />
            </CardHeader>
            <CardContent className="py-0 pb-3 pl-[70px] space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {chapters.map((chapter, idx) => (
        <Card
          key={chapter.id}
          className="cursor-pointer transition-colors hover:bg-muted/50 overflow-hidden relative"
          onClick={() => navigate(`/chapter/${chapter.id}`)}
        >
          <div className="absolute left-0 top-0 h-full w-[60px] flex items-center justify-center bg-muted/50">
            <span className="text-3xl font-bold font-anek-tamil">{chapter.id}</span>
          </div>
          <CardHeader className="py-3 pl-[70px]">
            <CardTitle className="font-tiro-tamil text-base">{chapter.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3 pl-[70px]">
            <p className="text-sm text-muted-foreground font-tiro-tamil line-clamp-2">{chapter.summary}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        <form onSubmit={handleSearch} className="rounded-lg border bg-card p-3 md:p-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Type Tamil Keyword"
              className="w-full pl-8 pr-20 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5" />
              Search
            </button>
          </div>
        </form>
        
        <PageNavigator />

        <section className="space-y-2">
          <ChaptersGrid />
        </section>
      </div>
    </Layout>
  );
};

export default Index;