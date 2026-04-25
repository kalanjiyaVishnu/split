import { createTwoFilesPatch } from 'diff';
import { diff as jsonDiff } from 'json-diff';

export function computeUnifiedDiff(left: string, right: string, fileType: string): string {
  let leftFormatted = left;
  let rightFormatted = right;

  if (fileType === 'json') {
    try {
      // Try to format for better diffing
      if (left.trim()) leftFormatted = JSON.stringify(JSON.parse(left), null, 2);
      if (right.trim()) rightFormatted = JSON.stringify(JSON.parse(right), null, 2);
    } catch (e) {
      // Fallback to raw if unparseable
    }
  }

  return createTwoFilesPatch('Original', 'Modified', leftFormatted, rightFormatted, '', '', {
    context: 3,
  });
}

export type DiffStats = {
  addedLines: number;
  removedLines: number;
  changedLines: number;
  similarity: number;
  keysAdded?: number;
  keysRemoved?: number;
  keysChanged?: number;
};

export function computeDiffStats(unifiedDiff: string, left: string, right: string, fileType: string): DiffStats {
  const lines = unifiedDiff.split('\n');
  let addedLines = 0;
  let removedLines = 0;
  let changedLinesCount = 0; // Approximate changed lines from +/- pairs, but we'll stick to diff stats

  // diff2html logic: we can just count lines from the unified patch
  // Lines starting with + (but not +++)
  // Lines starting with - (but not ---)
  for (const line of lines) {
    if (line.startsWith('+') && !line.startsWith('+++')) addedLines++;
    if (line.startsWith('-') && !line.startsWith('---')) removedLines++;
  }

  // Similarity is approx unchanged / total
  const leftLineCount = left.split('\n').length;
  const rightLineCount = right.split('\n').length;
  const maxLines = Math.max(leftLineCount, rightLineCount, 1);
  const changedOrRemoved = removedLines + addedLines;
  // A rough similarity calc
  let similarity = Math.max(0, 100 - (changedOrRemoved / (maxLines * 2)) * 100);
  
  const stats: DiffStats = {
    addedLines,
    removedLines,
    changedLines: 0, // Hard to precisely distinguish "changed" from added+removed in basic unified diff without word-diff
    similarity: Math.round(similarity),
  };

  if (fileType === 'json') {
    try {
      const leftObj = JSON.parse(left);
      const rightObj = JSON.parse(right);
      const delta = jsonDiff(leftObj, rightObj);
      
      let keysAdded = 0;
      let keysRemoved = 0;
      let keysChanged = 0;

      // Simplistic shallow calculation for the summary bar
      if (delta && typeof delta === 'object') {
         // json-diff uses suffixes like __added, __deleted for array items, and keys with + or - 
         // Let's just do a shallow check of top level keys as requested:
         // "(computed from a shallow structural diff of the top-level JSON keys)"
         const leftKeys = new Set(Object.keys(leftObj));
         const rightKeys = new Set(Object.keys(rightObj));
         
         for (const k of rightKeys) {
           if (!leftKeys.has(k)) keysAdded++;
           else if (JSON.stringify(leftObj[k]) !== JSON.stringify(rightObj[k])) keysChanged++;
         }
         for (const k of leftKeys) {
           if (!rightKeys.has(k)) keysRemoved++;
         }
      }
      
      stats.keysAdded = keysAdded;
      stats.keysRemoved = keysRemoved;
      stats.keysChanged = keysChanged;
    } catch (e) {
      // Ignored
    }
  }

  return stats;
}
