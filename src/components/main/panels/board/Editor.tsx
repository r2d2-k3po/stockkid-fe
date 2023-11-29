import React, {FC} from 'react';
import {WysiwygEditor} from '@remirror/react-editors/wysiwyg';
import {RemirrorJSON} from 'remirror';
import {OnChangeJSON} from '@remirror/react';
import {useTranslation} from 'react-i18next';

type EditorProps = {
  onChange: (json: RemirrorJSON) => void;
  initialContent?: RemirrorJSON;
};

const Editor: FC<EditorProps> = ({onChange, initialContent}) => {
  const {t} = useTranslation();
  const placeholder = t('Editor.placeholder') as string;

  return (
    <div className="mb-2">
      <WysiwygEditor placeholder={placeholder} initialContent={initialContent}>
        <OnChangeJSON onChange={onChange} />
      </WysiwygEditor>
    </div>
  );
};

export default React.memo(Editor);
