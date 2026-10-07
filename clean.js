const fs = require('fs');
const path = require('path');

const uiDir = path.join(process.cwd(), 'components', 'ui');
const searchDirs = [path.join(process.cwd(), 'app'), path.join(process.cwd(), 'components')];

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
       getAllFiles(filePath, fileList);
    } else {
       if (['.ts', '.tsx', '.js', '.jsx', '.css'].includes(path.extname(filePath))) {
          fileList.push(filePath);
       }
    }
  }
  return fileList;
}

let deletedCount = 0;
let changed = true;

while (changed) {
  changed = false;
  if (!fs.existsSync(uiDir)) break;
  const currentUiFiles = fs.readdirSync(uiDir).filter(f => !fs.statSync(path.join(uiDir, f)).isDirectory());
  
  for (const uiFile of currentUiFiles) {
    const baseName = path.basename(uiFile, path.extname(uiFile));
    let isUsed = false;
    
    const currentAllFiles = [];
    searchDirs.forEach(d => getAllFiles(d, currentAllFiles));
    
    for (const srcFile of currentAllFiles) {
      if (srcFile === path.join(uiDir, uiFile)) continue;
      const content = fs.readFileSync(srcFile, 'utf8');
      
      // Look for standard import patterns for this component
      if (
        content.includes(`ui/${baseName}`) || 
        content.includes(`./${baseName}`) || 
        content.includes(`/${baseName}'`) || 
        content.includes(`/${baseName}"`) ||
        content.includes(`from "${baseName}"`) ||
        content.includes(`from '${baseName}'`)
      ) {
         isUsed = true;
         break;
      }
    }
    
    if (!isUsed) {
      console.log("Deleting Unused UI File:", uiFile);
      fs.unlinkSync(path.join(uiDir, uiFile));
      changed = true;
      deletedCount++;
    }
  }
}

// Also check interactive-globe dir inside ui
const igDir = path.join(uiDir, 'interactive-globe');
if (fs.existsSync(igDir)) {
   let igUsed = false;
   const currentAllFiles = [];
   searchDirs.forEach(d => getAllFiles(d, currentAllFiles));
   for (const srcFile of currentAllFiles) {
      if (srcFile.startsWith(igDir)) continue;
      const content = fs.readFileSync(srcFile, 'utf8');
      if (content.includes('interactive-globe')) {
         igUsed = true;
         break;
      }
   }
   if (!igUsed) {
      console.log("Deleting Unused Directory: interactive-globe");
      fs.rmSync(igDir, { recursive: true, force: true });
   }
}

console.log("Cleanup complete. Total files deleted:", deletedCount);
