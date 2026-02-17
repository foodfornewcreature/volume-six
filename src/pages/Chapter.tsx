import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { getChapter } from '@/lib/book-data';
import { BookChapter } from '@/types/book';
import { ChapterContent } from '@/components/ChapterContent';
import { Skeleton } from '@/components/ui/skeleton';
import { showError } from '@/utils/toast';

const CHAPTER_COUNT = 17;

const Chapter = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [chapterData, setChapterData] = useState<BookChapter | null>(null);
  const [loading, setLoading] = useState(true);

  const highlightId = searchParams.get('highlight');
  const highlightTerm = searchParams.get('term');
  const page = searchParams.get('page');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setChapterData(null);
    getChapter(id).then(data => {
      if (data) {
        setChapterData(data);
      } else {
        showError(`Chapter ${id} not found.`);
        navigate('/');
      }
      setLoading(false);
    });
  }, [id, navigate]);

  useEffect(() => {
    if (!loading && chapterData) {
      let elementId = highlightId;
      
      // Handle page navigation - normalize page value to match element IDs
      if (page && !highlightId) {
        let pageIdentifier = page;
        // Apply normalization only if it's a Tamil page (starts with "Page ")
        if (page.toLowerCase().startsWith('page ')) {
          pageIdentifier = page.replace(/^Page\s+/i, '').trim(); // Remove "Page " prefix, keep case for number
        }
        // For English pages, pageIdentifier will already be in the correct format (e.g., "[A10]")
        elementId = `page-${pageIdentifier}`;
      }
      
      if (elementId) {
        setTimeout(() => {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            // Fallback: scroll to top if element not found
            console.log(`Element with ID "${elementId}" not found. Available page IDs:`,
              chapterData.filter(item => item.type === 'page').map(item => item.id));
            window.scrollTo(0, 0);
          }
        }, 500); // Increased timeout to ensure content is fully rendered
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [loading, chapterData, highlightId, page]);

  const handlePrev = () => {
    const currentId = parseInt(id!, 10);
    if (currentId > 1) {
      navigate(`/chapter/${(currentId - 1).toString().padStart(2, '0')}`);
    }
  };

  const handleNext = () => {
    const currentId = parseInt(id!, 10);
    if (currentId < CHAPTER_COUNT) {
      navigate(`/chapter/${(currentId + 1).toString().padStart(2, '0')}`);
    }
  };

  const footerProps = {
    onPrev: parseInt(id!, 10) > 1 ? handlePrev : undefined,
    onNext: parseInt(id!, 10) < CHAPTER_COUNT ? handleNext : undefined,
  };

  return (
    <Layout footerProps={footerProps}>
      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-10 w-1/2 mx-auto" />
          <Skeleton className="h-8 w-1/3" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>
        </div>
      ) : chapterData ? (
        <ChapterContent content={chapterData} highlightId={highlightId} highlightTerm={highlightTerm} />
      ) : null}
    </Layout>
  );
};

export default Chapter;