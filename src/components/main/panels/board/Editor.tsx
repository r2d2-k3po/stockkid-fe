import React, {
  FC,
  forwardRef,
  Ref,
  useCallback,
  useImperativeHandle
} from 'react';
import {PlaceholderExtension, wysiwygPreset} from 'remirror/extensions';
import {TableExtension} from '@remirror/extension-react-tables';
import {
  EditorComponent,
  OnChangeJSON,
  Remirror,
  TableComponents,
  useHelpers,
  useRemirror,
  useRemirrorContext
} from '@remirror/react';
import 'remirror/styles/all.css';

import {BubbleMenu} from './remirror/BubbleMenu';
import {TopToolbar} from './remirror/TopToolbar';
import {ReactEditorProps} from './remirror/types';
import {RemirrorContentType, RemirrorJSON} from 'remirror';
import {EditorRef} from '../BoardPage';
import {useTranslation} from 'react-i18next';

const ImperativeHandle = forwardRef(function ImperativeHandle(
  _: unknown,
  ref: Ref<EditorRef>
) {
  const {clearContent, setContent} = useRemirrorContext({
    autoUpdate: true
  });

  const {getText} = useHelpers();

  // Expose content handling to outside
  useImperativeHandle(ref, () => {
    return {clearContent, setContent, getText};
  });
  return <></>;
});

interface EditorProps extends Partial<ReactEditorProps> {
  onChange: (json: RemirrorJSON) => void;
  initialContent: RemirrorContentType | undefined;
  editorRef: React.MutableRefObject<EditorRef | null>;
}

const Editor: FC<EditorProps> = ({onChange, initialContent, editorRef}) => {
  const {t} = useTranslation();
  const placeholder = t('Editor.placeholder') as string;

  const extensions = useCallback(
    () => [
      new PlaceholderExtension({placeholder}),
      new TableExtension(),
      ...wysiwygPreset()
    ],
    [placeholder]
  );

  const {manager, state} = useRemirror({
    extensions,
    content: initialContent as RemirrorContentType | undefined
  });

  return (
    <div className="remirror-theme">
      <Remirror manager={manager} initialContent={state}>
        <ImperativeHandle ref={editorRef} />
        <TopToolbar />
        <EditorComponent />
        <BubbleMenu />
        <TableComponents />
        <OnChangeJSON onChange={onChange} />
      </Remirror>
    </div>
  );
};

export default React.memo(Editor);
