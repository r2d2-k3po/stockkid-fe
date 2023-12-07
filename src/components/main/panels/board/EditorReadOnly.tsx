import React, {FC, useCallback} from 'react';
import {RemirrorJSON} from 'remirror';
import {EditorComponent, Remirror, useRemirror} from '@remirror/react';
import {TableExtension} from '@remirror/extension-react-tables';
import {wysiwygPreset} from 'remirror/extensions';

type EditorReadOnlyProps = {
  initialContent: RemirrorJSON;
};

const EditorReadOnly: FC<EditorReadOnlyProps> = ({initialContent}) => {
  const extensions = useCallback(
    () => [new TableExtension(), ...wysiwygPreset()],
    []
  );

  const {manager, state} = useRemirror({
    extensions,
    content: initialContent,
    selection: 'start'
  });

  return (
    <div className="remirror-theme">
      {/* the className is used to define css variables necessary for the editor */}
      <Remirror manager={manager} initialContent={state} editable={false}>
        <EditorComponent />
      </Remirror>
    </div>
  );
};

export default React.memo(EditorReadOnly);
