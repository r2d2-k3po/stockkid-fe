import React, {
  FC,
  forwardRef,
  PropsWithChildren,
  Ref,
  useCallback,
  useImperativeHandle
} from 'react';
import {PlaceholderExtension, wysiwygPreset} from 'remirror/extensions';
import {TableExtension} from '@remirror/extension-react-tables';
import {
  EditorComponent,
  Remirror,
  TableComponents,
  ThemeProvider,
  useHelpers,
  useRemirror,
  useRemirrorContext
} from '@remirror/react';
import {AllStyledComponent} from '@remirror/styles/emotion';

import {BubbleMenu} from './BubbleMenu';
import {TopToolbar} from './TopToolbar';
import {ReactEditorProps} from './types';
import {RemirrorContentType} from 'remirror';
import {EditorRef} from '../../BoardPage';

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

type WysiwygEditorProps = Partial<ReactEditorProps>;

type MyWysiwygEditorProps = WysiwygEditorProps & {
  editorRef: React.MutableRefObject<EditorRef | null>;
};

const MyWysiwygEditor: FC<PropsWithChildren<MyWysiwygEditorProps>> = ({
  placeholder,
  stringHandler,
  children,
  theme,
  initialContent,
  editorRef,
  ...rest
}) => {
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
    content: initialContent as RemirrorContentType | undefined,
    stringHandler
  });

  return (
    <AllStyledComponent>
      <ThemeProvider theme={theme}>
        <Remirror manager={manager} initialContent={state} {...rest}>
          <ImperativeHandle ref={editorRef} />
          <TopToolbar />
          <EditorComponent />
          <BubbleMenu />
          <TableComponents />
          {children}
        </Remirror>
      </ThemeProvider>
    </AllStyledComponent>
  );
};

export default React.memo(MyWysiwygEditor);
