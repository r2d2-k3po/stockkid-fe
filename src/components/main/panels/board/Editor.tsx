import React, {FC} from 'react';
import {RemirrorContentType, RemirrorJSON} from 'remirror';
import {OnChangeJSON} from '@remirror/react';
import {useTranslation} from 'react-i18next';
import MyWysiwygEditor from './remirror/MyWysiwygEditor';
import {EditorRef} from '../BoardPage';

type EditorProps = {
  onChange: (json: RemirrorJSON) => void;
  initialContent?: RemirrorContentType | undefined;
  editorRef: React.MutableRefObject<EditorRef | null>;
};

const Editor: FC<EditorProps> = ({onChange, initialContent, editorRef}) => {
  const {t} = useTranslation();
  const placeholder = t('Editor.placeholder') as string;

  return (
    <div className="mr-1">
      <MyWysiwygEditor
        placeholder={placeholder}
        initialContent={initialContent}
        editorRef={editorRef}
      >
        <OnChangeJSON onChange={onChange} />
      </MyWysiwygEditor>
    </div>
  );
};

export default React.memo(Editor);
