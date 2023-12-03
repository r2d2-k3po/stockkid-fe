import {RemirrorJSON} from 'remirror';

export function getPreviewFromRemirrorJSON(
  json: RemirrorJSON | undefined
): string | null {
  try {
    if (json == undefined) return null;

    const docContent = json.type == 'doc' ? json.content : undefined;
    if (docContent == undefined) return null;

    const maxPreviewLength = 1000;
    let preview = '';
    let paragraphContent: RemirrorJSON[] | undefined;
    let text: string | undefined;

    outer: for (let i = 0; i < docContent.length; i++) {
      paragraphContent =
        docContent[i].type == 'paragraph' ? docContent[i].content : undefined;
      if (paragraphContent != undefined) {
        for (let j = 0; j < paragraphContent.length; j++) {
          text =
            paragraphContent[j].type == 'text'
              ? paragraphContent[j].text
              : undefined;
          if (text != undefined) {
            if (preview.length + text.length < maxPreviewLength) {
              preview += text;
            } else {
              break outer;
            }
          }
        }
        preview += ' ';
      }
    }
    return preview.trim() || null;
  } catch (error) {
    console.error('Error getting preview : ', error);
    return null;
  }
}
