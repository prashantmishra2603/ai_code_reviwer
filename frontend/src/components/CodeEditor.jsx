import React from 'react'
import Editor from '@monaco-editor/react'
import { useTheme } from '../context/ThemeContext'

const CodeEditor = ({ value, onChange, language = 'python', height = '400px', readOnly = false }) => {
  const { isDark } = useTheme()

  return (
    <div className="monaco-wrapper overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-inner">
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="ml-2 text-xs font-medium text-slate-400 dark:text-slate-500 font-mono">
          {language}
        </span>
      </div>

      <Editor
        height={height}
        language={language === 'cpp' ? 'cpp' : language}
        value={value}
        onChange={onChange}
        theme={isDark ? 'vs-dark' : 'light'}
        options={{
          minimap:              { enabled: false },
          fontSize:             13,
          fontFamily:           "'JetBrains Mono', 'Monaco', 'Courier New', monospace",
          fontLigatures:        true,
          lineNumbers:          'on',
          scrollBeyondLastLine: false,
          readOnly:             readOnly,
          wordWrap:             'on',
          padding:              { top: 12, bottom: 12 },
          lineDecorationsWidth: 8,
          renderLineHighlight:  'gutter',
          smoothScrolling:      true,
          cursorBlinking:       'smooth',
          cursorSmoothCaretAnimation: 'on',
          scrollbar: {
            verticalScrollbarSize:   6,
            horizontalScrollbarSize: 6,
          },
        }}
      />
    </div>
  )
}

export default CodeEditor
