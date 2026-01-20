import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChapter } from '@/lib/book-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface PageOption {
  chapterId: string;
  value: string;
  id?: string;
}

export function PageNavigator() {
  const [tamilPages, setTamilPages] = useState<PageOption[]>([]);
  const [englishPages, setEnglishPages] = useState<PageOption[]>([]);
  const [selectedTamilPage, setSelectedTamilPage] = useState<string>('');
  const [selectedEnglishPage, setSelectedEnglishPage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllPages = async () => {
      setLoading(true);
      const tamilPagesArray: PageOption[] = [];
      const englishPagesArray: PageOption[] = [];

      // Fetch data from all chapters (16 chapters)
      for (let i = 1; i <= 16; i++) {
        const chapterId = i.toString().padStart(2, '0');
        const chapterData = await getChapter(chapterId);
        
        if (chapterData) {
          // Extract Tamil pages (type: "page")
          const tamilPageItems = chapterData.filter(item => item.type === 'page');
          tamilPageItems.forEach(item => {
            tamilPagesArray.push({
              chapterId,
              value: item.value,
              id: item.id
            });
          });

          // Extract English pages (type: "eng_page")
          chapterData.forEach(item => {
            if (item.type === 'paragraph') {
              const engPageItems = item.content.filter(content => content.type === 'eng_page');
              engPageItems.forEach(engPage => {
                englishPagesArray.push({
                  chapterId,
                  value: engPage.value
                });
              });
            }
          });
        }
      }

      setTamilPages(tamilPagesArray);
      setEnglishPages(englishPagesArray);
      setLoading(false);
    };

    fetchAllPages();
  }, []);

  const handleGoToPage = () => {
    if (selectedTamilPage) {
      const [chapterId, rawPageValue] = selectedTamilPage.split('|');
      // Normalize the page value to match the ID format in ChapterContent.tsx (e.g., "002" from "Page 002")
      const pageValue = rawPageValue.replace(/^Page\s+/i, '').trim();
      navigate(`/chapter/${chapterId}?page=${pageValue}`);
    } else if (selectedEnglishPage) {
      const [chapterId, pageValue] = selectedEnglishPage.split('|');
      // For English pages, we need to use the full value including brackets
      // as the ID in ChapterContent.tsx is formatted as `page-${contentPart.value}`
      navigate(`/chapter/${chapterId}?page=${pageValue}`);
    }
  };

  return (
    <div className="flex flex-row gap-2 p-3 md:p-4 rounded-lg border bg-card">
      <div className="flex-1">
        <label htmlFor="tamil-page" className="block text-xs font-medium mb-1">Tamil Page</label>
        <Select
          value={selectedTamilPage}
          onValueChange={setSelectedTamilPage}
          disabled={loading}
        >
          <SelectTrigger id="tamil-page" className="w-full">
            <SelectValue placeholder="Select Tamil page" />
          </SelectTrigger>
          <SelectContent>
            {tamilPages.map((page, index) => (
              <SelectItem key={`${page.chapterId}-${page.value}-${index}`} value={`${page.chapterId}|${page.value}`}>
                {page.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <label htmlFor="english-page" className="block text-xs font-medium mb-1">English Page</label>
        <Select
          value={selectedEnglishPage}
          onValueChange={setSelectedEnglishPage}
          disabled={loading}
        >
          <SelectTrigger id="english-page" className="w-full">
            <SelectValue placeholder="Select English page" />
          </SelectTrigger>
          <SelectContent>
            {englishPages.map((page, index) => (
              <SelectItem key={`${page.chapterId}-${page.value}-${index}`} value={`${page.chapterId}|${page.value}`}>
                {page.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button 
          onClick={handleGoToPage} 
          disabled={loading || (!selectedTamilPage && !selectedEnglishPage)}
          className="w-full mt-auto"
        >
          Go
        </Button>
      </div>
    </div>
  );
}