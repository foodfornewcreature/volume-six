import { BookChapter, Paragraph, SearchResult, Hints, Line, Table } from "@/types/book";

const CHAPTER_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

// In dev, Vite serves from project root so /src/... works, but in production we copy to /assets.
// Build the base URL depending on environment.
const ASSETS_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.PROD)
    ? "/assets"
    : "/src/assets";

export async function getChapter(id: string): Promise<BookChapter | null> {
  try {
    const response = await fetch(`${ASSETS_BASE}/chapter-${id}.json`, {
      headers: { "Accept": "application/json" },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data as BookChapter;
  } catch (error) {
    console.error(`Failed to fetch chapter ${id}:`, error);
    return null;
  }
}

export async function getChaptersMetadata() {
  const chapterPromises = CHAPTER_NUMBERS.map(async (i) => {
    const id = i.toString().padStart(2, '0');
    const chapterData = await getChapter(id);
    if (chapterData) {
      const titleItem = chapterData.find(item => item.type === 'chapter');
      const hintsItem = chapterData.find(item => item.type === 'hints') as Hints | undefined;

      const hintsValue = hintsItem ? hintsItem.value : null;
      const summaryText = Array.isArray(hintsValue) ? hintsValue.join(' ') : hintsValue ?? "";

      return {
        id,
        title: titleItem ? (titleItem as { value: string }).value : `Chapter ${id}`,
        summary: summaryText ? summaryText.substring(0, 100) + '...' : 'No summary available.',
      };
    }
    return null;
  });

  const chapters = await Promise.all(chapterPromises);
  return chapters.filter((chapter): chapter is NonNullable<typeof chapter> => chapter !== null);
}

export async function searchAllChapters(query: string): Promise<SearchResult[]> {
  if (!query) return [];
  const results: SearchResult[] = [];
  const lowerCaseQuery = query.toLowerCase();

  // Detect English page query patterns like "A10", "a010", "ENG 10"
  const engPageMatch = query.trim().match(/^(?:eng|a)\s*0*([0-9]+)$/i);
  const requestedEnglishPage = engPageMatch ? engPageMatch[1] : null;

  for (const i of CHAPTER_NUMBERS) {
    const id = i.toString().padStart(2, '0');
    const chapterData = await getChapter(id);
    if (!chapterData) continue;

    const chapterTitleItem = chapterData.find(item => item.type === 'chapter');
    const chapterTitle = chapterTitleItem ? (chapterTitleItem as { value: string }).value : `Chapter ${id}`;

    // Track current Tamil page and map paragraphs -> tamilPage
    const pageMap = new Map<string, { tamilPage: string | null }>();
    let currentTamilPage: string | null = null;

    for (const item of chapterData) {
      if (item.type === 'page') {
        currentTamilPage = item.value;
      }
      if (item.type === 'paragraph') {
        pageMap.set(item.id, { tamilPage: currentTamilPage });
      }
    }

    for (const item of chapterData) {
      // Skip page items as they are metadata, not searchable content
      if (item.type === 'page') continue;

      let searchableText = '';
      let englishPage: string | null = null;
      const pageInfo = item.type === 'paragraph' ? pageMap.get(item.id) : null;

      // Extract searchable text based on content type
      switch (item.type) {
        case 'paragraph': {
          const paragraphText = item.content
            .filter((c): c is { type: 'text'; value: string } => c.type === 'text')
            .map(c => c.value)
            .join(' ');
          
          const engPageItem = item.content.find((c): c is { type: 'eng_page'; value: string } => c.type === 'eng_page');
          englishPage = engPageItem ? engPageItem.value : null;
          searchableText = paragraphText;

          break;
        }

        case 'footer_passage':
        case 'hints':
        case 'heading':
        case 'verse':
        case 'italic':
        case 'word':
          if ('value' in item && typeof (item as { value: string }).value === 'string') {
            searchableText = (item as { value: string }).value;
          }
          break;

        case 'chapter':
          if ('value' in item && typeof (item as { value: string }).value === 'string') {
            searchableText = (item as { value: string }).value;
          }
          break;

        case 'poem':
          searchableText = `${item.title} ${item.lines.map(line => line.value).join(' ')}`;
          break;

        case 'image':
          if ('src' in item && typeof (item as { src: string }).src === 'string') {
            searchableText = (item as { src: string }).src;
          }
          break;

        case 'line':
          searchableText = (item as Line).value;
          break;

        case 'table': {
          const table = item as Table;
          const tableText = table.data
            .map(row => {
              const cells = Object.keys(row)
                .filter(key => key.startsWith('cell_'))
                .sort((a, b) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]))
                .map(cellKey => {
                  const cell = row[cellKey as keyof typeof row] as { value: string };
                  return cell?.value || '';
                });
              return cells.join(' ');
            })
            .join(' ');
          searchableText = tableText;
          break;
        }

        default:
          continue; // Skip unknown types
      }

      // Normalize the stored english page to derive numeric portion
      // Stored format appears like "[A30]"; derive "30"
      const englishPageNumeric = englishPage
        ? (englishPage.match(/\[?A\s*0*([0-9]+)\]?/i)?.[1] ?? englishPage.replace(/^0+/, ''))
        : null;

      // 1) Normal text match
      const textMatches = searchableText.toLowerCase().includes(lowerCaseQuery);

      // 2) Direct English page query like "A10"/"ENG 10" matches by numeric page
      const engPageMatches =
        requestedEnglishPage !== null && englishPageNumeric !== null
          ? englishPageNumeric === String(requestedEnglishPage).replace(/^0+/, '')
          : false;

      // 3) Literal match: query equals the stored token or derived labels
      const literalMatches = (() => {
        if (!englishPage) return false;
        // Remove brackets and whitespace: "[A30]" -> "A30"
        const noBrackets = englishPage.replace(/[[\]\s]/g, '');
        const labelA = `A${englishPageNumeric ?? ''}`;
        const labelEng = `ENG ${englishPageNumeric ?? ''}`;
        const q = lowerCaseQuery;
        return (
          englishPage.toLowerCase() === q ||
          noBrackets.toLowerCase() === q ||
          labelA.toLowerCase() === q ||
          labelEng.toLowerCase() === q
        );
      })();

      if (textMatches || engPageMatches || literalMatches) {
        let excerptText = searchableText;

        if (textMatches) {
          const lowerFullText = searchableText.toLowerCase();
          const matchIndex = lowerFullText.indexOf(lowerCaseQuery);
          if (matchIndex !== -1) {
            const contextLength = 250;
            const start = Math.max(0, matchIndex - contextLength);
            const end = Math.min(searchableText.length, matchIndex + lowerCaseQuery.length + contextLength);
            excerptText = searchableText.slice(start, end);
            
            // Add ellipsis if truncated
            let excerpt = excerptText;
            if (start > 0) excerpt = "..." + excerpt;
            if (end < searchableText.length) excerpt += "...";
            
            excerptText = excerpt;
          }
        } else if (searchableText.length > 500) {
          excerptText = searchableText.substring(0, 500) + '...';
        }

        // For non-paragraph types, create a mock paragraph for search results
        const paragraphResult: SearchResult = {
          chapterId: id,
          chapterTitle,
          paragraph: {
            id: item.id, // Use the original item ID for proper scrolling
            type: 'paragraph',
            content: [
              {
                type: 'text',
                value: excerptText
              }
            ]
          },
          tamilPage: pageInfo?.tamilPage || null,
          englishPage: englishPage,
        };

        results.push(paragraphResult);
      }
    }
  }
  return results;
}
