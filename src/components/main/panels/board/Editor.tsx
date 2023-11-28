import React, {FC} from 'react';
import {WysiwygEditor} from '@remirror/react-editors/wysiwyg';
import {RemirrorJSON} from 'remirror';
import {OnChangeJSON} from '@remirror/react';

type EditorProps = {
  onChange: (json: RemirrorJSON) => void;
  initialContent?: RemirrorJSON;
};

const Editor: FC<EditorProps> = ({onChange, initialContent}) => {
  return (
    <div className="mb-2">
      <WysiwygEditor
        placeholder="Enter text..."
        initialContent={initialContent}
      >
        <OnChangeJSON onChange={onChange} />
      </WysiwygEditor>
    </div>
  );
};

export default React.memo(Editor);
