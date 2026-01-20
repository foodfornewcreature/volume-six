import React from 'react';
import { BookChapter, ContentItem, Hints, Text, Verse, EngPage, Word, Italic, Bold, Table } from '@/types/book';
import { useFontSize } from '@/context/FontSizeContext';
import {
  Table as UITable,
  TableBody,
  TableCell as UITableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface ChapterContentProps {
  content: BookChapter;
  highlightId?: string | null;
  highlightTerm?: string | null;
}

const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-300 dark:bg-yellow-500 rounded-md px-1">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

// Add highlight styling to all content types
const getHighlightStyles = (isHighlighted: boolean, itemType: string) => {
  if (!isHighlighted) return {};
  
  // Base highlight styles
  const baseStyles = {
    animation: 'highlight-fade 10s ease-out forwards',
    position: 'relative' as const,
    zIndex: 10 as const,
  };
  
  // Add specific padding based on content type
  switch (itemType) {
    case 'chapter':
    case 'heading':
      return {
        ...baseStyles,
        padding: '1rem',
        borderRadius: '0.5rem',
        backgroundColor: 'rgba(250, 204, 21, 0.3)',
      };
    case 'hints':
    case 'footer_passage':
      return {
        ...baseStyles,
        padding: '1rem',
        borderRadius: '0.5rem',
        backgroundColor: 'rgba(250, 204,21, 0.2)',
        border: '2px solid rgba(250, 204, 21, 0.5)',
      };
    case 'poem':
      return {
        ...baseStyles,
        padding: '1rem',
        borderRadius: '0.5rem',
        backgroundColor: 'rgba(250, 204, 21, 0.2)',
      };
    case 'image':
      return {
        ...baseStyles,
        padding: '0.5rem',
        borderRadius: '0.5rem',
        border: '3px solid rgba(250, 204, 21, 0.7)',
      };
    case 'page':
      return {
        ...baseStyles,
        backgroundColor: 'rgba(250, 204, 21, 0.4)',
      };
    default:
      return baseStyles;
  }
};

export const ChapterContent: React.FC<ChapterContentProps> = ({ content, highlightId, highlightTerm }) => {
  const { fontSize } = useFontSize();

  const renderContentItem = (item: ContentItem) => {
    const isHighlighted = item.id === highlightId;
    const highlightClass = isHighlighted ? 'highlight-paragraph' : '';
    
    // Add ID to all content types for scrolling to work
    const elementProps = {
      id: item.id,
      className: highlightClass
    };

    const highlightStyles = getHighlightStyles(isHighlighted, item.type);

    switch (item.type) {
      case 'chapter':
        return (
          <h1
            {...elementProps}
            className="text-4xl font-bold mt-8 mb-4 text-center font-tiro-tamil"
            style={highlightStyles}
          >
            {highlightTerm && item.value.toLowerCase().includes(highlightTerm.toLowerCase())
              ? <HighlightedText text={item.value} highlight={highlightTerm} />
              : item.value
            }
          </h1>
        );
      case 'heading': {
        const heading = item as import('@/types/book').Heading;
        const fontFamily = 'Tiro Tamil';
        return (
          <h2
            {...elementProps}
            className="text-xl font-semibold mt-6 mb-3 text-center"
            style={{fontFamily, fontWeight: 600, ...highlightStyles}}
          >
            {highlightTerm && item.value.toLowerCase().includes(highlightTerm.toLowerCase())
              ? <HighlightedText text={item.value} highlight={highlightTerm} />
              : item.value
            }
          </h2>
        );
      }
      case 'hints': {
        const hintsValue = (item as Hints).value;
        const renderHintsContent = () => {
          if (Array.isArray(hintsValue)) {
            return hintsValue.map((hint, index) => {
              const key = `hint-${index}-${String(hint).slice(0,20)}`;
              return highlightTerm && hint.toLowerCase().includes(highlightTerm.toLowerCase())
                ? <li key={key}><HighlightedText text={hint} highlight={highlightTerm} /></li>
                : <li key={key}>{hint}</li>;
            });
          } else {
            return highlightTerm && hintsValue.toLowerCase().includes(highlightTerm.toLowerCase())
              ? <HighlightedText text={hintsValue} highlight={highlightTerm} />
              : hintsValue;
          }
        };

        return (
          <div
            {...elementProps}
            className="my-4 p-4 rounded-lg font-tiro-tamil bg-muted/70 dark:bg-muted/60 border border-border/60"
            style={highlightStyles}
          >
            {Array.isArray(hintsValue) ? (
              <ul className="list-disc list-inside text-foreground/90">
                {renderHintsContent()}
              </ul>
            ) : (
              <p className="text-foreground/90">{renderHintsContent()}</p>
            )}
          </div>
        );
      }
      case 'paragraph':
        return (
          <p
            {...elementProps}
            className={`mb-4 leading-relaxed font-tiro-tamil break-words [overflow-wrap:break-word] ${highlightClass}`}
            style={{ fontSize: `${fontSize}px`, ...highlightStyles }}
          >
            {item.content.map((contentPart, index) => {
              const key = `${item.id}-part-${index}`;

              // Handle known union members first
              if (contentPart.type === 'text') {
                const value = contentPart.value;
                return highlightTerm && value.toLowerCase().includes(highlightTerm.toLowerCase())
                  ? <HighlightedText key={key} text={value} highlight={highlightTerm} />
                  : <span key={key}>{value}</span>;
              }

              if (contentPart.type === 'verse') {
                return <a key={key} href={contentPart.link} className="text-primary no-underline mx-1">{contentPart.value}</a>;
              }

              if (contentPart.type === 'eng_page') {
                return (
                  <span
                    key={key}
                    id={`page-${contentPart.value}`}
                    className="eng-page text-muted-foreground text-sm mx-1 font-bold"
                  >
                    {contentPart.value}
                  </span>
                );
              }

              // Gracefully support extra token types (e.g., "word") that may appear in JSON
              if ((contentPart as unknown as { type?: string }).type === 'word') {
                const w = contentPart as unknown as { value?: string };
                const val = w.value ?? '';
                const displayValue = val.trim().startsWith('(') && val.trim().endsWith(')')
                  ? val
                  : `(${val})`;
                return (
                  <span
                    key={key}
                    className="mx-1 inline-block rounded bg-secondary px-1.5 py-0.5 text-xs align-baseline break-words [overflow-wrap:break-word] font-inter"
                  >
                    {displayValue}
                  </span>
                );
              }

              if (contentPart.type === 'italic') {
                const value = contentPart.value;
                return (
                  <span
                    key={key}
                    className="italic mx-1"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {` ${value} `}
                  </span>
                );
              }

              if (contentPart.type === 'bold') {
                const value = contentPart.value;
                return (
                  <strong
                    key={key}
                    className="mx-1"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {` ${value} `}
                  </strong>
                );
              }

              return null;
            })}
          </p>
        );
      case 'page':
        return (
          <div
            {...elementProps}
            className="page-break relative my-6 flex items-center justify-center text-muted-foreground font-tiro-tamil"
            style={highlightStyles}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none select-none grow border-t border-dotted border-muted-foreground/50"
            />
            <span className="mx-3 shrink-0 text-xs tabular-nums tracking-wider">
              {item.value.padStart(3, "0")}
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none select-none grow border-t border-dotted border-muted-foreground/50"
            />
          </div>
        );
      case 'image':
        return (
          <div
            {...elementProps}
            className="my-4 mx-auto"
            style={highlightStyles}
          >
            <img
              src={item.src}
              alt="illustration"
              className="max-w-full h-auto"
            />
          </div>
        );
      case 'poem':
        return (
          <div
            {...elementProps}
            className="my-6 mx-auto max-w-md font-tiro-tamil break-words [overflow-wrap:break-word]"
            style={highlightStyles}
          >
            <h4 className="text-xl font-semibold text-center mb-3">
              {highlightTerm && item.title.toLowerCase().includes(highlightTerm.toLowerCase())
                ? <HighlightedText text={item.title} highlight={highlightTerm} />
                : item.title
              }
            </h4>
            <div className="italic space-y-1">
              {item.lines.map((line, index) => {
                const key = `poem-${item.title}-${index}`;
                return highlightTerm && line.value.toLowerCase().includes(highlightTerm.toLowerCase())
                  ? <p key={key} className="text-center"><HighlightedText text={line.value} highlight={highlightTerm} /></p>
                  : <p key={key} className="text-center">{line.value}</p>;
              })}
            </div>
          </div>
        );
      case 'bold':
        return (
          <p
            {...elementProps}
            className={`font-bold text-lg font-tiro-tamil mb-4` + (highlightClass ? ` ${highlightClass}` : '')}
            style={highlightStyles}
          >
            {highlightTerm && item.value.toLowerCase().includes(highlightTerm.toLowerCase())
              ? <HighlightedText text={item.value} highlight={highlightTerm} />
              : item.value
            }
          </p>
        );
      case 'footer_passage':
        return (
          <div
            {...elementProps}
            className="my-6 p-4 rounded-lg border border-border/60 bg-muted/70 dark:bg-muted/60 font-tiro-tamil"
            style={highlightStyles}
          >
            {item.value.split('\n\n').map((paragraph, index) => {
              const key = `footer-${index}`;
              return highlightTerm && paragraph.toLowerCase().includes(highlightTerm.toLowerCase())
                ? <p key={key} className="text-foreground/90 leading-relaxed break-words [overflow-wrap:break-word] mb-4 last:mb-0">
                    <HighlightedText text={paragraph} highlight={highlightTerm} />
                  </p>
                : <p key={key} className="text-foreground/90 leading-relaxed break-words [overflow-wrap:break-word] mb-4 last:mb-0">
                    {paragraph}
                  </p>;
            })}
          </div>
        );
      case 'table': {
        const table = item as Table;
        return (
          <div
            {...elementProps}
            className="my-6 overflow-x-auto border-2 border-border"
            style={highlightStyles}
          >
            <UITable className="min-w-full border-2 border-border">
              <TableBody>
                {table.data.map((row, rowIndex) => {
                  const key = `table-${item.id}-row-${rowIndex}`;
                  const cellEntries = Object.entries(row)
                    .filter(([cellKey]) => cellKey.startsWith('cell_'))
                    .sort(([a], [b]) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]));
                  
                  // Track occupied columns due to colspan
                  let occupiedColumns = 0;
                  const cellsToRender: Array<{
                    shouldSkip: boolean;
                    colSpan: number;
                    value: string;
                    isBold: boolean;
                    isItalic: boolean;
                    isUnderline: boolean;
                    textAlign: 'left' | 'center' | 'right';
                  }> = [];

                  for (const [cellKey, cellData] of cellEntries) {
                    const colIndex = parseInt(cellKey.split('_')[1]);
                    const cell = cellData as {
                      value: string;
                      style?: {
                        align?: 'left' | 'center' | 'right';
                        bold?: boolean;
                        italic?: boolean;
                        underline?: boolean;
                      };
                      colspan?: number;
                    };
                    const colSpan = cell.colspan || 1;

                    // If this cell falls within an already occupied column range, skip it
                    if (colIndex < occupiedColumns) {
                      continue;
                    }

                    // Update occupied columns if this cell has colspan
                    if (colSpan > 1) {
                      occupiedColumns = colIndex + colSpan;
                    }

                    cellsToRender.push({
                      shouldSkip: false,
                      colSpan: colSpan,
                      value: cell.value,
                      isBold: cell.style?.bold || false,
                      isItalic: cell.style?.italic || false,
                      isUnderline: cell.style?.underline || false,
                      textAlign: cell.style?.align || 'left'
                    });
                  }
                  
                  return (
                    <TableRow key={key} className="border border-border">
                      {cellsToRender.map((cell, cellIndex) => {
                        const cellKey = `table-${item.id}-row-${rowIndex}-cell-${cellIndex}`;
                        
                        return (
                          <UITableCell
                            key={cellKey}
                            className={[
                              "font-tiro-tamil border border-border",
                              cell.isBold ? "font-bold" : "",
                              cell.isItalic ? "italic" : "",
                              cell.isUnderline ? "underline" : "",
                            ].join(" ").trim()}
                            style={{
                              textAlign: cell.textAlign,
                              fontSize: `${fontSize}px`,
                              ...(cell.isUnderline && { textDecorationThickness: '2px' }),
                            } as React.CSSProperties}
                            {...(cell.colSpan > 1 && { colSpan: cell.colSpan })}
                          >
                            {highlightTerm &&
                            cell.value.toLowerCase().includes(highlightTerm.toLowerCase()) ? (
                              <HighlightedText text={cell.value} highlight={highlightTerm} />
                            ) : (
                              cell.value
                            )}
                          </UITableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </UITable>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div>
      <style>
        {`
          @keyframes highlight-fade {
            from { background-color: rgba(250, 204, 21, 0.7); }
            to { background-color: transparent; }
          }
          .highlight-paragraph {
            animation: highlight-fade 10s ease-out forwards;
          }
        `}
      </style>
      {content.map(item => (
        <React.Fragment key={item.id}>
          {renderContentItem(item)}
        </React.Fragment>
      ))}
    </div>
  );
};
