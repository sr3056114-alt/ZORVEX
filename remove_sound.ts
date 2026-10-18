import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove Volume2 and VolumeX imports
  content = content.replace(/,\s*Volume2/g, '');
  content = content.replace(/Volume2,\s*/g, '');
  content = content.replace(/,\s*VolumeX/g, '');
  content = content.replace(/VolumeX,\s*/g, '');
  
  // Remove Volume2 from Play.tsx
  content = content.replace(/<Volume2[^>]*\/>/g, '');
  
  // Remove buttons that toggle mute
  content = content.replace(/<button[^>]*onClick=\{[^}]*setIsMuted[^}]*\}[^>]*>[\s\S]*?<\/button>\n?/g, '');
  content = content.replace(/<button[^>]*onClick=\{toggleMute\}[^>]*>[\s\S]*?<\/button>\n?/g, '');
  
  // Remove MenuItem for Sound in Plinko
  content = content.replace(/<MenuItem icon=\{<Volume2[^>]*\/>\} label="Sound" hasToggle \/>/g, '');

  fs.writeFileSync(filePath, content);
});
console.log('Sound icons removed.');
