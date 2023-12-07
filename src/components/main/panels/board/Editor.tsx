import React, {forwardRef} from 'react';
import {RemirrorContentType, RemirrorJSON} from 'remirror';
import {OnChangeJSON} from '@remirror/react';
import {useTranslation} from 'react-i18next';
import MyWysiwygEditor from './remirror/MyWysiwygEditor';
import {EditorRef} from './Board';

type EditorProps = {
  onChange: (json: RemirrorJSON) => void;
  initialContent?: RemirrorContentType | undefined;
};

const Editor = forwardRef<EditorRef, EditorProps>(function Editor(
  {onChange, initialContent},
  ref
) {
  const {t} = useTranslation();
  const placeholder = t('Editor.placeholder') as string;

  return (
    <MyWysiwygEditor
      placeholder={placeholder}
      initialContent={initialContent}
      ref={ref}
    >
      <OnChangeJSON onChange={onChange} />
    </MyWysiwygEditor>
  );
});

export default React.memo(Editor);
