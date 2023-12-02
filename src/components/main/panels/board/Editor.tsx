import React, {FC} from 'react';
import {RemirrorContentType, RemirrorJSON} from 'remirror';
import {OnChangeJSON} from '@remirror/react';
import {useTranslation} from 'react-i18next';
import MyWysiwygEditor from './remirror/MyWysiwygEditor';

type EditorProps = {
  onChange: (json: RemirrorJSON) => void;
  initialContent?: RemirrorContentType | undefined;
};

const Editor: FC<EditorProps> = ({onChange, initialContent}) => {
  const {t} = useTranslation();
  const placeholder = t('Editor.placeholder') as string;

  return (
    <div className="mb-2">
      <MyWysiwygEditor
        placeholder={placeholder}
        initialContent={initialContent}
      >
        <OnChangeJSON onChange={onChange} />
      </MyWysiwygEditor>
    </div>
  );
};

export default React.memo(Editor);
