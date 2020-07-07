window.addEventListener('load', () => {
  const codePre = document.getElementById('codePre');
  const editorDiv = document.getElementById('editorDiv');
  editorDiv.contentEditable = true;
  editorDiv.addEventListener('input', () => {
    // Remember the range in the editor div so we can recover it at the end
    const selectionRange = window.getSelection().getRangeAt(0);

    console.log('selection range', selectionRange.startOffset, selectionRange.endOffset);

    // Clone a range we'll use to select the words and surround them
    const range = selectionRange.cloneRange();

    console.log('intermediate dirty', JSON.stringify(editorDiv.innerHTML));

    for (const child of editorDiv.children) {
      child.replaceWith(child.innerText);
      console.log('replace', child.innerText, range.startOffset, range.endOffset);
    }

    console.log('intermediate clear', JSON.stringify(editorDiv.innerHTML));

    // Select all individual words and surround them by a nested container span
    const text = editorDiv.innerText;
    const regex = /\w+/g;
    let match;
    let offset = 0;
    while (match = regex.exec(text)) {
      console.log(`match ${match[0]} at index ${match.index} (now ${match.index - offset}), length ${match[0].length}`);

      range.setStart(selectionRange.startContainer, match.index - offset);
      range.setEnd(selectionRange.endContainer, match.index - offset + match[0].length);
      console.log(`range ${range.startOffset} ${range.endOffset}`, JSON.stringify(range.cloneContents().textContent));

      range.surroundContents(document.createElement('span'));
      console.log('intermediate', editorDiv.innerHTML);

      // Shift the range to account for the fact this word is now nested
      offset += (match.index === 0 ? 0 : 1) + match[0].length;
    }

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(selectionRange);

    console.log('final', JSON.stringify(editorDiv.innerHTML));

    codePre.innerText = editorDiv.innerHTML;
  });

  codePre.innerText = editorDiv.innerHTML;
});
