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

type OnChangeType = (json: RemirrorJSON) => void;

type EditorProps = {
  onChange?: OnChangeType;
  initialContent: RemirrorContentType | undefined;
  editorRef: React.MutableRefObject<EditorRef | null>;
  editable: boolean;
};

const Editor: FC<EditorProps> = ({
  onChange,
  initialContent,
  editorRef,
  editable
}) => {
  const {t} = useTranslation();

  const extensions = useCallback(() => {
    if (editable) {
      const placeholder = t('Editor.placeholder') as string;
      return [
        new PlaceholderExtension({placeholder}),
        new TableExtension(),
        ...wysiwygPreset()
      ];
    } else {
      return [new TableExtension(), ...wysiwygPreset()];
    }
  }, [editable, t]);

  const {manager, state} = useRemirror({
    extensions,
    content: initialContent as RemirrorContentType | undefined
  });

  return (
    <div className="remirror-theme">
      <Remirror manager={manager} initialContent={state} editable={editable}>
        <ImperativeHandle ref={editorRef} />
        {editable && <TopToolbar />}
        <EditorComponent />
        {editable && (
          <>
            <BubbleMenu />
            <TableComponents />
            <OnChangeJSON onChange={onChange as OnChangeType} />
          </>
        )}
      </Remirror>
    </div>
  );
};

export default React.memo(Editor);
