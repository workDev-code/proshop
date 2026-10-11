const TypographyScale = () => (
  <>
    <h1>H1 — Display Heading 36px</h1>
    <h2>H2 — Section Heading 30px</h2>
    <h3>H3 — Subsection 24px</h3>
    <h4>H4 — Card Title 20px</h4>
    <h5>H5 — Sub Title 18px</h5>
    <h6>H6 — Small Heading 16px</h6>
    <hr />
    <p>
      Body — <strong>strong</strong>, <em>emphasis</em>,{' '}
      <a href='#brand'>link</a>, <code>inline code</code>.
    </p>
    <p className='text-muted'>
      Small muted text — typically used for captions and helper text.
    </p>
    <ul>
      <li>Unordered list item one</li>
      <li>Two</li>
      <li>Three</li>
    </ul>
    <blockquote className='blockquote-footer'>
      Blockquote footer — author or extra context
    </blockquote>
  </>
);

export default TypographyScale;
