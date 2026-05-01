/// <reference lib="webworker" />
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import { Volume, createFsFromVolume } from 'memfs';
import { buildReport } from '../../src/analyze';
import { CommitData } from '../../src/types'; // Assuming shared logic

const vol = new Volume();
const fs = createFsFromVolume(vol) as any;

self.addEventListener('message', async (e) => {
  const { type, url } = e.data;
  
  if (type === 'START') {
    try {
      const dir = '/repo';
      vol.reset();
      await fs.promises.mkdir(dir, { recursive: true });

      self.postMessage({ type: 'PROGRESS', phase: 'Connecting to GitHub proxy...', progress: 0 });

      await git.clone({
        fs,
        http,
        dir,
        corsProxy: 'https://cors.isomorphic-git.org',
        url,
        singleBranch: true,
        depth: 500,
        onProgress: (event) => {
          let percent = 0;
          if (event.total) {
            percent = Math.floor((event.loaded / event.total) * 100);
          }
          self.postMessage({ 
            type: 'PROGRESS',
            phase: `Cloning repository into browser memory (${percent}%)...`, 
            progress: percent 
          });
        }
      });

      self.postMessage({ type: 'PROGRESS', phase: 'Analyzing commit strata...', progress: null });

      const log = await git.log({ fs, dir, depth: 500 });
      const commits: CommitData[] = [];

      const flatten = (arr: any[]): any[] => arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

      for (const commit of log) {
        const parentOid = commit.commit.parent ? commit.commit.parent[0] : undefined;
        
        const trees = [git.TREE({ ref: commit.oid })];
        if (parentOid) {
          trees.push(git.TREE({ ref: parentOid }));
        }

        // Walk the tree to find changed files between head and parent
        const changes = await git.walk({
          fs,
          dir,
          trees,
          map: async function(filepath, [head, parent]) {
            if (filepath === '.') return true;
            
            const headOid = head ? await head.oid() : undefined;
            const parentOid = parent ? await parent.oid() : undefined;
            
            if (headOid !== parentOid) {
               const nodeType = head ? await head.type() : (parent ? await parent.type() : 'blob');
               if (nodeType === 'tree') {
                 return true; // descend
               }
               return filepath; // file changed
            }
          }
        });

        const flatChanges = flatten(changes).filter((x: any) => typeof x === 'string');

        const numStats = flatChanges.map((filepath: string) => ({
          added: 1, // Represents 1 churn event
          deleted: 0,
          path: filepath
        }));

        commits.push({
          sha: commit.oid,
          date: new Date(commit.commit.author.timestamp * 1000).toISOString(),
          author: commit.commit.author.name,
          subject: commit.commit.message.split('\n')[0],
          numStats,
          renames: [] // Shallow clone ignores renames for speed
        });
      }

      self.postMessage({ type: 'PROGRESS', phase: 'Building exhibits...', progress: null });

      // Identify tracked files at HEAD
      const trackedFilesTree = await git.walk({
        fs, dir, trees: [git.TREE({ ref: log[0].oid })],
        map: async (filepath, [head]) => {
          if (filepath === '.') return true;
          if (head && await head.type() === 'tree') return true;
          return filepath;
        }
      });
      const trackedFiles = flatten(trackedFilesTree).filter((x: any) => typeof x === 'string');

      const repoParts = url.split('/');
      const repoName = repoParts[repoParts.length - 1].replace('.git', '');

      const reportData = buildReport(commits.reverse(), trackedFiles, {
        repoName,
        repoPath: url,
        gitVersion: 'isomorphic-git (Browser)',
        numEras: 6
      });

      self.postMessage({ type: 'DONE', payload: reportData });

    } catch (err: any) {
      self.postMessage({ type: 'ERROR', error: err.message });
    }
  }
});
