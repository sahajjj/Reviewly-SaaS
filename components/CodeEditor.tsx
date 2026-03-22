'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, onChange }) => {
  return (
    <div style={{ height: 420, width: '100%', background: '#1e1e1e' }}>
      <Editor
        height="100%"
        width="100%"
        language={language.toLowerCase()}
        theme="vs-dark"
        value={code}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: true,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
          fontLigatures: true,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderWhitespace: 'none',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          contextmenu: true,
          scrollbar: {
            alwaysConsumeMouseWheel: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </div>
  );
};

export default CodeEditor;
