import React, {
  FC,
  forwardRef,
  Ref,
  useCallback,
  useImperativeHandle
} from 'react';
import {RemirrorJSON} from 'remirror';
import {
  EditorComponent,
  Remirror,
  useRemirror,
  useRemirrorContext
} from '@remirror/react';
import {TableExtension} from '@remirror/extension-react-tables';
import {wysiwygPreset} from 'remirror/extensions';
import {EditorReadOnlyRef} from '../BoardPage';

const ImperativeHandleReadOnly = forwardRef(function ImperativeHandle(
  _: unknown,
  ref: Ref<EditorReadOnlyRef>
) {
  const {setContent} = useRemirrorContext({
    autoUpdate: true
  });

  // Expose content handling to outside
  useImperativeHandle(ref, () => {
    return {setContent};
  });
  return <></>;
});

type EditorReadOnlyProps = {
  initialContent: RemirrorJSON;
  editorReadOnlyRef: React.MutableRefObject<EditorReadOnlyRef | null>;
};

const EditorReadOnly: FC<EditorReadOnlyProps> = ({
  initialContent,
  editorReadOnlyRef
}) => {
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
        <ImperativeHandleReadOnly ref={editorReadOnlyRef} />
        <EditorComponent />
      </Remirror>
    </div>
  );
};

export default React.memo(EditorReadOnly);
