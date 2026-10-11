import { useState } from 'react';

/**
 * Inline code snippet with a Copy button.
 * Use anywhere a design-system demo wants to show how to implement.
 */
const CodeBlock = ({ code, language = 'jsx' }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className='position-relative mt-2'>
      <pre
        className='mb-0'
        style={{
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: '12px 16px',
          borderRadius: 6,
          fontSize: 12,
          overflowX: 'auto',
        }}
      >
        <code>{code}</code>
      </pre>
      <button
        type='button'
        onClick={copy}
        className='btn btn-sm btn-light position-absolute'
        style={{ top: 6, right: 6, fontSize: 11 }}
      >
        {copied ? '✓ Copied' : '📋 Copy'}
      </button>
    </div>
  );
};

export { CodeBlock };
export default CodeBlock;
