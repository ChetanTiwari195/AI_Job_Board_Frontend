const fs = require('fs');
const files = [
    'D:/AI_Job_Board/frontend/extension/src/components/AuthForm.tsx',
    'D:/AI_Job_Board/frontend/extension/src/components/FileUpload.tsx',
    'D:/AI_Job_Board/frontend/extension/src/components/KeywordSelector.tsx',
    'D:/AI_Job_Board/frontend/extension/src/components/ProgressBar.tsx',
    'D:/AI_Job_Board/frontend/extension/src/components/Results.tsx',
    'D:/AI_Job_Board/frontend/extension/src/pages/Popup.tsx'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    let imports = [];
    if (content.includes('🌙') || content.includes('☀️')) imports.push('Moon', 'Sun');
    if (content.includes('✓') || content.includes('✅')) imports.push('Check');
    if (content.includes('❌')) imports.push('X');
    if (content.includes('🎉') || content.includes('✨')) imports.push('Sparkles');
    if (content.includes('⚠️')) imports.push('AlertTriangle');
    if (content.includes('📄') || content.includes('📑')) imports.push('FileText');
    if (content.includes('💾')) imports.push('Save');
    if (content.includes('🔍')) imports.push('Search');
    if (content.includes('🚀')) imports.push('Zap');
    
    if (imports.length > 0) {
        content = "import { " + imports.join(', ') + " } from 'lucide-react';\n" + content;
    }

    content = content.replace(/'🌙'/g, "<Moon size={16} />");
    content = content.replace(/'☀️'/g, "<Sun size={16} />");
    // Only wrap with <> </> if we are inside a JSX expression string
    content = content.replace(/'🔍 Get ATS Score & Keywords'/g, "<><Search size={16} className=\"inline mr-1\" /> Get ATS Score & Keywords</>");
    content = content.replace(/`🚀 Optimize with \$\{selectedKeywords\.size\} Selected Keywords`/g, "<><Zap size={16} className=\"inline mr-1\" /> Optimize with {selectedKeywords.size} Selected Keywords</>");
    
    content = content.replace(/✓/g, "<Check size={14} className=\"inline\" />");
    content = content.replace(/✅/g, "<Check size={18} className=\"inline mr-2\" />");
    content = content.replace(/❌/g, "<X size={18} className=\"inline mr-2\" />");
    content = content.replace(/🎉/g, "<Sparkles size={18} className=\"inline mr-2\" />");
    content = content.replace(/✨/g, "<Sparkles size={18} className=\"inline mr-2\" />");
    content = content.replace(/⚠️/g, "<AlertTriangle size={18} className=\"inline mr-2\" />");
    content = content.replace(/📄/g, "<FileText size={16} className=\"inline mr-1\" />");
    content = content.replace(/📑/g, "<FileText size={16} className=\"inline mr-1\" />");
    content = content.replace(/💾/g, "<Save size={16} className=\"inline mr-1\" />");

    fs.writeFileSync(file, content, 'utf8');
});
